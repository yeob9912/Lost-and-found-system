import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Scan, UserPlus } from 'lucide-react';

export default function Login({ onSwitchToSignup }) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', loginData);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0] flex items-center justify-center p-3 sm:p-6 font-sans text-[#2D3748]">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[700px] transition-all duration-300">

        {/* Left Banner Panel */}
        <div className="w-full md:w-5/12 bg-[#E9F0E6] p-6 sm:p-8 lg:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E0E7DC]">
          <div>
            <div className="flex items-center gap-2 mb-6 sm:mb-8 group cursor-pointer">
              <div className="w-8 h-8 bg-[#2D5A46] rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-base sm:text-lg text-[#1A362B] block">FindBack</span>
                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#4A6B5D] font-semibold block">
                  UNIVERSITY LOST & FOUND
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1A362B] leading-tight mb-3 sm:mb-4">
              Good to have <br className="hidden sm:inline" />You back.
            </h1>
            <p className="text-xs sm:text-sm text-[#4A6B5D] leading-relaxed mb-6">
              A lost item is only the start of a story. Your campus can help write a happier ending.
            </p>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-6 shadow-md border border-[#D5E2D1] group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students returning lost headphones"
                className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="flex items-start gap-3 text-xs text-[#3E5C4E] group">
              <ShieldCheck className="w-5 h-5 text-[#2D5A46] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
              <span>
                Designed for a trusted campus community.<br />
                <strong>Your identifying evidence stays private.</strong>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-[#6B8A7A] mt-6 sm:mt-8 hidden md:block">
            University FindBack - ASTU University
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-[#FAFCFA]">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">

            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <button className="flex items-center gap-2 text-xs text-[#527063] hover:text-[#1A362B] transition-all group">
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to FindBack
              </button>
            </div>


            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A362B] mb-1.5 sm:mb-2">Welcome back</h2>
            <p className="text-xs text-[#527063] mb-6 sm:mb-8">
              Log in to report, claim and reconnect with your belongings.
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                  Email address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex.morgan@northbridge.edu"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 sm:px-4 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 sm:px-4 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#4A6B5D] group">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-[#2D5A46] focus:ring-[#2D5A46] transition-colors"
                  />
                  <span className="group-hover:text-[#1A362B] transition-colors">Remember me</span>
                </label>
                <a href="#" className="font-semibold text-[#2D5A46] hover:underline transition-all">
                  Forgot password?
                </a>
              </div>

              {/* Main Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#2D5A46] hover:bg-[#234737] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 active:scale-[0.98] group"
              >
                <span>Log in</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </form>

            {/* Border-less Switch Link: "Have no account ? Create account" */}
            <div className="mt-6 pt-5 border-t border-[#E0E7DC] text-center text-xs text-[#527063]">
              Have no account?{' '}
              <button
                type="button"
                onClick={onSwitchToSignup}
                className="font-semibold text-[#2D5A46] hover:text-[#1A362B] hover:underline active:text-[#132A20] transition-colors inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
              >
                Create an account
              </button>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-[#6B8A7A] mt-8 sm:mt-10">
              <a href="#" className="hover:underline transition-colors">Privacy policy</a>
              <span>•</span>
              <a href="#" className="hover:underline transition-colors">Need help?</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}