/**
 * Curated data set for Bangka Belitung premium travel platform
 */

export interface PillarItem {
  id: string;
  title: string;
  tagline: string;
  desc: string;
  image: string;
}

export interface LandingDestination {
  id: string;
  name: string;
  island: 'Bangka' | 'Belitung';
  category: string;
  desc: string;
  rating: number;
  reviewsCount: number;
  estimatedBudget: string;
  operationalHours: string;
  image: string;
}

export interface CulinaryLandingItem {
  id: string;
  name: string;
  category: 'Seafood' | 'Halal' | 'Sarapan' | 'Pagi' | 'Warkop' | 'Kopi';
  rating: number;
  hours: string;
  priceEstimate: string;
  isPremium: boolean;
  image: string;
  desc: string;
}

export interface TimelineActivity {
  time: string;
  activity: string;
  location: string;
  cost: string;
  duration: string;
}

export interface CuratedTimeline {
  day1: TimelineActivity[];
  day2: TimelineActivity[];
  day3: TimelineActivity[];
  totalEstimasi: string;
  tips: string;
}

// 8 Pillars of Why Visit Bangka Belitung
export const WHY_VISIT_PILLARS: PillarItem[] = [
  {
    id: "granite_beaches",
    title: "Pantai Granit Eksotis",
    tagline: "Hamparan Pasir Putih Berbalut Granit Purba Raksasa",
    desc: "Tidak seperti pantai pasir biasa, pesisir Bangka Belitung sangat ikonik karena formasi batuan granit megalitikum berusia jutaan tahun yang tersebar artistik di pinggir air laut tenang.",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "island_hopping",
    title: "Island Hopping Maritim",
    tagline: "Air Laut Sebening Kaca di Kepulauan Tak Berpenghuni",
    desc: "Arungi gugusan pulau tropis berair kristal yang tenang. Singgahi Pulau Lengkuas untuk snorkeling bersama terumbu karang hidup dan taklukkan mercusuar bersejarah peninggalan Belanda era 1882.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "traditional_culinary",
    title: "Kuliner Tradisional Unik",
    tagline: "Cita Rasa Kuah Lempah Kuning & Gangan Penjuru Laut",
    desc: "Manjakan lidah Anda dengan perpaduan rempah kunyit asam segar sup ikan Lempah Kuning legendaris, Mie Belitung kuah udang manis gurih, dan sedapnya Otak-Otak ikan tenggiri bakar daun talas.",
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "malay_culture",
    title: "Kebudayaan Melayu-Hak",
    tagline: "Harmoni Kultur Melayu & Tionghoa Hakka yang Indah",
    desc: "Rasakan asimilasi budaya damai bersahaja selama berabad-abad. Alami ritual adat seperti Buang Jong, arsitektur rumah panggung klasik, dan sejarah keraton Melayu bertetangga kelenteng antik.",
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "hidden_gems",
    title: "Hidden Gems Unexplored",
    tagline: "Danau Kaolin Biru Toska & Hutan Pinus Pantai",
    desc: "Temukan keajaiban lubang bekas tambang timah yang bermetamorfosis menjadi kawah air berwarna toska cerah berpagar pasir putih menyala, serta rimbunnya lorong cemara Bangka Botanical Garden.",
    image: "https://images.unsplash.com/photo-1528150395403-992a693e26c8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "healing_atmosphere",
    title: "Suasana Tenang Penyembuh",
    tagline: "Destinasi Terbaik untuk Mindful Healing & Rileks",
    desc: "Lepaskan penat perkotaan di pulau yang terkenal aman dan sunyi ini. Cocok untuk healing melamun di pantai, waktu romantis bersama keluarga, solo traveler, maupun liburan eksklusif resor mewah.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "affordable_luxe",
    title: "Premium View, Smart Budget",
    tagline: "Pemandangan Kelas Dunia yang Sangat Terjangkau",
    desc: "Dapatkan ketenangan liburan privat bintang lima dengan harga lokal yang sangat hemat. Biaya logistik makanan laut segar, penyewaan perahu, dan hotel di Babel jauh lebih ekonomis dibanding destinasi lain.",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "local_hospitality",
    title: "Keramahan Putra Daerah",
    tagline: "Sambutan Hangat Melalui Budaya Amboi & Kopi Chats",
    desc: "Rasakan kebaikan tulus warga lokal pembuat kedamaian. Budaya ngopi saring di pelabuhan atau pasar serta kebiasaan saling menyapa melahirkan ikatan kekeluargaan instan yang tak terlupakan.",
    image: "https://images.unsplash.com/photo-1549474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
  }
];

