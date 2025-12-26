"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { FEES } from "@/config/contracts";

export default function HomePage() {
  const { connected } = useWallet();

  const features = [
    {
      title: "NFT Marketplace",
      description: "Mint, list, and trade NFTs with low fees",
      fee: `${FEES.NFT_SALE_FEE}% sale fee`,
      href: "/marketplace",
      icon: "🎨",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Token Launchpad",
      description: "Launch your own token on Stacks",
      fee: `${FEES.TOKEN_CREATION / 1000000} STX creation fee`,
      href: "/launchpad",
      icon: "🚀",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Staking Vault",
      description: "Stake STX and earn rewards",
      fee: `${FEES.STAKING_WITHDRAW}% withdrawal fee`,
      href: "/staking",
      icon: "🏦",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Service Registry",
      description: "Offer and pay for services on-chain",
      fee: `${FEES.SERVICE_TX}% transaction fee`,
      href: "/services",
      icon: "🛠️",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">StackHub</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your all-in-one DeFi platform on Stacks. Trade NFTs, launch tokens, stake STX, and access services - all with minimal fees.
        </p>
        
        {!connected && (
          <div className="mt-8">
            <p className="text-gray-500 mb-4">Connect your wallet to get started</p>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {features.map((feature) => (
          <Link
            key={feature.title}
            href={feature.href}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <div className="p-8">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {feature.fee}
                  </span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Platform Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-gray-600">NFTs Minted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-600">Tokens Launched</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">0 STX</div>
            <div className="text-gray-600">Total Staked</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-gray-600">Services Listed</div>
          </div>
        </div>
      </div>
    </div>
  );
}
