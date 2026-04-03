import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Language } from '../types';

interface AuthProps {
  lang: Language;
  t: any;
  mode: 'signin' | 'signup';
  setView: (v: any) => void;
  onLogin: (user: any) => void;
}

export default function Auth({ lang, t, mode, setView, onLogin }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (mode === 'signin') {
          if (data.user.must_change_password) {
            setMustChangePassword(true);
          } else {
            onLogin(data.user);
          }
        } else {
          setView('signin');
          alert('Account created! Please sign in.');
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword })
      });
      if (res.ok) {
        alert('Password updated successfully! Please sign in again.');
        setMustChangePassword(false);
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
        setView('signin');
      }
    } catch (err) {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (mustChangePassword) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Update Password</h2>
            <p className="text-slate-500 font-medium">As a new administrator, you must update your temporary password.</p>
          </div>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  required 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-slate-200 outline-none pr-12"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold">Update & Continue</button>
          </form>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section 
      key={mode}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto px-4 py-24"
    >
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>
          <h2 className={`text-3xl font-bold text-slate-900 mb-2 ${lang === 'am' ? 'font-amharic' : ''}`}>
            {mode === 'signin' ? t.nav.signin : t.nav.signup}
          </h2>
          <p className="text-slate-500 font-medium">
            {mode === 'signin' ? 'Welcome back to CTN-ET' : 'Join the national research network'}
          </p>
        </div>

        {error && <p className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-bold mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.nav.email}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.nav.password}</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t.nav.confirm_password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-secondary hover:bg-accent text-white py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowRight size={20} />
                <span className={lang === 'am' ? 'font-amharic' : ''}>
                  {mode === 'signin' ? t.nav.signin : t.nav.signup}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 mb-2">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button 
            onClick={() => setView(mode === 'signin' ? 'signup' : 'signin')}
            className="text-primary font-bold hover:underline"
          >
            {mode === 'signin' ? t.nav.signup : t.nav.signin}
          </button>
        </div>
      </div>
    </motion.section>
  );
}
