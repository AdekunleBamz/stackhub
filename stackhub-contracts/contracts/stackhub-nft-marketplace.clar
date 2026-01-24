;; StackHub NFT Marketplace - Gas Optimized
;; Platform fee: 1.25% on sales

(define-constant CONTRACT-OWNER tx-sender)

;; Error Constants
;; @desc Error code when sender is not owner (u100)
(define-constant ERR-NOT-OWNER (err u100))      ;; Sender is not the owner
(define-constant ERR-NOT-FOUND (err u101))      ;; Entity not found
(define-constant ERR-UNAUTHORIZED (err u102))   ;; Unauthorized action
(define-constant ERR-LISTED (err u103))         ;; Token already listed
(define-constant ERR-NOT-LISTED (err u104))     ;; Token not listed
(define-constant ERR-PRICE (err u105))          ;; Invalid price
;; @desc 1.25% fee (125 basis points)
(define-constant PLATFORM-FEE u125) ;; 1.25% = 125/10000

;; Data Variables
;; @desc Tracks the most recently minted Token ID
(define-data-var last-token-id uint u0)
;; @desc Tracks total fees collected by the platform
(define-data-var total-fees uint u0)

(define-non-fungible-token stackhub-nft uint)

;; Data Maps
;; @desc Stores URI and creator principal for each NFT
(define-map nft-data uint {uri: (string-ascii 256), creator: principal})
;; @desc Stores listing details (price, seller) for NFTs on sale
(define-map listings uint {price: uint, seller: principal})

;; Read functions - Public Getters
(define-read-only (get-last-token-id)
  (ok (var-get last-token-id)))

(define-read-only (get-token-uri (id uint))
  (ok (get uri (map-get? nft-data id))))

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? stackhub-nft id)))

(define-read-only (get-listing (id uint))
  (map-get? listings id))

(define-read-only (get-total-fees)
  (var-get total-fees))

;; Mint NFT - Public Function
;; @desc Mints a new NFT with the specified Metadata URI.
;; @param uri - The metadata URI string (max 256 chars).
;; @returns (ok uint) - Returns the token ID of the minted NFT.
(define-public (mint (uri (string-ascii 256)))
  (let ((id (+ (var-get last-token-id) u1)))
    (try! (nft-mint? stackhub-nft id tx-sender))
    (map-set nft-data id {uri: uri, creator: tx-sender})
    (var-set last-token-id id)
    (ok id)))

;; List NFT - Public Function
;; @desc Lists an NFT for sale at a specific price.
;; @param id - The ID of the NFT to list.
;; @param price - The price in micro-STX.
;; @returns (ok bool) - Returns true if successful.
(define-public (list-nft (id uint) (price uint))
  (begin
    (asserts! (is-eq (some tx-sender) (nft-get-owner? stackhub-nft id)) ERR-UNAUTHORIZED)
    (asserts! (> price u0) ERR-PRICE)
    (asserts! (is-none (map-get? listings id)) ERR-LISTED)
    (map-set listings id {price: price, seller: tx-sender})
    (ok true)))

;; Unlist NFT - Public Function
;; @desc Removes an active listing for an NFT.
;; @param id - The ID of the NFT to unlist.
;; @returns (ok bool) - Returns true if successful.
(define-public (unlist-nft (id uint))
  (let ((listing (unwrap! (map-get? listings id) ERR-NOT-LISTED)))
    (asserts! (is-eq tx-sender (get seller listing)) ERR-UNAUTHORIZED)
    (map-delete listings id)
    (ok true)))

;; Buy NFT - Public Function
;; @desc Purchases a listed NFT, distributes payment and platform fee.
;; @param id - The ID of the NFT to buy.
;; @returns (ok bool) - Returns true if successful.
(define-public (buy-nft (id uint))
  (let (
    (listing (unwrap! (map-get? listings id) ERR-NOT-LISTED))
    (price (get price listing))
    (seller (get seller listing))
    (fee (/ (* price PLATFORM-FEE) u10000))
    (seller-amount (- price fee))
  )
    (try! (stx-transfer? seller-amount tx-sender seller))
    (try! (stx-transfer? fee tx-sender CONTRACT-OWNER))
    (try! (nft-transfer? stackhub-nft id seller tx-sender))
    (map-delete listings id)
    (var-set total-fees (+ (var-get total-fees) fee))
    (ok true)))

;; Transfer NFT - Public Function
;; @desc Transfers an NFT if it is NOT listed for sale.
;; @param id - The ID of the NFT.
;; @param recipient - The principal to receive the NFT.
;; @returns (ok bool) - Returns true if transfer succeeds.
(define-public (transfer (id uint) (recipient principal))
  (begin
    (asserts! (is-eq (some tx-sender) (nft-get-owner? stackhub-nft id)) ERR-UNAUTHORIZED)
    (asserts! (is-none (map-get? listings id)) ERR-LISTED)
    (nft-transfer? stackhub-nft id tx-sender recipient)))
