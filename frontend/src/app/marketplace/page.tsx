"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { mintNFT, listNFT, buyNFT } from "@/lib/contracts";

/**
 * NFT Marketplace Page.
 * - Mint new NFTs
 * - List owned NFTs for sale
 * - Buy listed NFTs
 */
export default function MarketplacePage() {
  const { connected } = useWallet();
  const [mintUri, setMintUri] = useState("");
  const [listTokenId, setListTokenId] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [buyTokenId, setBuyTokenId] = useState("");

  /**
   * Orchestrates the NFT minting process.
   */
  const handleMint = async () => {
    if (!mintUri) return alert("Please enter IPFS URI");
    await mintNFT(mintUri);
    setMintUri("");
  };

  const handleList = async () => {
    if (!listTokenId || !listPrice) return alert("Please fill all fields");
    await listNFT(parseInt(listTokenId), parseInt(listPrice) * 1000000);
    setListTokenId("");
    setListPrice("");
  };

  const handleBuy = async () => {
    if (!buyTokenId) return alert("Please enter token ID");
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
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🎨 NFT Marketplace</h1>
      <p className="text-gray-600 mb-8">Mint, list, and trade NFTs with only 1.25% platform fee</p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Mint NFT */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mint NFT</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IPFS URI</label>
              <input
                type="text"
                value={mintUri}
                onChange={(e) => setMintUri(e.target.value)}
                placeholder="ipfs://Qm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleMint}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Mint NFT
            </button>
          </div>
        </div>

        {/* List NFT */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">List for Sale</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
              <input
                type="number"
                value={listTokenId}
                onChange={(e) => setListTokenId(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (STX)</label>
              <input
                type="number"
                value={listPrice}
                onChange={(e) => setListPrice(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleList}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              List NFT
            </button>
          </div>
        </div>

        {/* Buy NFT */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Buy NFT</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Token ID</label>
              <input
                type="number"
                value={buyTokenId}
                onChange={(e) => setBuyTokenId(e.target.value)}
                placeholder="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleBuy}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Buy NFT
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-purple-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-2">How it works</h3>
        <ul className="text-purple-800 space-y-2">
          <li>• Upload your image to IPFS (use Pinata, NFT.Storage, etc.)</li>
          <li>• Mint your NFT with the IPFS URI</li>
          <li>• List it for sale at your desired price</li>
          <li>• When sold, 1.25% goes to the platform, rest to you</li>
        </ul>
      </div>
    </div>
  );
}
