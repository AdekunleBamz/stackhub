"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { stakeSTX, requestUnstake } from "@/lib/contracts";

/**
 * Staking Vault Page.
 * Users can stake STX to earn rewards and request unstaking.
 * Interacts with `stackhub-staking-vault`.
 */
export default function StakingPage() {
  const { connected } = useWallet();
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeAmountError, setStakeAmountError] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [unstakeAmountError, setUnstakeAmountError] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);

  const validateStakeAmount = (amount: string) => {
    if (!amount.trim()) {
      setStakeAmountError("Amount is required");
      return false;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setStakeAmountError("Amount must be a positive number");
      return false;
    }
    if (num < 1) {
      setStakeAmountError("Minimum stake is 1 STX");
      return false;
    }
    setStakeAmountError("");
    return true;
  };

  const validateUnstakeAmount = (amount: string) => {
    if (!amount.trim()) {
      setUnstakeAmountError("Amount is required");
      return false;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setUnstakeAmountError("Amount must be a positive number");
      return false;
    }
    if (num < 1) {
      setUnstakeAmountError("Minimum unstake is 1 STX");
      return false;
    }
    setUnstakeAmountError("");
    return true;
  };

  /**
   * Handles staking amount conversion and contract call.
   */
  const handleStake = async () => {
    if (!validateStakeAmount(stakeAmount)) return;
    setIsStaking(true);
    try {
      const amount = parseFloat(stakeAmount) * 1000000;
      await stakeSTX(amount);
      setStakeAmount("");
    } finally {
      setIsStaking(false);
    }
  };

  /**
   * Handles unstaking request.
   */
  const handleUnstake = async () => {
    if (!validateUnstakeAmount(unstakeAmount)) return;
    setIsUnstaking(true);
    try {
      const amount = parseFloat(unstakeAmount) * 1000000;
      await requestUnstake(amount);
      setUnstakeAmount("");
    } finally {
      setIsUnstaking(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Staking Vault</h1>
        <p className="text-gray-600">Please connect your wallet to stake STX</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">🏦 Staking Vault</h1>
        <p className="text-gray-600 text-base sm:text-lg">Stake your STX with minimal withdrawal fees</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" role="list">
        {/* Stake */}
        <article className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" role="listitem">
          <header className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Stake STX</h2>
          </header>
          <form onSubmit={(e) => { e.preventDefault(); handleStake(); }}>
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="sr-only">Stake STX form</legend>
              <div>
                <label htmlFor="stake-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (STX)
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="stake-amount"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  onBlur={() => validateStakeAmount(stakeAmount)}
                  placeholder="100"
                  min="1"
                  step="0.01"
                  required
                  aria-required="true"
                  aria-invalid={!!stakeAmountError}
                  aria-describedby={stakeAmountError ? "stake-error" : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    stakeAmountError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                  }`}
                />
                {stakeAmountError && (
                  <p id="stake-error" className="text-red-500 text-xs mt-1" role="alert">{stakeAmountError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isStaking || !!stakeAmountError || !stakeAmount}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
              >
                {isStaking ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                    <span>Staking...</span>
                  </>
                ) : (
                  "Stake STX"
                )}
              </button>
            </fieldset>
          </form>
        </article>

        {/* Unstake */}
        <article className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" role="listitem">
          <header className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Request Unstake</h2>
          </header>
          <form onSubmit={(e) => { e.preventDefault(); handleUnstake(); }}>
            <fieldset className="space-y-4 border-none p-0 m-0">
              <legend className="sr-only">Request Unstake form</legend>
              <div>
                <label htmlFor="unstake-amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (STX)
                  <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="unstake-amount"
                  type="number"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  onBlur={() => validateUnstakeAmount(unstakeAmount)}
                  placeholder="50"
                  min="1"
                  step="0.01"
                  required
                  aria-required="true"
                  aria-invalid={!!unstakeAmountError}
                  aria-describedby={unstakeAmountError ? "unstake-error" : undefined}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                    unstakeAmountError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"
                  }`}
                />
                {unstakeAmountError && (
                  <p id="unstake-error" className="text-red-500 text-xs mt-1" role="alert">{unstakeAmountError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isUnstaking || !!unstakeAmountError || !unstakeAmount}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation min-h-[48px]"
              >
                {isUnstaking ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></span>
                    <span>Processing...</span>
                  </>
                ) : (
                  "Request Unstake"
                )}
              </button>
            </fieldset>
          </form>
        </article>
      </div>

      {/* Your Stake Info */}
      <section className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6" aria-labelledby="stake-info-heading">
        <h2 id="stake-info-heading" className="text-xl font-bold text-gray-900 mb-4">Your Stake</h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-green-50 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-green-600">Staked Amount</div>
            <div className="text-xl sm:text-2xl font-bold text-green-900">0 STX</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-blue-600">Lock Status</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-900">-</div>
          </div>
        </div>
      </section>

      {/* Fee Info */}
      <aside className="mt-6 sm:mt-8 bg-green-50 rounded-2xl p-4 sm:p-6" aria-labelledby="fee-heading">
        <h3 id="fee-heading" className="text-lg font-bold text-green-900 mb-3 sm:mb-4">Fee Structure</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-green-800">
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <div className="font-medium text-sm sm:text-base">Normal Withdrawal</div>
            <div className="text-xl sm:text-2xl font-bold">0.5%</div>
            <div className="text-xs sm:text-sm opacity-75">After ~1 day lock period</div>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4">
            <div className="font-medium text-sm sm:text-base">Early Withdrawal</div>
            <div className="text-xl sm:text-2xl font-bold">2.5%</div>
            <div className="text-xs sm:text-sm opacity-75">Before lock period ends</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
