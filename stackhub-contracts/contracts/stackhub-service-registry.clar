;; StackHub Service Registry - Gas Optimized
;; Listing fee: 2.5 STX | Transaction fee: 1.5%

(define-constant CONTRACT-OWNER tx-sender)

;; Error Code Constants
(define-constant ERR-NOT-OWNER (err u100))      ;; Not contract owner
(define-constant ERR-NOT-FOUND (err u101))      ;; Service not found
(define-constant ERR-UNAUTHORIZED (err u102))   ;; Unauthorized action
(define-constant ERR-ZERO (err u103))           ;; Amount cannot be zero
;; @desc 2.5 STX fee to list a service
(define-constant LISTING-FEE u2500000) ;; 2.5 STX
;; @desc 1.5% transaction fee on payments
(define-constant TX-FEE u150) ;; 1.5% = 150/10000

;; @desc Tracks the most recent Service ID
(define-data-var last-service-id uint u0)
;; @desc Tracks total platform fees collected
(define-data-var total-fees uint u0)

;; Services Data Map
;; @desc Stores details for each registered service
(define-map services uint {
  provider: principal,
  title: (string-ascii 64),
  price: uint,
  active: bool
})

;; @desc Tracks earnings for each provider
(define-map provider-earnings principal uint)

;; Read functions - Public Getters
;; @desc Get service details by ID
(define-read-only (get-service (id uint))
  (map-get? services id))

;; @desc Get total fees collected
(define-read-only (get-total-fees)
  (var-get total-fees))

(define-read-only (get-last-service-id)
  (var-get last-service-id))

(define-read-only (get-earnings (who principal))
  (default-to u0 (map-get? provider-earnings who)))

;; Register Service - Public Function
;; @desc Listing a new service on the platform.
;; @param title - The title/name of the service.
;; @param price - The cost in micro-STX.
;; @returns (ok uint) - Returns the new service ID.
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

;; Update Service - Public Function
;; @desc Updates the details of an existing service.
;; @param id - The ID of the service.
;; @param title - The new title.
;; @param price - The new price.
;; @returns (ok bool) - Returns true if successful.
(define-public (update-service (id uint) (title (string-ascii 64)) (price uint))
  (let ((service (unwrap! (map-get? services id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get provider service)) ERR-UNAUTHORIZED)
    (map-set services id (merge service {title: title, price: price}))
    (ok true)))

;; Toggle Service Status - Public Function
;; @desc Activates or deactivates a service listing.
;; @param id - The ID of the service.
;; @returns (ok bool) - Returns true if successful.
(define-public (toggle-service (id uint))
  (let ((service (unwrap! (map-get? services id) ERR-NOT-FOUND)))
    (asserts! (is-eq tx-sender (get provider service)) ERR-UNAUTHORIZED)
    (map-set services id (merge service {active: (not (get active service))}))
    (ok true)))

;; Pay Service - Public Function
;; @desc Process payment for a service. Splits fee between provider and platform.
;; @param id - The ID of the service to pay for.
;; @returns (ok tuple) - Returns payment details.
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
