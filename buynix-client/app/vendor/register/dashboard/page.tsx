'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Store, PlusCircle, Package, DollarSign, LogOut, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'addProduct'>('products');
  
  // Product Form State
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: 'Home Decor',
    price: '',
    stock: '',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=600'
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('loivo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loivo_token');
    localStorage.removeItem('loivo_user');
    router.push('/login');
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const token = localStorage.getItem('loivo_token');
      const response = await fetch('https://loivo-backend.onrender.com/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: productData.name,
          description: productData.description,
          category: productData.category,
          price: Number(productData.price),
          stock: Number(productData.stock),
          images: [{ public_id: 'sample_id', url: productData.imageUrl }]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMsg('✨ Product added successfully to LOIVO marketplace!');
        setProductData({ name: '', description: '', category: 'Home Decor', price: '', stock: '', imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&q=80&w=600' });
      } else {
        setErrorMsg(data.message || 'Failed to add product.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
                <Store size={22} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm">{user?.name || 'Vendor Store'}</h2>
                <span className="text-[11px] text-emerald-400 font-semibold">Verified Vendor</span>
              </div>
            </div>

            <nav className="space-y-2 pt-4 border-t border-slate-800">
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <Package size={18} />
                <span>My Products</span>
              </button>
              <button 
                onClick={() => setActiveTab('addProduct')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'addProduct' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <PlusCircle size={18} />
                <span>Add New Product</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 font-medium text-sm transition-colors rounded-xl hover:bg-slate-800"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
          
          <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Vendor Management Portal</h1>
              <p className="text-xs text-gray-500 mt-1">Manage your store products, inventory, and listings on LOIVO.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-bold border border-emerald-100">
              <DollarSign size={16} />
              <span>Store Status: Active</span>
            </div>
          </header>

          {/* TAB 1: Products List */}
          {activeTab === 'products' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/60 text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Package size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Store Catalog is Active</h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                You can add new Home Decor or Kitchen Appliances items using the sidebar tab "Add New Product".
              </p>
              <button 
                onClick={() => setActiveTab('addProduct')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all inline-flex items-center gap-2"
              >
                <PlusCircle size={18} /> Add Your First Product
              </button>
            </div>
          )}

          {/* TAB 2: Add New Product Form */}
          {activeTab === 'addProduct' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200/60 p-6 sm:p-8 max-w-2xl">
              <h2 className="text-xl font-extrabold text-gray-900 mb-1">Add New Product to Marketplace</h2>
              <p className="text-xs text-gray-500 mb-6">List your home decor or kitchen appliance item for customers.</p>

              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-medium">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-medium">
                  <ShieldAlert size={20} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={productData.name} 
                    onChange={handleProductChange}
                    placeholder="e.g. Premium Ceramic Dinner Set" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                    <select 
                      name="category" 
                      value={productData.category} 
                      onChange={handleProductChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Home Decor">Home Decor</option>
                      <option value="Kitchen Appliances">Kitchen Appliances</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (BDT)</label>
                    <input 
                      type="number" 
                      name="price" 
                      required 
                      value={productData.price} 
                      onChange={handleProductChange}
                      placeholder="1499" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Stock Quantity</label>
                    <input 
                      type="number" 
                      name="stock" 
                      required 
                      value={productData.stock} 
                      onChange={handleProductChange}
                      placeholder="50" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Image URL</label>
                    <input 
                      type="text" 
                      name="imageUrl" 
                      required 
                      value={productData.imageUrl} 
                      onChange={handleProductChange}
                      placeholder="https://image-url.com" 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={3}
                    value={productData.description} 
                    onChange={handleProductChange}
                    placeholder="Provide product details..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm disabled:opacity-50 mt-4"
                >
                  {loading ? 'Publishing Product...' : 'Publish Product to LOIVO'}
                </button>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}