import React, { useState } from 'react';
import { X, Eye, EyeOff, Check, ShieldCheck, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authMode, setAuthMode, login, signup } = useShop();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Signup form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  if (!isAuthOpen) return null;

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const passStrength = calculatePasswordStrength(signupPassword);
  const getStrengthLabel = (score: number) => {
    if (score === 0) return { label: 'Empty', color: 'bg-neutral-700' };
    if (score <= 25) return { label: 'Basic', color: 'bg-red-500' };
    if (score <= 50) return { label: 'Moderate', color: 'bg-amber-500' };
    if (score <= 75) return { label: 'Strong', color: 'bg-emerald-500' };
    return { label: 'Exceptional (Atelier Grade)', color: 'bg-amber-300' };
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both your email or mobile and your password.');
      return;
    }
    setLoading(true);
    try {
      const ok = await login(loginEmail, loginPassword);
      if (ok) {
        setSuccessMsg('Welcome back to VÉNARO.');
      } else {
        setErrorMsg('Invalid credentials. Please verify your password.');
      }
    } catch {
      setErrorMsg('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!firstName.trim()) {
      setErrorMsg('First name is required.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      const ok = await signup(
        {
          firstName,
          lastName,
          email: signupEmail,
          mobile: signupMobile,
        },
        signupPassword
      );
      if (ok) {
        setSuccessMsg('Account created successfully. Welcome to VÉNARO.');
      }
    } catch {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role: 'client' | 'admin') => {
    if (role === 'admin') {
      setLoginEmail('admin@venaro.com');
      setLoginPassword('VenaroAdmin2026!');
    } else {
      setLoginEmail('alexander.wright@venaro.com');
      setLoginPassword('LuxuryClient123#');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/10 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300 mb-1">
            ATELIER MEMBERSHIP
          </p>
          <h2 className="text-2xl font-brand tracking-[0.2em] font-bold text-white">
            VÉNARO
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {authMode === 'login'
              ? 'Access your bespoke wardrobe, saved sizes, and private orders.'
              : 'Join the circle of modern luxury tailoring.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 mb-6 text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => {
              setAuthMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-center border-b-2 transition-all ${
              authMode === 'login'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 pb-3 text-center border-b-2 transition-all ${
              authMode === 'signup'
                ? 'border-amber-400 text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-200 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
            <Check size={14} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {authMode === 'login' && !showForgotPassword && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 mb-1 font-medium tracking-wide">
                Email / Mobile Number
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@venaro.com or +91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-neutral-300 font-medium tracking-wide">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-[11px] text-amber-300/80 hover:text-amber-200"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-neutral-900 text-amber-400 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In to VÉNARO</span>
              )}
            </button>

            {/* Quick Demo Credentials for Reviewers */}
            <div className="p-3 bg-neutral-900/50 border border-white/5 rounded-lg">
              <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mb-1.5">
                Quick Test Credentials:
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('client')}
                  className="flex-1 py-1 bg-white/5 hover:bg-white/10 text-neutral-300 text-[11px] rounded transition-colors"
                >
                  Fill Client Demo
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('admin')}
                  className="flex-1 py-1 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-[11px] rounded border border-amber-400/20 transition-colors"
                >
                  Fill Admin Demo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODAL VIEW */}
        {showForgotPassword && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-white">Reset Password</h3>
            <p className="text-neutral-400 text-[11px]">
              Enter your registered email address and our atelier team will send secure reset instructions.
            </p>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="name@venaro.com"
              className="w-full px-3.5 py-2.5 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessMsg('Reset code sent to ' + (forgotEmail || 'your email'));
                  setShowForgotPassword(false);
                }}
                className="flex-1 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200"
              >
                Send Instructions
              </button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="px-4 py-2.5 border border-white/10 text-neutral-300 rounded-lg hover:bg-white/5"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* SIGNUP FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">First Name *</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alexander"
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Wright"
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Email *</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="alexander@venaro.com"
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Mobile Number</label>
                <input
                  type="tel"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Date of Birth (Optional)</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-neutral-300 focus:outline-none focus:border-amber-400/50"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-amber-400/50"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Password with Strength Meter */}
            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Create Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Min 8 characters with symbol & number"
                  className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {signupPassword && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${getStrengthLabel(passStrength).color}`}
                      style={{ width: `${passStrength}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[10px] text-neutral-400">
                    <span>Security: {getStrengthLabel(passStrength).label}</span>
                    <span>8+ chars, capital, number, symbol</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-medium">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full px-3 py-2 bg-neutral-900/80 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-neutral-400">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-neutral-900 text-amber-400 focus:ring-0"
                />
                <span>
                  I agree to VÉNARO's{' '}
                  <span className="text-neutral-200 underline">Terms of Service</span> and{' '}
                  <span className="text-neutral-200 underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Create VÉNARO Account</span>
              )}
            </button>
          </form>
        )}

        {/* Social Authentication Splitter */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#11131a] text-[10px] uppercase font-mono tracking-widest text-neutral-500">
            Or Continue With
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <button
            type="button"
            onClick={() => {
              login('google.client@venaro.com', 'demo');
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              login('apple.client@venaro.com', 'demo');
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.66-.82 1.11-1.95.98-3.08-1 .04-2.14.67-2.8 1.44-.58.67-1.1 1.76-.96 2.86 1.12.09 2.19-.57 2.78-1.22z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Bottom Switcher */}
        <div className="mt-5 text-center text-xs text-neutral-400">
          {authMode === 'login' ? (
            <p>
              New to VÉNARO?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-amber-300 hover:text-amber-200 font-medium underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already an Atelier Client?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-amber-300 hover:text-amber-200 font-medium underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
