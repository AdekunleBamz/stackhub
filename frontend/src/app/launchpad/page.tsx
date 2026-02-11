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
  const [nameError, setNameError] = useState("");
  const [symbol, setSymbol] = useState("");
  const [symbolError, setSymbolError] = useState("");
  const [decimals, setDecimals] = useState("6");
  const [decimalsError, setDecimalsError] = useState("");
  const [supply, setSupply] = useState("");
  const [supplyError, setSupplyError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Token name is required");
      return false;
    }
    if (value.length < 2 || value.length > 32) {
      setNameError("Token name must be 2-32 characters");
      return false;
    }
    if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
      setNameError("Token name must be alphanumeric");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateSymbol = (value: string) => {
    if (!value.trim()) {
      setSymbolError("Symbol is required");
      return false;
    }
    if (value.length < 2 || value.length > 5) {
      setSymbolError("Symbol must be 2-5 characters");
      return false;
    }
    if (!/^[A-Z]+$/.test(value)) {
      setSymbolError("Symbol must be uppercase letters only");
      return false;
    }
    setSymbolError("");
    return true;
  };

  const validateDecimals = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0 || num > 18) {
      setDecimalsError("Decimals must be between 0 and 18");
      return false;
    }
    setDecimalsError("");
    return true;
  };

  const validateSupply = (value: string) => {
    if (!value.trim()) {
      setSupplyError("Supply is required");
      return false;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num <= 0) {
      setSupplyError("Supply must be a positive integer");
      return false;
    }
    if (num > Number.MAX_SAFE_INTEGER) {
      setSupplyError("Supply exceeds maximum safe value");
      return false;
    }
    setSupplyError("");
    return true;
  };

  /**
   * Calculates total supply including decimals and invokes token creation.
   */
  const handleCreate = async () => {
    if (!validateName(name) || !validateSymbol(symbol) || !validateDecimals(decimals) || !validateSupply(supply)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const totalSupply = parseInt(supply) * Math.pow(10, parseInt(decimals));
      await createToken(name, symbol, parseInt(decimals), totalSupply);
      setName("");
      setSymbol("");
      setDecimals("6");
      setSupply("");
    } finally {
      setIsLoading(false);
    }
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
              onBlur={() => validateName(name)}
              placeholder="My Token"
              maxLength={32}
              aria-label="Token Name"
              aria-required="true"
              aria-invalid={!!nameError}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                nameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">{name.length}/32 characters</p>
              {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              onBlur={() => validateSymbol(symbol)}
              placeholder="MTK"
              maxLength={5}
              aria-label="Token Symbol"
              aria-required="true"
              aria-invalid={!!symbolError}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                symbolError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            <div className="flex justify-between mt-1">
              <p className="text-xs text-gray-500">{symbol.length}/5 characters</p>
              {symbolError && <p className="text-red-500 text-xs">{symbolError}</p>}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Decimals</label>
            <select
              value={decimals}
              onChange={(e) => setDecimals(e.target.value)}
              onBlur={() => validateDecimals(decimals)}
              aria-label="Token Decimals"
              aria-required="true"
              aria-invalid={!!decimalsError}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                decimalsError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            >
              <option value="0">0</option>
              <option value="6">6 (Recommended)</option>
              <option value="8">8</option>
              <option value="18">18</option>
            </select>
            {decimalsError && <p className="text-red-500 text-xs mt-1">{decimalsError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Supply</label>
            <input
              type="number"
              value={supply}
              onChange={(e) => setSupply(e.target.value)}
              onBlur={() => validateSupply(supply)}
              placeholder="1000000"
              aria-label="Initial Supply"
              aria-required="true"
              aria-invalid={!!supplyError}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                supplyError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {supplyError && <p className="text-red-500 text-xs mt-1">{supplyError}</p>}
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
          disabled={isLoading || !!nameError || !!symbolError || !!decimalsError || !!supplyError || !name || !symbol || !supply}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating Token...
            </>
          ) : (
            "Create Token (5 STX)"
          )}
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