// Showcase Destinations for Real-time search/clicks on Homepage
export const LANDING_DESTINATIONS: LandingDestination[] = [
  {
    id: "ld1",
    name: "Pantai Tanjung Tinggi",
    island: "Belitung",
    category: "Pantai",
    desc: "Eksotisme legendaris berlatar batuan granit purba raksasa yang menjadi lokasi syuting film Laskar Pelangi.",
    rating: 4.9,
    reviewsCount: 1420,
    estimatedBudget: "Rp10.000 (Parkir)",
    operationalHours: "24 Jam",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ld2",
    name: "Pulau Lengkuas & Mercusuar Belanda",
    island: "Belitung",
    category: "Island Hopping",
    desc: "Pulau mungil eksotis dengan mercusuar baja antik tahun 1882 dan taman terumbu karang laut yang sangat bening.",
    rating: 4.8,
    reviewsCount: 980,
    estimatedBudget: "Rp350.000 / Perahu Sewa",
    operationalHours: "07:00 - 17:00",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ld3",
    name: "Pantai Parai Tenggiri",
    island: "Bangka",
    category: "Pantai",
    desc: "Pantai premium di Sungailiat dengan bebatuan granit indah yang dihubungkan dengan jembatan lampu romantis.",
    rating: 4.7,
    reviewsCount: 840,
    estimatedBudget: "Rp25.000",
    operationalHours: "06:00 - 21:00",
    image: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ld4",
    name: "Danau Kaolin Air Bara",
    island: "Bangka",
    category: "Danau",
    desc: "Kawah putih sisa galian timah dengan akumulasi air berwarna biru toska gradasi hijau muda yang luar biasa kontras.",
    rating: 4.6,
    reviewsCount: 510,
    estimatedBudget: "Rp10.050",
    operationalHours: "07:00 - 18:00",
    image: "https://images.unsplash.com/photo-1528150395403-992a693e26c8?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ld5",
    name: "Danau Kaolin Belitung",
    island: "Belitung",
    category: "Danau",
    desc: "Kawah kaolin murni bernuansa salju putih di dekat pusat Tanjung Pandan, sangat instagenic tanpa aroma belerang.",
    rating: 4.7,
    reviewsCount: 620,
    estimatedBudget: "Gratis",
    operationalHours: "24 Jam",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "ld6",
    name: "Bangka Botanical Garden (BBG)",
    island: "Bangka",
    category: "Ekowisata",
    desc: "Kawasan agrowisata rimbun berpagar ribuan pohon pinus tegak lurus dengan kebun edukasi dan peternakan susu sapi segar.",
    rating: 4.5,
    reviewsCount: 380,
    estimatedBudget: "Rp5.000",
    operationalHours: "08:00 - 17:00",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80"
  }
];

// Showcase Culinary for Homepage
export const LANDING_CULINARY: CulinaryLandingItem[] = [
  {
    id: "lc1",
    name: "Mie Ayam Belitung Ibu Atep",
    category: "Sarapan",
    rating: 4.9,
    hours: "08:00 - 19:00",
    priceEstimate: "Rp20.000 - Rp35.000",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1625220194771-7ebded0c968e?auto=format&fit=crop&w=600&q=80",
    desc: "Mie saring berkuah udang kental manis gurih, disajikan hangat beralaskan daun simpor aromatis."
  },
  {
    id: "lc2",
    name: "Warkop Kong Djie Kopi 1943",
    category: "Warkop",
    rating: 4.8,
    hours: "24 Jam",
    priceEstimate: "Rp12.000 - Rp25.000",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    desc: "Warung kopi legendaris penyaji kopi saring arang kayu tradisional dengan aroma kuat membakar kantuk."
  },
  {
    id: "lc3",
    name: "Lempah Kuning Kepala Tenggiri Muara",
    category: "Seafood",
    rating: 4.9,
    hours: "10:00 - 21:00",
    priceEstimate: "Rp50.000 - Rp95.000",
    isPremium: true,
    image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80",
    desc: "Sajian sup ikan kuah kuning berempah kunyit, cabai rahasia, nanas segar, dan asam belimbing wuluh."
  },
  {
    id: "lc4",
    name: "Otak-Otak Tenggiri Amui Pangkalpinang",
    category: "Halal",
    rating: 4.7,
    hours: "09:00 - 21:00",
    priceEstimate: "Rp4.000 / Pcs",
    isPremium: false,
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
    desc: "Otak-otak tenggiri rebus dan bakar bumbu tauco merah Melayu bersalut wangi daun kelapa."
  }
];

