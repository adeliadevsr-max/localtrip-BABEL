/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Clock, BadgeDollarSign, ChevronRight, LogOut, Loader, Heart, X, Menu, Palmtree, Waves, ShieldCheck, Sun, Moon, HelpCircle } from 'lucide-react';
import { Wisata } from '../types';
import { getSpotImageUrl } from '../utils/images';
import BrandLogo from './BrandLogo';
import TravelMap from './TravelMap';

interface DashboardFreeProps {
  user: { username: string; email: string; tier: 'free' | 'premium' };
  token: string;
  onLogout: () => void;
  onUpgradeSuccess: (token: string, user: any) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function DashboardFree({ user, token, onLogout, onUpgradeSuccess, darkMode, onToggleDarkMode }: DashboardFreeProps) {
  const [selectedRegion, setSelectedRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [selectedSubRegion, setSelectedSubRegion] = useState<'semua' | 'pangkalpinang' | 'bangka_induk' | 'bangka_selatan'>('semua');
  const [selectedCategory, setSelectedCategory] = useState<'pantai' | 'restoran' | 'cafe' | 'spot_foto'>('pantai');
  const [rekomendasi, setRekomendasi] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Live Map switcher toggle for Free users
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Collapsible Action Menu state
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  
  // Upgrade state
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [cardName, setCardName] = useState('');

  // Selected spot details popup
  const [selectedSpot, setSelectedSpot] = useState<Wisata | null>(null);
  const [isClosingSpot, setIsClosingSpot] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    setSelectedSubRegion('semua');
  }, [selectedRegion]);

