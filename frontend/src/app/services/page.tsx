"use client";

import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { registerService, payForService } from "@/lib/contracts";

/**
 * Service Registry Page.
 * Allows providers to register services and users to pay for them.
 * Interacts with `stackhub-service-registry` contract.
 */
export default function ServicesPage() {
  const { connected } = useWallet();
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceIdError, setServiceIdError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const validateTitle = (value: string) => {
    if (!value.trim()) {
      setTitleError("Service title is required");
      return false;
    }
    if (value.length < 3 || value.length > 64) {
      setTitleError("Title must be 3-64 characters");
      return false;
    }
    setTitleError("");
    return true;
  };

  const validatePrice = (value: string) => {
    if (!value.trim()) {
      setPriceError("Price is required");
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      setPriceError("Price must be a positive number");
      return false;
    }
    if (num < 0.1) {
      setPriceError("Minimum price is 0.1 STX");
      return false;
    }
    setPriceError("");
    return true;
  };

  const validateServiceId = (value: string) => {
    if (!value.trim()) {
      setServiceIdError("Service ID is required");
      return false;
    }
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) {
      setServiceIdError("Service ID must be a non-negative integer");
      return false;
    }
    setServiceIdError("");
    return true;
  };

  /**
   * Validates input and registers a new service.
   * Converts price to microSTX.
   */
  const handleRegister = async () => {
    if (!validateTitle(title) || !validatePrice(price)) return;
    setIsRegistering(true);
    try {
      const priceInMicrostacks = parseFloat(price) * 1000000;
      await registerService(title, priceInMicrostacks);
      setTitle("");
      setPrice("");
    } finally {
      setIsRegistering(false);
    }
  };

  /**
   * Processes payment for a registered service.
   */
  const handlePay = async () => {
    if (!validateServiceId(serviceId)) return;
    setIsPaying(true);
    try {
      await payForService(parseInt(serviceId));
      setServiceId("");
    } finally {
      setIsPaying(false);
    }
  };

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Registry</h1>
        <p className="text-gray-600">Please connect your wallet to access services</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">🛠️ Service Registry</h1>
      <p className="text-gray-600 mb-8">Offer and pay for services on-chain</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Register Service */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Register Service</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => validateTitle(title)}
                placeholder="Web Development"
                maxLength={64}
                aria-label="Service Title"
                aria-required="true"
                aria-invalid={!!titleError}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  titleError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              <div className="flex justify-between mt-1">
                <p className="text-xs text-gray-500">{title.length}/64 characters</p>
                {titleError && <p className="text-red-500 text-xs">{titleError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (STX)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={() => validatePrice(price)}
                placeholder="100"
                min="0.1"
                step="0.01"
                aria-label="Service Price"
                aria-required="true"
                aria-invalid={!!priceError}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  priceError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500"
                }`}
              />
              {priceError && <p className="text-red-500 text-xs mt-1">{priceError}</p>}
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Listing Fee</span>
                <span className="text-orange-900 font-medium">2.5 STX</span>
              </div>
            </div>
            <button
              onClick={handleRegister}
              disabled={isRegistering || !!titleError || !!priceError || !title || !price}
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegistering ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Registering...
                </>
              ) : (
                "Register Service (2.5 STX)"
              )}
            </button>
          </div>
        </div>

        {/* Pay for Service */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pay for Service</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service ID</label>
              <input
                type="number"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                onBlur={() => validateServiceId(serviceId)}
                placeholder="1"
                min="0"
                aria-label="Service ID"
                aria-required="true"
                aria-invalid={!!serviceIdError}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                  serviceIdError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-green-500"
                }`}
              />
              {serviceIdError && <p className="text-red-500 text-xs mt-1">{serviceIdError}</p>}
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Platform Fee</span>
                <span className="text-green-900 font-medium">1.5%</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              disabled={isPaying || !!serviceIdError || !serviceId}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPaying ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </>
              ) : (
                "Pay for Service"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Services List Placeholder */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Services</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No services listed yet. Be the first to offer your services!</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-orange-50 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-orange-900 mb-2">How it works</h3>
        <ul className="text-orange-800 space-y-2">
          <li>• Register your service with a title and price (2.5 STX fee)</li>
          <li>• Clients can find and pay for your service on-chain</li>
          <li>• You receive 98.5% of the payment (1.5% platform fee)</li>
          <li>• Toggle your service active/inactive anytime</li>
        </ul>
      </div>
    </div>
  );
}
