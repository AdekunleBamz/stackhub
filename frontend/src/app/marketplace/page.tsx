"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { mintNFT, listNFT, buyNFT } from "@/lib/contracts";
import { PageErrorBoundary } from "@/components/ErrorBoundary";
import { VALIDATION } from "@/config/constants";

/**
 * NFT Marketplace Page.
 * - Mint new NFTs
 * - List owned NFTs for sale
 * - Buy listed NFTs
 */
function MarketplacePage() {
  const { connected } = useWallet();
  const [mintUri, setMintUri] = useState("");
  const [mintUriError, setMintUriError] = useState("");
  const [listTokenId, setListTokenId] = useState("");
  const [listTokenIdError, setListTokenIdError] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [listPriceError, setListPriceError] = useState("");
  const [buyTokenId, setBuyTokenId] = useState("");
  const [buyTokenIdError, setBuyTokenIdError] = useState("");

  const validateUri = (uri: string) => {
    if (!uri.trim()) {
      setMintUriError("URI is required");
      return false;
    }
    if (uri.length > 256) {
      setMintUriError("URI must be 256 characters or less");
      return false;
    }
    if (!uri.startsWith("ipfs://") && !uri.startsWith("http://") && !uri.startsWith("https://")) {
      setMintUriError("URI must start with ipfs://, http://, or https://");
      return false;
    }
    setMintUriError("");
    return true;
  };

  const validateTokenId = (id: string, field: "list" | "buy") => {
    if (!id.trim()) {
      if (field === "list") {
        setListTokenIdError("Token ID is required");
      } else {
        setBuyTokenIdError("Token ID is required");
      }
      return false;
    }
    const num = parseInt(id, 10);
    if (isNaN(num) || num < 0) {
      if (field === "list") {
        setListTokenIdError("Token ID must be a non-negative integer");
      } else {
        setBuyTokenIdError("Token ID must be a non-negative integer");
      }
      return false;
    }
    if (field === "list") {
      setListTokenIdError("");
    } else {
      setBuyTokenIdError("");
    }
    return true;
  };

  const validatePrice = (price: string) => {
    if (!price.trim()) {
      setListPriceError("Price is required");
      return false;
    }
    const num = parseFloat(price);
    if (isNaN(num) || num <= 0) {
      setListPriceError("Price must be a positive number");
      return false;
    }
    if (num < 0.001) {
      setListPriceError("Minimum price is 0.001 STX");
      return false;
    }
    setListPriceError("");
    return true;
  };

  /**
   * Orchestrates the NFT minting process.
   */
  const handleMint = async () => {
    if (!validateUri(mintUri)) return;
    await mintNFT(mintUri);
    setMintUri("");
  };

  /**
   * Orchestrates the NFT listing process.
   * Converts price to microSTX before calling contract.
   */
  const handleList = async () => {
    if (!validateTokenId(listTokenId, "list") || !validatePrice(listPrice)) return;
    await listNFT(parseInt(listTokenId), parseInt(listPrice) * 1000000);
    setListTokenId("");
    setListPrice("");
  };

  const handleBuy = async () => {
    if (!validateTokenId(buyTokenId, "buy")) return;
    await buyNFT(parseInt(buyTokenId));
    setBuyTokenId("");
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">NFT Marketplace</h1>
        <p className="text-gray-600">Please connect your wallet to access the marketplace</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🎨 NFT Marketplace</h1>
        <p className="text-gray-600">Mint, list, and trade NFTs with only 1.25% platform fee</p>
      </header>

      <div className="grid md:grid-cols-3 gap-6" role="list">
        {/* Mint NFT */}
        <article className="bg-white rounded-2xl shadow-lg p-6" role="listitem">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mint NFT</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleMint(); }}>
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="sr-only">Mint NFT Form</legend>
              <div>
                <label htmlFor="mint-uri" className="block text-sm font-medium text-gray-700 mb-1">IPFS URI</label>
                <input
                  id="mint-uri"
                  type="text"
                  value={mintUri}
                  onChange={(e) => setMintUri(e.target.value)}
                  onBlur={() => validateUri(mintUri)}
                  placeholder="ipfs://Qm..."
                  maxLength={VALIDATION.URI_MAX_LENGTH}
                  aria-describedby={mintUriError ? "mint-uri-error" : undefined}
                  aria-invalid={!!mintUriError}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    mintUriError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {mintUriError && (
                  <p id="mint-uri-error" className="text-red-500 text-xs mt-1" role="alert">{mintUriError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={!!mintUriError || !mintUri}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Mint NFT
              </button>
            </fieldset>
          </form>
        </article>

        {/* List NFT */}
        <article className="bg-white rounded-2xl shadow-lg p-6" role="listitem">
          <h2 className="text-xl font-bold text-gray-900 mb-4">List for Sale</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleList(); }}>
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="sr-only">List NFT for Sale Form</legend>
              <div>
                <label htmlFor="list-token-id" className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
                <input
                  id="list-token-id"
                  type="number"
                  value={listTokenId}
                  onChange={(e) => setListTokenId(e.target.value)}
                  placeholder="1"
                  aria-describedby={listTokenIdError ? "list-token-id-error" : undefined}
                  aria-invalid={!!listTokenIdError}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    listTokenIdError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {listTokenIdError && (
                  <p id="list-token-id-error" className="text-red-500 text-xs mt-1" role="alert">{listTokenIdError}</p>
                )}
              </div>
              <div>
                <label htmlFor="list-price" className="block text-sm font-medium text-gray-700 mb-1">Price (STX)</label>
                <input
                  id="list-price"
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="10"
                  aria-describedby={listPriceError ? "list-price-error" : undefined}
                  aria-invalid={!!listPriceError}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    listPriceError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {listPriceError && (
                  <p id="list-price-error" className="text-red-500 text-xs mt-1" role="alert">{listPriceError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
              >
                List NFT
              </button>
            </fieldset>
          </form>
        </article>

        {/* Buy NFT */}
        <article className="bg-white rounded-2xl shadow-lg p-6" role="listitem">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buy NFT</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleBuy(); }}>
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="sr-only">Buy NFT Form</legend>
              <div>
                <label htmlFor="buy-token-id" className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
                <input
                  id="buy-token-id"
                  type="number"
                  value={buyTokenId}
                  onChange={(e) => setBuyTokenId(e.target.value)}
                  placeholder="1"
                  aria-describedby={buyTokenIdError ? "buy-token-id-error" : undefined}
                  aria-invalid={!!buyTokenIdError}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    buyTokenIdError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
                  }`}
                />
                {buyTokenIdError && (
                  <p id="buy-token-id-error" className="text-red-500 text-xs mt-1" role="alert">{buyTokenIdError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                Buy NFT
              </button>
            </fieldset>
          </form>
        </article>
      </div>

      {/* Info Section */}
      <aside className="mt-12 bg-purple-50 rounded-2xl p-6" aria-label="How it works">
        <h3 className="text-lg font-bold text-purple-900 mb-2">How it works</h3>
        <ul className="text-purple-800 space-y-2">
          <li>• Upload your image to IPFS (use Pinata, NFT.Storage, etc.)</li>
          <li>• Mint your NFT with the IPFS URI</li>
          <li>• List it for sale at your desired price</li>
          <li>• When sold, 1.25% goes to the platform, rest to you</li>
        </ul>
      </aside>
    </div>
  );
}

// Wrap with error boundary
export default function MarketplacePageWithErrorBoundary() {
  return (
    <PageErrorBoundary>
      <MarketplacePage />
    </PageErrorBoundary>
  );
}
