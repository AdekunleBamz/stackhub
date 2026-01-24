;; StackHub Token Launchpad - Gas Optimized
;; Creation fee: 5 STX per token launch

(define-constant CONTRACT-OWNER tx-sender)

;; Error Constants
(define-constant ERR-NOT-OWNER (err u100))      ;; Sender is not the owner
(define-constant ERR-NOT-FOUND (err u101))      ;; Entity not found
(define-constant ERR-UNAUTHORIZED (err u102))   ;; Unauthorized action
(define-constant ERR-ALREADY-EXISTS (err u103)) ;; Token entity already exists
(define-constant CREATION-FEE u5000000) ;; 5 STX

(define-data-var last-token-id uint u0)
(define-data-var total-fees uint u0)

(define-fungible-token stackhub-ft)

(define-map token-info uint {
  name: (string-ascii 32),
  symbol: (string-ascii 10),
  decimals: uint,
  owner: principal,
  total-supply: uint
})

(define-map balances {token-id: uint, owner: principal} uint)

;; Read functions - Public Getters
(define-read-only (get-token-info (id uint))
  (map-get? token-info id))

(define-read-only (get-balance (id uint) (who principal))
  (default-to u0 (map-get? balances {token-id: id, owner: who})))

(define-read-only (get-total-fees)
  (var-get total-fees))

(define-read-only (get-last-token-id)
  (var-get last-token-id))

;; Create Token - Public Function
;; @desc Creates a new custom token with specified parameters.
;; @param name - The name of the token.
;; @param symbol - The symbol/ticker.
;; @param decimals - The number of decimal places.
;; @param initial-supply - The amount to mint to the creator.
;; @returns (ok uint) - Returns the new token ID.
(define-public (create-token (name (string-ascii 32)) (symbol (string-ascii 10)) (decimals uint) (initial-supply uint))
  (let ((id (+ (var-get last-token-id) u1)))
    (try! (stx-transfer? CREATION-FEE tx-sender CONTRACT-OWNER))
    (map-set token-info id {
      name: name,
      symbol: symbol,
      decimals: decimals,
      owner: tx-sender,
      total-supply: initial-supply
    })
    (map-set balances {token-id: id, owner: tx-sender} initial-supply)
    (var-set last-token-id id)
    (var-set total-fees (+ (var-get total-fees) CREATION-FEE))
    (ok id)))

;; Mint Tokens - Public Function
;; @desc Mints additional tokens (Owner only).
;; @param id - The ID of the token.
;; @param amount - The amount to mint.
;; @param recipient - The receiver address.
;; @returns (ok bool) - Returns true if successful.
(define-public (mint-tokens (id uint) (amount uint) (recipient principal))
  (let ((info (unwrap! (map-get? token-info id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get owner info)) ERR-UNAUTHORIZED)
    (map-set token-info id (merge info {total-supply: (+ (get total-supply info) amount)}))
    (map-set balances {token-id: id, owner: recipient} 
      (+ (get-balance id recipient) amount))
    (ok true)))

;; Transfer Token - Public Function
;; @desc Transfers tokens between principals.
;; @param id - The ID of the token.
;; @param amount - The amount to transfer.
;; @param recipient - The receiver address.
;; @returns (ok bool) - Returns true if successful.
(define-public (transfer-token (id uint) (amount uint) (recipient principal))
  (let ((sender-balance (get-balance id tx-sender)))
    (asserts! (>= sender-balance amount) ERR-UNAUTHORIZED)
    (map-set balances {token-id: id, owner: tx-sender} (- sender-balance amount))
    (map-set balances {token-id: id, owner: recipient} (+ (get-balance id recipient) amount))
    (ok true)))

;; Burn Tokens - Public Function
;; @desc Burns tokens, reducing total supply.
;; @param id - The ID of the token.
;; @param amount - The amount to burn.
;; @returns (ok bool) - Returns true if successful.
(define-public (burn-tokens (id uint) (amount uint))
  (let (
    (sender-balance (get-balance id tx-sender))
    (info (unwrap! (map-get? token-info id) ERR-NOT-FOUND))
  )
    (asserts! (>= sender-balance amount) ERR-UNAUTHORIZED)
    (map-set balances {token-id: id, owner: tx-sender} (- sender-balance amount))
    (map-set token-info id (merge info {total-supply: (- (get total-supply info) amount)}))
    (ok true)))
