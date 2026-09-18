'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  LogOut,
  AlertTriangle,
  Lock,
  Unlock,
  Ban
} from 'lucide-react';

// Mock data for pending vendor applications
const INITIAL_VENDORS = [
  {
    _id: 'v1',
    storeName: 'Artisan Living',
    ownerName: 'Tarek Ahmed',
    contactEmail: 'tarek@example.com',
    phoneNumber: '01711223344',
    address: { division: 'Dhaka', district: 'Dhaka', detailedAddress: 'House 12, Road 5, Uttara' },
    nidNumber: '1992837465',
    tradeLicenseNumber: 'TR-2026-9981',
    accountType: 'bKash',
    accountNumber: '01711223344',
    status: 'pending'
  },
  {
    _id: 'v2',
    storeName: 'KitchenPro BD',
    ownerName: 'Rahim Uddin',
    contactEmail: 'rahim@example.com',
    phoneNumber: '01811223355',
    address: { division: 'Chattogram', district: 'Chattogram', detailedAddress: 'GEC Circle, CDA Avenue' },
    nidNumber: '1985746392',
    tradeLicenseNumber: 'TR-2026-4432',
    accountType: 'Nagad',
    accountNumber: '01811223355',
    status: 'pending'
  }
];

// Mock stores for advanced Store Control (Active/Temp Block/Banned)
const INITIAL_STORES = [
  { _id: 's1', storeName: 'Artisan Living', owner: 'Tarek Ahmed', status: 'Active' },
  { _id: 's2', storeName: 'DecorCraft BD', owner: 'Kamal Hossain', status: 'Temporarily Blocked' },
  { _id: 's3', storeName: 'HomeChef Appliances', owner: 'Nusrat Jahan', status: 'Active' },
];

