;; StackHub Staking Vault - Gas Optimized
;; Withdrawal fee: 0.5% | Early unstake: 2.5%
;; Uses direct STX transfers - simpler and cheaper

(define-constant CONTRACT-OWNER tx-sender)

;; Error Code Constants
(define-constant ERR-NOT-OWNER (err u100))      ;; Not contract owner
(define-constant ERR-NO-STAKE (err u101))       ;; No active stake found
(define-constant ERR-INSUFFICIENT (err u102))   ;; Insufficient balance
(define-constant ERR-ZERO (err u103))           ;; Amount cannot be zero
;; @desc 0.5% fee on normal withdrawal
(define-constant WITHDRAW-FEE u50) ;; 0.5% = 50/10000
;; @desc 2.5% penalty fee for early unstake
(define-constant EARLY-FEE u250) ;; 2.5% = 250/10000
;; @desc 144 blocks ~ 24 hours lock period
(define-constant MIN-LOCK-BLOCKS u144) ;; ~1 day in blocks

;; @desc Total STX currently staked
(define-data-var total-staked uint u0)
;; @desc Total fees accrued
(define-data-var total-fees uint u0)
;; @desc Current contract liquid balance
(define-data-var vault-balance uint u0)

;; Staking Data
;; @desc Map of principal to their betting info
(define-map stakes principal {amount: uint, start-block: uint})

;; Read functions - Public Getters
(define-read-only (get-stake (who principal))
  (map-get? stakes who))

(define-read-only (get-total-staked)
  (var-get total-staked))

(define-read-only (get-total-fees)
  (var-get total-fees))

(define-read-only (get-vault-balance)
  (var-get vault-balance))

(define-read-only (can-unstake-free (who principal))
  (match (map-get? stakes who) 
    s (>= (- stacks-block-height (get start-block s)) MIN-LOCK-BLOCKS)
    false))

;; Stake STX - Public Function
;; @desc Stacks STX in the vault. Funds move to contract owner (vault keeper).
;; @param amount - The amount of uSTX to stake.
;; @returns (ok bool) - Returns true if successful.
(define-public (stake (amount uint))
  (let ((current-stake (map-get? stakes tx-sender)))
    (asserts! (> amount u0) ERR-ZERO)
    (try! (stx-transfer? amount tx-sender CONTRACT-OWNER))
    (match current-stake
      existing (map-set stakes tx-sender {
        amount: (+ (get amount existing) amount),
        start-block: stacks-block-height
      })
      (map-set stakes tx-sender {amount: amount, start-block: stacks-block-height})
    )
    (var-set total-staked (+ (var-get total-staked) amount))
    (var-set vault-balance (+ (var-get vault-balance) amount))
    (ok true)))

;; Process Unstake - Admin Function
;; @desc Contract owner processes valid unstake requests with fee deduction.
;; @param staker - The principal of the staker.
;; @param amount - The amount to return.
;; @returns (ok tuple) - Returns payout details and fee.
(define-public (process-unstake (staker principal) (amount uint))
  (let (
    (stake-data (unwrap! (map-get? stakes staker) ERR-NO-STAKE))
    (staked (get amount stake-data))
    (is-early (< (- stacks-block-height (get start-block stake-data)) MIN-LOCK-BLOCKS))
    (fee-rate (if is-early EARLY-FEE WITHDRAW-FEE))
    (fee (/ (* amount fee-rate) u10000))
    (payout (- amount fee))
  )
    (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-OWNER)
    (asserts! (>= staked amount) ERR-INSUFFICIENT)
    (try! (stx-transfer? payout tx-sender staker))
    (if (is-eq staked amount)
      (map-delete stakes staker)
      (map-set stakes staker {
        amount: (- staked amount),
        start-block: (get start-block stake-data)
      })
    )
    (var-set total-staked (- (var-get total-staked) amount))
    (var-set vault-balance (- (var-get vault-balance) amount))
    (var-set total-fees (+ (var-get total-fees) fee))
    (ok {amount: payout, fee: fee})))

;; Request Unstake - Public Function
;; @desc User requests to unstake funds. Emits event for processing.
;; @param amount - The amount to unstake.
;; @returns (ok bool) - Returns true if request is valid.
(define-public (request-unstake (amount uint))
  (let ((stake-data (unwrap! (map-get? stakes tx-sender) ERR-NO-STAKE)))
    (asserts! (>= (get amount stake-data) amount) ERR-INSUFFICIENT)
    (print {event: "unstake-request", staker: tx-sender, amount: amount})
    (ok true)))


