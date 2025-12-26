;; StackHub Service Registry - Gas Optimized
;; Listing fee: 2.5 STX | Transaction fee: 1.5%

(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-NOT-FOUND (err u101))
(define-constant ERR-UNAUTHORIZED (err u102))
(define-constant ERR-ZERO (err u103))
(define-constant LISTING-FEE u2500000) ;; 2.5 STX
(define-constant TX-FEE u150) ;; 1.5% = 150/10000

(define-data-var last-service-id uint u0)
(define-data-var total-fees uint u0)

(define-map services uint {
  provider: principal,
  title: (string-ascii 64),
  price: uint,
  active: bool
})

(define-map provider-earnings principal uint)

;; Read functions
(define-read-only (get-service (id uint))
  (map-get? services id))

(define-read-only (get-total-fees)
  (var-get total-fees))

(define-read-only (get-last-service-id)
  (var-get last-service-id))

(define-read-only (get-earnings (who principal))
  (default-to u0 (map-get? provider-earnings who)))

;; Register service - pays 2.5 STX fee
(define-public (register-service (title (string-ascii 64)) (price uint))
  (let ((id (+ (var-get last-service-id) u1)))
    (asserts! (> price u0) ERR-ZERO)
    (try! (stx-transfer? LISTING-FEE tx-sender CONTRACT-OWNER))
    (map-set services id {
      provider: tx-sender,
      title: title,
      price: price,
      active: true
    })
    (var-set last-service-id id)
    (var-set total-fees (+ (var-get total-fees) LISTING-FEE))
    (ok id)))

;; Update service
(define-public (update-service (id uint) (title (string-ascii 64)) (price uint))
  (let ((service (unwrap! (map-get? services id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get provider service)) ERR-UNAUTHORIZED)
    (map-set services id (merge service {title: title, price: price}))
    (ok true)))

;; Toggle service active/inactive
(define-public (toggle-service (id uint))
  (let ((service (unwrap! (map-get? services id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get provider service)) ERR-UNAUTHORIZED)
    (map-set services id (merge service {active: (not (get active service))}))
    (ok true)))

;; Pay for service - 1.5% fee to platform
(define-public (pay-service (id uint))
  (let (
    (service (unwrap! (map-get? services id) ERR-NOT-FOUND))
    (price (get price service))
    (provider (get provider service))
    (fee (/ (* price TX-FEE) u10000))
    (provider-amount (- price fee))
  )
    (asserts! (get active service) ERR-NOT-FOUND)
    (try! (stx-transfer? provider-amount tx-sender provider))
    (try! (stx-transfer? fee tx-sender CONTRACT-OWNER))
    (map-set provider-earnings provider (+ (get-earnings provider) provider-amount))
    (var-set total-fees (+ (var-get total-fees) fee))
    (ok {paid: price, fee: fee})))
