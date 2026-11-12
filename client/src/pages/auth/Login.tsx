import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, Scan, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginUser } from '../../services/authService';

export default function Login({ onSwitchToSignup }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const authRes = await loginUser({
        email: loginData.email,
        password: loginData.password,
      });

      // Strict Role-based post-login redirection:
      // Admins are directed strictly to the Admin area; Students to the student home/intended page
      const userRole = authRes?.user?.role ? String(authRes.user.role).trim().toLowerCase() : '';
      const redirectFrom = (location.state as any)?.from;

      if (userRole === 'admin') {
        // If an admin had attempted to access an admin route, continue there; otherwise default to /admin
        if (redirectFrom && redirectFrom.startsWith('/admin')) {
          navigate(redirectFrom);
        } else {
          navigate('/admin');
        }
      } else {
        // Student user: never redirect into admin pages
        if (redirectFrom && !redirectFrom.startsWith('/admin') && redirectFrom !== '/login') {
          navigate(redirectFrom);
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F0]/85 dark:bg-[#0D0E12]/85 flex items-center justify-center p-3 sm:p-6 font-sans text-[#2D3748] relative z-10 transition-colors">
      <div className="glass-panel w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col md:flex-row min-h-[700px] transition-all duration-300">

        {/* Left Banner Panel */}
        <div className="w-full md:w-5/12 bg-[#E9F0E6] p-6 sm:p-8 lg:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E0E7DC]">
          <div>
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-2 mb-6 sm:mb-8 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-[#2D5A46] rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Scan className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="leading-tight">
                <span className="font-bold text-base sm:text-lg text-[#1A362B] block">FindBack</span>
                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase text-[#4A6B5D] font-semibold block">
                  UNIVERSITY LOST &amp; FOUND
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
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-xs text-[#527063] hover:text-[#1A362B] transition-all group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to FindBack
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A362B] mb-1.5 sm:mb-2">Welcome back</h2>
            <p className="text-xs text-[#527063] mb-6 sm:mb-8">
              Log in to report, claim and reconnect with your belongings.
            </p>

            {/* Error message banner */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 sm:px-4 pr-10 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8A7A] hover:text-[#2D5A46] transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
                disabled={loading}
                className="w-full py-3 bg-[#2D5A46] hover:bg-[#234737] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 active:scale-[0.98] group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Log in</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
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
