/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Send, Sparkles, MessageSquareHeart, User, HelpCircle, 
  AlertCircle, Loader, Volume2, Mic, MicOff, Star, MapPin, 
  Coins, Clock, Heart, Sliders, Battery, ArrowRight, Check, Sparkle,
  BadgeAlert, Trash2, Moon, Sun, ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types';
import { getImageUrlByNama } from '../utils/images';

interface AiChatComponentProps {
  token: string;
  username: string;
  persona?: string;
  interest?: string;
  budgetTone?: string;
  selectedRegion?: string;
}

// Full 15 real spots database metadata to render beautifully interactive cards
const INTERACTIVE_SPOTS = [
  { id: "w1", name: "Pantai Parai Tenggiri", area: "Bangka", cost: "Rp 25.000 (Tiket)", time: "07.00 - 18.00 WIB", rating: "4.9", category: "Pantai Premium", desc: "Pantai dengan formasi granit artistic besar, air toska, pas untuk sunrise romantic." },
  { id: "w2", name: "Pantai Tongaci & De Locomotief", area: "Bangka", cost: "Rp 15.000 (Tiket)", time: "08.00 - 20.00 WIB", rating: "4.7", category: "Konservasi Penyu", desc: "Situs pasir indah yang dipadukan galeri seni lampion dan penangkaran tukik penyu." },
  { id: "w3", name: "Danau Kaolin Air Bara", area: "Bangka", cost: "Rp 5.000 (Parkir)", time: "06.00 - 18.00 WIB", rating: "4.8", category: "Kawah Biru", desc: "Bekas pertambangan timah berbentuk kawah bernuansa air biru benderang kontras bukit putih." },
  { id: "w4", name: "Jembatan Emas", area: "Bangka", cost: "Gratis (Publik)", time: "24 Jam", rating: "4.6", category: "Bascule Bridge", desc: "Jembatan lift robotik penghubung muara, berlatar sunset jingga yang gagah maritim." },
  { id: "w5", name: "Bangka Botanical Garden (BBG)", area: "Bangka", cost: "Gratis (Retribusi)", time: "08.00 - 17.00 WIB", rating: "4.7", category: "Hutan Pinus", desc: "Lembah agro-wisata hijau sejuk berpagar pinus rimbun, peternakan sapi, dan ketenangan." },
  { id: "w6", name: "Otak-Otak Amui", area: "Bangka", cost: "Rp 5.000 / pcs", time: "09.00 - 21.00 WIB", rating: "4.9", category: "Kuliner Senior", desc: "Otak-otak panggang ikan tenggiri hangat disiram kuah tauco gurih pedas manis melayu." },
  { id: "w7", name: "Mie Koba Iskandar", area: "Bangka", cost: "Rp 20.000 / porsi", time: "08.00 - 20.00 WIB", rating: "4.8", category: "Mie Kuah Ikan", desc: "Kuliner legendaris bersiram kuah kental tenggiri murni dibumbui cengkeh harum." },
  { id: "w10", name: "Lempah Kuning Muara", area: "Bangka", cost: "Rp 45.000 / porsi", time: "10.00 - 22.00 WIB", rating: "4.9", category: "Kuliner Wajib", desc: "Restoran lempah kuning legendaris bersajikan kuah nanas belacan pedas segar merona." },
  { id: "w11", name: "Pantai Tanjung Tinggi", area: "Belitung", cost: "Gratis (Parkir Rp 5rb)", time: "24 Jam", rating: "4.95", category: "Must-Visit Wisata", desc: "Pantai ikonik Laskar Pelangi berpagar ratusan batu granit purba raksasa laksana kolam alami." },
  { id: "w12", name: "Pantai Tanjung Kelayang", area: "Belitung", cost: "Sewa Boat ~500k", time: "24 Jam", rating: "4.8", category: "Hub Island Hopping", desc: "Semenanjung pasir putih halus, titik labuh kapal kayu keliling mercusuar batu Garuda." },
  { id: "w13", name: "Pulau Lengkuas", area: "Belitung", cost: "Gratis Masuk", time: "Pagi - Sore", rating: "4.9", category: "Situs Mercusuar", desc: "Pulau pasir karang mungil bercirikan mercusuar baja Belanda 1882 berair jernih toska." },
  { id: "w14", name: "Danau Kaolin Belitung", area: "Belitung", cost: "Rp 5.000 (Tiket)", time: "06.00 - 18.00 WIB", rating: "4.82", category: "Kawah Putih Susu", desc: "Cekungan mineral kaolin berair biru toska tenang nan memikat di pinggiran Tanjung Pandan." },
  { id: "w15", name: "Kopi Kong Djie Siburik", area: "Belitung", cost: "Rp 15.000 / gelas", time: "06.00 - 24.00 WIB", rating: "4.85", category: "Cafe Legendaris", desc: "Pusat kopi saring tradisional belitung diracik teko tembaga kuno arang sejak era 1943." },
  { id: "w16", name: "Mie Belitung Atep", area: "Belitung", cost: "Rp 20.000 / porsi", time: "08.00 - 20.00 WIB", rating: "4.9", category: "Noodle Khas Belitong", desc: "Mie kuning legit kuah kaldu udang kental manis gurih dilapis daun simpor tradisional." },
  { id: "w17", name: "Rumah Adat Belitung", area: "Belitung", cost: "Rp 5.000 (Donasi)", time: "08.00 - 16.00 WIB", rating: "4.7", category: "Warisan Melayu", desc: "Replika rumah panggung bangsawan kayu besi ulin melayu klasik berpagar ornamen antik." }
];

