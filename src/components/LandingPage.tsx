/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Heart, 
  Menu, 
  X, 
  Palmtree, 
  Sun, 
  Moon,
  Waves, 
  HelpCircle, 
  Instagram, 
  Globe, 
  Star, 
  Coffee, 
  Utensils, 
  Map as MapIcon, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  BookOpen, 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  DollarSign, 
  Calendar,
  CloudSun,
  Wind,
  Navigation,
  Eye,
  BookmarkCheck
} from 'lucide-react';

import { 
  WHY_VISIT_PILLARS, 
  LANDING_DESTINATIONS, 
  LANDING_CULINARY, 
  ITINERARY_PRESETS,
  LandingDestination,
  CulinaryLandingItem
} from '../data/landingData';

import BrandLogo from './BrandLogo';
import TravelMap from './TravelMap';

interface LandingPageProps {
  onNavigateToAuth: (mode: 'login' | 'register', presetTier?: 'free' | 'premium') => void;
  onExploreAnonymously: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LandingPage({ onNavigateToAuth, onExploreAnonymously, darkMode, onToggleDarkMode }: LandingPageProps) {
  // Navigation & Scroll states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Weather state
  const [selectedWeatherRegion, setSelectedWeatherRegion] = useState<'bangka' | 'belitung'>('belitung');
  
  // Favorites State
  const [favorites, setFavorites] = useState<LandingDestination[]>([]);
  const [showFavDropdown, setShowFavDropdown] = useState(false);

  // Pillar Grid State
  const [activePillarTab, setActivePillarTab] = useState<string>("granite_beaches");

  // Filter Directory State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIslandFilter, setSelectedIslandFilter] = useState<'Semua' | 'Bangka' | 'Belitung'>('Semua');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'Semua' | 'Pantai' | 'Danau' | 'Ekowisata'>('Semua');

  // AI Planner Simulator State
  const [plannerMood, setPlannerMood] = useState<'healing' | 'adventure'>('healing');
  const [plannerBudget, setPlannerBudget] = useState<'budget' | 'luxury'>('budget');
  const [activePlanDay, setActivePlanDay] = useState<1 | 2 | 3>(1);

  // SVG Interactive Map Coordinates details State
  const [selectedMapPinId, setSelectedMapPinId] = useState<string>("pin1");

  // Track scroll position to change navbar glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set initial coordinates for map preview details
  const mapCoordinates = [
    {
      id: "pin1",
      name: "Tanjung Tinggi, Belitung",
      lat_long: "2.5694° S, 107.6975° E",
      desc: "Kawasan eksklusif pantai berpasir silika putih halus berjejer batu granit megah setinggi rumah dua lantai.",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pin2",
      name: "Pulau Lengkuas, Belitung",
      lat_long: "2.5312° S, 107.6250° E",
      desc: "Menyimpan sisa heritabilitas kolonial mercusuar setinggi 50 meter dengan ekosistem bawah air keperawanan mutlak.",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pin3",
      name: "Parai Tenggiri, Bangka",
      lat_long: "1.8021° S, 106.1852° E",
      desc: "Pantai aristokrat dengan ombak laut natuna halus, dilengkapi anjungan bebatuan granit berselimut gazebo megah.",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "pin4",
      name: "Danau Kaolin Air Bara, Bangka Tengah",
      lat_long: "2.3315° S, 106.2844° E",
      desc: "Lanskap gurun kawah tambang bergradasi ganda menyimpan air pirus kehijauan yang tidak beracun.",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1528150395403-992a693e26c8?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const currentMapDetail = mapCoordinates.find(p => p.id === selectedMapPinId) || mapCoordinates[0];

  // Weather Metrics values
  const weatherAdvisories = {
    belitung: {
      status: "Cerah Berawan",
      temp: "29°C",
      humidity: "78%",
      wind: "12 km/h (Selatan - Timur)",
      waves: "0.2 - 0.4 meter (Sangat Aman)",
      suitability: "Sangat Rekomendasi Island Hopping",
      adv: "Suhu terbaik snorkeling, visibilitas air laut mencapai puncak 25 meter."
    },
    bangka: {
      status: "Berawan Hangat",
      temp: "28°C",
      humidity: "82%",
      wind: "14 km/h (Tenggara)",
      waves: "0.3 - 0.5 meter (Aman)",
      suitability: "Sempurna untuk Coastal Tour & Kuliner",
      adv: "Sangat bersahabat untuk menyusuri pesisir timur Bangka & bersantap Lempah Kuning hangat."
    }
  };

  const currentWeather = weatherAdvisories[selectedWeatherRegion];

  // Helper toggle favorites
  const handleToggleFavorite = (dest: LandingDestination) => {
    if (favorites.some(f => f.id === dest.id)) {
      setFavorites(favorites.filter(f => f.id !== dest.id));
    } else {
      setFavorites([...favorites, dest]);
    }
  };

  // Filter process
  const filteredDestinations = LANDING_DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dest.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIsland = selectedIslandFilter === 'Semua' || dest.island === selectedIslandFilter;
    const matchesCategory = selectedCategoryFilter === 'Semua' || dest.category === selectedCategoryFilter;

    return matchesSearch && matchesIsland && matchesCategory;
  });

  const simulatedPlannerData = ITINERARY_PRESETS[plannerMood][plannerBudget];
  const activeTimeline = activePlanDay === 1 ? simulatedPlannerData.day1 : 
                         activePlanDay === 2 ? simulatedPlannerData.day2 : 
                         simulatedPlannerData.day3;

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900" id="landing-page-root">
      
      {/* 1. TOP GLOBAL NAVBAR (Glassmorphism & Adaptive Scrolling) */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 py-3 sm:px-12 flex items-center justify-between ${
        isScrolled 
          ? 'bg-white/90 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/80 shadow-md py-3' 
          : 'bg-[#0F172A]/35 backdrop-blur-md border-b border-white/10 py-5'
      }`}>
        
        {/* Logo identity representing modern and elegant exclusive tourism */}
        <div 
          className="group cursor-pointer select-none" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          id="navbar-logo"
        >
          <BrandLogo scrolled={isScrolled} />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-7">
          <a href="#why-visit-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>Why Babel</a>
          <a href="#profile-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>About Us</a>
          <a href="#explore-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>Explore Spots</a>
          <a href="#itinerary-simulator-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>Planner Preview</a>
          <a href="#culinary-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>Culinary</a>
          <a href="#map-section" className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
            isScrolled ? 'text-slate-600 hover:text-teal-700' : 'text-slate-200 hover:text-amber-400'
          }`}>Interactive Map</a>
          <a href="#premium-section" className={`text-xs font-black uppercase tracking-wider flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 duration-250 ${
            isScrolled ? 'hover:bg-amber-500/20' : 'hover:bg-amber-400/30'
          }`}>
            Premium Space <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
          </a>
        </nav>

        {/* Right Corner Buttons with Favorites List Integration */}
        <div className="hidden lg:flex items-center gap-4 relative">
          
          {/* Dark Mode Toggle Switch */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isScrolled 
                ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100' 
                : 'border-white/10 bg-white/5 text-white hover:bg-white/15'
            }`}
            title={darkMode ? "Aktifkan Mode Cahaya" : "Aktifkan Mode Gelap"}
            id="global-theme-toggle"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-black uppercase text-amber-400">Mode Terang</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-305 text-amber-500" />
                <span className="text-[11px] font-black uppercase text-slate-300">Mode Gelap</span>
              </>
            )}
          </button>

          {/* Favorite Trigger Icon with counter badge */}
          <button 
            onClick={() => setShowFavDropdown(!showFavDropdown)}
            className={`p-2.5 rounded-xl border relative transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isScrolled 
                ? 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100' 
                : 'border-white/10 bg-white/5 text-white hover:bg-white/15'
            }`}
            title="Saran Destinasi Favorit Anda"
            id="fav-trigger"
          >
            <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-current'}`} />
            <span className="text-[11px] font-black uppercase">Favorit</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 border border-white text-white rounded-full text-[9px] w-4.5 h-4.5 flex items-center justify-center font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Interactive Saved Favorites Dropdown Float */}
          {showFavDropdown && (
            <div className="absolute right-32 top-14 w-80 bg-white shadow-2xl rounded-3xl border border-slate-200/80 p-5 z-50 text-left animate-fade-in text-slate-900">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                <span className="text-xs font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600" /> Saved Destinations
                </span>
                <button onClick={() => setShowFavDropdown(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                  <Heart className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-50 block" />
                  <p className="text-[11px] font-medium leading-relaxed">Belum ada lokasi tersimpan. Ketuk tombol <Heart className="w-3 h-3 inline text-rose-500" /> di kartu destinasi di bawah!</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {favorites.map(item => (
                    <div key={item.id} className="flex gap-2.5 items-center p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-bold text-slate-900 truncate leading-tight">{item.name}</h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5 uppercase tracking-wide">{item.island} Island • {item.category}</span>
                      </div>
                      <button 
                        onClick={() => handleToggleFavorite(item)} 
                        className="text-slate-300 hover:text-rose-500 shrink-0 p-1"
                        title="Hapus"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setShowFavDropdown(false);
                        onNavigateToAuth('register', 'premium');
                      }}
                      className="w-full py-2 bg-[#0F172A] text-white hover:bg-teal-950 rounded-xl font-bold text-[10px] text-center uppercase tracking-wider block"
                    >
                      Hubungkan Ke AI Planner Premium
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button 
            onClick={() => onNavigateToAuth('login')}
            className={`text-xs font-bold transition-all px-3 py-2 cursor-pointer ${
              isScrolled ? 'text-slate-800 hover:text-teal-700' : 'text-slate-105 hover:text-white'
            }`}
          >
            Masuk
          </button>
          
          <button 
            onClick={() => onNavigateToAuth('register', 'premium')}
            className="text-xs font-black bg-gradient-to-tr from-stone-900 to-amber-950 text-white border border-white/20 px-4.5 py-3 rounded-2xl transition-all shadow-md hover:shadow-xl hover:scale-[1.02]"
            id="register-premium-btn"
          >
            Registrasi Premium
          </button>
        </div>

        {/* Hamburger menu for small touch screen devices */}
        <div className="flex xl:hidden items-center gap-2">
          
          {/* Mobile Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
              isScrolled 
                ? 'border-slate-200 bg-slate-50 text-slate-705 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100' 
                : 'border-white/10 bg-white/5 text-white hover:bg-white/15'
            }`}
            title="Suhu Tema"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Moon className="w-4 h-4 text-amber-450" />}
          </button>

          {favorites.length > 0 && (
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl shrink-0 flex items-center gap-1 text-[11px] font-black mr-1 dark:bg-rose-950/40 dark:text-rose-455">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{favorites.length}</span>
            </div>
          )}
          <button 
            onClick={() => onNavigateToAuth('register', 'premium')}
            className="text-[10px] bg-amber-500 hover:bg-amber-600 font-extrabold text-slate-950 px-3 py-2 rounded-xl"
          >
            JOIN ★
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-2 rounded-xl transition-colors cursor-pointer border ${
              isScrolled 
                ? 'text-slate-750 bg-slate-100 border-slate-200' 
                : 'text-white bg-white/10 border-white/10'
            }`}
            title="Toggle Menu Drawer"
            id="hamburger-trigger"
          >
            {isMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* 2. MOBILE MENU DRAWER COLLAPSIBLE */}
      {isMenuOpen && (
        <div className="xl:hidden z-40 fixed top-[66px] left-4 right-4 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 rounded-3.5xl shadow-2xl p-5 flex flex-col gap-4.5 animate-fade-in text-slate-800 dark:text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
            <span className="text-[10px] font-black text-slate-450 dark:text-slate-400 tracking-widest block uppercase">Bangka Belitung Hub</span>
            <span className="text-[9px] bg-[#0D9488]/10 text-teal-850 dark:bg-teal-500/10 dark:text-teal-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase">Exclusive Access</span>
          </div>

          <div className="flex flex-col gap-2">
            <a href="#why-visit-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ Why Bangka Belitung</a>
            <a href="#profile-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ About & UMKM Mission</a>
            <a href="#explore-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ Explore Spot Directory</a>
            <a href="#itinerary-simulator-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ ITineraries & Budgets</a>
            <a href="#culinary-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ Traditional Culinary</a>
            <a href="#map-section" onClick={() => setIsMenuOpen(false)} className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-teal-700">✓ Interactive Grid Map</a>
          </div>

          <div className="border-t border-slate-150 dark:border-slate-800 pt-3.5 flex flex-col gap-3">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onExploreAnonymously();
              }}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-[#0D9488]"
            >
              🏖️ Jelajahi Sebagai Tamu Demo
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateToAuth('login');
              }}
              className="w-full text-center py-2.5 bg-slate-100 hover:bg-slate-150 rounded-xl text-xs font-bold text-slate-700"
            >
              Masuk Akun
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onNavigateToAuth('register', 'premium');
              }}
              className="w-full py-3 bg-gradient-to-tr from-[#111827] via-[#1F2937] to-[#115E59] text-white font-black text-xs rounded-2xl shadow-md uppercase tracking-wider text-center"
            >
              Registrasi Premium (Rp29rb)
            </button>
          </div>
        </div>
      )}

      {/* 3. CINEMATIC FULL SCREEN HERO SECTION */}
      <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 bg-slate-900 text-white overflow-hidden" id="hero-section">
        
        {/* Full screen high resolution beautiful ocean imagery */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80" 
            alt="Cinematic Bangka Belitung Backdrop" 
            className="w-full h-full object-cover opacity-35 filter saturate-110 brightness-90 animate-fade-in select-none scale-100"
            referrerPolicy="no-referrer"
          />
          {/* Gradients blending with soft gold and ocean blue */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/40 to-[#0F172A]"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FBFBFA]/100 to-transparent"></div>
        </div>

        {/* Space Spacer */}
        <div></div>

        {/* Hero Central Typography Panel */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 my-auto pt-10">
          
          <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-[#D97706]/25 to-[#0D9488]/25 border border-amber-400/30 rounded-full text-amber-200 text-[11px] font-extrabold mx-auto shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
            <span className="tracking-widest uppercase">EKSKLUSIF DIGITAL GATEWAY BANGKA BELITUNG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black tracking-tight leading-[1.1] text-white">
            Eksplorasi Keaslian <br />
            <span className="font-sans font-extrabold italic bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-200 tracking-tight">
              Surga Bahari Tropis
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-medium">
            Tersaji eksklusif bagi pencinta pariwisata berkelas. Temukan jajaran batu granit megalitikum berusia ratusan juta tahun, kehangatan otentik masyarakat adat pesisir, dan kepraktisan menyusun itinerary real-world didampingi AI Travel Expert.
          </p>

          <div className="flex flex-col sm:flex-row gap-4.5 justify-center items-center w-full max-w-md mx-auto">
            <button
              onClick={() => onNavigateToAuth('register', 'premium')}
              className="w-full sm:w-auto text-xs font-black bg-gradient-to-tr from-amber-500 via-amber-600 to-[#D97706] text-slate-950 px-8 py-4.5 rounded-2xl shadow-xl hover:shadow-amber-500/25 cursor-pointer tracking-wider transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              JOIN PREMIUM EXPERIENCE
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExploreAnonymously}
              className="w-full sm:w-auto text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 px-8 py-4.5 rounded-2xl shadow-sm backdrop-blur-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              COBA DEMO AKSES 👀
            </button>
          </div>

        </div>

        {/* HERO LOWER BAR: Live Interactive Weather & Travel Advisory widget (Authentic integration) */}
        <div className="relative z-10 max-w-5xl mx-auto w-full pt-10">
          <div className="bg-[#1E293B]/75 border border-white/10 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-2xl">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-amber-400 font-extrabold tracking-widest block uppercase">LIVE MARITIME WEATHER & TRAVEL REPORT</span>
                <p className="text-xs text-slate-300 mt-0.5">Visibilitas perairan andalan Kepulauan diperbarui berkala rujukan Kantor Syahbandar Pelabuhan.</p>
              </div>

              {/* Weather Location Selector */}
              <div className="flex bg-[#0F172A] p-1 rounded-xl border border-white/10 shrink-0">
                <button 
                  onClick={() => setSelectedWeatherRegion('belitung')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition rounded-lg ${
                    selectedWeatherRegion === 'belitung' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-400 hover:text-slate-205'
                  }`}
                >
                  Pulau Belitung 🌴
                </button>
                <button 
                  onClick={() => setSelectedWeatherRegion('bangka')}
                  className={`px-3 py-1 text-[10px] font-bold uppercase transition rounded-lg ${
                    selectedWeatherRegion === 'bangka' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-400 hover:text-slate-205'
                  }`}
                >
                  Pulau Bangka 🌊
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4.5">
              
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Status Cuaca</span>
                <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase font-sans">
                  <CloudSun className="w-4 h-4 text-amber-400 shrink-0" /> {currentWeather.status}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">{currentWeather.temp} • Kelembapan {currentWeather.humidity}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Arah & Kecepatan Angin</span>
                <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase font-sans">
                  <Wind className="w-4 h-4 text-slate-350 shrink-0" /> {currentWeather.wind}
                </span>
                <span className="text-[10px] text-emerald-400 block font-bold">Arah Layar Normal ✓</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Gelombang Pasang</span>
                <span className="text-xs font-black text-white flex items-center gap-1.5 uppercase font-sans">
                  <Waves className="w-4 h-4 text-cyan-400 shrink-0" /> {currentWeather.waves}
                </span>
                <span className="text-[10px] text-[#0D9488] block font-bold">Kategori: Teduh (Sangat Aman)</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">Rekomendasi Aktivitas</span>
                <span className="text-xs font-black text-amber-300 block leading-tight">{currentWeather.suitability}</span>
                <span className="text-[10px] text-slate-400 block font-medium mt-0.5 leading-snug">{currentWeather.adv}</span>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 4. WHY VISIT BANGKA BELITUNG? Bento Grid & Feature detailer */}
      <section id="why-visit-section" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full scroll-mt-20">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-[#0D9488] font-extrabold text-xs tracking-widest block uppercase">WHY VISIT BANGKA BELITUNG</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Pesona Kepulauan Maritim Terindah di Nusantara
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium font-sans">
            Paduan langka formasi batuan heritabilitas purba, keasrian biota lepas pantai, dan kelezatan hidangan bahari berpadu menciptakan petualangan eksklusif tiada tara.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Interactive Selector Left Column (Shows the 8 pillars elegantly) */}
          <div className="lg:col-span-4 flex flex-col gap-2.5 justify-center">
            {WHY_VISIT_PILLARS.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillarTab(pillar.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3.5 cursor-pointer relative overflow-hidden group ${
                  activePillarTab === pillar.id 
                    ? 'bg-white border-slate-200/80 shadow-md ring-1 ring-[#0D9488]/10' 
                    : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100'
                }`}
              >
                {/* Visual Accent slice */}
                {activePillarTab === pillar.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0D9488] rounded-r"></div>
                )}

                <div className={`p-2.5 rounded-xl shrink-0 transition-all ${
                  activePillarTab === pillar.id ? 'bg-[#0D9488]/10 text-[#0D9488]' : 'bg-slate-100 text-slate-505'
                }`}>
                  <Palmtree className="w-4 h-4 text-emerald-650" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-xs font-black uppercase tracking-wider block ${
                    activePillarTab === pillar.id ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                  }`}>
                    {pillar.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 mt-0.5 block font-medium truncate">{pillar.tagline}</span>
                </div>
                <ChevronRight className={`w-4 h-4 text-slate-350 transition-all ${
                  activePillarTab === pillar.id ? 'translate-x-1 text-[#0D9488]' : 'group-hover:translate-x-0.5'
                }`} />
              </button>
            ))}
          </div>

          {/* Large display Card Showcase Right Column */}
          <div className="lg:col-span-8 bg-white rounded-[32px] border border-slate-250/50 p-6 sm:p-10 shadow-sm flex flex-col justify-between transition-all duration-300">
            {WHY_VISIT_PILLARS.filter(p => p.id === activePillarTab).map((p) => (
              <div key={p.id} className="h-full flex flex-col justify-between gap-8 animate-fade-in">
                
                <div className="space-y-4">
                  <div className="inline-block bg-[#0D9488]/10 border border-[#0D9488]/20 text-[#0D9488] text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                    WISATA UTAMA KEPULAUAN • FEATURED PILLAR
                  </div>
                  <h3 className="text-2xl sm:text-3.5xl font-serif font-black text-slate-900 leading-tight">
                    {p.tagline}
                  </h3>
                  <p className="text-slate-550 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                    {p.desc}
                  </p>
                </div>

                {/* Picture Section */}
                <div className="aspect-video w-full rounded-2.5xl overflow-hidden shadow-md relative group">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-5">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> JALUR PARIWISATA PILIHAN • 100% VERIFIED
                    </span>
                  </div>
                </div>

                {/* Sub features Bullet Points */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488]" /> <span>Autentik Lokal</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488]" /> <span>Rute Aman</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488]" /> <span>Tinggi Visibilitas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-[#0D9488]" /> <span>Asli Indonesia ✓</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </section>

      {/* 5. BUSINESS PROFILE (Vision, Mission, Values, & Local UMKM Pledges) */}
      <section id="profile-section" className="py-24 px-6 sm:px-12 bg-[#0F172A] text-white relative overflow-hidden scroll-mt-20">
        
        {/* Soft elegant glowing overlays */}
        <div className="absolute top-1/3 -left-36 w-[450px] h-[450px] rounded-full bg-teal-500/5 blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[150px]"></div>

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Mission & Vision context card panel */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 border border-teal-500/30 bg-[#115E59]/20 rounded-full text-teal-400 text-[10px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-amber-400" /> DIGITAL SAAS PLEDGE
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight leading-tight text-white">
                Memajukan Ekonomi Wisata <br />
                <span className="font-sans italic font-extrabold text-teal-400 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-amber-300">
                  Melalui Inovasi Digital
                </span>
              </h2>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                Kami berkomitmen mendukung pilar perekonomian lokal Bangka Belitung dengan mengintegrasikan keunikan pariwisata maritim dan kuliner UMKM ke dalam portal pemetaan canggih berbasis AI, guna mempermudah wisatawan menyusun rute hemat yang berdampak positif bagi masyarakat.
              </p>

              {/* Grid values pointers */}
              <div className="space-y-4 pt-6 border-t border-slate-800">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-slate-800 rounded-xl text-[#0D9488] shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#0D9488]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-150">PEMBERDAYAAN UMKM KULINER</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Kami memasukkan kedai lempah kuning rumahan, pengrajin cual, dan warkop saring arang tradisi milik putra daerah guna memutar modal perekonomian rill langsung di lapangan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-2.5 bg-slate-800 rounded-xl text-[#D97706] shrink-0">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-150">PELESTARIAN EXOTISME KEBUDAYAAN</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">Kami menghadirkan edukasi adat istiadat peninggalan Melayu Purba dan asimilasi Tionghoa Hakka agar lestari dalam dokumentasi modern.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Vision Mission cards right side */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-[#1E293B]/60 p-7 rounded-[28px] border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-teal-500/20 duration-300">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-bold text-teal-400 uppercase tracking-widest block">VISION STATEMENT</span>
                  <h3 className="text-xl font-serif font-extrabold text-white">Visi Strategis</h3>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed font-sans font-medium">
                    Menjadi hub pariwisata cerdas digital Kepulauan Bangka Belitung terpercaya di kancah global pariwisata laut, melestarikan ekosistem alami laut, memberkali UMKM lokal, dan menyajikan program pemandu cerdas AI termurah di Indonesia.
                  </p>
                </div>
                <div className="pt-6 text-[9px] text-[#0D9488] font-bold tracking-widest uppercase italic block">
                  “ECO-DIGITAL COMPASSION”
                </div>
              </div>

              <div className="bg-[#1E293B]/60 p-7 rounded-[28px] border border-white/5 backdrop-blur-md flex flex-col justify-between hover:border-amber-500/20 duration-300">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block">MISSION STATEMENT</span>
                  <h3 className="text-xl font-serif font-extrabold text-white">Misi Utama</h3>
                  <ul className="space-y-2.5 text-[11.5px] text-slate-300 font-sans font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Menyediakan rujukan harga masuk, jam operasi, dan rute real-time bebas rekayasa.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Mempromosikan tempat tersembunyi non-komersial berkelas dunia secara bertanggung-jawab.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Membantu wisatawan mendapatkan visualisasi budget instan yang efisien dan akuntabel.</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-6 text-[9px] text-amber-400 font-bold tracking-widest uppercase italic block">
                  “CULTURAL SUPPORT ✓”
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* 6. SMART DESTINATION FILTER & DIRECTORY WIDGET (Interactive Frontend Sandbox) */}
      <section id="explore-section" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full scroll-mt-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div className="space-y-2">
            <span className="text-[#0D9488] font-extrabold text-xs tracking-widest block uppercase">INTERACTIVE DIRECTORY</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
              Katalog Wisata Terakreditasi Utama
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Saring puluhan destinasi berlandaskan wilayah pulau dan genre pariwisata kesukaan Anda seketika.
            </p>
          </div>

          {/* Favorites simple indicator for helpful call-outs */}
          <div className="text-[11px] bg-slate-100 text-slate-600 px-4 py-2 rounded-2xl border border-slate-250 italic">
            Tips: Gunakan ikon <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> untuk menyematkan destinasi menarik ke dalam draft favorit.
          </div>
        </div>

        {/* Search Input Bar & Category Filter Buttons Combo */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm mb-10 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Realtime Search Input field */}
            <div className="md:col-span-5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Cari pantai, gangan, pulau lengkuas, danau kaolin..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-205 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:bg-white transition"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-450 text-xs font-bold hover:text-slate-700">Clear</button>
              )}
            </div>

            {/* Island Island filter selector */}
            <div className="md:col-span-4 flex bg-slate-50 p-1 border border-slate-205 rounded-2xl items-center">
              <span className="text-[10px] uppercase font-black tracking-widest text-[#0D9488] pl-3 shrink-0 mr-1.5">Pulau:</span>
              <div className="grid grid-cols-3 w-full gap-1">
                {(['Semua', 'Bangka', 'Belitung'] as const).map(isl => (
                  <button
                    key={isl}
                    onClick={() => setSelectedIslandFilter(isl)}
                    className={`py-1.5 text-[10px] font-black uppercase rounded-xl transition ${
                      selectedIslandFilter === isl ? 'bg-[#0F172A] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isl}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="md:col-span-3 flex bg-slate-50 p-1 border border-slate-205 rounded-2xl items-center text-left">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-600 pl-3 shrink-0 mr-1.5">Tipe:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value as any)}
                className="w-full bg-transparent border-none text-[10px] font-black uppercase text-slate-700 focus:outline-none cursor-pointer pr-2"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Pantai">Pantai</option>
                <option value="Danau">Danau Kaolin</option>
                <option value="Ekowisata">Ekowisata</option>
              </select>
            </div>

          </div>

          {/* Small status line */}
          <div className="flex justify-between text-[11px] text-slate-400 font-medium px-1">
            <span>Ditemukan: <strong className="text-slate-700">{filteredDestinations.length} destinasi</strong> sesuai kriteria filter.</span>
            {(searchQuery || selectedIslandFilter !== 'Semua' || selectedCategoryFilter !== 'Semua') && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIslandFilter('Semua');
                  setSelectedCategoryFilter('Semua');
                }}
                className="text-teal-600 hover:text-teal-850 font-bold underline cursor-pointer"
              >
                Reset Semua Filter
              </button>
            )}
          </div>

        </div>

        {/* Directory Card list grid */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/50">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-bounce" />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pencarian Tidak Diketemukan</p>
            <p className="text-slate-400 text-[11px] mt-1">Coba gunakan kata pencarian universal seperti 'pantai' atau 'kaolin'.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((dest) => {
              const isFav = favorites.some(f => f.id === dest.id);
              return (
                <div 
                  key={dest.id}
                  className="bg-white rounded-[28px] border border-slate-220/60 shadow-xs hover:shadow-xl hover:translate-y-[-5px] transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  
                  {/* Visual card thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                    
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 pointer-events-none">
                      <span className="text-[9px] font-black text-slate-800 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-2xs">
                        PULAU {dest.island.toUpperCase()}
                      </span>
                    </div>

                    <div className="absolute top-3.5 right-3.5">
                      <button
                        onClick={() => handleToggleFavorite(dest)}
                        className={`p-2 rounded-xl transition shadow-sm cursor-pointer ${
                          isFav 
                            ? 'bg-rose-50 text-rose-605 scale-110' 
                            : 'bg-white/80 backdrop-blur-md text-slate-600 hover:text-rose-550 hover:bg-white'
                        }`}
                        title={isFav ? "Hapus dari Favorit" : "Sematkan ke Favorit"}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-505' : 'text-current'}`} />
                      </button>
                    </div>

                    <div className="absolute bottom-3.5 left-3.5">
                      <span className="text-[9px] font-extrabold text-[#0D9488] bg-teal-50 shadow-2xs px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {dest.category}
                      </span>
                    </div>
                  </div>

                  {/* Body textual list */}
                  <div className="p-5.5 flex-1 flex flex-col justify-between space-y-4">
                    
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center text-amber-500 font-extrabold text-[11px] bg-amber-500/5 px-2.5 py-1 rounded-md self-start w-fit">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {dest.rating.toFixed(1)}
                        </span>
                        <span className="text-slate-400 ml-1.5 text-[9px] font-bold">({dest.reviewsCount} Ulasan)</span>
                      </div>

                      <h3 className="font-serif font-black text-lg text-slate-900 leading-snug group-hover:text-teal-700 duration-300">{dest.name}</h3>
                      <p className="text-slate-500 text-[11.5px] leading-relaxed font-sans font-medium">{dest.desc}</p>
                    </div>

                    {/* Operational Details Line */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10.5px] text-slate-550 font-medium">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{dest.estimatedBudget}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{dest.operationalHours}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => onNavigateToAuth('register', 'premium')}
                        className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl font-bold text-[10.5px] text-slate-700 text-center uppercase tracking-wider cursor-pointer border border-slate-205"
                      >
                        Add to Planner
                      </button>
                      <button
                        onClick={() => onNavigateToAuth('login')}
                        className="py-2.5 px-3 bg-[#0F172A] hover:bg-teal-950 text-white rounded-xl font-bold text-[10.5px] text-center uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detail
                      </button>
                    </div>

                  </div>

                </div>
              )
            })}
          </div>
        )}

      </section>

      {/* 7. AI TRAVEL PLANNER & TIMELINE BUDGET ESTIMATOR SIMULATOR */}
      <section id="itinerary-simulator-section" className="py-24 px-6 sm:px-12 bg-slate-50 border-y border-slate-200/60 scroll-mt-20">
        <div className="max-w-6xl mx-auto w-full">
          
          <div className="text-center max-w-2.5xl mx-auto mb-16 space-y-3">
            <span className="text-amber-600 font-extrabold text-xs tracking-widest block uppercase">AI TRAVEL ASSISTANT SIMULATOR</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-zero">
              Uji Coba Pintar AI Trip Planner & Itinerary
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Eksperimen langsung dengan pengatur rute cerdas kami. Pilih preferensi liburan serta budget Anda di bawah ini untuk melihat contoh alur perjalanan harian riil!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Box: Control Desk */}
            <div className="lg:col-span-5 bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between gap-6 shadow-sm">
              
              <div className="space-y-6">
                <div>
                  <span className="bg-[#115E59]/10 text-teal-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mb-2">INTELLIGENT SELECTION PANEL</span>
                  <h3 className="text-xl font-serif font-black text-slate-900">Konfigurator Perjalanan</h3>
                  <p className="text-[11.5px] text-slate-400 font-medium leading-relaxed mt-1">Sistem kami menghitung logistik, menyaring jarak tempuh optimal, dan menyelisik restoran halal terbaik untuk Anda secara digital.</p>
                </div>

                {/* Mood Selection Row icons / labels (Romantic, Family, Healing, Adventure) */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">1. Pilih Mood & Vibe Liburan:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPlannerMood('healing')}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        plannerMood === 'healing' 
                          ? 'border-[#0D9488] bg-[#0D9488]/5 text-slate-900' 
                          : 'border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black tracking-wide block leading-none uppercase">Healing & Relax</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 block leading-none">Pantai Tenang, Santai</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPlannerMood('adventure')}
                      className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        plannerMood === 'adventure' 
                          ? 'border-[#0D9488] bg-[#0D9488]/5 text-slate-900' 
                          : 'border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="text-[11px] font-black tracking-wide block leading-none uppercase">Adventure Vibe</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 block leading-none">Eksplor Tebing, Danau</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Budget Selection */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">2. Tentukan Alokasi Anggaran:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPlannerBudget('budget')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        plannerBudget === 'budget' 
                          ? 'border-slate-800 bg-slate-900 text-white' 
                          : 'border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1 rounded-md bg-[#0D9488]/10 text-[#0D9488] shrink-0">
                        <Waves className="w-3.5 h-3.5 text-emerald-505" />
                      </div>
                      <div>
                        <span className="text-[10.5px] font-black tracking-wide block uppercase">Smart Budget</span>
                        <span className="text-[8px] text-slate-405 mt-0.5 block leading-none">Hemat Rinci, Sewa Motor</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setPlannerBudget('luxury')}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                        plannerBudget === 'luxury' 
                          ? 'border-slate-800 bg-slate-900 text-white' 
                          : 'border-slate-200 bg-transparent text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-amber-505" />
                      </div>
                      <div>
                        <span className="text-[10.5px] font-black tracking-wide block uppercase">Luxury Reserve</span>
                        <span className="text-[8px] text-slate-405 mt-0.5 block leading-none">Villa Pantai, Yacht Privat</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Day selector */}
                <div className="space-y-2 select-none">
                  <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">3. Urutan Hari Perjalanan:</span>
                  <div className="flex bg-slate-100 p-1 border rounded-2xl w-full">
                    {([1, 2, 3] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setActivePlanDay(d)}
                        className={`flex-1 py-2 text-xs font-black rounded-xl transition cursor-pointer ${
                          activePlanDay === d ? 'bg-[#0D9488] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        HARI KE-{d}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Box Cost Display */}
              <div className="bg-[#FAF9F6] border border-amber-500/10 p-4.5 rounded-2.5xl space-y-1.5 mt-auto">
                <span className="text-[9px] font-mono font-bold text-amber-600 block uppercase tracking-widest">TOTAL ESTIMATED BUDGET (PAX)</span>
                <span className="text-xl sm:text-2xl font-serif font-black text-slate-900 block leading-none">{simulatedPlannerData.totalEstimasi}</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-bold font-sans">Saran AI: <span className="font-medium text-slate-500">{simulatedPlannerData.tips}</span></p>
              </div>

            </div>

            {/* Right Box: Dynamic Timeline display layout (Timeline-based travel planner UI) */}
            <div className="lg:col-span-12 xl:col-span-7 bg-white rounded-[32px] border border-slate-205/50 p-6 sm:p-9 shadow-sm flex flex-col justify-between">
              
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-100 pb-3.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-[#0D9488]" />
                    <span className="font-serif font-bold text-slate-900 text-lg uppercase tracking-tight">Timeline Rincian Hari Ke-{activePlanDay}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase">Dihitung Instan ✓</span>
                </div>

                {/* Vertical Timeline element tree */}
                <div className="space-y-6 relative pl-4 border-l border-slate-200">
                  
                  {activeTimeline.map((act, idx) => (
                    <div key={idx} className="relative group/timeline">
                      {/* Interactive dot */}
                      <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0D9488] ring-4 ring-teal-50 group-hover/timeline:scale-125 duration-200"></div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10.5px] font-black text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-md">{act.time} WIB</span>
                          <span className="text-[10px] font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-405" /> {act.location}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover/timeline:text-[#0D9488] duration-200">{act.activity}</h4>
                        
                        <div className="flex gap-4 text-[10px] text-slate-405 pt-1">
                          <span>Durasi: <strong className="text-slate-600">{act.duration}</strong></span>
                          <span>Estimasi Biaya: <strong className="text-slate-600">{act.cost}</strong></span>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>

              </div>

              {/* Call to action panel at Bottom of timeline */}
              <div className="pt-6 border-t border-slate-100 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[10.5px] text-slate-400 font-bold leading-normal font-sans">
                  *Pusat data diolah berdasarkan kalkulator rute riil dan pengalokasian bahan bakar. Untuk koordinasi rute tak terbatas, silakan buat akun premium.
                </span>
                <button
                  onClick={() => onNavigateToAuth('register', 'premium')}
                  className="px-6 py-3 bg-[#0D9488] hover:bg-teal-950 text-white rounded-xl font-black text-[10px] uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Rancang Itinerary Pribadi Anda
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8. POPULAR CULINARY RECOMMENDATION GRID */}
      <section id="culinary-section" className="py-24 px-6 sm:px-12 max-w-6xl mx-auto w-full scroll-mt-20">
        
        <div className="text-center max-w-2.5xl mx-auto mb-16 space-y-3">
          <span className="text-teal-700 font-extrabold text-xs tracking-widest block uppercase">CULINARY EXPERIENCES</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight leading-tight">
            Sensasi Kuliner Warisan Tradisional
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium font-sans">
            Eksplorasi cita rasa tinggi yang bersumber langsung dari jaring nelayan lokal Melayu, warkop legenda saring arang arsitektur kolonial, dan bumbu luhur warisan keluarga.
          </p>
        </div>

        {/* Categories of food grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LANDING_CULINARY.map((cul) => (
            <div 
              key={cul.id}
              className="bg-white rounded-[28px] border border-slate-200/60 shadow-xs hover:shadow-xl hover:translate-y-[-4px] duration-300 overflow-hidden flex flex-col justify-between group"
            >
              
              {/* Thumbnail image with premium label overlay if applicable */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                <img src={cul.image} alt={cul.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[9px] font-black bg-white text-slate-800 px-2 py-0.5 rounded uppercase tracking-wider">
                    {cul.category}
                  </span>
                  {cul.isPremium && (
                    <span className="text-[9px] font-black bg-emerald-600 text-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider shadow-xs">
                      ★ REK_UTAMA
                    </span>
                  )}
                </div>
              </div>

              {/* Title & info box description */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#0D9488] uppercase tracking-wider bg-teal-50 px-2 py-0.5 rounded">Kuliner Bangka Belitung</span>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500" /> {cul.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="font-serif font-black text-sm sm:text-base text-slate-900 leading-snug group-hover:text-teal-700 duration-300">{cul.name}</h3>
                  <p className="text-slate-450 text-[11px] leading-relaxed line-clamp-2">{cul.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-505 font-medium">
                    <span>Estimasi Biaya:</span>
                    <strong className="text-slate-700">{cul.priceEstimate}</strong>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-505 font-medium">
                    <span>Masa Operasi:</span>
                    <strong className="text-slate-700">{cul.hours}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onNavigateToAuth('register', 'premium')}
                    className="w-full py-2 bg-slate-850 hover:bg-[#0D9488] text-white hover:text-white rounded-xl font-bold text-[10px] text-center uppercase tracking-wider transition cursor-pointer"
                  >
                    Buka Rute & Menu Rahasia
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. HIGH EXCLUSIVITY LEAFLET INTERACTIVE GIS ARCHIPELAGO MAP */}
      <section id="map-section" className="py-24 px-6 sm:px-12 bg-slate-950 text-white relative border-t border-slate-900 scroll-mt-20">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-amber-400 font-extrabold text-xs tracking-widest block uppercase">GEOGRAPHICAL MAP EXPLORER</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-tight text-white leading-tight">
              Peta Eksplorasi Kepulauan Interaktif
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed max-w-2xl mx-auto">
              Telusuri kepulauan Bangka dan Belitung melalui GIS interaktif real-time. Ketuk pin destinasi atau landmark hidangan khas untuk pratinjau letak administratif.
            </p>
          </div>

          <div className="w-full">
            <TravelMap 
              darkMode={true} 
              spots={[
                ...LANDING_DESTINATIONS.map(d => ({
                  id: d.id,
                  nama: d.name,
                  lokasi: d.island,
                  kategori: d.category,
                  desc: d.desc,
                  imageUrl: d.image,
                  rating: d.rating,
                  wilayah: d.island as 'Bangka' | 'Belitung',
                  tipe: 'wisata' as const
                })),
                ...LANDING_CULINARY.map(c => ({
                  id: c.id,
                  nama: c.name,
                  lokasi: c.category,
                  kategori: "Kuliner Tradisional",
                  desc: c.desc,
                  imageUrl: c.image,
                  rating: 4.8,
                  wilayah: (c.id === 'k2' || c.id === 'k4' || c.id === 'k6' || c.id === 'w15' || c.id === 'w16') ? 'Belitung' as const : 'Bangka' as const,
                  tipe: 'kuliner' as const
                }))
              ]}
              onSelectSpot={(s) => {
                // Focus element dynamically or update state if needed
              }}
              premiumUser={false}
            />
          </div>
        </div>
      </section>

      {/* 10. PREMIUM EXPERIENCE & CALL TO ACTION SECTION */}
      <section id="premium-highlights-section" className="py-24 px-6 sm:px-12 bg-slate-950 text-white relative">
        <div className="absolute inset-0 bg-radial-gradient from-[#115E59]/10 via-transparent to-transparent opacity-60"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 col">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-radial border border-amber-500/25 rounded-full text-amber-300 text-[10.5px] font-black uppercase tracking-wider mx-auto animate-pulse">
            <Zap className="text-amber-400 fill-amber-400 w-3.5 h-3.5" /> Dapatkan Layana Eksklusif Member Premium
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight text-white max-w-2xl mx-auto">
              Bebaskan Petualangan Anda Tanpa Hambatan Akses
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto font-sans font-medium">
              Satu kali pendaftaran dengan kontribusi lokal Rp29.000 (bekali UMKM selama 2 bulan) meluaskan seluruh fitur canggih tak terbatas:
            </p>
          </div>

          {/* Premium cards values checklists mapping */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left pt-3">
            
            <div className="p-5.5 bg-white/[0.02] border border-white/[0.06] rounded-2.5xl flex items-start gap-3.5 hover:border-teal-500/25 transition">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">AI TRAVEL CONSULTANT</h4>
                <p className="text-[10px] text-slate-405 leading-relaxed">Pintu tanya jawab tak terbatas didukung memori lokal menyangkut rekomendasi hotel & warung kuliner asli peninggalan daerah.</p>
              </div>
            </div>

            <div className="p-5.5 bg-white/[0.02] border border-white/[0.06] rounded-2.5xl flex items-start gap-3.5 hover:border-teal-500/25 transition">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">COMPLETE CULINARY MAP</h4>
                <p className="text-[10px] text-slate-405 leading-relaxed">Membuka list warung non-kompetitif legendaris (Kong Djie 1943, Lempah Kuning Muara, Mi Atep, Kedai Kopi Tung Tau).</p>
              </div>
            </div>

            <div className="p-5.5 bg-white/[0.02] border border-white/[0.06] rounded-2.5xl flex items-start gap-3.5 hover:border-teal-500/25 transition">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">EXPERT BUDGET COUNTER</h4>
                <p className="text-[10px] text-slate-405 leading-relaxed">Perhitungan harga tiket, sewa mobil mandiri maupun kapal sharing boat untuk island hopping secara otomatis harian.</p>
              </div>
            </div>

          </div>

          <div className="pt-6">
            <button
              onClick={() => onNavigateToAuth('register', 'premium')}
              className="px-10 py-4.5 bg-gradient-to-tr from-teal-500 via-[#0D9488] to-emerald-600 hover:scale-[1.03] transition-transform text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl cursor-pointer"
            >
              Registrasi Premium — Rp29.000 (Aktif 2 Bulan)
            </button>
            <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-3">PROSES SECARA INSTAN • VERIFIKASI LANGSUNG</span>
          </div>

        </div>
      </section>

      {/* 11. FOOTER SECTION WITH PLEDGE */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6 sm:px-12 border-t border-slate-900 relative z-10 text-left">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo lightBackground={false} scrolled={false} />
            </div>
            <p className="text-xs text-slate-450 leading-relaxed font-medium">
              Satu-satunya portal kepulauan modern yang menjembatani keindahan pesona bahari Nusantara dengan efisiensi integrasi digital.
            </p>
            <div className="text-[10px] text-[#0D9488] font-mono tracking-normal bg-[#0D9488]/10 px-3.5 py-2 rounded-lg border border-teal-500/20 inline-block font-bold">
              🧭 Lat: 2.6167° S • Lon: 107.9125° E
            </div>
          </div>

          <div>
            <span className="block text-[10px] font-black text-slate-200 uppercase tracking-widest mb-4">Navigasi Utama</span>
            <ul className="space-y-2.5 text-xs text-slate-405">
              <li><a href="#why-visit-section" className="hover:text-teal-400 transition">Why Visit Bangka Belitung</a></li>
              <li><a href="#profile-section" className="hover:text-teal-400 transition">About Us & Misi Lokal</a></li>
              <li><a href="#explore-section" className="hover:text-teal-400 transition">Katalog Wisata</a></li>
              <li><a href="#itinerary-simulator-section" className="hover:text-teal-400 transition">AI Planner Preview</a></li>
            </ul>
          </div>

          <div>
            <span className="block text-[10px] font-black text-slate-200 uppercase tracking-widest mb-4">Misi Kemasyarakatan</span>
            <ul className="space-y-2.5 text-xs text-slate-405">
              <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer">
                <Instagram className="w-4 h-4 text-slate-500 shrink-0" /> @babel.trip
              </li>
              <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer">
                <Globe className="w-4 h-4 text-slate-500 shrink-0" /> www.babel-trip.gov
              </li>
              <li className="flex items-center gap-1.5 hover:text-teal-400 cursor-pointer">
                <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" /> Pusat Hubungi & Support
              </li>
            </ul>
          </div>

          <div>
            <span className="block text-[10px] font-black text-slate-200 uppercase tracking-widest mb-4">Keamanan Transaksi</span>
            <p className="text-xs text-slate-405 leading-relaxed mb-3">
              Kompensasi dana kontribusi Rp29.000 dialirkan langsung kepada perhimpunan UMKM kuliner peninggalan daerah.
            </p>
            <div className="flex items-center gap-2 bg-[#0F172A] p-2 rounded-xl border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span className="text-[10px] text-slate-400 font-bold font-mono uppercase tracking-wider">Cloud Security Guard Active</span>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-900 text-[10.5px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <p>© 2026 BABEL.trip Luxury Travel Portal. Seluruh Hak Cipta Dilindungi.</p>
          <p className="text-[10px] text-slate-450">
            Komitmen bersama: Jagalah kelestarian alam terumbu karang dengan tidak membuang sampah plastik di area kepulauan 🏖️
          </p>
        </div>
      </footer>

    </div>
  );
}
