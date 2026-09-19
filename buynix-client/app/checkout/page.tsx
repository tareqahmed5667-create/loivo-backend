'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    division: 'Dhaka',
    district: '',
    address: '',
    paymentMethod: 'bKash'
  });

  const [loading, setLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // In real app, load from localStorage or global state context
    const savedCart = localStorage.getItem('loivo_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setShippingData({ ...shippingData, [e.target.name]: e.target.value });
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingPrice = itemsPrice > 0 ? 100 : 0; // Flat 100 BDT shipping fee inside BD
  const totalPrice = itemsPrice + shippingPrice;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setErrorMessage('Your cart is empty!');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('loivo_token');
      const formattedItems = cartItems.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        vendor: item.vendor || '651234567890123456789012' // Fallback vendor id stub
      }));

      const response = await fetch('https://loivo-backend.onrender.com/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderItems: formattedItems,
          shippingAddress: {
            fullName: shippingData.fullName,
            phone: shippingData.phone,
            division: shippingData.division,
            district: shippingData.district,
            address: shippingData.address
          },
          paymentInfo: {
            id: 'TXN_' + Math.random().toString(36).substring(7).toUpperCase(),
            status: shippingData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
            method: shippingData.paymentMethod
          },
          itemsPrice,
          shippingPrice,
          totalPrice
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessOrder(true);
        localStorage.removeItem('loivo_cart');
      } else {
        setErrorMessage(data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error during order placement.');
    } finally {
      setLoading(false);
    }
  };

  if (successOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="max-w-md mx-auto px-4 py-20 flex-1 flex items-center justify-center text-center">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4 w-full">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Order Placed Successfully!</h1>
            <p className="text-sm text-gray-500">
              Thank you for shopping with LOIVO. Your order has been placed and sent to the vendor for processing.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-4"
            >
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 flex-1 w-full">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Secure Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Shipping & Payment Form */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Shipping Address & Payment</h2>

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    required 
                    value={shippingData.fullName} 
                    onChange={handleChange}
                    placeholder="Tarek Ahmed" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    required 
                    value={shippingData.phone} 
                    onChange={handleChange}
                    placeholder="01711223344" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Division</label>
                  <select 
                    name="division" 
                    value={shippingData.division} 
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">District</label>
                  <input 
                    type="text" 
                    name="district" 
                    required 
                    value={shippingData.district} 
                    onChange={handleChange}
                    placeholder="Dhaka" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Street Address</label>
                <textarea 
                  name="address" 
                  required 
                  rows={2}
                  value={shippingData.address} 
                  onChange={handleChange}
                  placeholder="House, Road, Area" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {['bKash', 'SSLCommerz', 'COD'].map((method) => (
                    <label key={method} className={`border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer text-xs font-bold transition-all ${shippingData.paymentMethod === method ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method} 
                        checked={shippingData.paymentMethod === method}
                        onChange={handleChange}
                        className="accent-indigo-600"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-6"
              >
                {loading ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-3xl p-6 sm:p-6 shadow-sm border border-gray-100 h-fit space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-2 border-b">Order Summary</h2>
            
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-bold text-gray-900">৳{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span className="font-bold text-gray-900">৳{shippingPrice}</span>
              </div>
              <div className="flex justify-between pt-3 border-t text-sm font-extrabold text-gray-900">
                <span>Total Amount:</span>
                <span className="text-indigo-600 text-base">৳{totalPrice}</span>
              </div>
            </div>

            <div className="pt-4 border-t text-[11px] text-gray-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
              <span>Secure Checkout & Verified Vendor Delivery</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}