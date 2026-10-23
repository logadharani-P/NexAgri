import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Sprout, Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthScreenProps {
  onSuccess?: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  initialMode = 'login',
}) => {
  const { loginWithCredentials, registerUser, quickDemoLogin } = useAuth();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('98421 78901');
  const [loginPassword, setLoginPassword] = useState('nexagri2026');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register Form State
  const [registerRole, setRegisterRole] = useState<'farmer' | 'buyer'>('farmer');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier.trim()) {
      setErrorMsg('Please enter your mobile number or username.');
      return;
    }

    if (!loginPassword.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await loginWithCredentials(loginIdentifier, loginPassword);
      if (ok) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg('Invalid login credentials. Please try again.');
      }
    } catch {
      setErrorMsg('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobileNumber.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (!agreedTerms) {
      setErrorMsg('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const ok = await registerUser(
        fullName,
        cleanMobile,
        email,
        regPassword,
        registerRole as UserRole
      );
      if (ok) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    } catch {
      setErrorMsg('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Login Handler
  const handleQuickDemo = (demoRole: 'farmer' | 'buyer') => {
    quickDemoLogin(demoRole);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Image Container */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={mode === 'login' ? '/assets/farmer_sunset.jpg' : '/assets/crop_leaves.jpg'}
          alt="Agricultural Background"
          className="w-full h-full object-cover object-center transition-all duration-700 scale-105"
        />
        {/* Subtle Dark/Transparent Overlay for enhanced readability */}
        <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]" />
      </div>

      {/* Centered Authentication Card Container */}
      <div className="relative z-10 w-full flex items-center justify-center my-auto py-6">
        {mode === 'login' ? (
          /* ==========================================================
             COMPACT, CENTERED LOGIN CARD
             ========================================================== */
          <div className="w-full max-w-[390px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-950/30 p-6 sm:p-7 transition-all duration-300 border border-white/80">
            {/* NexAgri AI Brand Header */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/25 mb-2.5">
                <Wheat className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-slate-900">NexAgri</span>
                <span className="text-xl font-black text-blue-600">AI</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                Welcome Back!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Login to your NexAgri account
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-3.5 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {/* Mobile Number / Username Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Mobile Number / Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter mobile or username"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600 font-medium text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert('Demo login credentials: Mobile 98421 78901 / Password: nexagri2026')}
                  className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer text-[11px]"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button (Full Width) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Register Here Link Footer */}
            <div className="text-center mt-4 pt-3 border-t border-slate-100">
              <p className="text-xs text-slate-600 font-medium">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('register');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* Quick Demo Access Bar */}
            <div className="mt-3.5 pt-2.5 border-t border-dashed border-slate-200">
              <p className="text-[10px] text-center font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                ⚡ 1-Click Demo Login
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('farmer')}
                  className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all border border-blue-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🌾 Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('buyer')}
                  className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all border border-slate-200 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>🏢 Buyer</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==========================================================
             COMPACT, CENTERED REGISTER CARD
             ========================================================== */
          <div className="w-full max-w-[440px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-slate-950/30 p-6 sm:p-7 transition-all duration-300 border border-white/80">
            {/* NexAgri AI Brand Header */}
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-600/25 mb-2">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-slate-900">NexAgri</span>
                <span className="text-lg font-black text-blue-600">AI</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                Create Your Account
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Join thousands of smart farmers and verified buyers
              </p>
            </div>

            {/* Role Toggle Selector (Farmer / Buyer) */}
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 mb-3.5">
              <button
                type="button"
                onClick={() => setRegisterRole('farmer')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  registerRole === 'farmer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌾 Farmer
              </button>
              <button
                type="button"
                onClick={() => setRegisterRole('buyer')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  registerRole === 'buyer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 Buyer
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            {/* Registration Form with Efficient Two-Column Layout on Desktop */}
            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              {/* Row 1: Full Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="10-digit mobile"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                    required
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                  Email <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                />
              </div>

              {/* Row 2: Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 chars"
                      className="w-full pl-3 pr-8 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showRegPassword ? "Hide password" : "Show password"}
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-3 pr-8 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-2xs"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start gap-1.5 cursor-pointer select-none text-[11px] text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                    required
                  />
                  <span>
                    I agree to the <span className="text-blue-600 font-semibold hover:underline">Terms</span> & <span className="text-blue-600 font-semibold hover:underline">Privacy Policy</span>
                  </span>
                </label>
              </div>

              {/* Register Button (Full Width) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-1 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Register Now</span>
                )}
              </button>
            </form>

            {/* Login Here Link Footer */}
            <div className="text-center mt-3.5 pt-2.5 border-t border-slate-100">
              <p className="text-xs text-slate-600 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setMode('login');
                  }}
                  className="text-blue-600 font-bold hover:underline cursor-pointer"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