export default function AdminDashboard() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [stores, setStores] = useState(INITIAL_STORES);
  const [activeTab, setActiveTab] = useState<'vendors' | 'analytics' | 'storeControl'>('vendors');
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    vendorId: string;
    actionType: 'approved' | 'rejected' | null;
    storeName: string;
  }>({
    show: false,
    vendorId: '',
    actionType: null,
    storeName: ''
  });

  const promptAction = (id: string, action: 'approved' | 'rejected', name: string) => {
    setConfirmModal({ show: true, vendorId: id, actionType: action, storeName: name });
  };

  const handleConfirmAction = () => {
    if (!confirmModal.vendorId || !confirmModal.actionType) return;
    setVendors(prev => prev.map(v => 
      v._id === confirmModal.vendorId ? { ...v, status: confirmModal.actionType as any } : v
    ));
    alert(`Success! Vendor "${confirmModal.storeName}" has been ${confirmModal.actionType}.`);
    setConfirmModal({ show: false, vendorId: '', actionType: null, storeName: '' });
  };

  // Change Store Status (Active / Temp Block / Banned)
  const handleStoreStatusChange = (storeId: string, newStatus: string) => {
    setStores(prev => prev.map(s => s._id === storeId ? { ...s, status: newStatus } : s));
    alert(`Store status updated to: "${newStatus}"`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row relative">
      
      {/* Confirmation Modal Popup */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center ${confirmModal.actionType === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900">Are you sure?</h3>
            <p className="text-sm text-gray-500">
              You are about to <span className="font-bold uppercase text-gray-800">{confirmModal.actionType}</span> the vendor application for <span className="text-indigo-600 font-bold">"{confirmModal.storeName}"</span>.
            </p>
            <div className="flex items-center gap-3 pt-4">
              <button 
                onClick={() => setConfirmModal({ show: false, vendorId: '', actionType: null, storeName: '' })}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                className={`flex-1 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm ${confirmModal.actionType === 'approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'}`}
              >
                Yes, {confirmModal.actionType}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <img 
              src="/logo.jfif" 
              alt="LOIVO Admin" 
              className="h-9 w-auto object-contain bg-white p-1 rounded-lg shadow-sm" 
            />
            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Admin</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('vendors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'vendors' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Store size={18} />
              <span>Vendor Approvals</span>
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <LayoutDashboard size={18} />
              <span>Platform Metrics</span>
            </button>
            <button 
              onClick={() => setActiveTab('storeControl')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${activeTab === 'storeControl' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <ShieldCheck size={18} />
              <span>Store & Payout Control</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 font-medium text-sm transition-colors rounded-xl hover:bg-slate-800">
            <LogOut size={18} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Admin Control Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Manage marketplace vendors, platform revenue, and application approvals.</p>
          </div>
          <div className="flex items-center gap-3 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold border border-indigo-100">
            <ShieldCheck size={20} />
            <span>Super Admin</span>
          </div>
        </header>

        {/* Analytics Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">৳1,45,200</h3>
              <span className="text-xs font-semibold text-emerald-600 mt-1 inline-block">+12% from last month</span>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Vendors</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">
                {vendors.filter(v => v.status === 'approved').length}
              </h3>
              <span className="text-xs font-semibold text-indigo-600 mt-1 inline-block">Home Decor & Kitchen</span>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Store size={28} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-3xl font-extrabold text-gray-900 mt-1">318</h3>
              <span className="text-xs font-semibold text-amber-600 mt-1 inline-block">14 Pending Delivery</span>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
              <ShoppingBag size={28} />
            </div>
          </div>
        </div>

        {/* Tab 1: Vendor Approvals */}
        {activeTab === 'vendors' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Vendor Applications Approval Workflow</h2>
                <p className="text-xs text-gray-500 mt-0.5">Review store details, NID, and trade license before approval.</p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                {vendors.filter(v => v.status === 'pending').length} Pending Requests
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="p-4 font-semibold">Store & Owner Details</th>
                    <th className="p-4 font-semibold">Contact & Address</th>
                    <th className="p-4 font-semibold">Legal & Payout Info</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {vendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 align-top">
                        <div className="font-extrabold text-gray-900 text-base">{vendor.storeName}</div>
                        <div className="text-xs text-gray-600 font-medium mt-0.5">Owner: {vendor.ownerName}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-gray-900 font-medium">{vendor.contactEmail}</div>
                        <div className="text-xs text-gray-500">{vendor.phoneNumber}</div>
                        <div className="text-xs text-gray-400 mt-1">{vendor.address.district}, {vendor.address.division}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-xs text-gray-800 font-bold">NID: <span className="font-normal text-gray-600">{vendor.nidNumber}</span></div>
                        <div className="text-xs text-indigo-600 font-bold mt-0.5">Trade: <span className="font-normal text-gray-600">{vendor.tradeLicenseNumber}</span></div>
                        <div className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded mt-1.5 inline-block font-semibold">
                          {vendor.accountType}: {vendor.accountNumber}
                        </div>
                      </td>
                      <td className="p-4 align-top">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize mt-1 ${
                          vendor.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                          vendor.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {vendor.status === 'pending' && <Clock size={12} />}
                          {vendor.status === 'approved' && <CheckCircle2 size={12} />}
                          {vendor.status === 'rejected' && <XCircle size={12} />}
                          {vendor.status}
                        </span>
                      </td>
                      <td className="p-4 align-top text-right space-x-2">
                        {vendor.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => promptAction(vendor._id, 'approved', vendor.storeName)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => promptAction(vendor._id, 'rejected', vendor.storeName)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic block mt-1">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Platform Metrics */}
        {activeTab === 'analytics' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200/60 text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Advanced Platform Financial & Vendor Analytics</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Real-time multi-vendor sales report, commission payout breakdowns, and category-wise performance metrics for Home Decor & Kitchen Appliances.
            </p>
            <div className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold">
              Analytics Module Fully Configured & Ready for Production.
            </div>
          </div>
        )}

        {/* Tab 3: Store Control & Payout Management (Advanced with Temp Block & Unban) */}
        {activeTab === 'storeControl' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Vendor Store & Payout Management</h2>
              <p className="text-xs text-gray-500 mb-6">Manage active stores, apply temporary blocks, permanent bans, or process commission payouts.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Store Status Control Section */}
                <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50 space-y-4">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Active Store Status Controls
                  </h3>
                  <div className="space-y-3">
                    {stores.map((store) => (
                      <div key={store._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-xl border border-gray-200/60 gap-3">
                        <div>
                          <h4 className="font-extrabold text-sm text-gray-900">{store.storeName}</h4>
                          <p className="text-xs text-gray-500">Owner: {store.owner}</p>
                          <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded mt-1 ${
                            store.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                            store.status === 'Temporarily Blocked' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {store.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {store.status !== 'Active' && (
                            <button 
                              onClick={() => handleStoreStatusChange(store._id, 'Active')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Unlock size={12} /> Unban
                            </button>
                          )}
                          {store.status !== 'Temporarily Blocked' && (
                            <button 
                              onClick={() => handleStoreStatusChange(store._id, 'Temporarily Blocked')}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Lock size={12} /> Temp Block
                            </button>
                          )}
                          {store.status !== 'Permanently Banned' && (
                            <button 
                              onClick={() => handleStoreStatusChange(store._id, 'Permanently Banned')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Ban size={12} /> Ban
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Withdrawal Requests Section */}
                <div className="border border-gray-100 p-5 rounded-2xl bg-gray-50/50 space-y-4">
                  <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Payout Requests
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200/60">
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">KitchenPro BD</h4>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">Amount: ৳12,500 (bKash)</p>
                      </div>
                      <button 
                        onClick={() => alert('Payout of ৳12,500 processed successfully to vendor account!')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <DollarSign size={14} /> Process Payout
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}