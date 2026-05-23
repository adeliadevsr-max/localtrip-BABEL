/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  Clock, 
  BadgeDollarSign, 
  Heart, 
  Utensils, 
  MessageSquare, 
  Calculator, 
  CalendarRange, 
  Shield, 
  LogOut, 
  Loader, 
  Smile, 
  X, 
  Menu, 
  Palmtree, 
  ChevronRight, 
  Star,
  Sliders,
  Award,
  TrendingUp,
  Zap,
  Coffee,
  Eye,
  Bookmark,
  Activity,
  User,
  Map,
  ShieldAlert,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';
import { Wisata, KulinerItem } from '../types';
import TripPlannerComponent from './TripPlannerComponent';
import AiChatComponent from './AiChatComponent';
import BudgetEstimator from './BudgetEstimator';
import AdminPanel from './AdminPanel';
import { getSpotImageUrl, getKulinerImageUrl } from '../utils/images';
import BrandLogo from './BrandLogo';
import TravelMap from './TravelMap';

interface DashboardPremiumProps {
  user: { username: string; email: string; tier: 'free' | 'premium' };
  token: string;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

type TabType = 'explore' | 'mood' | 'planner' | 'chat' | 'budget' | 'kuliner' | 'admin' | 'map';
type TravelPersona = 'Elite Jetsetter' | 'Cultural Explorer' | 'Healing Wanderer' | 'Adventure Trailblazer';
type TravelInterest = 'Beaches & Granite' | 'Culinary Journeys' | 'Cultural Heritage' | 'Hidden Wilderness';
type BudgetTone = 'Luxury Splurge' | 'Authentic Native' | 'Sleek Economical';

export default function DashboardPremium({ user, token, onLogout, darkMode, onToggleDarkMode }: DashboardPremiumProps) {
  const [activeTab, setActiveTab] = useState<TabType>('explore');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Custom Premium Settings (Personalized Dashboard States)
  const [persona, setPersona] = useState<TravelPersona>('Healing Wanderer');
  const [interest, setInterest] = useState<TravelInterest>('Beaches & Granite');
  const [budgetTone, setBudgetTone] = useState<BudgetTone>('Luxury Splurge');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Tab 1: Explore State & Multi-Filter States
  const [selectedRegion, setSelectedRegion] = useState<'Bangka' | 'Belitung'>('Belitung');
  const [selectedSubRegion, setSelectedSubRegion] = useState<'semua' | 'pangkalpinang' | 'bangka_induk' | 'bangka_selatan'>('semua');
  const [selectedCategory, setSelectedCategory] = useState<'pantai' | 'restoran' | 'cafe' | 'spot_foto'>('pantai');
  const [rekomendasi, setRekomendasi] = useState<Wisata[]>([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Wisata | null>(null);
  const [isClosingSpot, setIsClosingSpot] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Hidden/Exclusive Gems list simulation for premium users
  const [showOnlyHiddenGems, setShowOnlyHiddenGems] = useState(false);

  // Saved bookmark list simulation
  const [savedSpots, setSavedSpots] = useState<string[]>([]);

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

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedSpots.includes(id)) {
      setSavedSpots(savedSpots.filter(item => item !== id));
    } else {
      setSavedSpots([...savedSpots, id]);
    }
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

  // Enhanced search and filter logic
  const filteredRekomendasi = rekomendasi.filter(spot => {
    // 1. Text Search query filter
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      const matchName = spot.nama.toLowerCase().includes(term);
      const matchDesc = spot.deskripsi.toLowerCase().includes(term);
      const matchLokasi = spot.lokasi.toLowerCase().includes(term);
      if (!matchName && !matchDesc && !matchLokasi) return false;
    }

    // 2. Hidden Gems simulated exclusivity toggle
    if (showOnlyHiddenGems) {
      // simulate hidden gem by ID match or text traits
      const hash = spot.id.charCodeAt(0) % 2 === 0;
      if (!hash) return false;
    }

    // 3. Bangka Region specific filters
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

  // Simulated metrics and VIP insider content providers
  const getMatchPercentage = (spotName: string) => {
    let score = 88;
    if (persona === 'Elite Jetsetter' && (spotName.toLowerCase().includes('resort') || spotName.toLowerCase().includes('hotel') || spotName.toLowerCase().includes('parai'))) {
      score = 98;
    } else if (persona === 'Healing Wanderer' && (spotName.toLowerCase().includes('pantai') || spotName.toLowerCase().includes('lengkuas') || spotName.toLowerCase().includes('bara'))) {
      score = 99;
    } else if (persona === 'Cultural Explorer' && (spotName.toLowerCase().includes('muzium') || spotName.toLowerCase().includes('pecinan') || spotName.toLowerCase().includes('kopi') || spotName.toLowerCase().includes('asimilasi'))) {
      score = 97;
    } else if (interest === 'Beaches & Granite' && spotName.toLowerCase().includes('batu')) {
      score = 96;
    }
    // ensure unique pseudo score
    const charSum = spotName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.min(85 + (charSum % 15), score);
  };

  const getSimulatedGps = (spotId: string) => {
    const coords: Record<string, string> = {
      'tanjung_tinggi': '2.5694° S, 107.6975° E',
      'lengkuas': '2.5312° S, 107.6250° E',
      'parai_tenggiri': '1.8021° S, 106.1852° E',
      'kaolin_bara': '2.3315° S, 106.2844° E',
      'batu_mentas': '2.7214° S, 107.8211° E',
      'tanjung_pendam': '2.7389° S, 107.6289° E',
      'pesona_seafood': '2.5714° S, 107.7011° E',
      'kopi_kong_djie': '2.7411° S, 107.6322° E',
    };
    return coords[spotId] || '2.6167° S, 107.9125° E';
  };

  const getExclusiveInsiderTip = (spotName: string) => {
    if (spotName.toLowerCase().includes('tinggi')) {
      return 'Disarankan menyewa perahu nelayan VIP di sisi barat pantai tepat jam 05:30 pagi untuk menyaksikan siluet sun-rise di sela tumpukan granit purba raksasa.';
    }
    if (spotName.toLowerCase().includes('lengkuas')) {
      return 'Akses mercusuar dibatasi demi keselamatan, namun staf lokal dapat memberikan akses teropong luar jika Anda menunjukkan paspor digital babel.trip Premium Anda.';
    }
    if (spotName.toLowerCase().includes('kaolin')) {
      return 'Spot potret terbaik berada di sisi tebing utara kawah, mintalah pemandu lokal mengarahkan ke lekukan pasir putih kontras yang sepi turis.';
    }
    return 'Gunakan koneksi jalur darat kelas eksekutif yang disediakan mitra premium kami untuk mempersingkat perjalanan hingga 45 menit melewati rute hutan asri Belitung.';
  };

  // Personalized dynamic recommendations banner title
  const getPersonaGreeting = () => {
    switch (persona) {
      case 'Elite Jetsetter':
        return {
          title: `Salam Hangat, Yang Terhormat VIP ${user.username}`,
          desc: `Menampilkan kurasi eksklusif berbudget ${budgetTone} & rute penerbangan paling nyaman menuju resor pantai tersembunyi yang tenang.`
        };
      case 'Cultural Explorer':
        return {
          title: `Semangat Menjelajah, Budayawan Agung ${user.username}`,
          desc: `Jalur khusus sejarah asimilasi etnis Hakka-Melayu, kedai kopi legendaris arang saring, dan museum heritabilitas siap menanti Anda.`
        };
      case 'Adventure Trailblazer':
        return {
          title: `Siapkan Kendali, Petualang Tangguh ${user.username}`,
          desc: `Menyajikan jajaran pantai ombak liar, snorkeling gua batu pasir, trekking bebatuan purba, serta kemah eksklusif tepi laut.`
        };
      case 'Healing Wanderer':
      default:
        return {
          title: `Selamat Istirahat & Menikmati Ketenangan, ${user.username}`,
          desc: `Fokus pada detoksifikasi pikiran. Suara desir angin parai, jernihnya Pulau Lengkuas, dan kelezatan hidangan lempah ikan segar siap memulihkan sukma.`
        };
    }
  };

  const currentGreeting = getPersonaGreeting();

  return (
    <div className="min-h-screen bg-[#F0F4F6] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900" id="dashboard-premium-root">
      
      {/* BACKGROUND DECORATIONS (Luxury Soft Glow & Waves) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 right-[15%] w-[450px] h-[450px] rounded-full bg-teal-500/10 blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full bg-amber-400/5 blur-[150px]"></div>
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] rounded-full bg-indigo-500/5 blur-[100px]"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        
        {/* UPPER GLOBAL PORTAL HEADER */}
        <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 py-3 sm:px-8 flex justify-between items-center gap-4 text-white shadow-2xl">
          
          <div className="flex items-center gap-4">
            {/* Collapse triggering Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition cursor-pointer border border-slate-800 hidden md:block"
              title={isSidebarCollapsed ? "Luaskan Sidebar" : "Kempiskan Sidebar"}
            >
              <Menu className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('explore')}>
              <BrandLogo premiumTheme={true} />
            </div>
          </div>

          {/* User controls & VIP Active Badges */}
          <div className="flex items-center gap-3.5">
            
            <div className="text-right hidden sm:block">
              <span className="text-[8px] text-teal-400 font-extrabold block uppercase tracking-widest">LOYALTY MEMBER PASS</span>
              <span className="text-xs font-black text-slate-100 flex items-center gap-1.5 justify-end">
                {user.username}
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                  ★ LUXURY ELITE
                </span>
              </span>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

            {/* Mobile collapsible sidebar toggle if viewpoint is small */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition cursor-pointer block md:hidden"
              title="Navigasi Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* VIP Theme Switcher Toggle */}
            <button
              id="vip-theme-toggle"
              onClick={onToggleDarkMode}
              className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-xl transition-all border border-slate-900 hover:border-slate-800 flex items-center justify-center cursor-pointer"
              title={darkMode ? "Aktifkan Mode Terang (Light Mode)" : "Aktifkan Mode Gelap (Dark Mode)"}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400 fill-amber-300" /> : <Moon className="w-4.5 h-4.5 text-[#38BDF8]" />}
            </button>

            <button
              id="btn-logout"
              onClick={onLogout}
              className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-950/40 rounded-xl transition-all border border-slate-900 hover:border-rose-950/80"
              title="Logout Sesi"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* MAIN STRUCTURAL LAYOUT WORKSPACE */}
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* NAVIGATION SIDEBAR (Collapsible, Stylish, Translucent/Glassmorphic) */}
          <aside className={`bg-slate-950 border-r border-slate-900 p-4.5 flex flex-col gap-2 md:sticky md:top-16 md:h-[calc(100vh-4rem)] transition-all duration-300 text-white shadow-2xl ${
            isSidebarCollapsed 
              ? 'w-full md:w-20 items-center overflow-y-visible' 
              : 'w-full md:w-72 items-stretch'
          }`}>
            
            {!isSidebarCollapsed ? (
              <div className="mb-4 px-2">
                <span className="text-[9px] font-black tracking-widest text-[#94A3B8]/60 uppercase block">CORE WORKSPACE</span>
                <span className="text-[10px] text-amber-500 font-bold block mt-1">★ ALL INTEGRATIONS ENGAGED</span>
              </div>
            ) : (
              <hr className="border-slate-900 my-2 w-full hidden md:block" />
            )}

            {/* Tab navigation buttons */}
            {[
              { id: 'explore', label: 'Explore Wisata', desc: 'Hidden Gems & Spot Indah', icon: Compass },
              { id: 'map', label: 'Peta Satelit (GIS)', desc: 'Interaktif Navigasi Kepulauan', icon: Map },
              { id: 'mood', label: 'Suasana Hati (Mood)', desc: 'Pilihan Khusus Hati Anda', icon: Smile },
              { id: 'planner', label: 'AI Trip Planner', desc: 'Rencana Perjalanan Cerdas', icon: CalendarRange },
              { id: 'chat', label: 'Tanya AI Pemandu', desc: 'Gemini Agent Siaga 24 Jam', icon: MessageSquare },
              { id: 'budget', label: 'Kalkulator Budget', desc: 'Estimasi Realistis Akurat', icon: Calculator },
              { id: 'kuliner', label: 'Kuliner Tradisional', desc: 'Warisan Resep Orisinal', icon: Utensils }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`sidemenu-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer text-left ${
                    isSidebarCollapsed ? 'justify-center' : 'justify-start'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-400 to-amber-550 text-slate-950 shadow-lg shadow-amber-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/55'
                  }`}
                  title={tab.label}
                >
                  <IconComp className="w-5 h-5 shrink-0" />
                  {!isSidebarCollapsed && (
                    <div className="flex flex-col">
                      <span className="font-extrabold leading-none">{tab.label}</span>
                      <span className={`text-[8px] font-medium leading-none mt-1 ${isActive ? 'text-slate-900/80 font-bold' : 'text-slate-500'}`}>
                        {tab.desc}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}

            {!isSidebarCollapsed ? (
              <div className="mt-8 px-2 space-y-4">
                <span className="text-[9px] font-black tracking-widest text-[#94A3B8]/60 uppercase block">SYSTEM OPERATIONS</span>
                
                <button
                  id="sidemenu-tab-admin"
                  onClick={() => setActiveTab('admin')}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-left font-black transition ${
                    activeTab === 'admin' ? 'bg-amber-400 text-slate-950' : 'text-slate-500 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-[11px] uppercase tracking-wider block">Content Audit Panel</span>
                </button>

                <div className="p-3 bg-[#1E293B]/50 border border-slate-800 rounded-2xl">
                  <span className="text-[8.5px] font-extrabold text-[#D97706] uppercase block">PREMIUM STATS</span>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>Bookmarks:</span>
                    <span className="font-black text-amber-400">{savedSpots.length} saved</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>SaaS Engine:</span>
                    <span className="text-emerald-400 font-black">Active (V3.5)</span>
                  </div>
                </div>
              </div>
            ) : (
              <hr className="border-slate-900 my-4 w-full hidden md:block" />
            )}
          </aside>

          {/* WORKSPACE MIDDLE CONTENT PANEL */}
          <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full space-y-8">
            
            {/* CINEMATIC HERO GREETING PANEL (With Interactive Travel Preferences Dashboard) */}
            <section className="bg-slate-950 rounded-[36px] overflow-hidden text-white border border-slate-800 relative z-10 shadow-xl">
              
              {/* Dynamic Ocean Layer illustration cover */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1500&q=80"
                  alt="Scenic Premium Banner Backdrop"
                  className="w-full h-full object-cover opacity-20 filter brightness-90 saturate-125"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
              </div>

              <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between gap-8 h-full">
                
                {/* Header Welcome Title */}
                <div className="max-w-xl space-y-2.5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-400/10 border border-amber-400/30 rounded-full text-amber-300 text-[9.5px] font-black uppercase tracking-widest leading-none">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>PREMIUM PASSENGER PORTAL VIP STATUS</span>
                  </div>

                  <h1 className="text-2xl sm:text-4.5xl font-serif font-black tracking-tight leading-tight text-white">
                    {currentGreeting.title}
                  </h1>

                  <p className="text-[11.5px] sm:text-xs text-slate-300 font-medium font-sans leading-relaxed">
                    {currentGreeting.desc}
                  </p>
                </div>

                {/* INTERACTIVE PREFERENCE CONTROL PANEL: Personalized Dashboard triggers */}
                <div className="border-t border-slate-800 pt-6 mt-2">
                  <span className="text-[9px] text-amber-400 font-black tracking-wider block uppercase mb-4 text-left">
                    ⚙️ PERSONALISASI ALGORITMA TRAVEL ENGINE (REAL-TIME ADAPTATION)
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Persona selector */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-left">Travel Persona</label>
                      <select
                        value={persona}
                        onChange={(e) => setPersona(e.target.value as TravelPersona)}
                        className="w-full bg-[#111827] border border-slate-800 text-xs font-black uppercase p-2.5 rounded-xl text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                        id="select-travel-persona"
                      >
                        <option value="Healing Wanderer">🧘 Healing Wanderer (Detoks Pikiran)</option>
                        <option value="Elite Jetsetter">💎 Elite Jetsetter (Kemewahan Pantai)</option>
                        <option value="Cultural Explorer">🏮 Cultural Explorer (Tradisi & Budaya)</option>
                        <option value="Adventure Trailblazer">⛰️ Adventure Trailblazer (Eksplorasi Ekstrem)</option>
                      </select>
                    </div>

                    {/* Interest Alignment */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-left">Interest Alignment</label>
                      <select
                        value={interest}
                        onChange={(e) => setInterest(e.target.value as TravelInterest)}
                        className="w-full bg-[#111827] border border-slate-800 text-xs font-black uppercase p-2.5 rounded-xl text-teal-300 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer"
                        id="select-travel-interest"
                      >
                        <option value="Beaches & Granite">🌊 Pantai Batu Granit Purba</option>
                        <option value="Culinary Journeys">🍜 Kuliner Seafood & Tradisi Rempah</option>
                        <option value="Cultural Heritage">🏯 Vihara Etnis Hakka & Sejarah Tambang</option>
                        <option value="Hidden Wilderness">🌳 Ekowisata Rimba Tersembunyi</option>
                      </select>
                    </div>

                    {/* Budget Tone Priority */}
                    <div className="space-y-2">
                      <label className="text-[10px] text-slate-400 font-black uppercase tracking-wider block text-left">Premium Budget Tone</label>
                      <select
                        value={budgetTone}
                        onChange={(e) => setBudgetTone(e.target.value as BudgetTone)}
                        className="w-full bg-[#111827] border border-slate-800 text-xs font-black uppercase p-2.5 rounded-xl text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        id="select-budget-tone"
                      >
                        <option value="Luxury Splurge">👑 Luxury Splurge (Resor VIP & Yacht)</option>
                        <option value="Authentic Native">🏠 Authentic Native (UMKM & Home-Stay Autentik)</option>
                        <option value="Sleek Economical">🛵 Sleek Economical (Praktis Pintar Cerdas)</option>
                      </select>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* TAB CONTENT VIEWER */}

            {/* TAB 1: ADVANCED EXPLORE WISATA */}
            {activeTab === 'explore' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-explore">
                
                {/* ADVANCED MULTI-FILTER COMPONENT */}
                <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 sm:p-7 shadow-sm text-slate-900">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5 mb-5">
                    <div>
                      <h2 className="text-xl font-serif font-black tracking-tight text-slate-900 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-amber-500" /> Advanced Filter Engine 
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Daftar terlengkap yang didukung algoritma pencocokan personalisasi {persona}.</p>
                    </div>

                    {/* Hidden Gems toggle switcher */}
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-black text-slate-600 uppercase tracking-wider cursor-pointer select-none" htmlFor="hidden-gems-check">
                        💎 TAMPILKAN HANYA HIDDEN GEMS (★)
                      </label>
                      <input
                        type="checkbox"
                        id="hidden-gems-check"
                        checked={showOnlyHiddenGems}
                        onChange={() => setShowOnlyHiddenGems(!showOnlyHiddenGems)}
                        className="w-4.5 h-4.5 accent-amber-500 rounded border-slate-350 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                    
                    {/* Live search input block */}
                    <div className="md:col-span-5 relative">
                      <input
                        type="text"
                        placeholder="Ketik lokasi, nama pantai, atau ciri..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-205 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white transition"
                        id="search-explore-input"
                      />
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Compass className="w-4 h-4 text-slate-400" />
                      </span>
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-650"
                        >
                          Reset
                        </button>
                      )}
                    </div>

                    {/* Region Selector */}
                    <div className="md:col-span-4 flex bg-slate-50 p-1 border border-slate-205 rounded-2xl items-center">
                      <span className="text-[10px] uppercase font-black text-slate-450 tracking-wider pl-3 shrink-0 mr-2.5">Wilayah:</span>
                      <div className="grid grid-cols-2 w-full gap-1">
                        {(['Belitung', 'Bangka'] as const).map(reg => (
                          <button
                            key={reg}
                            onClick={() => setSelectedRegion(reg)}
                            className={`py-1.5 text-[10px] font-black uppercase rounded-xl transition cursor-pointer ${
                              selectedRegion === reg ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {reg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Selector */}
                    <div className="md:col-span-3 flex bg-slate-50 p-1 border border-slate-205 rounded-2xl items-center">
                      <span className="text-[10px] uppercase font-black text-amber-600 tracking-wider pl-3 shrink-0 mr-2.5">Kategori:</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value as any)}
                        className="w-full bg-transparent border-none text-[10px] font-black uppercase text-slate-800 focus:outline-none cursor-pointer pr-2"
                        id="select-category-filter"
                      >
                        <option value="pantai">🏖️ Pantai Granit</option>
                        <option value="restoran">🍜 Restoran Bahari</option>
                        <option value="cafe">☕ Warkop/Cafe</option>
                        <option value="spot_foto">📸 Spot Foto Instagenic</option>
                      </select>
                    </div>

                  </div>

                  {/* Bangka Sub-Region filter (Conditional) */}
                  {selectedRegion === 'Bangka' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in flex flex-wrap gap-2 items-center">
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mr-2">Kecamatan / Daerah:</span>
                      {[
                        { id: 'semua', label: 'Semua Kawasan' },
                        { id: 'pangkalpinang', label: 'Pangkalpinang (Pusat)' },
                        { id: 'bangka_induk', label: 'Bangka / Sungailiat' },
                        { id: 'bangka_selatan', label: 'Bangka Selatan (Toboali)' }
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedSubRegion(sub.id as any)}
                          className={`px-3 py-1.5 text-[10px] font-extrabold uppercase rounded-xl border transition-all cursor-pointer ${
                            selectedSubRegion === sub.id 
                              ? 'bg-[#0D9488]/10 border-[#0D9488]/30 text-teal-850 shadow-2xs' 
                              : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Active Filter Badges visual review */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2 text-[10px] text-slate-500 font-bold justify-between items-center">
                    <div className="flex gap-2.5 items-center">
                      <span>Aktif Aligns:</span>
                      <span className="bg-amber-100 text-amber-805 px-2.5 py-0.5 rounded-md uppercase font-black">Persona: {persona}</span>
                      <span className="bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-md uppercase font-black">Interest: {interest}</span>
                    </div>

                    <span className="font-mono text-slate-400 text-[9px]">Loaded: {filteredRekomendasi.length} Verified Spots</span>
                  </div>

                </div>

                {/* DESTINATION CARDS LIST (Luxurious Cards with Premium Badges) */}
                {exploreLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200">
                    <Loader className="w-8 h-8 text-amber-500 animate-spin mb-3.5" />
                    <span className="text-xs text-slate-450 font-black tracking-widest uppercase">Meracik Katalog Wisata Premium...</span>
                  </div>
                ) : filteredRekomendasi.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
                    <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="text-xs font-black uppercase text-slate-705 tracking-wider">Hasil Tidak Diketemukan</h4>
                    <p className="text-slate-400 text-[11px] mt-1 leading-relaxed">Saringan atau pencarian Anda menghasilkan 0 entri. Atur ulang kata kunci atau preferensi sub-wilayah.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredRekomendasi.map((spot) => {
                      const matchPct = getMatchPercentage(spot.nama);
                      const isSaved = savedSpots.includes(spot.id);
                      return (
                        <div
                          key={spot.id}
                          onClick={() => setSelectedSpot(spot)}
                          className="bg-white rounded-[32px] border border-slate-220/60 shadow-xs hover:border-amber-400/30 hover:shadow-xl hover:-translate-y-1.5 duration-500 cursor-pointer flex flex-col justify-between overflow-hidden group/card relative h-full"
                        >
                          <div>
                            {/* Rich Media Showcase Thumbnail */}
                            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                              <img 
                                src={getSpotImageUrl(spot.id)} 
                                alt={spot.nama}
                                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover/card:scale-105"
                                referrerPolicy="no-referrer"
                              />

                              {/* Gradient Shadows overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15"></div>

                              {/* Exclusivity Tag (Aesthetic premium indicators) */}
                              <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 items-start">
                                <span className="text-[9px] font-black text-slate-950 bg-amber-400 px-3 py-1 rounded-lg uppercase tracking-wider shadow-md flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-slate-950 fill-slate-950" />
                                  <span>{matchPct}% MATCH PASPORT</span>
                                </span>
                                {spot.id.charCodeAt(0) % 2 === 0 && (
                                  <span className="text-[8px] font-black text-white bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded border border-white/10 uppercase tracking-widest">
                                    ★ HIDDEN GEM
                                  </span>
                                )}
                              </div>

                              {/* Bookmark option trigger */}
                              <div className="absolute top-3.5 right-3.5 z-20">
                                <button
                                  onClick={(e) => handleToggleBookmark(spot.id, e)}
                                  className={`p-2.5 rounded-xl transition duration-300 shadow-lg ${
                                    isSaved 
                                      ? 'bg-rose-500 text-white' 
                                      : 'bg-slate-950/70 text-slate-350 border border-white/20 hover:bg-slate-950 hover:text-white'
                                  }`}
                                  title="Sematkan Ke Bookmarks Saku"
                                >
                                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : 'text-current'}`} />
                                </button>
                              </div>

                              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex justify-between items-center text-white">
                                <span className="text-[9px] font-black tracking-widest bg-slate-950/60 backdrop-blur-xs border border-white/10 px-2.5 py-0.5 rounded uppercase">
                                  {spot.kategori.replace('_', ' ')}
                                </span>
                                <span className="text-[8.5px] font-semibold text-slate-205 flex items-center gap-1 font-mono">
                                  <Map className="w-3.5 h-3.5 text-teal-400" /> {getSimulatedGps(spot.id)}
                                </span>
                              </div>
                            </div>

                            {/* Text Description Box */}
                            <div className="p-6 text-left space-y-3">
                              <h3 className="font-serif font-black text-lg text-slate-900 group-hover/card:text-teal-700 transition duration-300">
                                {spot.nama}
                              </h3>
                              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed font-sans font-medium">
                                {spot.deskripsi}
                              </p>
                            </div>
                          </div>

                          {/* Action Footer details */}
                          <div className="mx-6 mb-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-600 mt-auto">
                            <span className="text-[10px] text-slate-450 font-extrabold flex items-center gap-1.5 uppercase tracking-wide">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {spot.lokasi.split(',')[0]}
                            </span>
                            <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50/50 px-3 py-1 rounded-lg border border-amber-250/20">
                              {spot.estimasi_biaya}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: REGISTER BY MOOD COMPONENT */}
            {activeTab === 'mood' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-mood">
                <div className="bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-sm text-left">
                  <div className="flex items-center gap-3.5 mb-2">
                    <div className="p-3 bg-amber-400/10 text-amber-503 rounded-2xl">
                      <Smile className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-black text-slate-900">Kurasi Psikologi Perjalanan (Mood Oriented)</h2>
                      <p className="text-xs text-slate-500">Sesuaikan jajaran spot dengan motivasi psikologis bepergian Anda pekan ini.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6">
                    {(['healing', 'romantic', 'keluarga', 'solo', 'petualangan', 'gathering', 'honeymoon'] as const).map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`px-4 py-2 rounded-2xl text-xs font-black uppercase transition-all duration-350 cursor-pointer border ${
                          selectedMood === mood 
                            ? 'bg-slate-950 border-slate-950 text-white shadow-md' 
                            : 'bg-slate-50 border-slate-205 text-slate-500 hover:bg-slate-105 hover:text-slate-800'
                        }`}
                      >
                        {mood === 'healing' && '🧘 '}
                        {mood === 'romantic' && '💕 '}
                        {mood === 'keluarga' && '👨‍👩‍👧‍👦 '}
                        {mood === 'solo' && '🎒 '}
                        {mood === 'petualangan' && '🧭 '}
                        {mood === 'gathering' && '🤝 '}
                        {mood === 'honeymoon' && '🌴 '}
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                {moodLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-slate-200">
                    <Loader className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                    <span className="text-xs text-slate-450 font-black uppercase tracking-wider">Menyelaraskan dengan getaran emosi...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {moodSpots.map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedSpot(spot)}
                        className="bg-white rounded-[28px] border border-slate-100 shadow-xs hover:border-amber-400/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer flex flex-col justify-between overflow-hidden group/card relative text-left"
                      >
                        <div>
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                            <img 
                              src={getSpotImageUrl(spot.id)} 
                              alt={spot.nama}
                              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover/card:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            
                            {/* Mood tag and Category */}
                            <div className="absolute top-3.5 left-3.5 flex items-center gap-1">
                              <span className="text-[8.5px] font-black text-slate-950 bg-amber-400 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                Mood Matcher: {selectedMood}
                              </span>
                            </div>

                            <span className="absolute bottom-3.5 right-3.5 text-[8.5px] font-bold text-slate-205 bg-slate-950/60 hover:bg-slate-950 backdrop-blur-xs px-2.5 py-0.5 rounded border border-white/10 uppercase">
                              GPS: {getSimulatedGps(spot.id)}
                            </span>
                          </div>

                          <div className="p-6 space-y-3">
                            <h4 className="font-serif font-black text-slate-900 text-base leading-snug group-hover/card:text-emerald-700 transition">
                              {spot.nama}
                            </h4>
                            <p className="text-xs text-slate-550 leading-relaxed line-clamp-2">
                              {spot.deskripsi}
                            </p>
                          </div>
                        </div>

                        <div className="mx-6 mb-6 pt-4 border-t border-slate-105 text-[10px] text-slate-500 font-bold flex justify-between items-center">
                          <span className="flex items-center gap-1.5 uppercase text-slate-450">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {spot.lokasi.split(',')[0]}
                          </span>
                          <span className="text-emerald-805 font-black uppercase">{spot.estimasi_biaya}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: AI TRIP PLANNER COMPONENT */}
            {activeTab === 'planner' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-planner">
                
                {/* Advanced explanatory micro-banner for Premium Planner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-5 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-amber-400 font-extrabold tracking-widest block uppercase">★ ACTIVATED: DEEPMIND GEMINI TRAVEL ENGINE (GENAI-v3)</span>
                    <h3 className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                      Sistem Optimasi Biaya & Kronologi Itinerary Canggih <Sparkles className="w-4.5 h-4.5 text-amber-400 fill-amber-300" />
                    </h3>
                    <p className="text-[11px] text-slate-400">Susun rute dengan durasi berkendara optimal, porsi istirahat, serta estimasi harga rill UMKM.</p>
                  </div>

                  <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-emerald-500/20 block">
                    100% Unlimited Usage ✓
                  </span>
                </div>

                <TripPlannerComponent token={token} username={user.username} />
              </div>
            )}

            {/* TAB 4: TALK TO AI PEMANDU (GEMINI STREAMING) */}
            {activeTab === 'chat' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-chat">
                
                {/* Explanatory Info Header */}
                <div className="bg-amber-405/5 border border-amber-400/20 bg-amber-50/20 rounded-3xl p-4.5 text-slate-805 text-left flex items-start gap-3">
                  <div className="p-2 bg-amber-400 rounded-xl text-slate-950 shrink-0">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">VIP Pramuwisata Digital (AI Concierge Service)</h4>
                    <p className="text-[11.5px] text-slate-550 leading-relaxed mt-1">
                      Koneksi super cepat dengan asisten cerdas Gemini yang dibekali pangkalan data adat istiadat Kepulauan, peta jalan rill Belitung Timur, dan resep bumbu Lempah Kuning legendaris. Ajukan pertanyaan seputar koordinat dermaga hopping, tips menyewa sekoci, atau cuaca maritim sore ini.
                    </p>
                  </div>
                </div>

                <AiChatComponent 
                  token={token} 
                  username={user.username} 
                  persona={persona}
                  interest={interest}
                  budgetTone={budgetTone}
                  selectedRegion={selectedRegion}
                />
              </div>
            )}

            {/* TAB 5: KALKULATOR ESTIMATOR BUDGET */}
            {activeTab === 'budget' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-budget">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm text-left">
                  <span className="text-[9px] bg-teal-50 text-teal-800 font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                    BUDGET INTEGRATIF
                  </span>
                  <h3 className="text-lg font-serif font-bold text-slate-900 mt-1.5">Kalkulator Rincian Keuangan Eksklusif</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">Ukur anggaran terperinci mulai dari sewa bahan bakar mobil Avanza/Innova, makan kedai lempah, penginapan glamping bintang empat, hingga tiket snorkeling.</p>
                </div>

                <BudgetEstimator token={token} />
              </div>
            )}

            {/* TAB 6: PREMIUM KULINER TRADISIONAL */}
            {activeTab === 'kuliner' && (
              <div className="space-y-6 animate-fade-in" id="view-tab-kuliner">
                
                {/* Elegant gastronomy overview header */}
                <div className="bg-white rounded-[32px] border border-slate-200 p-6 sm:p-8 shadow-sm text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="space-y-1">
                      <span className="text-[#0D9488] font-black text-[9px] tracking-widest block uppercase">ESTEEMED MARITIME GASTRONOMY</span>
                      <h2 className="text-xl font-serif font-black text-slate-900 tracking-tight leading-none flex items-center gap-2">
                        <Utensils className="w-5.5 h-5.5 text-amber-500" /> Rekomendasi Kuliner Bintang Lima & Warung Rakyat Khas
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">Rekomendasi premium dikurasi langsung bersama perkumpulan koki kuliner Bangka Belitung.</p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                      {(['semua', 'seafood', 'halal', 'sarapan', 'murah meriah'] as const).map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setSelectedCulinerPref(pref)}
                          className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer ${
                            selectedCulinerPref === pref ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* FOOD GRID LIST */}
                {kulinerLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 animate-pulse">
                    <Loader className="w-8 h-8 text-[#0D9488] animate-spin mb-3.5" />
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Meracik resep & daftar restoran terbaik...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {kulinerList.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedKuliner(item)}
                        className="bg-white rounded-[32px] border border-slate-150/60 shadow-xs hover:border-emerald-500/20 hover:shadow-xl hover:-translate-y-1.5 duration-500 cursor-pointer flex flex-col justify-between overflow-hidden group/food relative h-full text-left"
                      >
                        <div>
                          {/* Visual high resolution food covers */}
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                            <img 
                              src={getKulinerImageUrl(item.id)} 
                              alt={item.nama}
                              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover/food:scale-105"
                              referrerPolicy="no-referrer"
                            />

                            {/* Gradient Shadows */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/15"></div>

                            <span className="absolute top-3.5 left-3.5 text-[9px] font-black text-emerald-950 bg-emerald-250 px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                              🍲 {item.tipe.toUpperCase()}
                            </span>

                            <span className="absolute bottom-3.5 right-3.5 text-white font-extrabold text-[10px] bg-slate-950/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
                              Est: {item.estimasi_biaya}
                            </span>
                          </div>

                          {/* Text labels */}
                          <div className="p-6 space-y-3.5">
                            <div className="flex items-center justify-between gap-2.5">
                              <h3 className="font-serif font-black text-slate-900 text-base group-hover/food:text-[#0D9488] transition line-clamp-1">
                                {item.nama}
                              </h3>
                              {item.rating && (
                                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md text-[10.5px] font-black">
                                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                  <span>{item.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>

                            <p className="text-xs text-slate-550 leading-relaxed line-clamp-2 font-medium font-sans">
                              {item.deskripsi}
                            </p>
                          </div>
                        </div>

                        {/* Extra food specific tag recommendations */}
                        <div className="mx-6 mb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold mt-auto font-sans">
                          <span className="text-slate-500 truncate max-w-[70%]">
                            🎯 Rekomendasi: <strong className="text-slate-800 font-extrabold">{item.rekomendasi_tempat}</strong>
                          </span>
                          <span className="text-emerald-700 font-extrabold text-[10px] uppercase hover:underline">Detail Gourmet →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: VIP LEAFLET SATELLITE MAP */}
            {activeTab === 'map' && (
              <div className="space-y-6 animate-fade-in text-left">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-100/40 dark:bg-slate-900/45 p-5 rounded-2.5xl border border-slate-205/10">
                  <div>
                    <span className="text-amber-550 text-[10px] font-extrabold tracking-widest block uppercase font-mono mb-1">VIP GEOGRAPHICAL RADAR</span>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-100 dark:text-white leading-none">
                      Integrated Satellite Explorer
                    </h2>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-sans font-medium">
                      Peta satelit navigasi kepulauan eksklusif untuk member VIP. Menyatukan titik wisata alam premium dengan landmark warisan kuliner legendaris Bangka & Belitung.
                    </p>
                  </div>
                  <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm font-sans select-none">
                    ★ EXECUTIVE MEMBER PASS
                  </span>
                </div>

                <div className="w-full">
                  <TravelMap 
                    darkMode={darkMode}
                    spots={[
                      ...rekomendasi.map(r => ({
                        id: r.id,
                        nama: r.nama,
                        lokasi: r.lokasi,
                        kategori: r.kategori,
                        desc: r.deskripsi || r.tips,
                        rating: r.rating,
                        wilayah: r.wilayah as 'Bangka' | 'Belitung',
                        tipe: 'wisata' as const
                      })),
                      ...kulinerList.map(k => ({
                        id: k.id,
                        nama: k.nama,
                        lokasi: k.wilayah || "Bangka Belitung",
                        kategori: k.tipe || "Kuliner Khas",
                        desc: k.deskripsi,
                        rating: k.rating || 4.9,
                        wilayah: k.wilayah as 'Bangka' | 'Belitung',
                        tipe: 'kuliner' as const
                      }))
                    ]}
                    premiumUser={true}
                    onSelectSpot={(spot) => {
                      if (spot.tipe === 'wisata') {
                        const fullSpot = rekomendasi.find(item => item.id === spot.id);
                        if (fullSpot) {
                          setSelectedSpot(fullSpot);
                        }
                      } else {
                        const fullCuliner = kulinerList.find(item => item.id === spot.id);
                        if (fullCuliner) {
                          setSelectedKuliner(fullCuliner);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 7: ADMIN CONTROL COMPOSITION */}
            {activeTab === 'admin' && (
              <AdminPanel />
            )}

          </main>
        </div>

        {/* DETAILED DIALOG MODALS: LUXURIOUS PRESENTATION FOR EXTENDED INFO */}
        
        {/* SPOT WINDOW MODAL */}
        {selectedSpot && (
          <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 ease-out ${isClosingSpot ? 'opacity-0' : 'opacity-100'}`}>
            <div 
              className={`bg-white rounded-[36px] max-w-lg md:max-w-4xl w-full overflow-hidden border border-slate-200/80 shadow-2xl relative transition-all duration-300 transform flex flex-col md:flex-row ${
                isClosingSpot ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
              }`}
              id="spot-detail-modal"
            >
              
              {/* Image side column (Wide screen showcase) */}
              <div className="relative w-full h-52 md:h-auto md:w-[45%] shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end text-left">
                <img 
                  src={getSpotImageUrl(selectedSpot.id)} 
                  alt={selectedSpot.nama}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glass overlays */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 md:from-black/95 via-black/45 to-transparent"></div>
                
                {/* Top Close (X) Trigger with great tactile accessibility */}
                <button
                  id="btn-close-spot-modal"
                  onClick={handleCloseSpotModal}
                  className="absolute top-4 right-4 z-30 text-white bg-slate-950/80 hover:bg-rose-600 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-xl border border-white/20 hover:scale-105"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Cover Text info */}
                <div className="relative p-6 sm:p-8 z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {selectedSpot.kategori.replace('_', ' ')}
                    </span>
                    <span className="text-[9.5px] font-bold text-white bg-slate-900/60 border border-white/10 px-2.5 py-0.5 rounded uppercase font-mono">
                      {selectedSpot.wilayah}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-serif font-black text-white leading-tight drop-shadow-md">
                    {selectedSpot.nama}
                  </h3>

                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Algoritma {persona}: {getMatchPercentage(selectedSpot.nama)}% Match Score</span>
                  </div>
                </div>
              </div>

              {/* Scrolled Content details */}
              <div className="p-6 sm:p-9 flex-1 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[640px] text-left">
                
                <div className="space-y-6">
                  
                  {/* General detailed desc */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans">
                      DESKRIPSI LENGKAP & HERITABILITAS
                    </span>
                    <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 relative">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium font-sans">
                        {selectedSpot.deskripsi.length > 180
                          ? isDescExpanded
                            ? selectedSpot.deskripsi
                            : `${selectedSpot.deskripsi.slice(0, 177)}...`
                          : selectedSpot.deskripsi}
                      </p>
                      {selectedSpot.deskripsi.length > 180 && (
                        <button
                          onClick={() => setIsDescExpanded(!isDescExpanded)}
                          className="mt-2 text-[11px] font-extrabold text-teal-650 hover:text-teal-850 duration-200 block cursor-pointer"
                        >
                          {isDescExpanded ? 'Sembunyikan Deskripsi Detail' : 'Baca Selengkapnya Deskripsi'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Segment Details Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-left flex flex-col justify-between">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">LOKASI FISIK</span>
                      <span className="font-extrabold text-xs text-slate-800 block mt-1 leading-snug line-clamp-2">
                        {selectedSpot.lokasi}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-left flex flex-col justify-between">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest">JAM OPERASIONAL</span>
                      <span className="font-extrabold text-xs text-slate-800 block mt-1">
                        {selectedSpot.jam_buka}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-left flex flex-col justify-between">
                      <span className="text-[8.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">ESTIMASI BIAYA</span>
                      <span className="font-black text-xs text-amber-600 block mt-1">
                        {selectedSpot.estimasi_biaya}
                      </span>
                    </div>

                  </div>

                  {/* PREMIUM INSIDER SECRETS GUIDE */}
                  <div className="bg-gradient-to-r from-teal-50/80 to-emerald-50/80 border border-teal-100 p-4.5 rounded-2xl">
                    <span className="font-black text-teal-800 text-[9.5px] uppercase tracking-wider block mb-1">
                      💡 EXCLUSIVE INSIDER VIP TRAVEL ADVISORY
                    </span>
                    <p className="text-xs text-teal-950 leading-relaxed font-medium block">
                      {getExclusiveInsiderTip(selectedSpot.nama)}
                    </p>
                  </div>

                  {/* Core guidance tips */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-1">
                    <span className="font-extrabold uppercase text-slate-500 text-[9px] block">PANGKALAN REKOMENDASI UMUM PEMERINTAH</span>
                    <p className="text-slate-650 font-medium leading-relaxed">{selectedSpot.tips}</p>
                  </div>

                </div>

                <div className="mt-8 flex gap-3.5">
                  <button
                    onClick={(e) => handleToggleBookmark(selectedSpot.id, e)}
                    className={`px-4.5 py-3 rounded-xl font-bold text-xs cursor-pointer flex items-center gap-1.5 border transition ${
                      savedSpots.includes(selectedSpot.id)
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'bg-white border-slate-220 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${savedSpots.includes(selectedSpot.id) ? 'fill-rose-500 text-rose-500' : 'text-current'}`} />
                    <span>{savedSpots.includes(selectedSpot.id) ? 'Tersimpan Ke Favorit' : 'Simpan Destinasi'}</span>
                  </button>

                  <button
                    onClick={handleCloseSpotModal}
                    className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black text-xs cursor-pointer transition uppercase tracking-wider text-center"
                  >
                    Selesai Membaca & Tutup
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* KULINER WINDOW MODAL */}
        {selectedKuliner && (
          <div className={`fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 ease-out ${isClosingKuliner ? 'opacity-0' : 'opacity-100'}`}>
            <div 
              className={`bg-white rounded-[36px] max-w-lg md:max-w-4xl w-full overflow-hidden border border-slate-200 shadow-2xl relative transition-all duration-300 transform flex flex-col md:flex-row ${
                isClosingKuliner ? 'scale-95 translate-y-4' : 'scale-100 translate-y-0'
              }`}
              id="kuliner-detail-modal"
            >
              
              <div className="relative w-full h-52 md:h-auto md:w-[45%] shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end text-left">
                <img 
                  src={getKulinerImageUrl(selectedKuliner.id)} 
                  alt={selectedKuliner.nama}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 md:from-black/95 via-black/45 to-transparent"></div>

                <button
                  onClick={handleCloseKulinerModal}
                  className="absolute top-4 right-4 z-30 text-white bg-slate-950/80 hover:bg-rose-600 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 shadow-xl border border-white/20 hover:scale-105"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>

                <div className="relative p-6 sm:p-8 z-10 space-y-3Description">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black bg-[#0D9488] text-white px-2.5 py-0.5 rounded uppercase tracking-wider">
                      Kuliner Khas • {selectedKuliner.tipe}
                    </span>
                    {selectedKuliner.kategori && (
                      <span className="text-[9px] font-bold text-slate-100 bg-slate-900/80 border border-slate-750 px-2 py-0.5 rounded uppercase font-mono">
                        {selectedKuliner.kategori}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-3xl font-serif font-black text-white leading-tight drop-shadow-md">
                    {selectedKuliner.nama}
                  </h3>

                  {selectedKuliner.rating && (
                    <div className="flex items-center gap-1 mt-2 text-amber-400 text-sm font-extrabold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{selectedKuliner.rating.toFixed(1)} / 5.0 Akreditasi Rasa</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-9 flex-1 flex flex-col justify-between overflow-y-auto max-h-[70vh] md:max-h-[640px] text-left">
                
                <div className="space-y-6">
                  
                  <div className="space-y-2">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                      SEJARAH & RESEP KHAS KEDAI
                    </span>
                    <p className="text-xs text-slate-650 leading-relaxed font-semibold font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {selectedKuliner.deskripsi}
                    </p>
                  </div>

                  <div className="space-y-4">
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-50 text-emerald-650 rounded-xl">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-extrabold block text-slate-400 text-[8.5px] uppercase tracking-wider">Rekomendasi Restoran Pilihan</span>
                        <span className="font-black text-slate-800 text-xs">{selectedKuliner.rekomendasi_tempat}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <BadgeDollarSign className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <span className="font-extrabold block text-slate-400 text-[8.5px] uppercase tracking-wider">Rincian Budget Porsi</span>
                        <span className="font-bold text-slate-800 text-xs">{selectedKuliner.estimasi_biaya}</span>
                      </div>
                    </div>

                    {selectedKuliner.jam_buka && (
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 whitespace-nowrap rounded-xl">
                          <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-extrabold block text-slate-400 text-[8.5px] uppercase tracking-wider">Jam Sibuk Pelayanan</span>
                          <span className="font-semibold text-slate-800 text-xs">{selectedKuliner.jam_buka}</span>
                        </div>
                      </div>
                    )}

                  </div>

                  {selectedKuliner.highlights && selectedKuliner.highlights.length > 0 && (
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-150 text-left">
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 font-sans">
                        ⭐ ATRIBUT KULINER & HIGHLIGHTS MAKANAN
                      </span>
                      <ul className="space-y-2 text-xs text-slate-700 font-bold font-sans">
                        {selectedKuliner.highlights.map((h, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-[#0D9488] font-bold select-none">•</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl">
                    <span className="font-black text-emerald-800 text-[9.5px] uppercase tracking-wider block mb-1">
                      🍲 PETUNJUK GOURMET SENSARY TIPS
                    </span>
                    <p className="text-xs text-emerald-950 leading-relaxed font-sans font-medium">
                      {selectedKuliner.tips}
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleCloseKulinerModal}
                  className="w-full mt-8 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black text-xs cursor-pointer transition uppercase tracking-wider text-center"
                >
                  Selesai Membaca & Tutup
                </button>

              </div>

            </div>
          </div>
        )}

        {/* COMPREHENSIVE LUXURY FOOTER */}
        <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 text-center relative z-10 rounded-t-[36px] shadow-2xl">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-left space-y-1">
              <span className="font-bold text-white text-lg block font-serif tracking-wide">
                babel<span className="text-amber-400">.trip</span> 👑
              </span>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Peta Cerdas Pariwisata Maritim & Kuliner Daerah • Akun Premium Terverifikasi
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4.5 text-[11px] font-bold text-slate-500 items-center">
              <span className="text-[#0D9488] flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> SECURE SSL ENCRYPTED
              </span>
              <span>•</span>
              <span className="text-slate-400">Pariwisata Ramah Lingkungan</span>
              <span>•</span>
              <span className="text-slate-600 font-mono text-[9px]">S.: 2.5694°, E.: 107.6975°</span>
            </div>
          </div>
          
          <p className="text-[10px] text-slate-600 mt-8 leading-relaxed font-medium">
            © 2026 babel.trip. Hak Cipta Dilindungi Undang-Undang. <br />
            Mendukung pengembangan UMKM Pesisir, Kelestarian Terumbu Karang Lepas Pantai, dan Keasrian Maritim Bangka Belitung 💚
          </p>
        </footer>

      </div>
    </div>
  );
}
