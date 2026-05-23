/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  username: string;
  email: string;
  tier: 'free' | 'premium';
}

export interface Wisata {
  id: string;
  nama: string;
  deskripsi: string;
  lokasi: string;
  estimasi_biaya: string;
  jam_buka: string;
  tips: string;
  kategori: 'pantai' | 'restoran' | 'cafe' | 'spot_foto' | 'kuliner';
  wilayah: 'Bangka' | 'Belitung';
  tier?: 'free' | 'premium';
}

export interface KulinerItem {
  id: string;
  nama: string;
  deskripsi: string;
  tipe: 'seafood' | 'halal' | 'sarapan' | 'murah meriah';
  estimasi_biaya: string;
  rekomendasi_tempat: string;
  tips: string;
  rating?: number;
  jam_buka?: string;
  kategori?: string;
  highlights?: string[];
  wilayah?: 'Bangka' | 'Belitung';
}

export interface ItineraryDay {
  day: number;
  activities: {
    waktu: string;
    aktivitas: string;
    lokasi: string;
    estimasi_durasi: string;
    estimasi_biaya: string;
  }[];
}

export interface TripPlan {
  itinerary: ItineraryDay[];
  estimasi_total_biaya: string;
  tips_perjalanan: string[];
}

export interface BudgetPackage {
  nama: string;
  total_estimasi: string;
  rincian: {
    transportasi: string;
    akomodasi: string;
    makan: string;
    tiket_masuk: string;
    lain_lain: string;
  };
  catatan: string;
}

export interface BudgetEstimateResponse {
  packages: {
    HEMAT: BudgetPackage;
    STANDAR: BudgetPackage;
    NYAMAN: BudgetPackage;
  };
  tips_hemat: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
