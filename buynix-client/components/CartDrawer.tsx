'use client';

import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, cartItems, onRemoveItem, onCheckout }: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-indigo-600" size={22} />
            <h2 className="text-lg font-extrabold text-gray-900">Your Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 py-6 space-y-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag size={28} />
              </div>
              <p className="text-gray-500 text-sm font-medium">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-xs text-indigo-600 font-extrabold mt-0.5">৳{item.price} x {item.quantity}</p>
                </div>
                <button 
                  onClick={() => onRemoveItem(item._id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex justify-between items-center text-base font-bold text-gray-900">
              <span>Subtotal:</span>
              <span className="text-indigo-600 text-lg">৳{subtotal}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-all text-sm"
            >
              Proceed to Checkout & Order
            </button>
          </div>
        )}

      </div>
    </div>
  );
}