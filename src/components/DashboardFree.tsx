/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin, Clock, BadgeDollarSign, ChevronRight, LogOut, Loader, Heart, X } from 'lucide-react';
import { Wisata } from '../types';
import { getSpotImageUrl } from '../utils/images';

interface DashboardFreeProps {
  user: { username: string; email: string; tier: 'free' | 'premium' };
  token: string;
  onLogout: () => void;
  onUpgradeSuccess: (token: string, user: any) => void;
}

export default function DashboardFree({ user, token, onLogout, onUpgradeSuccess }: DashboardFreeProps) {
  const [selectedRegion, setSelectedRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [selectedSubRegion, setSelectedSubRegion] = useState<'semua' | 'pangkalpinang' | 'bangka_induk' | 'bangka_selatan'>('semua');
  const [selectedCategory, setSelectedCategory] = useState<'pantai' | 'restoran' | 'cafe' | 'spot_foto'>('pantai');
  const [rekomendasi, setRekomendasi] = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9F5] via-[#F4F7F6] to-[#E9EFF1] flex flex-col font-sans relative overflow-x-hidden" id="dashboard-free-root">
      
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
        {/* Header */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-600 rounded-xl text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">LocalTrip</span>
            <span className="text-[10px] font-bold text-emerald-600 tracking-wider">BABEL - FREE</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <span className="text-xs text-slate-400 block">Sesi Masuk</span>
            <span className="text-sm font-bold text-slate-800">{user.username} <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full ml-1">Gratis</span></span>
          </div>

          <button
            id="btn-upgrade-nav"
            onClick={() => setShowUpgradeModal(true)}
            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 fill-amber-950/20" /> Upgrade Premium
          </button>

          <button
            id="btn-logout"
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            title="Keluar Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Explore Panel */}
        <main className="lg:col-span-8 space-y-8">
          
          {/* Filters card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 tracking-tight mb-2">Jelajahi Babel Secara Gratis</h1>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">Pilih wilayah pulau dan jenis destinasi yang ingin Anda intip. Akun gratis dibatasi melihat total data rekomendasi dasar.</p>
            
            <div className="space-y-4">
              {/* Region Selector */}
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pulau Tujuan</span>
                <div className="flex bg-slate-100 p-1 rounded-xl max-w-xs">
                  <button
                    id="filter-region-belitung"
                    onClick={() => setSelectedRegion('Belitung')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedRegion === 'Belitung' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Belitung
                  </button>
                  <button
                    id="filter-region-bangka"
                    onClick={() => setSelectedRegion('Bangka')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedRegion === 'Bangka' ? 'bg-white text-slate-955 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Bangka
                  </button>
                </div>
              </div>

              {/* Bangka Sub-Region Selector */}
              {selectedRegion === 'Bangka' && (
                <div>
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 animate-fade-in">Filter Wilayah Bangka</span>
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    {[
                      { id: 'semua', label: 'Semua Bangka' },
                      { id: 'pangkalpinang', label: 'Pangkalpinang (Pusat)' },
                      { id: 'bangka_induk', label: 'Bangka / Sungailiat' },
                      { id: 'bangka_selatan', label: 'Bangka Selatan (Toboali)' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        id={`filter-sub-${sub.id}`}
                        onClick={() => setSelectedSubRegion(sub.id as any)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${selectedSubRegion === sub.id ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Selector */}
              <div>
                <span className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Kategori Destinasi</span>
                <div className="flex flex-wrap gap-2">
                  {(['pantai', 'restoran', 'cafe', 'spot_foto'] as const).map((cat) => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat}`}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all uppercase tracking-wide cursor-pointer ${selectedCategory === cat ? 'bg-slate-900 border-slate-950 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results list */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">
                Rekomendasi di {selectedRegion} {selectedRegion === 'Bangka' && selectedSubRegion !== 'semua' ? ' - ' + selectedSubRegion.replace('_', ' ').toUpperCase() : ''} <span className="text-xs text-slate-400">({filteredRekomendasi.length} ditemukan)</span>
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Batas Tier Free (Maks 8)</span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                <Loader className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                <span className="text-xs text-slate-500 font-semibold">Mengambil kurasi wisata...</span>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
                {error}
              </div>
            ) : filteredRekomendasi.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                Tidak ada data wisata yang sesuai dengan kategori ini di {selectedRegion} sub-wilayah saat ini.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRekomendasi.map((sport) => (
                  <div
                    key={sport.id}
                    id={`spot-card-${sport.id}`}
                    onClick={() => handleSpotClick(sport)}
                    className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-emerald-500/20 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 ease-out cursor-pointer overflow-hidden flex flex-col justify-between group h-full relative"
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
                        <div className="absolute top-2.5 left-2.5">
                          <span className="text-[9px] font-bold bg-white/95 backdrop-blur-xs text-slate-700 px-2 py-0.5 rounded shadow-2xs">
                            {selectedCategory.replace('_', ' ')}
                          </span>
                        </div>
                        {sport.tier === 'premium' && (
                          <div className="absolute top-2.5 right-2.5">
                            <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded shadow-sm flex items-center gap-0.5 animate-pulse">
                              💎 PREMIUM
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="block text-[8px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
                            {sport.tier === 'premium' ? '👑 Premium locked' : '🆓 Free access'}
                          </span>
                          <h3 className="font-serif font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-base mb-2 leading-snug">{sport.nama}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-sans">{sport.deskripsi}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 mt-auto">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{sport.lokasi}</span>
                      </div>
                      <span className="text-emerald-700 shrink-0">{sport.estimasi_biaya}</span>
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
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-slate-400 text-xs">
        <p>© 2026 LocalTrip Babel • Akun Premium Rp29.000 membuka rute, AI guide, & estimasi budget lengkap.</p>
      </footer>
      </div>
    </div>
  );
}
