/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, Compass, Palmtree, Sparkles, Star, ChevronRight, Map as MapIcon } from 'lucide-react';

// Precision coordinates database for Bangka Belitung tourist areas and culinary heritage
const COORDINATE_DB: Record<string, [number, number]> = {
  // Bangka tour spots
  "w1": [-1.8105, 106.1912],  // Pantai Parai Tenggiri
  "w2": [-1.8604, 106.1205],  // Pantai Tongaci & De Locomotief
  "w3": [-2.1158, 106.1685],  // Pantai Pasir Padi
  "w4": [-1.8712, 106.1150],  // Pantai Matras Bangka
  "w5": [-1.8885, 106.1032],  // Bukit Kolong Sungai Liat
  "w6": [-2.4284, 106.3211],  // Danau Kaolin-Air Bara
  "w7": [-1.9056, 105.7834],  // Pantai Penyusuk & Pulau Putri
  "w8": [-2.6710, 106.3980],  // Pantai Belimbing Toboali
  "w9": [-2.0620, 106.1280],  // Jembatan Emas Merawang
  "w10": [-2.1120, 106.1110], // Lempah Kuning Muara, Pangkalpinang

  // Belitung tour spots
  "w11": [-2.5647, 107.6917], // Pantai Tanjung Tinggi
  "w12": [-2.5620, 107.6620], // Pantai Tanjung Kelayang
  "w13": [-2.5298, 107.6234], // Pulau Lengkuas & Lighthouse
  "w14": [-2.7300, 107.6500], // Danau Kaolin Belitung
  "w15": [-2.7315, 107.6322], // Warkop Kong Djie Siburik
  "w16": [-2.7342, 107.6355], // Mie Belitung Atep
  "w17": [-2.7340, 107.6408], // Rumah Adat Belitung
  "w18": [-2.5833, 107.9167], // Pantai Bukit Batu
  "w19": [-3.1667, 107.2343], // Pantai Penyabong Membalong
  "w20": [-2.7483, 108.1825], // Open Pit Nam Salu Manggar

  // Additional identifiers for food / spots
  "k1": [-2.1122, 106.1115],  // Lempah Kuning Sari Laut
  "k2": [-2.7341, 107.6354],  // Mie Belitong Atep Resto
  "k3": [-2.1220, 106.1210],  // Martabak Hok Lopang Bangka
  "k4": [-2.7405, 107.6380],  // RM Bedulang Belitung
  "k5": [-2.1150, 106.1122],  // Otak-Otak Amse Bangka
  "k6": [-2.7350, 107.6341],  // RM Pandan Laut Belitung
  "k7": [-2.7314, 107.6321],  // Kong Djie Coffee HQ
  "k8": [-2.7554, 108.2560],  // Kopi Manggar (Sarkawi)
  "k9": [-2.1160, 106.1130],  // Warung Es Campur Ayung Bangka
};

interface LocalMapSpot {
  id: string;
  nama: string;
  lokasi: string;
  kategori: string;
  desc?: string;
  deskripsi?: string;
  imageUrl?: string;
  rating?: string | number;
  estimasi_biaya?: string;
  wilayah: 'Bangka' | 'Belitung';
  tipe: 'wisata' | 'kuliner';
}

interface TravelMapProps {
  spots: LocalMapSpot[];
  darkMode: boolean;
  onSelectSpot?: (spot: any) => void;
  premiumUser?: boolean;
}

