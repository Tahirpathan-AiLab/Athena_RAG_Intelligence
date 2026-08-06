import { useState } from 'react';
import { Brain, Mail, Lock, User as UserIcon, Eye, EyeOff, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useChat } from '../context/ChatContext';
import sevenSkysLogo from '../assets/Seven_Skys_Logo.png';

const HIGHLIGHTS = [
  { icon: Sparkles, text: 'Ask questions, get answers grounded in your own documents' },
  { icon: ShieldCheck, text: 'Source citations on every answer, no guesswork' },
  { icon: Zap, text: 'Fast retrieval with adjustable relevance threshold' },
];

export default function AuthPage() {
  const { login, signup } = useChat();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (isSignup && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) {
        signup({ name: name.trim(), email: email.trim(), password });
      } else {
        login({ email: email.trim(), password });
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-0 light:bg-gray-50">
      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-accent-700 via-accent-600 to-accent-900 p-10 text-white lg:flex">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <img src={sevenSkysLogo} alt="Seven Skys Logo" className="h-6 w-6 object-contain" />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-bold">Athena</p>
            <p className="text-[11px] text-white/70">AI Knowledge Assistant</p>
          </div>
        </div>

        <div>
          <h1 className="mb-4 max-w-md text-[32px] font-bold leading-tight">
            Chat with your documents, powered by AI
          </h1>
          <p className="mb-8 max-w-sm text-[14px] text-white/75">
            Upload your PDFs and ask anything. Athena answers strictly from your knowledge base,
            with citations you can trust.
          </p>
          <div className="flex flex-col gap-3.5">
            {HIGHLIGHTS.map((h) => (
              <div key={h.text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <h.icon size={14} />
                </div>
                <p className="text-[13px] text-white/85">{h.text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/50">&copy; {new Date().getFullYear()} Seven Skys. All rights reserved.</p>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-10 h-72 w-72 rounded-full bg-black/20 blur-3xl" />
      </div>

      {/* Right auth form */}
      <div className="flex w-full flex-1 items-center justify-center overflow-y-auto px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-accent-700">
              <Brain size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-[15px] font-bold text-white light:text-gray-900">Athena</p>
              <p className="text-[11px] text-gray-500">AI Knowledge Assistant</p>
            </div>
          </div>

          <h2 className="mb-1.5 text-[22px] font-bold text-white light:text-gray-900">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mb-6 text-[13px] text-gray-500">
            {isSignup ? 'Sign up to start chatting with your documents.' : 'Log in to continue to Athena.'}
          </p>

          {/* Mode toggle */}
          <div className="mb-6 flex rounded-xl border border-surface-border bg-surface-100 p-1 light:bg-gray-100">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                !isSignup ? 'bg-surface-0 text-white shadow light:bg-white light:text-gray-900' : 'text-gray-500'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 rounded-lg py-2 text-[13px] font-semibold transition-colors ${
                isSignup ? 'bg-surface-0 text-white shadow light:bg-white light:text-gray-900' : 'text-gray-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {isSignup && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-400">Full name</label>
                <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-0 px-3 py-2 focus-within:border-accent-500 light:bg-white">
                  <UserIcon size={15} className="shrink-0 text-gray-500" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-transparent text-[13.5px] text-white outline-none light:text-gray-900"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-400">Email</label>
              <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-0 px-3 py-2 focus-within:border-accent-500 light:bg-white">
                <Mail size={15} className="shrink-0 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-[13.5px] text-white outline-none light:text-gray-900"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-400">Password</label>
              <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-surface-0 px-3 py-2 focus-within:border-accent-500 light:bg-white">
                <Lock size={15} className="shrink-0 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-[13.5px] text-white outline-none light:text-gray-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-[12.5px] text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-1.5 rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 py-2.5 text-[13.5px] font-semibold text-white shadow-md shadow-accent-600/20 transition-opacity disabled:opacity-60"
            >
              {isSignup ? 'Create Account' : 'Log In'}
            </button>
          </form>

          <p className="mt-5 text-center text-[12.5px] text-gray-500">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => switchMode(isSignup ? 'login' : 'signup')}
              className="font-semibold text-accent-400 hover:underline"
            >
              {isSignup ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
