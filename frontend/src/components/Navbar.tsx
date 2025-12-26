"use client";

import Link from "next/link";
import { ConnectButton } from "./ConnectButton";

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SH</span>
              </div>
              <span className="text-xl font-bold text-gray-900">StackHub</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                NFT Marketplace
              </Link>
              <Link href="/launchpad" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Token Launchpad
              </Link>
              <Link href="/staking" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Staking Vault
              </Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Services
              </Link>
            </div>
          </div>

          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