export default function TravelMap({ spots, darkMode, onSelectSpot, premiumUser = false }: TravelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'Semua' | 'Bangka' | 'Belitung'>('Semua');
  const [selectedType, setSelectedType] = useState<'Semua' | 'wisata' | 'kuliner'>('Semua');
  const [activeSpotDetail, setActiveSpotDetail] = useState<LocalMapSpot | null>(null);

  // Fallback lat-long assigning for items outside database
  const getCoordinates = (spot: LocalMapSpot, index: number): [number, number] => {
    if (COORDINATE_DB[spot.id]) {
      return COORDINATE_DB[spot.id];
    }
    // Deterministic spread around respective island coordinates
    const center: [number, number] = spot.wilayah === 'Bangka' ? [-2.1, 106.1] : [-2.7, 107.8];
    const angle = (index * 47) % 360;
    const distance = 0.08 + (index * 0.012) % 0.15;
    const rad = (angle * Math.PI) / 180;
    return [
      center[0] + Math.sin(rad) * distance,
      center[1] + Math.cos(rad) * distance
    ];
  };

  // Compile full markers list matching the filters applied
  const resolvedSpots: LocalMapSpot[] = spots.map((s, idx) => {
    // Provide full field backups if missing from backend contracts
    const backupDesc = s.desc || s.deskripsi || "Destinasi istimewa Bangka Belitung dengan kearifan lokal berdaya pikat eksklusif.";
    const score = s.rating ? parseFloat(String(s.rating)) : 4.7;
    return {
      ...s,
      desc: backupDesc,
      deskripsi: backupDesc,
      rating: isNaN(score) ? 4.7 : score,
      estimasi_biaya: s.estimasi_biaya || "Rp 15.000",
      imageUrl: s.imageUrl || `/placeholder_${s.id}.jpg`
    };
  });

  const filteredSpots = resolvedSpots.filter(spot => {
    const matchesSearch = spot.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          spot.kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'Semua' || spot.wilayah === selectedRegion;
    const matchesType = selectedType === 'Semua' || spot.tipe === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  // Re-render and plot pins on Leaflet instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      // Babel center coordinate frame matching latitude and longitude projection
      const defaultCenter: [number, number] = [-2.35, 107.1]; 
      const defaultZoom = 9;

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: true
      }).setView(defaultCenter, defaultZoom);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Add zoom control manually at bottom-right of the viewport
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (!map || !markersLayer) return;

    // Update tile style seamlessly using CartoDB layers which are beautiful, minimalist, and lightweight
    const oldTileLayer = (map as any)._tileLayer;
    if (oldTileLayer) {
      map.removeLayer(oldTileLayer);
    }

    // Light Theme vs Dark Theme Carto basemaps
    const tileUrl = darkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 18,
      minZoom: 8
    }).addTo(map);

    (map as any)._tileLayer = tiles;

    // Reset previous pins on redraw
    markersLayer.clearLayers();

    // Map through elements and build pins
    filteredSpots.forEach((spot, idx) => {
      const coords = getCoordinates(spot, idx);
      
      // Gorgeous custom marker styled in modern premium tones
      const pinColor = spot.tipe === 'kuliner' 
        ? '#D97706' // Soft gold/amber for food 
        : spot.wilayah === 'Bangka' 
          ? '#0D9488' // Muted Tropical teal for Bangka
          : '#0284C7'; // Deep ocean blue for Belitung

      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div class="relative group cursor-pointer duration-350">
            <!-- Pulsing outer ring -->
            <div class="absolute -inset-2.5 bg-current rounded-full opacity-0 group-hover:opacity-10 dark:opacity-0 animate-ping" style="color: ${pinColor}"></div>
            <!-- Main solid pin pinhead -->
            <div class="w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-lg text-white" style="background-color: ${pinColor}">
              ${spot.tipe === 'kuliner' 
                ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coffee"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z"/><path d="M6 14h2"/><path d="M17 14h2a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2"/></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-palmtree"><path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2c0-1.66 1.79-3 4-3s4 1.34 4 3"/><path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-2c0-1.66-1.79-3-4-3s-3.03.83-3.03 2"/><path d="M13 14h-3c0-1.66-1.79-3-4-3H4c0 1.66 1.79 3 4 3"/><path d="M13 10c0 4.97-3.13 9-7 9H4v-1h2c2.76 0 5-3.13 5-7h2Z"/><path d="M18 14c0 2.21-1.34 4-3 4H14v-1h1c1.1 0 2-1.34 2-3h1Z"/></svg>'
              }
            </div>
            <!-- Pin triangle base tip -->
            <div class="w-1.5 h-1.5 rotate-45 mx-auto -mt-1 shadow-sm" style="background-color: ${pinColor}"></div>
          </div>
        `,
        iconSize: [28, 34],
        iconAnchor: [14, 34],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(coords, { icon });

      // Actionable tooltip click / popup
      marker.on('click', () => {
        map.panTo(coords);
        setActiveSpotDetail(spot);
        if (onSelectSpot) onSelectSpot(spot);
      });

      marker.addTo(markersLayer);
    });

    // Fit map bounds only if we have filtered elements
    if (filteredSpots.length > 0) {
      const bounds = L.latLngBounds(filteredSpots.map((s, idx) => getCoordinates(s, idx)));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13, animate: true, duration: 0.8 });
    }

  }, [filteredSpots, darkMode]);

  // Handle flyover selection click centering
  const handleSpotCardClick = (spot: LocalMapSpot, idx: number) => {
    setActiveSpotDetail(spot);
    if (mapInstanceRef.current) {
      const coords = getCoordinates(spot, idx);
      mapInstanceRef.current.setView(coords, 13, { animate: true, duration: 0.6 });
    }
    if (onSelectSpot) onSelectSpot(spot);
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[580px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-350 border ${
      premiumUser
        ? 'border-[#D97706]/35 bg-slate-950/80 shadow-amber-500/5'
        : 'border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-950'
    }`} id="custom-leaflet-travelmap">
      
      {/* 1. LEFT CONTROLS & PLACES EXPEDITER SIDEBAR (4 Cols) */}
      <div className="lg:col-span-4 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/60 border-r border-slate-200/50 dark:border-slate-800/80 overflow-hidden">
        
        {/* Search header & Filter pillboxes */}
        <div className="p-4.5 space-y-3.5 border-b border-slate-200/50 dark:border-slate-800/80 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pantai, cafe, kuliner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium py-2.5 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-teal-500 transition-all font-sans"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          </div>

          {/* Region Island Filter */}
          <div className="flex bg-slate-100 dark:bg-slate-950 rounded-xl p-1 border border-slate-250/20">
            {(['Semua', 'Bangka', 'Belitung'] as const).map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`flex-1 text-center py-1.5 text-[10px] uppercase font-black tracking-widest rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedRegion === region
                    ? 'bg-white dark:bg-slate-800 text-[#0D9488] dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex bg-slate-150/55 dark:bg-slate-950/70 rounded-xl p-1 border border-slate-250/15">
            {(['Semua', 'wisata', 'kuliner'] as const).map((tipeVal) => (
              <button
                key={tipeVal}
                onClick={() => setSelectedType(tipeVal)}
                className={`flex-1 text-center py-1.5 text-[10px] uppercase font-black tracking-widest rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedType === tipeVal
                    ? 'bg-white dark:bg-slate-800 text-[#D97706] dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {tipeVal === 'Semua' ? 'All Types' : tipeVal}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Places List Scroll container */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40 p-3 space-y-2.5">
          {filteredSpots.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
              <Compass className="w-8 h-8 opacity-25 animate-spin-slow" />
              <p className="text-[11px] font-bold uppercase tracking-wider">Lokasi Tidak Ditemukan</p>
              <p className="text-[10px]">Coba sesuaikan kata kunci atau filter pulau Anda.</p>
            </div>
          ) : (
            filteredSpots.map((spot, idx) => {
              const isActive = activeSpotDetail?.id === spot.id;
              const isKuliner = spot.tipe === 'kuliner';
              const dotColor = isKuliner 
                ? 'bg-amber-500' 
                : spot.wilayah === 'Bangka' 
                  ? 'bg-teal-500' 
                  : 'bg-sky-500';

              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotCardClick(spot, idx)}
                  className={`flex gap-3 p-3 rounded-2xl cursor-pointer duration-300 transition-all border text-left ${
                    isActive
                      ? 'bg-white dark:bg-slate-950 border-[#0D9488]/40 shadow-md translate-x-1'
                      : 'bg-transparent border-transparent hover:bg-white/40 dark:hover:bg-slate-950/20'
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    <img
                      src={spot.imageUrl}
                      alt={spot.nama}
                      className="w-full h-full object-cover select-none"
                      onError={(e) => {
                        // Image fallback to Unsplash placeholder matching Babel ocean vibe
                        (e.target as HTMLImageElement).src = isKuliner 
                          ? 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80'
                          : 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                    <div className="absolute top-1 left-1">
                      <span className={`w-2 h-2 rounded-full block ${dotColor}`}></span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isKuliner 
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {spot.kategori}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium shrink-0 flex items-center">
                        ★ {typeof spot.rating === 'number' ? spot.rating.toFixed(1) : spot.rating}
                      </span>
                    </div>
                    <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 truncate leading-tight">
                      {spot.nama}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5 shrink-0" /> {spot.lokasi}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT LEAFLET CANVAS MAP CONTAINER (8 Cols) */}
      <div className="lg:col-span-8 relative h-full bg-slate-900 border-none select-none">
        
        {/* Actual Map Target Div Node */}
        <div ref={mapContainerRef} className="w-full h-full z-10" id="leaflet-surface" style={{ background: darkMode ? '#090D1A' : '#FAFBFD' }} />

        {/* Ambient Darkened Compass Watermark Background overlays */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none select-none bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-205/30 dark:border-slate-800 text-left">
          <div className="flex items-center gap-2">
            <Compass className="w-4.5 h-4.5 text-[#0D9488] animate-spin-slow shrink-0" />
            <div>
              <span className="text-[8px] tracking-widest uppercase block text-slate-400 font-extrabold font-mono">SATELLITE POSITIONING</span>
              <span className="text-[10px] font-black tracking-tight text-white font-serif">
                Bangka Belitung Archipelago Grid 🌊
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic spot metadata detail overlay card on bottom edge */}
        {activeSpotDetail && (
          <div className="absolute bottom-5 left-5 right-12 lg:right-5 z-20 max-w-lg bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg rounded-2xl border border-slate-200/50 dark:border-slate-800/80 p-4 shadow-xl text-left animate-fade-in text-slate-900 dark:text-white">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                <img
                  src={activeSpotDetail.imageUrl}
                  alt={activeSpotDetail.nama}
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = activeSpotDetail.tipe === 'kuliner' 
                      ? 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80'
                      : 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black bg-teal-500/10 dark:bg-teal-500/20 text-[#0d9488] dark:text-teal-400 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      {activeSpotDetail.kategori} • {activeSpotDetail.wilayah}
                    </span>
                    <button 
                      onClick={() => setActiveSpotDetail(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-black px-1.5 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white truncate leading-tight mt-1 font-serif">
                    {activeSpotDetail.nama}
                  </h3>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-snug font-sans font-medium">
                    {activeSpotDetail.desc || activeSpotDetail.deskripsi}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/40 text-[10px] mt-2 bg-transparent shrink-0">
                  <div className="text-slate-400">
                    Est. Biaya: <strong className="text-slate-700 dark:text-amber-400 font-extrabold">{activeSpotDetail.estimasi_biaya}</strong>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-500/15 dark:bg-amber-400/10 px-2 py-0.5 rounded-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                    <span className="text-[10px] font-extrabold text-[#D97706] dark:text-amber-400">★ {activeSpotDetail.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
