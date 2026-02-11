"use client";

import Link from "next/link";
import React, { useState, useCallback } from "react";
import { ConnectButton } from "./ConnectButton";

/**
 * Navigation bar component containing links to main application features.
 * Displays branding and the wallet connection button.
 * Mobile-responsive with hamburger menu for smaller screens.
 * Memoized to prevent unnecessary re-renders.
 */
export const Navbar = React.memo(function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const navLinks = [
    { href: "/marketplace", label: "NFT Marketplace" },
    { href: "/launchpad", label: "Token Launchpad" },
    { href: "/staking", label: "Staking Vault" },
    { href: "/services", label: "Services" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 touch-manipulation" 
            aria-label="StackHub Home"
            onClick={closeMobileMenu}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="text-xl font-bold text-gray-900">StackHub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Connect Button */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 touch-manipulation min-h-[48px] min-w-[48px]"
            aria-expanded={mobileMenuOpen}
            aria-haspopup="true"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">{mobileMenuOpen ? "Close main menu" : "Open main menu"}</span>
            {!mobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 touch-manipulation min-h-[48px]"
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="px-3">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});
