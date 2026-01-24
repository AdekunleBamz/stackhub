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
  const [price, setPrice] = useState("");
  const [serviceId, setServiceId] = useState("");

  /**
   * Validates input and registers a new service.
   * Converts price to microSTX.
   */
  const handleRegister = async () => {
    if (!title || !price) return alert("Please fill all fields");
    const priceInMicrostacks = parseFloat(price) * 1000000;
    await registerService(title, priceInMicrostacks);
    setTitle("");
    setPrice("");
  };

  const handlePay = async () => {
    if (!serviceId) return alert("Please enter service ID");
    await payForService(parseInt(serviceId));
    setServiceId("");
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
                placeholder="Web Development"
                maxLength={64}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (STX)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-orange-800">Listing Fee</span>
                <span className="text-orange-900 font-medium">2.5 STX</span>
              </div>
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-3 rounded-lg font-medium hover:from-orange-700 hover:to-yellow-700 transition-all"
            >
              Register Service (2.5 STX)
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
                placeholder="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-green-800">Platform Fee</span>
                <span className="text-green-900 font-medium">1.5%</span>
              </div>
            </div>
            <button
              onClick={handlePay}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all"
            >
              Pay for Service
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
