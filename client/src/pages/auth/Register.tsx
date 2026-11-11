import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  FileText,
  Heart,
  CheckCircle2,
  Scan,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { registerUser } from '../../services/authService';

export default function Signup({ onSwitchToLogin }) {
  const navigate = useNavigate();
  const [signupData, setSignupData] = useState({
    fullName: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await registerUser(signupData);
      setSuccess(data.message || 'Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch =
    signupData.password !== '' &&
    signupData.password === signupData.confirmPassword;

  return (
    <div className="min-h-screen bg-[#F4F6F0]/85 dark:bg-[#0D0E12]/85 flex items-center justify-center p-3 sm:p-6 font-sans text-[#2D3748] relative z-10 transition-colors">
      <div className="glass-panel w-full max-w-6xl rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 overflow-hidden flex flex-col md:flex-row min-h-[700px] transition-all duration-300">

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
                  UNIVERSITY LOST &amp; FOUND
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#1A362B] leading-tight mb-3 sm:mb-4">
              A campus that <br className="hidden sm:inline" />looks out for you.
            </h1>
            <p className="text-xs sm:text-sm text-[#4A6B5D] leading-relaxed mb-6">
              One student account. Whether you've lost something or found something, you're in the right place.
            </p>

            <div className="rounded-xl sm:rounded-2xl overflow-hidden mb-6 shadow-md border border-[#D5E2D1] group">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Students returning lost headphones"
                className="w-full h-40 sm:h-48 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            <div className="space-y-2.5 sm:space-y-3 text-xs text-[#3E5C4E] font-medium">
              <div className="flex items-center gap-2.5 group">
                <FileText className="w-4 h-4 text-[#2D5A46] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>Keep every report in one place</span>
              </div>
              <div className="flex items-center gap-2.5 group">
                <ShieldCheck className="w-4 h-4 text-[#2D5A46] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>Share ownership evidence privately</span>
              </div>
              <div className="flex items-center gap-2.5 group">
                <Heart className="w-4 h-4 text-[#2D5A46] shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>Make someone's day with a return</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#6B8A7A] mt-6 sm:mt-8 hidden md:block">
            University FindBack - ASTU University
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 lg:p-12 flex flex-col justify-between bg-[#FAFCFA]">
          <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">

            <div className="flex items-center justify-between mb-6">
              <button
                onClick={onSwitchToLogin}
                className="flex items-center gap-2 text-xs text-[#527063] hover:text-[#1A362B] transition-all group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back
              </button>
            </div>

            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1A362B] mb-1">Let's get you connected</h2>
            <p className="text-xs text-[#527063] mb-6">
              Create your student account. Fields marked * are required.
            </p>

            {/* Error / Success banners */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                    Full name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Morgan"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 sm:px-4 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    value={signupData.studentId}
                    onChange={(e) => setSignupData({ ...signupData, studentId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2.5 sm:px-4 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                  Email address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. alex.morgan@northbridge.edu"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 sm:px-4 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                />
                <p className="text-[11px] text-[#6B8A7A] mt-1">
                  Use an email address you can access for account recovery.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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
                  <p className="text-[11px] text-[#6B8A7A] mt-1">At least 8 characters.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2D3748] mb-1">
                    Confirm password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 sm:px-4 pr-10 rounded-xl border border-[#D5E2D1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A46]/30 focus:border-[#2D5A46] transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B8A7A] hover:text-[#2D5A46] transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordsMatch && (
                    <p className="text-[11px] text-[#2D5A46] mt-1 flex items-center gap-1 font-medium animate-pulse">
                      Passwords match <CheckCircle2 className="w-3 h-3" />
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-[#E9F0E6] p-3.5 rounded-xl border border-[#D5E2D1] flex items-start gap-2.5 sm:gap-3 group">
                <CheckCircle2 className="w-5 h-5 text-[#2D5A46] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-xs text-[#2D5A46]">
                  <span className="font-semibold block mb-0.5"> Join US  </span>
                  <span className="text-[#4A6B5D] text-[11px]">
                    A student account allows you to report both lost and found items across campus.
                  </span>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#4A6B5D] pt-1 group">
                <input
                  type="checkbox"
                  checked={signupData.agreeTerms}
                  onChange={(e) => setSignupData({ ...signupData, agreeTerms: e.target.checked })}
                  required
                  className="w-4 h-4 rounded border-gray-300 text-[#2D5A46] focus:ring-[#2D5A46] mt-0.5 shrink-0 transition-colors"
                />
                <span className="group-hover:text-[#1A362B] transition-colors">
                  I agree to the Terms of Use and Privacy Policy, and will share accurate reports and respectful messages.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#2D5A46] hover:bg-[#234737] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-300 active:scale-[0.98] mt-4 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create student account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Border-less Switch Link: "Have account ? Login" */}
            <div className="mt-5 pt-4 border-t border-[#E0E7DC] text-center text-xs text-[#527063]">
              Have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="font-semibold text-[#2D5A46] hover:text-[#1A362B] hover:underline active:text-[#132A20] transition-colors inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
              >
                Log in
              </button>
            </div>

            <div className="text-center text-[11px] text-[#6B8A7A] mt-5">
              Need a hand? Contact the campus FindBack team
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
