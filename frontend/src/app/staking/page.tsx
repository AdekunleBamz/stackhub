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
  const [unstakeAmount, setUnstakeAmount] = useState("");

  /**
   * Handles staking amount conversion and contract call.
   */
  const handleStake = async () => {
    if (!stakeAmount) return alert("Please enter amount");
    const amount = parseFloat(stakeAmount) * 1000000; // Convert to microstacks
    await stakeSTX(amount);
    setStakeAmount("");
  };

  const handleUnstake = async () => {
    if (!unstakeAmount) return alert("Please enter amount");
    const amount = parseFloat(unstakeAmount) * 1000000;
    await requestUnstake(amount);
    setUnstakeAmount("");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🏦 Staking Vault</h1>
      <p className="text-gray-600 mb-8">Stake your STX with minimal withdrawal fees</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Stake */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Stake STX</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (STX)</label>
              <input
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleStake}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Stake STX
            </button>
          </div>
        </div>

        {/* Unstake */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Request Unstake</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (STX)</label>
              <input
                type="number"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                placeholder="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleUnstake}
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all"
            >
              Request Unstake
            </button>
          </div>
        </div>
      </div>

      {/* Your Stake Info */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stake</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600">Staked Amount</div>
            <div className="text-2xl font-bold text-green-900">0 STX</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600">Lock Status</div>
            <div className="text-2xl font-bold text-blue-900">-</div>
          </div>
        </div>
      </div>

      {/* Fee Info */}
      <div className="mt-8 bg-green-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-green-900 mb-2">Fee Structure</h3>
        <div className="grid md:grid-cols-2 gap-4 text-green-800">
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium">Normal Withdrawal</div>
            <div className="text-2xl font-bold">0.5%</div>
            <div className="text-sm">After ~1 day lock period</div>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="font-medium">Early Withdrawal</div>
            <div className="text-2xl font-bold">2.5%</div>
            <div className="text-sm">Before lock period ends</div>
          </div>
        </div>
      </div>
    </div>
  );
}