  const handleSpotClick = (spot: Wisata) => {
    if (spot.tier === 'premium') {
      setShowUpgradeModal(true);
    } else {
      setSelectedSpot(spot);
    }
  };

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

  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/wisata/rekomendasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wilayah: selectedRegion,
          kategori: selectedCategory,
          tier: 'free'
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gagal mengambil data wisata');
      }
      setRekomendasi(data.rekomendasi || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedRegion, selectedCategory]);

  const handleUpgradeAction = async () => {
    setUpgrading(true);
    try {
      const response = await fetch('/api/auth/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server error upgrading account.');
      }
      
      // Upgrade verified
      onUpgradeSuccess(data.token, data.user);
      setShowUpgradeModal(false);
    } catch (err: any) {
      alert(err.message || "Gagal memproses upgrade");
    } finally {
      setUpgrading(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden" id="dashboard-free-root">
      
      {/* Modern Gen-Z Elegant Beach Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1920&q=80" 
          alt="Bangka Belitung Beach Background" 
          className="w-full h-full object-cover opacity-[0.05] filter saturate-150 brightness-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF9F5]/90 via-[#F4F7F6]/95 to-[#E9EFF1]/90 z-0"></div>

        {/* Ambient Blurry Beach Blobs */}
        <div className="absolute top-1/4 -left-24 w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-12 w-[450px] h-[450px] rounded-full bg-amber-400/5 blur-[120px]"></div>
        <div className="absolute top-10 right-1/4 w-80 h-80 rounded-full bg-blue-400/5 blur-[100px]"></div>

        {/* Soft, beautiful ocean wave SVG patterns */}
        <svg className="absolute top-0 left-0 right-0 w-full h-80 text-emerald-500/[0.012] fill-current" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path d="M0,160 L60,170.7 C120,181,240,203,360,181.3 C480,160,600,96,720,85.3 C840,75,960,117,1080,128 C1200,139,1320,117,1380,106.7 L1440,96 L1440,0 L1380,0 C1320,0,1200,0,1080,0 C960,0,840,0,720,0 C600,0,480,0,360,0 C240,0,120,0,60,0 L0,0 Z"></path>
        </svg>

        <svg className="absolute bottom-0 left-0 right-0 w-full h-40 text-emerald-600/[0.02] fill-current" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0,96 L48,112 C96,128,192,160,288,165.3 C384,171,480,149,576,122.7 C672,96,768,64,864,80 C960,96,1056,160,1152,176 C1248,192,1344,160,1392,144 L1440,128 L1440,200 L1392,200 C1344,200,1248,200,1152,200 C1056,200,960,200,864,200 C768,200,672,200,576,200 C480,200,384,200,288,200 C192,200,96,200,48,200 L0,200 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Upgraded Header with Collapsible Toggle */}
        <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 px-6 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BrandLogo scrolled={true} />
          </div>

          <div className="flex items-center gap-3">
            {/* Ambient Dark Mode Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-705 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-xs"
              title={darkMode ? "Aktifkan Mode Cahaya" : "Aktifkan Mode Gelap"}
              id="free-navbar-theme-toggle"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-500 hover:text-indigo-500" />
              )}
            </button>

            <div className="text-right hidden md:block mr-2">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">MASUK SEBAGAI</span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{user.username}</span>
            </div>

            <button
              id="btn-upgrade-nav"
              onClick={() => setShowUpgradeModal(true)}
              className="text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950/20" /> Premium (Rp29rb)
            </button>

            {/* Hamburger Button for Collapsible action items */}
            <button
              onClick={() => setIsSideMenuOpen(!isSideMenuOpen)}
              className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer border border-slate-100"
              title="Aktivasi Pilihan Menu"
            >
              {isSideMenuOpen ? <X className="w-5 h-5 text-rose-600" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Collapsible Action Drawer Menu */}
        {isSideMenuOpen && (
          <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-l border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-6 flex flex-col justify-between animate-fade-in relative z-50 text-slate-900 dark:text-slate-100">
            <div>
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-4 mb-6">
                <span className="text-xs font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Palmtree className="w-3.5 h-3.5 text-emerald-600 animate-pulse" /> PANEL NAVIGASI
                </span>
                <button 
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-slate-450 hover:text-rose-600 transition"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User profile */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-950 flex items-center justify-center font-bold text-white text-sm uppercase font-serif">
                    {user.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 leading-none">{user.username}</h4>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 block mt-1">{user.email}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center bg-white dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                  <span className="text-[10px] font-bold text-slate-450">Tipe Akun:</span>
                  <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-55 font-mono uppercase">Standard Free</span>
                </div>
              </div>

              {/* Beach Conditions & Tips */}
              <div className="space-y-4">
                <div className="bg-sky-50/50 border border-sky-100/50 p-4 rounded-xl">
                  <span className="font-bold text-sky-800 text-[9px] uppercase tracking-wider block mb-1">🌊 KONDISI PANTAI LASKAR PELANGI</span>
                  <p className="text-[11px] text-sky-950 leading-relaxed font-sans font-medium">
                    Sangat teduh! Pantai batu belimbing dan pesona pasir halus Laskar Pelangi sangat ideal dikunjungi sore ini.
                  </p>
                </div>

                <div className="bg-amber-50/50 border border-amber-100/50 p-4 rounded-xl">
                  <span className="font-bold text-amber-800 text-[9px] uppercase tracking-wider block mb-1">💡 TIPS HEMAT PENJELAJAH</span>
                  <p className="text-[11px] text-amber-950 leading-relaxed font-sans font-medium">
                    Selalu siapkan cash receh untuk parkir sekitar pantai & nikmati sruput kopi legendaris Kong Djie dengan segelas es jeruk kunci segar!
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-6 border-t border-slate-150">
              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  setShowUpgradeModal(true);
                }}
                className="w-full py-3 bg-gradient-to-tr from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white/10" /> UPGRADE PREMIUM (Rp29rb)
              </button>
              <button
                onClick={() => {
                  setIsSideMenuOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Keluar dari Sesi
              </button>
            </div>
          </div>
        )}

      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Explore Panel */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Filters card */}
          <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 shadow-sm relative overflow-hidden">
            {/* Soft decorative badge */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-60 pointer-events-none"></div>

            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight leading-tight mb-2">Panduan Wisata Nusantara</h1>
            <p className="text-xs text-slate-500 mb-8 leading-relaxed font-sans font-medium">Bebas pilih rute pantai pasir putih, bebatuan granit purba, serta kuliner terlezat Bangka maupun Belitung berbekal akun Penjelajah Gratis Anda.</p>
            
            <div className="space-y-6">
              {/* Region Selector */}
              <div>
                <span className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-2.5 font-display">TENTUKAN PULAU TUJUAN</span>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl max-w-xs border border-slate-200/50">
                  <button
                    id="filter-region-belitung"
                    onClick={() => setSelectedRegion('Belitung')}
                    className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                      selectedRegion === 'Belitung' 
                        ? 'bg-slate-950 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Belitung 🏝️
                  </button>
                  <button
                    id="filter-region-bangka"
                    onClick={() => setSelectedRegion('Bangka')}
                    className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-wider cursor-pointer ${
                      selectedRegion === 'Bangka' 
                        ? 'bg-slate-950 text-white shadow-md' 
                        : 'text-slate-555 hover:text-slate-805'
                    }`}
                  >
                    Bangka 🌊
                  </button>
                </div>
              </div>

              {/* Bangka Sub-Region Selector */}
              {selectedRegion === 'Bangka' && (
                <div>
                  <span className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-2 animate-fade-in font-display">FILTER WILAYAH BANGKA</span>
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    {[
                      { id: 'semua', label: 'Semua Bangka 🗺️' },
                      { id: 'pangkalpinang', label: 'Pangkalpinang (Pusat) ☕' },
                      { id: 'bangka_induk', label: 'Bangka / Sungailiat 🐚' },
                      { id: 'bangka_selatan', label: 'Bangka Selatan (Toboali) 🍇' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        id={`filter-sub-${sub.id}`}
                        onClick={() => setSelectedSubRegion(sub.id as any)}
                        className={`px-4 py-2 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                          selectedSubRegion === sub.id 
                            ? 'bg-emerald-600 border-emerald-550 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-205 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selector */}
              <div>
                <span className="block text-[10px] font-extrabold text-slate-450 uppercase tracking-widest mb-2.5 font-display">KATEGORI DESTINASI</span>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    { cat: 'pantai', label: 'Pantai Indah 🌴' },
                    { cat: 'restoran', label: 'Kuliner Lokal 🍲' },
                    { cat: 'cafe', label: 'Tempat Kopi ☕' },
                    { cat: 'spot_foto', label: 'Pesona Foto 📸' }
                  ].map(({ cat, label }) => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat}`}
                      onClick={() => setSelectedCategory(cat as any)}
                      className={`px-5 py-3 text-xs font-black rounded-2xl border transition-all uppercase tracking-wider cursor-pointer font-sans ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 border-slate-950 text-white shadow-md shadow-slate-900/10' 
                          : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-100/50 hover:border-slate-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results list */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 bg-slate-100/40 dark:bg-slate-900/30 p-4 rounded-2.5xl border border-slate-205/10">
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 font-serif leading-none">
                  Rekomendasi di {selectedRegion} {selectedRegion === 'Bangka' && selectedSubRegion !== 'semua' ? ' - ' + selectedSubRegion.replace('_', ' ').toUpperCase() : ''}
                </h2>
                <span className="text-xs text-slate-400">({filteredRekomendasi.length} ditemukan)</span>
              </div>
              
              <div className="flex items-center gap-3.5 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end">
                <div className="flex bg-slate-200/70 dark:bg-slate-950/80 p-1 rounded-xl border border-slate-250/15 shrink-0 select-none">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-850 text-[#0D9488] dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Katalog Grid
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-white dark:bg-slate-850 text-[#0D9488] dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    Satelit Map
                  </button>
                </div>
                <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1.5 rounded-md uppercase tracking-wide">Batas Tier Free (Maks 8)</span>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-slate-950/40 rounded-3xl border border-slate-200/40 dark:border-slate-850 shadow-sm">
                <Loader className="w-8 h-8 text-emerald-650 animate-spin mb-3" />
                <span className="text-xs text-slate-400 font-bold tracking-wider font-display uppercase">MENYIAPKAN PETUALANGAN...</span>
              </div>
            ) : filteredRekomendasi.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-950/40 rounded-3xl border border-slate-150 dark:border-slate-855 text-slate-400 text-xs font-sans font-semibold">
                Tidak ada data wisata yang sesuai dengan saringan sub-wilayah Anda saat ini.
              </div>
            ) : viewMode === 'map' ? (
              <div className="w-full">
                <TravelMap 
                  darkMode={darkMode}
                  spots={filteredRekomendasi.map(r => ({
                    id: r.id,
                    nama: r.nama,
                    lokasi: r.lokasi,
                    kategori: r.kategori,
                    desc: r.deskripsi || r.tips,
                    rating: r.rating,
                    wilayah: selectedRegion,
                    tipe: 'wisata' as const
                  }))}
                  premiumUser={false}
                  onSelectSpot={(spot) => {
                    const fullSpot = filteredRekomendasi.find(item => item.id === spot.id);
                    if (fullSpot) {
                      setSelectedSpot(fullSpot);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRekomendasi.map((sport) => (
                  <div
                    key={sport.id}
                    id={`spot-card-${sport.id}`}
                    onClick={() => handleSpotClick(sport)}
                    className="bg-white rounded-3xl border border-slate-150 shadow-sm hover:border-emerald-500/10 hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 ease-out cursor-pointer overflow-hidden flex flex-col justify-between group h-full relative"
                  >
                    <div>
                      {/* Beautiful card photo segment */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 shrink-0">
                        <img 
                          src={getSpotImageUrl(sport.id)} 
                          alt={sport.nama}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="text-[9px] font-extrabold bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1.5 rounded-xl uppercase tracking-wider shadow-xs font-display">
                            {selectedCategory}
                          </span>
                        </div>
                        {sport.tier === 'premium' && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[9px] font-black bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl shadow-sm flex items-center gap-1 animate-pulse tracking-wide font-display">
                              👑 PREMIUM
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1 tracking-widest font-display">
                            {sport.tier === 'premium' ? '👑 Premium locked' : '🆓 Pintu Terbuka'}
                          </span>
                          <h3 className="font-serif font-black text-slate-900 group-hover:text-emerald-700 transition-colors text-base mb-1.5 leading-snug">{sport.nama}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-sans font-medium">{sport.deskripsi}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3.5 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-450 mt-auto font-sans">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-650 shrink-0" />
                        <span className="line-clamp-1 font-medium">{sport.lokasi}</span>
                      </div>
                      <span className="text-emerald-800 font-extrabold shrink-0 bg-emerald-50 px-2.5 py-1 rounded-lg">{sport.estimasi_biaya}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Sidebar Upgrade Call To Action */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white border-2 border-amber-500 relative shadow-md overflow-hidden">
            <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold mb-4 uppercase">
              <Sparkles className="w-3 h-3 fill-amber-300" /> Upgrade Tersedia
            </span>
            
            <h3 className="text-xl font-bold mb-2">Liburan Impian Babel Menanti Anda!</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">Jangan biarkan batas 3 data menghambat eksplorasi Anda. Tingkatkan ke Premium untuk membuka semua fitur SaaS unggulan.</p>
            
            <div className="space-y-3.5 mb-6 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Akses 5-12 tempat per kategori</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>AI Trip Planner otomatis by Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>24/7 Personal AI Chat Tour Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Kalkulasi 3 Opsi Paket Budget</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span>Unduh file PDF Itinerary rapi</span>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700/60 mb-6 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">HARGA PROMO SAAS</span>
                <span className="font-extrabold text-amber-400 text-sm">Rp29.000 <span className="text-[9px] text-slate-300 font-normal">/ 2 Bulan</span></span>
              </div>
              <span className="text-[9px] font-bold bg-amber-500 text-slate-900 px-2.5 py-1 rounded-lg">Rp480 / hari</span>
            </div>

            <button
              id="btn-sidebar-upgrade"
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-md"
            >
              Tingkatkan Ke Premium
            </button>
          </div>
        </aside>
      </div>

      {/* Detail Pop-up Modal */}
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
                  <span className="font-bold text-emerald-800 text-[9.5px] uppercase tracking-wider block mb-1">💡 TIPS PEMANDU LOKAL</span>
                  <p className="text-xs text-emerald-950 leading-relaxed font-sans">{selectedSpot.tips}</p>
                </div>
              </div>

              <button
                id="btn-close-spot-down"
                onClick={handleCloseSpotModal}
                className="w-full mt-6 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer transition-all hover:scale-[1.01]"
              >
                Selesai Membaca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Payments Modal Simulation */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative" id="upgrade-modal-ui">
            
            <button
               onClick={() => setShowUpgradeModal(false)}
               className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold p-1 rounded-full cursor-pointer transition-colors"
               aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto h-12 w-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 fill-amber-200" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">Proses Integrasi Pembayaran</h3>
              <p className="text-xs text-slate-500 mt-1">Layanan SaaS Premium untuk Kak {user.username}</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 text-center mb-6">
              <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-widest block mb-1">TOTAL TAGIHAN</span>
              <span className="text-2xl font-black text-slate-900">Rp 29.000</span>
              <span className="text-slate-500 text-[10px] ml-1">/ 2 Bulan Mandiri</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nama Pemegang Kartu</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Contoh: Budi Gunawan"
                  className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Nomor Kartu Debit/Kredit (Simulasi)</label>
                <input
                  type="text"
                  disabled
                  value="4119 •••• •••• 9920"
                  className="block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 text-xs font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                id="btn-confirm-upgrade"
                disabled={upgrading || !cardName}
                onClick={handleUpgradeAction}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
              >
                {upgrading ? 'Menjalankan Upgrade...' : 'Gunakan Premium Sekarang'}
              </button>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-2.5 text-slate-400 hover:text-slate-800 text-[11px] font-bold"
              >
                Batal Transaksi
              </button>
            </div>
            
            <p className="text-[9px] text-slate-400 text-center leading-relaxed mt-4">
              *Tekan konfirmasi demi mensimulasikan upgrade instan JWT Token. Tidak ada tagihan nyata.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-12 border-t border-slate-800 text-center relative z-10 rounded-t-3xl">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans">
          <div className="text-left">
            <span className="font-extrabold text-white text-sm block font-serif tracking-wide mb-1">babel<span className="text-emerald-400">.trip</span> 🌊</span>
            <p className="text-slate-500 font-medium">Bangka Belitung travel system • Standard Free Access</p>
          </div>
          <div className="flex gap-4 text-slate-500 font-bold">
            <button onClick={() => setShowUpgradeModal(true)} className="hover:text-emerald-400 cursor-pointer">Upgrade Premium</button>
            <span>•</span>
            <span className="text-slate-600">2.6167° S, 107.9125° E</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 mt-6 leading-relaxed">
          © 2026 babel.trip. Dibuat dengan cinta untuk pariwisata Nusantara • Jaga kebersihan dan keasrian laut Bangka Belitung 💚
        </p>
      </footer>
      </div>
    </div>
  );
}
