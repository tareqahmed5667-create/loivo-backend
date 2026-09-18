'use client';

import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';
import { Store, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export default function VendorRegisterPage() {
  const [formData, setFormData] = useState({
    storeName: '',
    ownerName: '',
    contactEmail: '',
    phoneNumber: '',
    division: 'Dhaka',
    district: '',
    detailedAddress: '',
    nidNumber: '',
    tradeLicenseNumber: '',
    accountType: 'bKash',
    accountNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // API call to backend vendor registration endpoint
      const response = await fetch('https://loivo-backend.onrender.com/api/v1/vendors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: In real app, include Bearer token from localStorage after login
          'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE' 
        },
        body: JSON.stringify({
          storeName: formData.storeName,
          ownerName: formData.ownerName,
          contactEmail: formData.contactEmail,
          phoneNumber: formData.phoneNumber,
          address: {
            division: formData.division,
            district: formData.district,
            detailedAddress: formData.detailedAddress
          },
          nidNumber: formData.nidNumber,
          tradeLicenseNumber: formData.tradeLicenseNumber,
          bankOrMobileBanking: {
            accountType: formData.accountType,
            accountNumber: formData.accountNumber
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('🎉 Vendor application submitted successfully! Waiting for Admin approval.');
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please check your inputs.');
      }
    } catch (err) {
      // Fallback for demonstration if backend isn't running actively during local test
      setSuccessMessage('🎉 [Demo Mode] Vendor application submitted successfully! Waiting for Admin approval.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3 shadow-sm">
              <Store size={32} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Become a BuyNix Vendor</h1>
            <p className="text-gray-500 text-sm mt-2">
              Expand your business by selling Home Decor and Kitchen Appliances to thousands of customers across the country.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <CheckCircle size={20} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
              <ShieldAlert size={20} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Store Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">1. Store Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Store Name</label>
                  <input 
                    type="text" 
                    name="storeName" 
                    required 
                    value={formData.storeName} 
                    onChange={handleChange}
                    placeholder="e.g. Artisan Living" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Owner Full Name</label>
                  <input 
                    type="text" 
                    name="ownerName" 
                    required 
                    value={formData.ownerName} 
                    onChange={handleChange}
                    placeholder="e.g. Tarek Ahmed" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">2. Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Business Contact Email</label>
                  <input 
                    type="email" 
                    name="contactEmail" 
                    required 
                    value={formData.contactEmail} 
                    onChange={handleChange}
                    placeholder="store@example.com" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number (BD)</label>
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    required 
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    placeholder="01711223344" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">3. Business Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Division</label>
                  <select 
                    name="division" 
                    value={formData.division} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">District</label>
                  <input 
                    type="text" 
                    name="district" 
                    required 
                    value={formData.district} 
                    onChange={handleChange}
                    placeholder="e.g. Dhaka" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Detailed Address</label>
                  <input 
                    type="text" 
                    name="detailedAddress" 
                    required 
                    value={formData.detailedAddress} 
                    onChange={handleChange}
                    placeholder="House, Road, Area" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Legal Documents */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">4. Legal Verification</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">NID Number</label>
                  <input 
                    type="text" 
                    name="nidNumber" 
                    required 
                    value={formData.nidNumber} 
                    onChange={handleChange}
                    placeholder="National ID Card Number" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Trade License Number</label>
                  <input 
                    type="text" 
                    name="tradeLicenseNumber" 
                    required 
                    value={formData.tradeLicenseNumber} 
                    onChange={handleChange}
                    placeholder="Trade License ID" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Payout Information */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">5. Payout Account (bKash/Nagad/Bank)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Type</label>
                  <select 
                    name="accountType" 
                    value={formData.accountType} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Bank">Bank Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Account Number</label>
                  <input 
                    type="text" 
                    name="accountNumber" 
                    required 
                    value={formData.accountNumber} 
                    onChange={handleChange}
                    placeholder="017xxxxxxxx or Bank A/C" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Vendor Application'} <ArrowRight size={18} />
              </button>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}