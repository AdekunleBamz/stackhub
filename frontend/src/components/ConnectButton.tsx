"use client";

import { useWallet } from "@/context/WalletContext";

export function ConnectButton() {
  const { connected, address, connect, disconnect } = useWallet();

  if (connected) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={disconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  );
}
