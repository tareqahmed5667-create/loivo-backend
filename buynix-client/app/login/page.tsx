'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('https://loivo-backend.onrender.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token and user info to localStorage
        localStorage.setItem('loivo_token', data.token);
        localStorage.setItem('loivo_user', JSON.stringify(data.user));

        alert('🎉 Logged in successfully!');
        
        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'vendor') {
          router.push('/vendor/register');
        } else {
          router.push('/');
        }
      } else {
        setErrorMessage(data.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="max-w-md mx-auto px-4 py-12 flex-1 w-full flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 w-full">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3 shadow-sm">
              <LogIn size={28} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 text-xs mt-1">Log in to your LOIVO Marketplace account</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 text-xs font-medium">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange}
                placeholder="example@gmail.com" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
            >
              {loading ? 'Logging in...' : 'Log In'} <ArrowRight size={16} />
            </button>

          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>

        </div>
      </main>
    </div>
  );
}