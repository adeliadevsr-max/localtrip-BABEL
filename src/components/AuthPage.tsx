/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, AlertTriangle, ArrowLeft, ShieldCheck, Mail, Lock, User, Sparkles, Check } from 'lucide-react';

interface AuthPageProps {
  initialMode: 'login' | 'register';
  initialTier?: 'free' | 'premium';
  onAuthSuccess: (token: string, user: { id: string; username: string; email: string; tier: 'free' | 'premium' }) => void;
  onBackToLanding: () => void;
}

export default function AuthPage({ initialMode, initialTier = 'free', onAuthSuccess, onBackToLanding }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [tier, setTier] = useState<'free' | 'premium'>(initialTier);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Simulated premium payment screen if signing up for premium
  const [showPremiumMockPayment, setShowPremiumMockPayment] = useState(false);
  const [mockCardName, setMockCardName] = useState('');
  const [mockCardNo, setMockCardNo] = useState('4532 •••• •••• 8821');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'register' && tier === 'premium' && !showPremiumMockPayment) {
      // Show payment modal first!
      setShowPremiumMockPayment(true);
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login' 
        ? { email, password } 
        : { username, email, password, tier };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan sistem, silakan coba lagi.');
      }

      // Success
      onAuthSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
      setShowPremiumMockPayment(false); // Return to signup state
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 relative">
        
        {/* Header Back Link */}
        <button
          id="btn-auth-back"
          onClick={onBackToLanding}
          className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </button>

        <div className="text-center mt-6 mb-8">
          <div className="mx-auto h-12 w-12 bg-emerald-50 rounded-2xl text-emerald-700 flex items-center justify-center mb-3 border border-emerald-100">
            <Compass className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru Anda'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 font-sans">
            LocalTrip Babel — Rekomendasi Pintar Bangka Belitung
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-bounce">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Sign In / Register Forms */}
        {!showPremiumMockPayment ? (
          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            {mode === 'register' && (
              <>
                {/* Username */}
                <div>
                  <label htmlFor="reg-username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Username</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="reg-username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                      placeholder="Contoh: budi_traveler"
                    />
                  </div>
                </div>

                {/* Account Tier Selector */}
                <div className="mb-4">
                  <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pilih Keanggotaan</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="tile-tier-free"
                      type="button"
                      onClick={() => setTier('free')}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${tier === 'free' ? 'border-slate-800 bg-slate-50 text-slate-900 ring-2 ring-slate-800/15' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      <span className="font-bold text-xs block">FREE</span>
                      <span className="text-[10px] text-slate-500 mt-1 block leading-snug">Rekomendasi terbatas (maks 4 data)</span>
                    </button>
                    <button
                      id="tile-tier-premium"
                      type="button"
                      onClick={() => setTier('premium')}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative cursor-pointer ${tier === 'premium' ? 'border-emerald-600 bg-emerald-50/30 text-emerald-950 ring-2 ring-emerald-500/15' : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}
                    >
                      <span className="font-bold text-xs flex items-center gap-1">PREMIUM <Sparkles className="w-3 h-3 text-emerald-600 fill-emerald-500" /></span>
                      <span className="text-[10px] text-emerald-800 mt-1 block font-medium leading-snug">Rp29rb (Trip planner & AI Chat)</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label htmlFor="auth-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                  placeholder="traveler@contoh.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kata Sandi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
                  placeholder="Minimal 6 karakter"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 font-semibold text-sm bg-slate-900 border-none rounded-xl text-white transition-all shadow-md active:scale-98/100 disabled:opacity-55"
            >
              {loading ? 'Memproses Akun...' : mode === 'login' ? 'Masuk Sekarang' : tier === 'premium' ? 'Lanjut ke Pembayaran Rp29.000' : 'Daftar Akun Gratis'}
            </button>
          </form>
        ) : (
          /* Mock premium payment screen details */
          <div className="space-y-6" id="payment-modal-ui">
            <div className="text-center bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">PROSES PEMBAYARAN SAAS</span>
              <h4 className="font-serif font-bold text-slate-900 text-xl">Nominal: Rp29.000</h4>
              <p className="text-xs text-slate-500 mt-1 font-sans">Akses penuh 2 bulan (Itinerary PDF, AI Chat & Trip Planning)</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Pemilik Kartu (Lokal)</label>
                <input
                  type="text"
                  required
                  value={mockCardName}
                  onChange={(e) => setMockCardName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nomor Kartu Kredit / Debit (Simulasi)</label>
                <input
                  type="text"
                  required
                  value={mockCardNo}
                  onChange={(e) => setMockCardNo(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-850 focus:bg-white text-sm font-mono transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Valid Thru</label>
                  <input type="text" value="12/30" disabled className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">CVV</label>
                  <input type="text" value="***" disabled className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-mono" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="btn-confirm-payment"
                type="button"
                disabled={loading || !mockCardName}
                onClick={handleAuthSubmit}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {loading ? 'Menyelesaikan Transaksi...' : 'Konfirmasi & Bayar Rp29.000'}
              </button>
              
              <button
                id="btn-cancel-payment"
                type="button"
                onClick={() => setShowPremiumMockPayment(false)}
                className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-bold"
              >
                Batal Pembayaran (Kembali)
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              *Ini adalah simulasi berlayar aman transaksi SaaS LocalTrip Babel. Tidak ada dana nyata yang dipotong dari kartu Anda.
            </p>
          </div>
        )}

        {/* Toggle Mode footer */}
        {!showPremiumMockPayment && (
          <div className="mt-8 text-center border-t border-slate-100 pt-6">
            <button
              id="btn-auth-mode-toggle"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
            >
              {mode === 'login' ? 'Belum punya akun? Buat Baru' : 'Sudah punya akun? Silakan Masuk'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
