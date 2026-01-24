"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { createToken } from "@/lib/contracts";

/**
 * Token Launchpad Page.
 * Allows users to create new SIP-010 fungible tokens.
 * Handles form input and calls `createToken` contract function.
 */
export default function LaunchpadPage() {
  const { connected } = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [supply, setSupply] = useState("");

  /**
   * Calculates total supply including decimals and invokes token creation.
   */
  const handleCreate = async () => {
    if (!name || !symbol || !supply) return alert("Please fill all fields");
    const totalSupply = parseInt(supply) * Math.pow(10, parseInt(decimals));
    await createToken(name, symbol, parseInt(decimals), totalSupply);
    setName("");
    setSymbol("");
    setSupply("");
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Token Launchpad</h1>
        <p className="text-gray-600">Please connect your wallet to launch tokens</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Token Launchpad</h1>
      <p className="text-gray-600 mb-8">Launch your own token on Stacks for just 5 STX</p>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Token</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Token Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Token"
              maxLength={32}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Max 32 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="MTK"
              maxLength={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Max 10 characters</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
            <select
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="0">0</option>
              <option value="6">6 (Recommended)</option>
              <option value="8">8</option>
              <option value="18">18</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              placeholder="1000000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-blue-900 font-medium">Creation Fee</span>
            <span className="text-blue-900 font-bold">5 STX</span>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
        >
          Create Token (5 STX)
        </button>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Token Features</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• You become the token owner with minting rights</li>
          <li>• Transfer tokens to any Stacks address</li>
          <li>• Mint additional tokens at any time</li>
          <li>• Burn tokens to reduce supply</li>
        </ul>
      </div>
    </div>
  );
}
