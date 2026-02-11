"use client";

import React, { useCallback, useMemo } from "react";
import { useWallet } from "@/context/WalletContext";

/**
 * Dual-wallet connection button component.
 * Handles connection states for both Stacks (Leather/Xverse) and EVM wallets.
 * Memoized to prevent unnecessary re-renders.
 */
export const ConnectButton = React.memo(function ConnectButton() {
  const { 
    stacksConnected, 
    stacksAddress, 
    connectStacks, 
    disconnectStacks,
    evmConnected,
    evmAddress,
    connectEvm,
    disconnectEvm,
  } = useWallet();

  return (
    <div className="flex items-center gap-2">
      {/* Stacks Wallet */}
      {stacksConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-lg">
            STX: {stacksAddress?.slice(0, 4)}...{stacksAddress?.slice(-4)}
          </span>
          <button
            onClick={disconnectStacks}
            className="text-xs text-red-500 hover:text-red-600"
            title="Disconnect Stacks"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={connectStacks}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Connect Stacks
        </button>
      )}

      {/* EVM Wallet (Reown AppKit) */}
      {evmConnected ? (
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">
            EVM: {evmAddress?.slice(0, 4)}...{evmAddress?.slice(-4)}
          </span>
          <button
            onClick={disconnectEvm}
            className="text-xs text-red-500 hover:text-red-600"
            title="Disconnect EVM"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={connectEvm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          Connect EVM
        </button>
      )}
    </div>
  );
}

// Simple Stacks-only button for pages that only need Stacks
export function StacksConnectButton() {
  const { stacksConnected, stacksAddress, connectStacks, disconnectStacks } = useWallet();

  if (stacksConnected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
          {stacksAddress?.slice(0, 6)}...{stacksAddress?.slice(-4)}
        </span>
        <button
          onClick={disconnectStacks}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectStacks}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  );
});

// Reown AppKit modal button
export function AppKitButton() {
  return <appkit-button />;
}
