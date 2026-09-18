'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Heart, Search, Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  onOpenCart?: () => void;
}

export default function Navbar({ cartCount = 0, wishlistCount = 0, onOpenCart }: NavbarProps) {
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle Language between English and Bengali
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'EN' ? 'BN' : 'EN'));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect or filter logic for search
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Top Bar for Announcements / Language Toggle */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-8 flex justify-between items-center">
        <p>
          {lang === 'EN' 
            ? '🔥 Special Offer: Free Delivery on Kitchen Appliances over ৳5000!' 
            : '🔥 বিশেষ অফার: ৫০০০ টাকার বেশি কিচেন অ্যাপ্লায়েন্সেসে ফ্রি ডেলিভারি!'}
        </p>
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors text-xs font-medium"
        >
          <Globe size={13} />
          <span>{lang === 'EN' ? 'বাংলা (BN)' : 'English (EN)'}</span>
        </button>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
       {/* Logo Image */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.jfif" 
            alt="LOIVO Marketplace" 
            className="h-10 w-auto object-contain" 
          />
        </Link>

        {/* Search Bar (Desktop) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'EN' ? 'Search Home Decor, Kitchen Appliances...' : 'হোম ডেকোর, কিচেন অ্যাপ্লায়েন্সেস খুঁজুন...'}
            className="w-full bg-gray-100 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-indigo-600">
            <Search size={18} />
          </button>
        </form>

        {/* Navigation Actions (Wishlist, Cart, Mobile Menu Toggle) */}
        <div className="flex items-center gap-5">
          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative text-gray-700 hover:text-indigo-600 transition-colors hidden sm:flex items-center gap-1">
            <div className="p-2 rounded-full hover:bg-gray-100 relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </div>
          </Link>

          {/* Cart Drawer Toggle Button */}
          <button 
            onClick={onOpenCart}
            className="relative text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <div className="p-2 rounded-full hover:bg-gray-100 relative bg-indigo-50 text-indigo-600">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Category Links Sub-bar */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center gap-8 py-2.5 text-sm font-medium overflow-x-auto whitespace-nowrap">
          <Link href="/" className="text-indigo-600 font-semibold hover:text-indigo-700">
            {lang === 'EN' ? 'All Products' : 'সকল পণ্য'}
          </Link>
          <Link href="/category/home-decor" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {lang === 'EN' ? '🏡 Home Decor' : '🏡 হোম ডেকোর'}
          </Link>
          <Link href="/category/kitchen-appliances" className="text-gray-600 hover:text-indigo-600 transition-colors">
            {lang === 'EN' ? '🍳 Kitchen Appliances' : '🍳 কিচেন অ্যাপ্লায়েন্সেস'}
          </Link>
          <Link href="/vendor/register" className="text-emerald-600 hover:text-emerald-700 font-semibold ml-auto">
            {lang === 'EN' ? '✨ Become a Vendor' : '✨ ভেন্ডর হোন'}
          </Link>
        </div>
      </div>
    </header>
  );
}