// Curated Timeline Interactive Simulator Data based on user interests
export const ITINERARY_PRESETS: Record<string, Record<string, CuratedTimeline>> = {
  healing: {
    budget: {
      totalEstimasi: "Rp1.120.000 / Pax",
      tips: "Hemat sewa motor Rp75rb/hari dan sarapan mie khas di warung pasar rakyat.",
      day1: [
        { time: "08:30", activity: "Tiba di Bandara Tanjung Pandan, sewa unit kendaraan lokal", location: "Bandara HAS Hanandjoeddin", cost: "Rp80.000 (Sewa motor/day)", duration: "30 menit" },
        { time: "09:30", activity: "Sarapan Mie Belitung original saringan daun simpor", location: "Mie Atep Jln Sriwijaya", cost: "Rp22.000", duration: "45 menit" },
        { time: "11:00", activity: "Eksplorasi berfoto santai di bebatuan kawah salju", location: "Danau Kaolin Tanjung Pandan", cost: "Gratis", duration: "1 Jam" },
        { time: "14:00", activity: "Relaksasi santai melamun di pantai berpasir selembut bedak", location: "Pantai Tanjung Tinggi", cost: "Rp5.000", duration: "3 Jam" }
      ],
      day2: [
        { time: "08:00", activity: "Berlayar menembus pulau karang & mengunjungi mercusuar tua Belanda", location: "Dermaga Tanjung Kelayang", cost: "Rp120.000 (Sharing Boat)", duration: "5 Jam" },
        { time: "14:00", activity: "Makan siang masakan laut kuah gangan bumbu kampung", location: "Warung Pantai Kelayang", cost: "Rp45.000", duration: "1 Jam" },
        { time: "16:00", activity: "Menikmati senja tenang tanpa polusi suara", location: "Pantai Bukit Berahu", cost: "Rp10.000", duration: "2 Jam" }
      ],
      day3: [
        { time: "09:00", activity: "Membeli oleh-oleh keripik sukun & sereal kopi lokal", location: "Pusat UMKM Tanjung Pandan", cost: "Rp100.000", duration: "1.5 Jam" },
        { time: "11:00", activity: "Ngopi vintage penutup perjalanan sebelum terbang pulang", location: "Warkop Kong Djie Sejak 1943", cost: "Rp15.000", duration: "1 Jam" }
      ]
    },
    luxury: {
      totalEstimasi: "Rp4.850.000 / Pax",
      tips: "Memilih vila tepi pantai langsung (beachfront villa) dengan boat privat berpelayan mumpuni.",
      day1: [
        { time: "09:00", activity: "Layanan penjemputan mobil SUV Alphard Premium & Coconuts Welcome", location: "HAS Hanandjoeddin VIP Gate", cost: "Rp1.200.000 / Day", duration: "45 menit" },
        { time: "11:00", activity: "Check-in resor mewah privat bintang lima berpemandu pantai", location: "Sheraton Belitung Resort Sijuk", cost: "Rp2.500.000 / Malam", duration: "30 menit" },
        { time: "13:00", activity: "Santap siang udang galah premium bumbu rempah Melayu", location: "Island Restaurant Sheraton", cost: "Rp250.000", duration: "1.5 Jam" },
        { time: "16:30", activity: "Layanan pijat aroma terapi laut menghadap Sunset", location: "Resort Wellness Spa Pavilion", cost: "Rp450.000", duration: "2 Jam" }
      ],
      day2: [
        { time: "08:30", activity: "Sewa kapal yacht cepat privat berlayar ke mercusuar & pulau sepi", location: "Pantai Tanjung Kelayang", cost: "Rp1.500.000 (Private Boat)", duration: "6 Jam" },
        { time: "12:00", activity: "Pranala piknik makan siang seafood segar panggang di pulau berpasir privat", location: "Pulau Kepayang Pasir Putih", cost: "Rp350.000", duration: "2 Jam" },
        { time: "18:00", activity: "Makan malam eksklusif tepian pantai ditemani lantunan alat musik gambus", location: "Tanjung Tinggi Private Cove", cost: "Rp600.000", duration: "2.5 Jam" }
      ],
      day3: [
        { time: "09:00", activity: "Sarapan mengapung (Floating Breakfast) di kolam renang privat vila", location: "Sheraton Private Pool", cost: "Termasuk Hotel", duration: "1.5 Jam" },
        { time: "11:30", activity: "Membeli kain tenun Cual asli tenunan tangan premium khas daerah", location: "Galeri Cual Exclusive", cost: "Rp750.000", duration: "1 Jam" }
      ]
    }
  },
  adventure: {
    budget: {
      totalEstimasi: "Rp1.350.000 / Pax",
      tips: "Gunakan kemudi mandiri roda dua dan membawa kacamata action cam untuk dasar laut.",
      day1: [
        { time: "09:00", activity: "Penjemputan motor trail keliling lintasan bukit pasir", location: "Pusat Sewa Sungailiat Bangka", cost: "Rp150.000", duration: "1 Jam" },
        { time: "10:30", activity: "Menembus bebatuan tebing terjal pantai berangin kencang", location: "Pantai Tikus Emas & Pagoda", cost: "Rp10.000", duration: "2 Jam" },
        { time: "13:00", activity: "Merasakan sensasi Lempah Kuning pedas ekstra di pelabuhan", location: "Warung H. Asui Seafood", cost: "Rp65.000", duration: "1 Jam" }
      ],
      day2: [
        { time: "08:00", activity: "Perjalanan lintas kabupaten mengarungi Danau Kaolin gurun pasir", location: "Danau Kaolin Air Bara Bangka Tengah", cost: "Rp40.000 (Bensin)", duration: "3 Jam" },
        { time: "12:00", activity: "Snorkeling bebas di terumbu karang laut dangkal berarus", location: "Pesisir Ketapang & Pulau Ketawai", cost: "Rp150.000 (Sewa kano)", duration: "4 Jam" },
        { time: "18:30", activity: "Nongkrong bersama pembalap lokal di warkop saring arang malam", location: "Kedai Kopi Amoy Tua", cost: "Rp20.000", duration: "2.5 Jam" }
      ],
      day3: [
        { time: "08:30", activity: "Surfing angin pagi menjelajah rute perhutanan pinus rimbun", location: "Bangka Botanical Garden", cost: "Rp5.000", duration: "2 Jam" },
        { time: "11:00", activity: "Beli camilan kemplang panggang oven timah untuk bekal tiket pulang", location: "UMKM Jalan Baru Pangkalpinang", cost: "Rp60.000", duration: "1 Jam" }
      ]
    },
    luxury: {
      totalEstimasi: "Rp3.900.000 / Pax",
      tips: "Memasukkan penyewaan fotografer drone profesional berlisensi pariwisata untuk dokumentasi aksi.",
      day1: [
        { time: "09:00", activity: "Penjemputan premium 4x4 Offroad Cruiser ber-AC di Bandara Pangkalpinang", location: "Depati Amir Airport", cost: "Rp1.500.000 / Day", duration: "30 menit" },
        { time: "11:00", activity: "Check-in cottage kayu estetik berpagar perbukitan granit", location: "Parai Beach Resort Executive Villa", cost: "Rp1.400.000", duration: "45 menit" },
        { time: "15:00", activity: "Penerbangan helikopter charter panorama udara formasi batuan lepas pantai", location: "Parai Helipad", cost: "Rp2.000.000", duration: "45 menit" }
      ],
      day2: [
        { time: "08:00", activity: "Perjalanan privat pulau berkecepatan tinggi dengan kapal speedboat luxury 250HP", location: "Dermaga Sungailiat", cost: "Rp1.800.000", duration: "6 Jam" },
        { time: "15:00", activity: "Petualangan mengemudi ATV quad-bike menyusuri rimbunnya pesisir liar", location: "Pantai Rebo Trail", cost: "Rp350.000", duration: "2 Jam" }
      ],
      day3: [
        { time: "09:00", activity: "Eksklusif breakfast dipandu guide kearifan lokal berkarisma", location: "Parai Floating Deck", cost: "Termasuk Kamar", duration: "1.5 Jam" },
        { time: "11:00", activity: "Membeli madu Pelawan pahit murni langka berkualitas ekspor", location: "Butik Madu Hutan Babel", cost: "Rp350.005", duration: "1 Jam" }
      ]
    }
  }
};
