/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ShieldCheck, Zap, Sparkles, MapPin, ArrowRight, Heart, ExternalLink } from 'lucide-react';
import { getImageUrlByNama } from '../utils/images';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', presetTier?: 'free' | 'premium') => void;
  onExploreAnonymously: () => void;
}

export default function LandingPage({ onNavigateToAuth, onExploreAnonymously }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<'bangka' | 'belitung'>('belitung');

  const highlightSpots = {
    bangka: [
      { nama: "Pantai Parai Tenggiri", kab: "Bangka", tag: "Granit Artistik", desc: "Pantai eksotis berselimut batu granit raksasa di Sungailiat." },
      { nama: "Danau Kaolin Air Bara", kab: "Bangka Tengah", tag: "Air Biru Toska", desc: "Danau fotogenik bekas galian tambang semenanjung timah." },
      { nama: "Mie Koba Iskandar", kab: "Pangkalpinang", tag: "Kaldu Ikan Klasik", desc: "Sajian kuliner mi dengan aroma cengkeh yang sangat legendaris." }
    ],
    belitung: [
      { nama: "Pantai Tanjung Tinggi", kab: "Belitung (Sijuk)", tag: "Laskar Pelangi", desc: "Pasir putih luas dibingkai hamparan batuan granit bersejarah." },
      { nama: "Pulau Lengkuas", kab: "Belitung", tag: "Mercusuar 1882", desc: "Snorkeling air jernih dengan mercusuar peninggalan Belanda." },
      { nama: "Kong Djie Kopi 1943", kab: "Tanjung Pandan", tag: "Arang Tradisional", desc: "Kandungan cita rasa kopi saring arang yang menghangatkan jiwa." }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F5] via-[#F4F7F6] to-[#E9EFF1] text-slate-800 flex flex-col font-sans relative overflow-x-hidden" id="landing-page-root">
      
      {/* Decorative Beach & Ocean Theme background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-12 w-[450px] h-[450px] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-blue-400/5 blur-[100px]"></div>
        
        {/* Soft, beautiful ocean wave SVG patterns at the top and bottom with very low opacity */}
        <svg className="absolute top-0 left-0 right-0 w-full h-80 text-emerald-500/[0.02] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0,160 L60,170.7 C120,181,240,203,360,181.3 C480,160,600,96,720,85.3 C840,75,960,117,1080,128 C1200,139,1320,117,1380,106.7 L1440,96 L1440,0 L1380,0 C1320,0,1200,0,1080,0 C960,0,840,0,720,0 C600,0,480,0,360,0 C240,0,120,0,60,0 L0,0 Z"></path>
        </svg>

        <svg className="absolute bottom-0 left-0 right-0 w-full h-40 text-emerald-600/[0.03] fill-current" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,96 L48,112 C96,128,192,160,288,165.3 C384,171,480,149,576,122.7 C672,96,768,64,864,80 C960,96,1056,160,1152,176 C1248,192,1344,160,1392,144 L1440,128 L1440,200 L1392,200 C1344,200,1248,200,1152,200 C1056,200,960,200,864,200 C768,200,672,200,576,200 C480,200,384,200,288,200 C192,200,96,200,48,200 L0,200 Z"></path>
        </svg>

        <svg className="absolute bottom-10 left-0 right-0 w-full h-32 text-amber-500/[0.015] fill-current" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,128 L80,122.7 C160,117,320,107,480,122.7 C640,139,800,181,960,186.7 C1120,192,1280,160,1360,144 L1440,128 L1440,200 L1360,200 C1280,200,1120,200,960,200 C800,200,640,200,480,200 C320,200,160,200,80,200 L0,200 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">LocalTrip</span>
            <span className="text-xs font-semibold text-emerald-600 tracking-wider">BABEL</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            id="btn-explore-anon"
            onClick={onExploreAnonymously}
            className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-lg"
          >
            Situs Demo
          </button>
          <button 
            id="btn-nav-login"
            onClick={() => onNavigateToAuth('login')}
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-all"
          >
            Masuk
          </button>
          <button 
            id="btn-nav-register"
            onClick={() => onNavigateToAuth('register', 'premium')}
            className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            Daftar Premium <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-55/70 border border-emerald-100 rounded-full text-emerald-800 text-xs font-semibold mb-6 animate-pulse mx-auto">
          <Sparkles className="w-3.5 h-3.5" /> #1 Travel Assistant Bangka Belitung
        </div>
        
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
          Eksplorasi Keaslian <span className="text-emerald-700 italic">Bangka Belitung</span> Tanpa Batas
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-sans font-normal">
          Temukan pantai tersembunyi, cita rasa kuliner legendaris Lempah Kuning, rute perjalanan optimal hemat BBM, dan panduan asisten AI cerdas berbasis budget perjalanan nyata Anda.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            id="btn-hero-premium"
            onClick={() => onNavigateToAuth('register', 'premium')}
            className="w-full sm:w-auto text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl shadow-md cursor-pointer tracking-wide transition-all flex items-center justify-center gap-2 group"
          >
            Gabung Premium (Rp29.000)
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            id="btn-hero-free"
            onClick={onExploreAnonymously}
            className="w-full sm:w-auto text-sm font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            Eksplor Mode Gratis
          </button>
        </div>

        {/* Feature Visual Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-200/80 pt-12">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 bg-amber-50 text-amber-700 border border-amber-100/55 rounded-xl flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Kurasi Destinasi Autentik</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Informasi lengkap & jam buka akurat untuk 20+ pantai granit serta kuliner orisinal Bangka & Belitung.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-700 border border-indigo-100/55 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Pintar Trip Planner (Budget-Fit)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Susun rute otomatis anti rute memutar, hitung total pengeluaran 3 tipe paket (Hemat, Standar, Nyaman).</p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-100/55 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-2">Pemandu Chat Cerdas AI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Bebas konsultasi kuliner halal, rute sunset, tips sewa kendaraan kapan saja bersama asisten lokal ramah.</p>
          </div>
        </div>
      </section>

      {/* Tier Pricing / SaaS info */}
      <section className="bg-[#F3F4F6]/50 border-y border-slate-200/80 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Pilih Tingkat Keanggotaan Anda</h2>
            <p className="text-slate-500 text-sm mt-2">Dapatkan layanan yang disesuaikan dengan kebutuhan eksplorasi Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier Card */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col shadow-sm">
              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Akses Standar</span>
                <h3 className="text-xl font-bold text-slate-800 mt-1">Free User</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-serif font-bold text-slate-900">Rp0</span>
                  <span className="text-slate-400 text-xs ml-2 font-medium">/ selamanya</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Cocok untuk penjelajah pemula yang butuh info kilat di satu wilayah.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1 border-t border-slate-100 pt-6">
                <li className="flex items-start gap-3 text-slate-600 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Akses terbatas: <strong>2-4 rekomendasi</strong> per kategori</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kategori reguler (Pantai, Restoran, Cafe, Spot Foto)</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mencakup kawasan Bangka & Belitung</span>
                </li>
                <li className="text-slate-400 text-xs line-through flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center font-bold text-rose-500">×</span>
                  <span>Fitur Trip Planning lengkap</span>
                </li>
                <li className="text-slate-400 text-xs line-through flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center font-bold text-rose-500">×</span>
                  <span>Konsultasi AI Chat Assistant khusus</span>
                </li>
                <li className="text-slate-400 text-xs line-through flex items-start gap-3">
                  <span className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center font-bold text-rose-500">×</span>
                  <span>Estimasi kalkulator Budget otomatis & PDF Itinerary</span>
                </li>
              </ul>

              <button
                id="btn-signup-free"
                onClick={() => onNavigateToAuth('register', 'free')}
                className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
              >
                Mulai Gratis
              </button>
            </div>

            {/* Premium Tier Card */}
            <div className="bg-slate-950 rounded-3xl p-8 border-2 border-emerald-500 relative flex flex-col text-white shadow-lg overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-bold text-[10px] px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                SANGAT POPULER
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-emerald-400" /> FITUR SAAS MAKSIMAL
                </span>
                <h3 className="text-xl font-bold mt-1 text-slate-150">Premium User</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-serif font-bold text-emerald-400">Rp29.000</span>
                  <span className="text-slate-400 text-xs ml-2 font-medium">/ 2 bulan aktif</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Didesain khusus untuk solo traveler, rombongan keluarga, & perencana trip profesional.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1 border-t border-slate-800 pt-6">
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Akses kurasi penuh: <strong>5-12 rekomendasi</strong> lengkap</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Kategori tambahan eksklusif: <strong>Kuliner Khas & Tradisional</strong></span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>AI Trip Planner Cerdas:</strong> Itinerary instan relevan budget</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>24/7 AI Chat Assistant:</strong> Rekomendasi ramah bersuara lokal</span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Rekomendasi instan via filter <strong>Mood & Situasi Perjalanan</strong></span>
                </li>
                <li className="flex items-start gap-3 text-slate-300 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Estimasi otomatis 3 paket (Hemat, Standar, Nyaman) + <strong>Unduh PDF</strong></span>
                </li>
              </ul>

              <button
                id="btn-signup-premium"
                onClick={() => onNavigateToAuth('register', 'premium')}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-950/20 text-center cursor-pointer"
              >
                Dapatkan Akses Premium Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Real places preview */}
      <section className="py-20 px-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest block">GALERI LOKAL</span>
            <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mt-1">Intip Kekayaan Wisata Babel</h2>
          </div>
          <div className="flex bg-slate-200/60 p-1 rounded-xl">
            <button
              id="tab-belitung"
              onClick={() => setActiveTab('belitung')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'belitung' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
            >
              Pulau Belitung
            </button>
            <button
              id="tab-bangka"
              onClick={() => setActiveTab('bangka')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'bangka' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
            >
              Pulau Bangka
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {highlightSpots[activeTab].map((spot, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-emerald-500/20 hover:-translate-y-1.5 transition-all duration-500 ease-out flex flex-col overflow-hidden group"
            >
              {/* Beautiful visual card header */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img 
                  src={getImageUrlByNama(spot.nama)} 
                  alt={spot.nama}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 px-2 py-1 rounded-md flex items-center gap-1 uppercase shadow-2xs">
                    <MapPin className="w-2.5 h-2.5 text-emerald-600" /> {spot.kab}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold text-emerald-900 bg-emerald-100/90 backdrop-blur-xs border border-emerald-200/50 px-2.5 py-1 rounded-full shadow-2xs">{spot.tag}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 font-serif text-lg leading-snug group-hover:text-emerald-700 transition-colors duration-300">{spot.nama}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">{spot.desc}</p>
                </div>
              </div>
              <div className="bg-slate-50/50 border-t border-slate-100 px-5 py-3.5 flex justify-between items-center transition-colors duration-300 group-hover:bg-emerald-50/10">
                <span className="text-[10px] font-semibold text-slate-400">LocalTrip Babel verified ✅</span>
                <button
                  id={`btn-explore-spot-${i}`}
                  onClick={() => onNavigateToAuth('login')}
                  className="text-[11px] font-bold text-emerald-750 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-all duration-300"
                >
                  Detail Info <ArrowRight className="w-3 h-3 text-emerald-755 transform group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-tight block">LocalTrip Babel</span>
              <span className="text-[10px] text-emerald-400">Pemandu Wisata Kepercayaan Anda</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 text-center md:text-right">
            <p className="mb-1">© 2026 LocalTrip Babel. Dibuat dengan cinta untuk mempromosikan pariwisata Bangka Belitung, Indonesia.</p>
            <p>SaaS platform untuk Free & Premium Travelers • Harga tetap Rp29.000 / 2 bulan aktif.</p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
