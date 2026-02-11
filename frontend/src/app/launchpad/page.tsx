"use client";

import { useState, useEffect } from "react";
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

  // Persist form state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("launchpadFormState");
    if (savedState) {
      const { name: savedName, symbol: savedSymbol, decimals: savedDecimals, supply: savedSupply } = JSON.parse(savedState);
      setName(savedName || "");
      setSymbol(savedSymbol || "");
      setDecimals(savedDecimals || "6");
      setSupply(savedSupply || "");
    }
  }, []);

  // Save form state when values change
  useEffect(() => {
    localStorage.setItem("launchpadFormState", JSON.stringify({ name, symbol, decimals, supply }));
  }, [name, symbol, decimals, supply]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">🚀 Token Launchpad</h1>
        <p className="text-gray-600 text-base sm:text-lg">Launch your own token on Stacks for just 5 STX</p>
      </header>

      <article className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
        <header className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Create New Token</h2>
        </header>
        
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <fieldset className="space-y-4 sm:space-y-6 border-none p-0 m-0">
            <legend className="sr-only">Token creation form</legend>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="token-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Token Name
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="token-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validateName(name)}
                  placeholder="My Token"
                  maxLength={32}
                  required
                  aria-required="true"
                  aria-invalid={!!nameError}
                  aria-describedby={nameError ? "name-error" : "name-help"}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    nameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between mt-1 gap-1">
                  <p id="name-help" className="text-xs text-gray-500">{name.length}/32 characters</p>
                  {nameError && <p id="name-error" className="text-red-500 text-xs" role="alert">{nameError}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="token-symbol" className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="token-symbol"
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  onBlur={() => validateSymbol(symbol)}
                  placeholder="MTK"
                  maxLength={5}
                  required
                  aria-required="true"
                  aria-invalid={!!symbolError}
                  aria-describedby={symbolError ? "symbol-error" : "symbol-help"}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    symbolError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between mt-1 gap-1">
                  <p id="symbol-help" className="text-xs text-gray-500">{symbol.length}/5 characters</p>
                  {symbolError && <p id="symbol-error" className="text-red-500 text-xs" role="alert">{symbolError}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="token-decimals" className="block text-sm font-medium text-gray-700 mb-1">
                  Decimals
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <select
                  id="token-decimals"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  onBlur={() => validateDecimals(decimals)}
                  required
                  aria-required="true"
                  aria-invalid={!!decimalsError}
                  aria-describedby={decimalsError ? "decimals-error" : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    decimalsError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="0">0</option>
                  <option value="6">6 (Recommended)</option>
                  <option value="8">8</option>
                  <option value="18">18</option>
                </select>
                {decimalsError && <p id="decimals-error" className="text-red-500 text-xs mt-1" role="alert">{decimalsError}</p>}
              </div>
              
              <div>
                <label htmlFor="token-supply" className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Supply
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="token-supply"
                  type="number"
                  value={supply}
                  onChange={(e) => setSupply(e.target.value)}
                  onBlur={() => validateSupply(supply)}
                  placeholder="1000000"
                  required
                  aria-required="true"
                  aria-invalid={!!supplyError}
                  aria-describedby={supplyError ? "supply-error" : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    supplyError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
                {supplyError && <p id="supply-error" className="text-red-500 text-xs mt-1" role="alert">{supplyError}</p>}
              </div>
            </div>

            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-blue-900 font-medium">Creation Fee</span>
                <span className="text-blue-900 font-bold text-lg">5 STX</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!nameError || !!symbolError || !!decimalsError || !!supplyError || !name || !symbol || !supply}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                  <span>Creating Token...</span>
                </>
              ) : (
                "Create Token (5 STX)"
              )}
            </button>
          </fieldset>
        </form>
      </article>

      {/* Info Section */}
      <aside className="mt-6 sm:mt-8 bg-blue-50 rounded-2xl p-4 sm:p-6" aria-label="Token features">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Token Features</h3>
        <ul className="text-blue-800 space-y-2">
          <li>• You become the token owner with minting rights</li>
          <li>• Transfer tokens to any Stacks address</li>
          <li>• Mint additional tokens at any time</li>
          <li>• Burn tokens to reduce supply</li>
        </ul>
      </aside>
    </div>
  );
}
