/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Clock, BadgeDollarSign, Heart, Utensils, MessageSquare, Calculator, CalendarRange, HelpCircle, Shield, LogOut, Loader, Smile, X } from 'lucide-react';
import { Wisata, KulinerItem } from '../types';
import TripPlannerComponent from './TripPlannerComponent';
import AiChatComponent from './AiChatComponent';
import BudgetEstimator from './BudgetEstimator';
import AdminPanel from './AdminPanel';
import { getSpotImageUrl, getKulinerImageUrl } from '../utils/images';

interface DashboardPremiumProps {
  user: { username: string; email: string; tier: 'free' | 'premium' };
  token: string;
  onLogout: () => void;
}

type TabType = 'explore' | 'mood' | 'planner' | 'chat' | 'budget' | 'kuliner' | 'admin';

export default function DashboardPremium({ user, token, onLogout }: DashboardPremiumProps) {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  
  // Tab 1: Explore State
  const [selectedRegion, setSelectedRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [selectedSubRegion, setSelectedSubRegion] = useState<'semua' | 'pangkalpinang' | 'bangka_induk' | 'bangka_selatan'>('semua');
  const [selectedCategory, setSelectedCategory] = useState<'pantai' | 'restoran' | 'cafe' | 'spot_foto'>('pantai');
  const [rekomendasi, setRekomendasi] = useState<Wisata[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Wisata | null>(null);
  const [isClosingSpot, setIsClosingSpot] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    setSelectedSubRegion('semua');
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedSpot) {
      setIsDescExpanded(false);
    }
  }, [selectedSpot]);

  const handleCloseSpotModal = () => {
    setIsClosingSpot(true);
    setTimeout(() => {
      setSelectedSpot(null);
      setIsClosingSpot(false);
    }, 250);
  };

  // Tab 2: Mood State
  const [selectedMood, setSelectedMood] = useState<'romantic' | 'keluarga' | 'solo' | 'healing' | 'petualangan' | 'gathering' | 'honeymoon'>('healing');
  const [moodSpots, setMoodSpots] = useState<Wisata[]>([]);
  const [moodLoading, setMoodLoading] = useState(false);

  // Tab 6: Kuliner State
  const [selectedCulinerPref, setSelectedCulinerPref] = useState<'semua' | 'seafood' | 'halal' | 'sarapan' | 'murah meriah'>('semua');
  const [kulinerList, setKulinerList] = useState<KulinerItem[]>([]);
  const [kulinerLoading, setKulinerLoading] = useState(false);
  const [selectedKuliner, setSelectedKuliner] = useState<KulinerItem | null>(null);
  const [isClosingKuliner, setIsClosingKuliner] = useState(false);

  const handleCloseKulinerModal = () => {
    setIsClosingKuliner(true);
    setTimeout(() => {
      setSelectedKuliner(null);
      setIsClosingKuliner(false);
    }, 250);
  };

  // Fetch Tab 1: Explore Wisata
  const fetchExplore = async () => {
    setExploreLoading(true);
    try {
      const resp = await fetch('/api/wisata/rekomendasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wilayah: selectedRegion, kategori: selectedCategory, tier: 'premium' })
      });
      const data = await resp.json();
      setRekomendasi(data.rekomendasi || []);
    } catch (err) {
      console.error(err);
    } finally {
      setExploreLoading(false);
    }
  };

  // Fetch Tab 2: Mood Wisata
  const fetchMoodSpots = async () => {
    setMoodLoading(true);
    try {
      const resp = await fetch('/api/wisata/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, wilayah: selectedRegion, tier: 'premium' })
      });
      const data = await resp.json();
      setMoodSpots(data.rekomendasi || []);
    } catch (err) {
      console.error(err);
    } finally {
      setMoodLoading(false);
    }
  };

  // Fetch Tab 6: Kuliner Khas
  const fetchKuliner = async () => {
    setKulinerLoading(true);
    try {
      const resp = await fetch('/api/kuliner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wilayah: selectedRegion,
          preferensi: selectedCulinerPref === 'semua' ? undefined : selectedCulinerPref,
          tier: 'premium'
        })
      });
      const data = await resp.json();
      setKulinerList(data.kuliner || []);
    } catch (err) {
      console.error(err);
    } finally {
      setKulinerLoading(false);
    }
  };

   useEffect(() => {
    if (activeTab === 'explore') fetchExplore();
    if (activeTab === 'mood') fetchMoodSpots();
    if (activeTab === 'kuliner') fetchKuliner();
  }, [selectedRegion, selectedCategory, selectedMood, selectedCulinerPref, activeTab]);

  const filteredRekomendasi = rekomendasi.filter(spot => {
    if (selectedRegion === 'Belitung') return true;
    if (selectedSubRegion === 'semua') return true;
    
    const loc = spot.lokasi.toLowerCase();
    const name = spot.nama.toLowerCase();
    if (selectedSubRegion === 'pangkalpinang') {
      return loc.includes('pangkalpinang') || loc.includes('kota pangkalpinang') || name.includes('pangkalpinang');
    }
    if (selectedSubRegion === 'bangka_selatan') {
      return loc.includes('selatan') || loc.includes('toboali') || name.includes('toboali') || name.includes('belimbing');
    }
    if (selectedSubRegion === 'bangka_induk') {
      const isPangkalpinang = loc.includes('pangkalpinang') || loc.includes('kota pangkalpinang') || name.includes('pangkalpinang');
      const isBangkaSelatan = loc.includes('selatan') || loc.includes('toboali') || name.includes('toboali') || name.includes('belimbing');
      return !isPangkalpinang && !isBangkaSelatan;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F5] via-[#F4F7F6] to-[#E9EFF1] flex flex-col font-sans relative overflow-x-hidden" id="dashboard-premium-root">
      
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
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">LocalTrip</span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-wider flex items-center gap-0.5">
              BABEL - PREMIUM <Sparkles className="w-2.5 h-2.5 fill-emerald-500 text-emerald-650" />
            </span>
          </div>
        </div>

        {/* User control info */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-400 font-bold block">PRO MEMBRE</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
              {user.username} 
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                PRO ★
              </span>
            </span>
          </div>

          <button
            id="btn-logout"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar Drawer */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col gap-1.5 md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block mb-3 pl-2">Menu Utama</span>
          
          <button
            id="sidemenu-tab-explore"
            onClick={() => setActiveTab('explore')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'explore' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Compass className="w-4.5 h-4.5" /> Explore Wisata
          </button>

          <button
            id="sidemenu-tab-mood"
            onClick={() => setActiveTab('mood')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'mood' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Smile className="w-4.5 h-4.5" /> Rekomendasi Mood
          </button>

          <button
            id="sidemenu-tab-planner"
            onClick={() => setActiveTab('planner')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'planner' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <CalendarRange className="w-4.5 h-4.5" /> AI Trip Planner
          </button>

          <button
            id="sidemenu-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <MessageSquare className="w-4.5 h-4.5" /> Tanya AI Pemandu
          </button>

          <button
            id="sidemenu-tab-budget"
            onClick={() => setActiveTab('budget')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'budget' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Calculator className="w-4.5 h-4.5" /> Kalkulator Budget
          </button>

          <button
            id="sidemenu-tab-kuliner"
            onClick={() => setActiveTab('kuliner')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'kuliner' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Utensils className="w-4.5 h-4.5" /> Kuliner Tradisional
          </button>

          <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase block mt-6 mb-3 pl-2">Pengembangan</span>

          <button
            id="sidemenu-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'admin' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Shield className="w-4.5 h-4.5" /> Content Audit
          </button>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
          
          {/* TAB 1: EXPLORE WISATA */}
          {activeTab === 'explore' && (
            <div className="space-y-6" id="view-tab-explore">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-serif font-bold text-slate-900">Eksplorasi Kurasi Penuh Premium</h2>
                <p className="text-xs text-slate-500 mt-1">Gunakan saringan di bawah ini untuk melihat hingga maksimal 10 rekomendasi destinasi unggulan Bangka & Belitung terlengkap.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
                  {/* Region selector */}
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">WILAYAH PULAU</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs">
                      <button
                        onClick={() => setSelectedRegion('Belitung')}
                        className={`flex-1 py-1.5 font-bold rounded-md transition-all cursor-pointer ${selectedRegion === 'Belitung' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Belitung
                      </button>
                      <button
                        onClick={() => setSelectedRegion('Bangka')}
                        className={`flex-1 py-1.5 font-bold rounded-md transition-all cursor-pointer ${selectedRegion === 'Bangka' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Bangka
                      </button>
                    </div>
                  </div>

                  {/* Category select */}
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">JENIS KATEGORI</span>
                    <div className="flex flex-wrap gap-1">
                      {(['pantai', 'restoran', 'cafe', 'spot_foto'] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${selectedCategory === cat ? 'bg-slate-900 border-slate-950 text-white font-semibold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-350'}`}
                        >
                          {cat.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bangka Sub-Region Selector */}
                {selectedRegion === 'Bangka' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Filter Wilayah Bangka</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'semua', label: 'Semua Bangka' },
                        { id: 'pangkalpinang', label: 'Pangkalpinang (Pusat)' },
                        { id: 'bangka_induk', label: 'Bangka / Sungailiat' },
                        { id: 'bangka_selatan', label: 'Bangka Selatan (Toboali)' }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubRegion(sub.id as any)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${selectedSubRegion === sub.id ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {exploreLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <span className="text-xs text-slate-500 font-semibold text-center">Menyiapkan kurasi terfavorit...</span>
                </div>
              ) : filteredRekomendasi.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs text-mono">
                  Saringan data sub-wilayah menghasilkan 0 destinasi. Silakan ubah opsi wilayah Bangka.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRekomendasi.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot)}
                      className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-emerald-500/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between overflow-hidden group h-full relative"
                    >
                      <div>
                        {/* Elegant visual card header */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <img 
                            src={getSpotImageUrl(spot.id)} 
                            alt={spot.nama}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[9px] font-black tracking-wider text-emerald-800 bg-emerald-50/90 border border-emerald-100/50 px-2.5 py-0.5 rounded-md uppercase">
                              {spot.kategori.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="text-[9px] bg-white/95 backdrop-blur-xs text-slate-500 font-semibold px-2 py-0.5 rounded shadow-2xs">Verified ✅</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="font-serif font-bold text-slate-900 text-base mb-2 leading-snug group-hover:text-emerald-700 transition-colors">{spot.nama}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{spot.deskripsi}</p>
                        </div>
                      </div>

                      <div className="mx-5 mb-5 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-700 mt-auto">
                        <span className="text-[10px] text-slate-450 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {spot.lokasi}
                        </span>
                        <span className="text-[10px] font-bold text-amber-500">{spot.estimasi_biaya}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REGISTER BY MOOD */}
          {activeTab === 'mood' && (
            <div className="space-y-6" id="view-tab-mood">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-xl font-serif font-bold text-slate-900">Rekomendasi Berdasarkan Suasana Hati</h2>
                <p className="text-xs text-slate-500 mt-1">Kami mengerti motivasi bepergian setiap orang berbeda. Apakah Anda menginginkan kesunyian healing atau liburan romantis bulan madu?</p>
                
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {(['healing', 'romantic', 'keluarga', 'solo', 'petualangan', 'gathering', 'honeymoon'] as const).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${selectedMood === mood ? 'bg-amber-400 text-slate-950 border-amber-400' : 'bg-slate-100 border border-transparent text-slate-500 hover:bg-slate-200'}`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              {moodLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <span className="text-xs text-slate-500 font-semibold">Memilah tempat berdasarkan mood {selectedMood}...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {moodSpots.map((spot) => (
                    <div
                      key={spot.id}
                      onClick={() => setSelectedSpot(spot)}
                      className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-amber-400/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Beautiful landscape header */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <img 
                            src={getSpotImageUrl(spot.id)} 
                            alt={spot.nama}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[9px] font-black text-amber-900 bg-amber-100/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md uppercase font-sans">Mood: {selectedMood}</span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="text-[9px] font-bold bg-white/95 text-slate-400 uppercase px-2 py-0.5 rounded-md">{spot.kategori}</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="font-serif font-bold text-slate-900 text-base mb-2 leading-snug group-hover:text-emerald-700 transition-colors">{spot.nama}</h4>
                          <p className="text-xs text-slate-550 leading-relaxed line-clamp-2">{spot.deskripsi}</p>
                        </div>
                      </div>

                      <div className="mx-5 mb-5 pt-3 border-t border-slate-100 text-[10px] text-slate-500 font-bold flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" /> {spot.lokasi}
                        </span>
                        <span className="text-emerald-700">{spot.estimasi_biaya}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI TRIP PLANNER */}
          {activeTab === 'planner' && (
            <TripPlannerComponent token={token} username={user.username} />
          )}

          {/* TAB 4: AI CHAT ASSISTANT */}
          {activeTab === 'chat' && (
            <AiChatComponent token={token} username={user.username} />
          )}

          {/* TAB 5: KALKULATOR BUDGET */}
          {activeTab === 'budget' && (
            <BudgetEstimator token={token} />
          )}

          {/* TAB 6: KULINER TRADISIONAL */}
          {activeTab === 'kuliner' && (
            <div className="space-y-6" id="view-tab-kuliner">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase">Khas Daerah</span>
                <h2 className="text-xl font-serif font-bold text-slate-900 mt-1">Sajian Kuliner Orisinal Bangka Belitung</h2>
                <p className="text-xs text-slate-500 mt-1">Babel dianugerahi rupa makanan laut yang sangat segar dan ramuan kopi saring sejak zaman kolonial yang tiada duanya.</p>
                
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {(['semua', 'seafood', 'halal', 'sarapan', 'murah meriah'] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setSelectedCulinerPref(pref)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${selectedCulinerPref === pref ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {kulinerLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 animate-pulse">
                  <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <span className="text-xs text-slate-500 font-semibold font-mono">Meracik data makanan tradisional...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {kulinerList.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedKuliner(item)}
                      className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:border-emerald-500/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between overflow-hidden group"
                    >
                      <div>
                        {/* Food card illustration cover */}
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                          <img 
                            src={getKulinerImageUrl(item.id)} 
                            alt={item.nama}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="text-[9px] font-black text-emerald-900 bg-emerald-100/90 backdrop-blur-xs px-2.5 py-0.5 rounded-md uppercase">{item.tipe}</span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="text-[10px] font-bold bg-white/95 text-slate-800 px-2 py-0.5 rounded shadow-2xs">{item.estimasi_biaya}</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h4 className="font-serif font-bold text-slate-900 text-base mb-1.5 group-hover:text-emerald-700 transition-colors">{item.nama}</h4>
                          <p className="text-xs text-slate-550 leading-relaxed line-clamp-2">{item.deskripsi}</p>
                        </div>
                      </div>

                      <div className="mx-5 mb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                        <span>Rekomendasi: <strong className="text-slate-700">{item.rekomendasi_tempat}</strong></span>
                        <span className="text-emerald-600 hover:underline">Pelajari Resep/Tips</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADMIN COMPLIANCE PANEL */}
          {activeTab === 'admin' && (
            <AdminPanel />
          )}

        </main>
      </div>

      {/* Spot Detail dialog */}
      {selectedSpot && (
        <div className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-250 ease-in-out ${isClosingSpot ? 'opacity-0' : 'opacity-100'}`}>
          <div 
            className={`bg-white rounded-3xl max-w-lg md:max-w-3xl w-full overflow-hidden border border-slate-200 shadow-2xl relative transition-all duration-250 ease-in-out transform flex flex-col md:flex-row ${isClosingSpot ? 'animate-fade-out' : 'animate-fade-in'}`} 
            id="spot-detail-modal"
          >
            {/* Left Column: Beautiful visual hero banner */}
            <div className="relative w-full h-48 md:h-auto md:w-[42%] shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end">
              <img 
                src={getSpotImageUrl(selectedSpot.id)} 
                alt={selectedSpot.nama}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-black/90 via-black/40 to-transparent"></div>
              
              {/* Close (X) Button perfectly absolute over the image */}
              <button
                id="btn-close-spot-modal"
                onClick={handleCloseSpotModal}
                className="absolute top-4 right-4 z-30 text-white hover:text-white bg-slate-950/75 hover:bg-rose-600 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-lg border border-white/20 hover:scale-105 active:scale-95"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="relative p-6 z-10 text-left">
                <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-md uppercase tracking-wider mb-2.5 inline-block">
                  {selectedSpot.kategori.replace('_', ' ')} • {selectedSpot.wilayah}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight drop-shadow-md">{selectedSpot.nama}</h3>
              </div>
            </div>

            {/* Right Column: Information details in a scrollable frame if needed */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[580px]">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">DESKRIPSI DESTINASI</span>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 transition-all duration-300">
                  <p className="text-xs text-slate-600 leading-relaxed font-sans transition-all duration-300">
                    {selectedSpot.deskripsi.length > 151
                      ? isDescExpanded
                        ? selectedSpot.deskripsi
                        : `${selectedSpot.deskripsi.slice(0, 150)}...`
                      : selectedSpot.deskripsi}
                  </p>
                  {selectedSpot.deskripsi.length > 151 && (
                    <button
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                      className="mt-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-750 transition-colors flex items-center gap-1 cursor-pointer focus:outline-hidden"
                    >
                      {isDescExpanded ? 'Lihat Lebih Sedikit' : 'Selengkapnya'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-emerald-100 text-emerald-800 rounded-lg">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-400 text-[8.5px] uppercase tracking-wider">LOKASI FISIK</span>
                    </div>
                    <span className="font-semibold text-slate-800 line-clamp-2 leading-relaxed">{selectedSpot.lokasi}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-blue-105 text-blue-800 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-400 text-[8.5px] uppercase tracking-wider">OPERASIONAL</span>
                    </div>
                    <span className="font-semibold text-slate-800 leading-relaxed">{selectedSpot.jam_buka}</span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex flex-col justify-between hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 bg-amber-100 text-amber-800 rounded-lg">
                        <BadgeDollarSign className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-400 text-[8.5px] uppercase tracking-wider">ESTIMASI BIAYA</span>
                    </div>
                    <span className="font-bold text-slate-900 leading-relaxed text-xs">{selectedSpot.estimasi_biaya}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
                  <span className="font-bold text-emerald-800 text-[9.5px] uppercase tracking-wider block mb-1">💡 REVIU TIPS PEMANDU</span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-sans">{selectedSpot.tips}</p>
                </div>
              </div>

              <button
                onClick={handleCloseSpotModal}
                className="w-full mt-6 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-all hover:scale-[1.01]"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kuliner Detail dialog */}
      {selectedKuliner && (
        <div className={`fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-250 ease-in-out ${isClosingKuliner ? 'opacity-0' : 'opacity-100'}`}>
          <div 
            className={`bg-white rounded-3xl max-w-lg md:max-w-3xl w-full overflow-hidden border border-slate-200 shadow-2xl relative transition-all duration-250 ease-in-out transform flex flex-col md:flex-row ${isClosingKuliner ? 'animate-fade-out' : 'animate-fade-in'}`} 
            id="kuliner-detail-modal"
          >
            {/* Left Column: Food Visual Header */}
            <div className="relative w-full h-48 md:h-auto md:w-[42%] shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end">
              <img 
                src={getKulinerImageUrl(selectedKuliner.id)} 
                alt={selectedKuliner.nama}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 md:from-black/90 via-black/40 to-transparent"></div>
              
              {/* Close Button perfectly absolute over the culinary image */}
              <button
                onClick={handleCloseKulinerModal}
                className="absolute top-4 right-4 z-30 text-white hover:text-white bg-slate-950/75 hover:bg-rose-600 w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-lg border border-white/20 hover:scale-105 active:scale-95"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>

              <div className="relative p-6 z-10 text-left">
                <span className="text-[9px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-md uppercase tracking-wide mb-2.5 inline-block">
                  Kuliner Tradisional • {selectedKuliner.tipe}
                </span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight drop-shadow-md">{selectedKuliner.nama}</h3>
              </div>
            </div>

            {/* Right Column: Culinary Info content in a scrollable block */}
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[580px]">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-sans">DESKRIPSI KULINER</span>
                <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 font-medium font-sans">
                  {selectedKuliner.deskripsi}
                </p>

                <div className="space-y-4 mb-6 text-xs text-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-slate-400 text-[9px] uppercase tracking-wider">REKOMENDASI TEMPAT MAKAN</span>
                      <span className="font-bold text-slate-900">{selectedKuliner.rekomendasi_tempat}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                      <BadgeDollarSign className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-slate-400 text-[9px] uppercase tracking-wider">ESTIMASI BIAYA PER KALI MAKAN</span>
                      <span className="font-semibold text-slate-900">{selectedKuliner.estimasi_biaya}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
                  <span className="font-bold text-emerald-800 text-[9.5px] uppercase tracking-wider block mb-1">💡 TIPS MENIKMATI MAKANAN</span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-sans">{selectedKuliner.tips}</p>
                </div>
              </div>

              <button
                onClick={handleCloseKulinerModal}
                className="w-full mt-6 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-all hover:scale-[1.01]"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-450 text-xs">
        <p>© 2026 LocalTrip Babel Premium Portal • Beroperasi penuh dengan autostrap model gemini-3.5-flash</p>
      </footer>
      </div>
    </div>
  );
}
