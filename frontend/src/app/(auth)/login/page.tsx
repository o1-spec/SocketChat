'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Github } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Simulate login success and redirect
    router.push('/chat');
  };

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex flex-col justify-center py-0 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 animate-in fade-in zoom-in duration-700">
            <Mail size={24} className="text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Welcome back
        </h2>
        <p className="mt-3 text-center text-sm text-gray-500 max-w">
          Log in to <span className="text-blue-600 font-semibold">SocketChat</span> to continue your conversations.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 sm:shadow-2xl sm:rounded-3xl sm:px-12 border-0 sm:border border-gray-100/50 backdrop-blur-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 sm:text-sm transition-all bg-white hover:bg-gray-50/50"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Password
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 sm:text-sm transition-all bg-white hover:bg-gray-50/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg transition-all cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500 cursor-pointer select-none">
                Stay signed in
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-blue-200 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] items-center gap-2 group"
              >
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">
                  Quick Access
                </span>
              </div>
            </div>

            <div className="mt-8">
              <button
                type="button"
                className="w-full inline-flex justify-center py-3.5 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98] items-center gap-3 group"
              >
                <Github size={20} className="group-hover:scale-110 transition-transform text-gray-900" />
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition-colors">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