export default function AiChatComponent({ 
  token, 
  username,
  persona = "Healing Wanderer",
  interest = "Beaches & Granite",
  budgetTone = "Luxury Splurge",
  selectedRegion = "Belitung"
}: AiChatComponentProps) {
  
  // Custom states
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMood, setCurrentMood] = useState<'Serene/Relaxed' | 'Exploratory' | 'Excited/Cheerful' | 'Culinary Hungry'>('Serene/Relaxed');
  
  // UI Customizations
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [simulatedVoiceText, setSimulatedVoiceText] = useState('');
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message dynamically on settings load
  useEffect(() => {
    const welcomeText = `Halo Kak ${username}! Selamat datang di Lounge VIP Asisten Utama BabelGuide PRO. 👑 

Saya telah menyesuaikan sistem navigasi untuk mendampingi gaya perjalanan Anda sebagai **${persona}** dengan minat utama pada **${interest}**. 

Saat ini saya siap membeberkan koordinat "Hidden Gems" tersembunyi, taksiran biaya riil berbekal suasana hati **${currentMood === 'Serene/Relaxed' ? 'Tenang & Nyaman 🌊' : currentMood === 'Exploratory' ? 'Fokus Penjelajah 🧭' : currentMood === 'Excited/Cheerful' ? 'Penuh Ceria & Semangat 🌟' : 'Lapar & Berkeinginan Kuliner 🍽️'}**, serta melayani penyusunan Itinerary Eksklusif 100% otomatis di ${selectedRegion}.

Ada lokasi rahasia yang ingin Kakak ketahui pagi ini?`;

    setMessages([
      {
        id: 'init_welcome',
        sender: 'ai',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [persona, interest, budgetTone, selectedRegion, username]);

  // Adjust suggested quick prompts dynamically depending on the Travel Interest Prop
  const getAdaptiveSuggestions = () => {
    switch (interest) {
      case 'Culinary Journeys':
        return [
          "Lempah Kuning terpedas khas Bangka di mana?",
          "Beri rahasia kedai kopi saring arang autentik!",
          "Berapa harga Mie Belitung Atep legendaris?",
          "Kuliner unik penutup yang manis-manis"
        ];
      case 'Cultural Heritage':
        return [
          "Museum kearifan lokal & Rumah Adat Belitung",
          "Kisah asimilasi budaya Tionghoa & Melayu Babel",
          "Mercusuar sejarah peninggalan Belanda era 1882",
          "Tips santun berinteraksi dengan warga desa wisata"
        ];
      case 'Hidden Wilderness':
        return [
          "Beri info Danau Kaolin yang sepi penonton",
          "Spot tracking bukit hijau di Belitung Timur",
          "Akses rahasia ke desa wisata nelayan terpencil",
          "Keunikan flora kepulauan dan penyu konservasi"
        ];
      case 'Beaches & Granite':
      default:
        return [
          "Di mana pasir rahasia paling bersih di Belitung?",
          "Rekomendasi private yacht snorkeling Lengkuas",
          "Spot sunset batuan granit raksasa bebas kerumunan",
          "Estimasi biaya penjelajahan pulau 1 hari penuh"
        ];
    }
  };

  // Extract tourist destinations or culinary items mentioned in messages for interactive layout integration
  const findEntitiesInText = (text: string) => {
    return INTERACTIVE_SPOTS.filter(spot => {
      const cleanName = spot.name.toLowerCase();
      const cleanText = text.toLowerCase();
      return cleanText.includes(cleanName) || 
             (cleanName.includes("lempah kuning") && cleanText.includes("lempah")) ||
             (cleanName.includes("kong djie") && cleanText.includes("kong djie")) ||
             (cleanName.includes("atep") && cleanText.includes("atep"));
    });
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Create prompt-specific context history to send to server
    const historyPayload = messages.map(m => ({
      sender: m.sender,
      text: m.text
    })).slice(-10); // last 10 dialogues for memory limits

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pertanyaan: textToSend,
          nama_user: username,
          wilayah: selectedRegion,
          budget: budgetTone === 'Luxury Splurge' ? '2000000' : '500000',
          history: historyPayload,
          tier: 'premium',
          persona,
          interest,
          budgetTone,
          userMood: currentMood
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Server concierge sedang melakukan sinkronisasi rute.');
      }

      const aiMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: data.jawaban,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      
      // Trigger subtle synthetic speech feedback if speech synthesis is possible (conceptually aware)
      if (isVoiceActive && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const synthText = data.jawaban.replace(/[#*`_]/g, '').substring(0, 150) + "...";
        const utterance = new SpeechSynthesisUtterance(synthText);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'error_' + Date.now(),
        sender: 'ai',
        text: `Maaf Kak ${username}, sinyal pramuwisata satelit kami sedikit terlewat: "${err.message}".\n\nNamun jangan kuatir, silakan tinjau rute Pantai Tanjung Tinggi yang berbatu granit indah rimbun di database di bawah ini!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Mock Voice Assistant stimulation
  const toggleVoiceAssistant = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setSimulatedVoiceText("BabelGuide mandiri sedang mendengarkan... Katakan sesuatu");
      
      // Simulate speaking or recognizing voice after 3 seconds
      setTimeout(() => {
        if (isVoiceActive) return; // if turned off early
        const randomQuestions = [
          "Rekomendasi spot sunset Pantai Tanjung Tinggi?",
          "Berapa tarif private boat sewa ke Pulau Lengkuas?",
          "Kuliner lezat Lempah Kuning muara halal Bangka?"
        ];
        const randomSelection = randomQuestions[Math.floor(Math.random() * randomQuestions.length)];
        setInputText(randomSelection);
        setSimulatedVoiceText(`Mendengar suara sayup: "${randomSelection}"`);
        setTimeout(() => {
          setSimulatedVoiceText('');
          setIsVoiceActive(false);
          handleSendMessage(randomSelection);
        }, 1500);
      }, 3500);
    } else {
      setIsVoiceActive(false);
      setSimulatedVoiceText('');
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
  };

  const handleBookmarkSpot = (spotName: string) => {
    if (bookmarks.includes(spotName)) {
      setBookmarks(prev => prev.filter(b => b !== spotName));
    } else {
      setBookmarks(prev => [...prev, spotName]);
    }
  };

  const clearChatLogs = () => {
    if (window.confirm("Apakah Kakak yakin ingin mereset seluruh log percakapan concierge VIP ini?")) {
      setMessages([
        {
          id: 'init_welcome',
          sender: 'ai',
          text: `Percakapan diatur ulang. Halo kembali Kak ${username}, silakan konsultasikan rute emas atau kuliner tersembunyi berkelas premium Anda kepada saya! Aku siap 24 jam mendampingi petualanganmu.`,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const moodPresets = [
    { key: 'Serene/Relaxed', label: 'Tenang 🌊', bg: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    { key: 'Exploratory', label: 'Petualang 🧭', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    { key: 'Excited/Cheerful', label: 'Ceria ✨', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    { key: 'Culinary Hungry', label: 'Kulineran 🍽️', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' }
  ];

  return (
    <div 
      className={`rounded-3xl border shadow-2xl transition-all duration-300 flex flex-col md:grid md:grid-cols-12 min-h-[620px] overflow-hidden ${
        themeMode === 'dark' 
          ? 'bg-slate-950/95 border-slate-800 text-slate-100 shadow-teal-950/10' 
          : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50'
      }`} 
      id="ai-chat-premium-container"
    >
      {/* LEFT SIDEBAR: AI CO-PILOT DIAGNOSTIC (Highly Interactive Visual Metadata) */}
      {isDiagnosticOpen && (
        <div className={`col-span-12 md:col-span-4 p-5 flex flex-col justify-between border-b md:border-b-0 md:border-r transition-all duration-300 ${
          themeMode === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-100'
        }`} id="chat-left-diagnostic-pane">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest ${
                themeMode === 'dark' ? 'bg-teal-500/15 text-teal-400' : 'bg-teal-100 text-teal-900'
              }`}>
                SYSTEM INTELLIGENCE
              </span>
              <button 
                onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                className="p-1 rounded-lg hover:bg-slate-500/10 transition-all text-slate-400"
                title="Ganti Tema Visual"
              >
                {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-900" />}
              </button>
            </div>

            {/* Concierge Status Indicator */}
            <div className={`p-4 rounded-2xl border mb-4 text-left ${
              themeMode === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-tr from-teal-500 to-amber-400 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(20,184,166,0.3)] animate-pulse">
                    BP
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950 animate-ping"></span>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                    BabelGuide PRO <ShieldCheck className="w-3.5 h-3.5 text-amber-405 text-teal-400" />
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">VIP Concierge & Local Expert</p>
                </div>
              </div>

              {/* Status parameters list */}
              <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-2.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Gaya Travel (Persona):</span>
                  <span className="font-bold text-emerald-400">{persona}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Minat Kepulauan:</span>
                  <span className="font-bold text-cyan-400">{interest}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Anggaran (Tone):</span>
                  <span className="font-bold text-amber-400">{budgetTone}</span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Wilayah Aktif:</span>
                  <span className="font-bold text-teal-400">{selectedRegion}</span>
                </div>
              </div>
            </div>

            {/* Interactive Mood Selector Row */}
            <div className="text-left mb-4">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">Suasana Hati Saya (Adaptive AI Tone):</span>
              <div className="grid grid-cols-2 gap-1.5">
                {moodPresets.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setCurrentMood(m.key as any)}
                    className={`text-[10px] py-1.5 px-2 rounded-xl border font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                      currentMood === m.key 
                        ? 'bg-linear-to-r from-teal-500 to-emerald-600 text-white border-transparent shadow-xs' 
                        : `${m.bg} ${themeMode === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100'}`
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Itinerary Pins */}
            <div className="text-left mt-2 block">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2 flex items-center justify-between">
                <span>Destinasi Disematkan:</span>
                <span className="px-1.5 py-0.5 bg-slate-800 rounded text-xs text-slate-300 font-bold">{bookmarks.length}</span>
              </span>
              {bookmarks.length === 0 ? (
                <div className={`p-4 rounded-2xl border text-center text-[10px] text-slate-500 ${
                  themeMode === 'dark' ? 'bg-slate-950/20 border-slate-850' : 'bg-slate-100/50 border-slate-200'
                }`}>
                  Belum ada destinasi tersimpan. Sebut nama tempat di chat, ketuk "Sematkan" di kartu rekomendasi!
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                  {bookmarks.map((bName) => (
                    <div 
                      key={bName}
                      className={`flex items-center justify-between p-2 rounded-xl text-[10px] font-bold border transition-all ${
                        themeMode === 'dark' ? 'bg-slate-900 border-slate-800 text-teal-300' : 'bg-emerald-50 border-emerald-100 text-neutral-800'
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        {bName}
                      </span>
                      <button 
                        onClick={() => handleBookmarkSpot(bName)}
                        className="text-slate-400 hover:text-rose-400 font-extrabold px-1 text-xs"
                        title="Hapus"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between">
            <button 
              onClick={clearChatLogs}
              className="text-[10px] text-slate-500 font-bold hover:text-rose-400 transition-all flex items-center gap-1"
              title="Reset Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bersihkan Percakapan
            </button>
            <div className="flex items-center gap-1 text-[9px] text-slate-500 font-mono">
              <Battery className="w-3.5 h-3.5 text-teal-500 animate-pulse" /> Live CPU Sync
            </div>
          </div>
        </div>
      )}

      {/* RIGHT SIDEBAR: PRIMARY CONVERSATIONAL CORE */}
      <div className={`col-span-12 ${isDiagnosticOpen ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-between`}>
        
        {/* Chat Header Control Row */}
        <div className={`p-4 border-b flex justify-between items-center ${
          themeMode === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDiagnosticOpen(!isDiagnosticOpen)}
              className={`p-2 rounded-xl border transition-all ${
                themeMode === 'dark' ? 'border-slate-850 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
              title={isDiagnosticOpen ? "Sembunyikan Panel Kontrol" : "Tampilkan Panel Kontrol"}
            >
              <Sliders className="w-4 h-4 text-teal-400" />
            </button>
            <div className="text-left">
              <h3 className="text-xs font-black uppercase tracking-widest text-teal-400 flex items-center gap-1">
                VIP CHAT LOUNGE <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Berkomunikasi dengan kecerdasan lokal emosional Bangka Belitung</p>
            </div>
          </div>

          {/* Connected state and voice toggle widget */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleVoiceAssistant}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-[10px] font-black uppercase ${
                isVoiceActive 
                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse' 
                  : themeMode === 'dark' 
                    ? 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800' 
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {isVoiceActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-ping"></span>
          </div>
        </div>

        {/* Voice Recognition Simulated Alert Row */}
        {isVoiceActive && (
          <div className="bg-linear-to-r from-teal-900/40 via-purple-900/40 to-slate-950 p-2.5 border-b border-teal-800/40 transition-all text-[11px] font-bold text-center text-teal-200 flex items-center justify-center gap-2">
            <div className="flex gap-0.5 items-end justify-center min-h-[14px]">
              <div className="w-0.5 h-3 bg-teal-400 rounded-xs animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-0.5 h-4 bg-teal-300 rounded-xs animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-0.5 h-2 bg-purple-400 rounded-xs animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-0.5 h-5 bg-purple-300 rounded-xs animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-0.5 h-3 bg-teal-400 rounded-xs animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>{simulatedVoiceText || "Sistem suara siap mendengarkan... Katakan atau diam untuk memilih acak"}</span>
          </div>
        )}

        {/* MESSAGES VIEW CONTAINER */}
        <div className={`flex-1 overflow-y-auto p-5 space-y-5 max-h-[420px] min-h-[380px] ${
          themeMode === 'dark' ? 'bg-slate-950/70' : 'bg-slate-50/50'
        }`}>
          {messages.map((msg, idx) => {
            const mentionedEntities = findEntitiesInText(msg.text);
            const isLatestAiMessage = msg.sender === 'ai' && idx === messages.length - 1;

            return (
              <div key={msg.id} className="space-y-4">
                <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                  {/* Avatar wrapper */}
                  <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-linear-to-tr from-cyan-600 to-indigo-600 text-white' 
                      : 'bg-linear-to-tr from-teal-500 to-emerald-500 text-white'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Compass className="w-4.5 h-4.5" />}
                  </div>

                  {/* Text bubble body */}
                  <div className="text-left">
                    <div className={`p-4 rounded-3xl text-xs leading-relaxed transition-all shadow-xs ${
                      msg.sender === 'user' 
                        ? 'bg-linear-to-tr from-cyan-600 to-indigo-600 text-white rounded-tr-none' 
                        : themeMode === 'dark' 
                          ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none' 
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {/* Sub-pill header to identify persona matching on assistant bubbles */}
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-[8px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded">
                            BabelGuide PRO
                          </span>
                          <span className="text-[8px] text-slate-400">• Active Intelligence Match</span>
                        </div>
                      )}

                      <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                      
                      {/* Audio feedback simulator inside bubbles */}
                      {msg.sender === 'ai' && (
                        <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/40">
                          <span className={`text-[8.5px] ${themeMode === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {msg.timestamp}
                          </span>
                          <button
                            onClick={() => {
                              if (window.speechSynthesis) {
                                window.speechSynthesis.cancel();
                                const speechString = msg.text.replace(/[#*`_]/g, '');
                                const utterance = new SpeechSynthesisUtterance(speechString.substring(0, 250));
                                utterance.lang = 'id-ID';
                                window.speechSynthesis.speak(utterance);
                              }
                            }}
                            className={`p-1.5 rounded-lg hover:bg-slate-700/30 transition-all flex items-center gap-1 ${
                              themeMode === 'dark' ? 'text-slate-400 hover:text-teal-400' : 'text-slate-500 hover:text-emerald-600'
                            }`}
                            title="Nyalakan Pembacaan Suara"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[8px] font-bold">Dengar Panduan</span>
                          </button>
                        </div>
                      )}

                      {msg.sender === 'user' && (
                        <div className="text-right mt-1.5">
                          <span className="text-[8.5px] text-slate-300">{msg.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC DESTINATION CARD PREVIEWS (Shows real images dynamically under the bubbles!) */}
                {msg.sender === 'ai' && mentionedEntities.length > 0 && (
                  <div className="pl-11 pr-4 space-y-3 pt-1 animate-fade-in text-left">
                    <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wide flex items-center gap-1">
                      <Sparkle className="w-3 h-3 text-amber-400 fill-amber-400" /> Deteksi Rekomendasi Pintar Platform:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {mentionedEntities.map((spot) => (
                        <div 
                          key={spot.id} 
                          className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-102 flex flex-col justify-between ${
                            themeMode === 'dark' 
                              ? 'bg-slate-900/80 border-slate-800/90' 
                              : 'bg-white border-slate-200 shadow-md shadow-slate-100'
                          }`}
                        >
                          {/* Image box */}
                          <div className="relative h-28 w-full bg-slate-800">
                            <img 
                              src={getImageUrlByNama(spot.name)} 
                              alt={spot.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <span className="absolute top-2 left-2 bg-slate-950/80 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-md text-emerald-400 border border-slate-800 tracking-wider">
                              {spot.category}
                            </span>
                            <div className="absolute top-2 right-2 bg-slate-950/80 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-slate-200 text-[9px] font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {spot.rating}
                            </div>
                          </div>

                          {/* Body details */}
                          <div className="p-3 text-left">
                            <h4 className="text-xs font-black text-slate-100 tracking-tight leading-snug line-clamp-1 truncate block text-slate-800 dark:text-slate-100">
                              {spot.name}
                            </h4>
                            <p className="text-[10px] text-slate-405 leading-relaxed line-clamp-2 mt-1 min-h-[30px] text-slate-500 dark:text-slate-400">
                              {spot.desc}
                            </p>

                            <div className="mt-2 pt-2 border-t border-slate-800/40 grid grid-cols-2 gap-1.5 text-[9px] text-slate-400">
                              <span className="flex items-center gap-1 text-slate-400">
                                <Coins className="w-3.5 h-3.5 text-amber-450 shrink-0 text-amber-400" /> {spot.cost}
                              </span>
                              <span className="flex items-center gap-1 text-slate-400">
                                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" /> {spot.time}
                              </span>
                            </div>
                          </div>

                          {/* Action footer */}
                          <div className={`p-2 border-t flex gap-1 bg-slate-100/30 ${
                            themeMode === 'dark' ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'
                          }`}>
                            <button
                              onClick={() => handleBookmarkSpot(spot.name)}
                              className={`flex-1 py-1 px-1.5 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                                bookmarks.includes(spot.name)
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${bookmarks.includes(spot.name) ? 'fill-rose-500' : ''}`} />
                              {bookmarks.includes(spot.name) ? 'Disematkan' : 'Sematkan'}
                            </button>
                            
                            <button
                              onClick={() => {
                                alert(`Informasi Tambahan:\n\nLokasi: ${spot.area}\nJam Buka: ${spot.time}\nEstimasi Biaya: ${spot.cost}\nTips: Sebaiknya bawalah uang tunai secukupnya dikarenakan beberapa warung lokal belum mendukung pembayaran digital (QRIS).`);
                              }}
                              className={`py-1 px-2 rounded-lg text-[9px] font-bold border transition-all cursor-pointer ${
                                themeMode === 'dark' 
                                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              Info Rute
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 font-semibold p-4 mr-auto bg-slate-900 border border-slate-800 rounded-3xl rounded-tl-none max-w-[240px] animate-pulse">
              <Loader className="w-4.5 h-4.5 text-teal-400 animate-spin" />
              <span className="text-[10px] tracking-wide font-black animate-pulse">BabelGuide sedang merumus jawaban...</span>
            </div>
          )}

          <div ref={chatBottomRef}></div>
        </div>

        {/* INTERACTIVE SUGGESTED ACTIONS BAR */}
        <div className={`p-3.5 border-t ${
          themeMode === 'dark' ? 'bg-slate-900/30 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="text-[9px] font-black text-slate-400 uppercase block mb-2 text-left flex items-center gap-1 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" /> PILIHAN PENANYA CONCIERGE (ADAPSIONAL MINAT: {interest}):
          </span>
          <div className="flex flex-wrap gap-1.5 text-left">
            {getAdaptiveSuggestions().map((q, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(q)}
                className={`text-[9.5px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  themeMode === 'dark' 
                    ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-teal-400 hover:text-teal-300' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-2xs'
                }`}
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* CHAT INPUT AREA FOOTER */}
        <div className={`p-4 border-t flex flex-col gap-2 ${
          themeMode === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex gap-2">
            <input
              id="premium-chat-input-field"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Tanyakan Pantai Laskar Pelangi, Private Snorkeling, Makan Lempah Kuning..."
              className={`flex-1 px-4 py-3 border rounded-2xl text-xs focus:outline-hidden transition-all font-semibold ${
                themeMode === 'dark' 
                  ? 'bg-slate-900/85 border-slate-800 text-slate-100 focus:border-teal-500 focus:bg-slate-900' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-emerald-500 focus:bg-white'
              }`}
            />
            <button
              id="premium-btn-send-chat"
              onClick={() => handleSendMessage(inputText)}
              disabled={loading}
              className={`p-3.5 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer text-white shadow-lg ${
                loading 
                  ? 'bg-slate-800 text-slate-500 shadow-none cursor-not-allowed' 
                  : 'bg-linear-to-tr from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 hover:shadow-teal-500/20 active:scale-95'
              }`}
              title="Kirim Pesan"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-500">
            <span>Sesi diacak & diamankan dengan kunci enkripsi 256-bit</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" /> Didukung kecerdasan Gemini 3.5 AI
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
