/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'localtrip_babel_secret_key_678910';
const PORT = 3000;

// Database File Path
const DB_PATH = path.join(process.cwd(), 'database.json');

// --- Real Seed Data (Bangka Belitung Tourism) ---
const defaultWisata = [
  {
    id: "w1",
    nama: "Pantai Parai Tenggiri",
    deskripsi: "Pantai eksotis dengan formasi batuan granit besar yang artistik, hamparan pasir putih yang lembut, dan air laut jernih berwarna toska khas Pulau Bangka.",
    lokasi: "Sungailiat, Kabupaten Bangka",
    estimasi_biaya: "Rp 25.000 (Tiket Masuk)",
    jam_buka: "07.00 - 18.00 WIB",
    tips: "Sangat direkomendasikan datang di pagi hari untuk menikmati sunrise yang tenang tanpa keramaian, serta membawa kamera lensa lebar untuk menangkap bebatuan granit.",
    kategori: "pantai",
    wilayah: "Bangka"
  },
  {
    id: "w2",
    nama: "Pantai Tongaci & De Locomotief",
    deskripsi: "Pantai indah yang dipadukan dengan penangkaran penyu serta pusat rekreasi seni 'De Locomotief' yang menyajikan galeri foto dan dekorasi lampion merah oriental.",
    lokasi: "Sungailiat, Kabupaten Bangka",
    estimasi_biaya: "Rp 10.000 - Rp 15.000",
    jam_buka: "08.00 - 20.00 WIB",
    tips: "Sangat asyik berfoto di lorong payung tradisional Tionghoa dan berinteraksi langsung dengan tukik penyu di area konservasi.",
    kategori: "pantai",
    wilayah: "Bangka"
  },
  {
    id: "w3",
    nama: "Danau Kaolin Air Bara",
    deskripsi: "Bekas tambang timah yang bertransformasi menjadi danau dengan air berwarna biru menyala yang kontras dengan dinding tanah putih bersih di sekelilingnya.",
    lokasi: "Air Bara, Kabupaten Bangka Tengah",
    estimasi_biaya: "Rp 5.000 (Parkir)",
    jam_buka: "06.00 - 18.00 WIB",
    tips: "Gunakan pakaian berwarna kontras seperti merah atau kuning agar foto bento bento Anda terlihat sangat menawan berlatar air biru toska.",
    kategori: "spot_foto",
    wilayah: "Bangka"
  },
  {
    id: "w4",
    nama: "Jembatan Emas",
    deskripsi: "Jembatan tipe bascule (pintu angkat) raksasa sepanjang 785 meter yang menghubungkan Kota Pangkalpinang dan Kabupaten Bangka, menawarkan pemandangan muara sungai menakjubkan.",
    lokasi: "Bukit Intan, Kota Pangkalpinang",
    estimasi_biaya: "Gratis (Fasilitas Publik)",
    jam_buka: "24 jam (Bascule naik-turun sesuai jadwal kapal)",
    tips: "Datanglah menjelang pukul 17.00 WIB untuk menyaksikan jembatan terangkat saat kapal besar melintas di bawahnya dengan latar senja kekuningan.",
    kategori: "spot_foto",
    wilayah: "Bangka"
  },
  {
    id: "w5",
    nama: "Bangka Botanical Garden (BBG)",
    deskripsi: "Kawasan ekowisata hijau seluas 70 hektar dengan pepohonan pinus menjulang tinggi yang rimbun di kiri kanan jalan, peternakan sapi perah, dan perkebunan hidroponik organik.",
    lokasi: "Temberan, Kota Pangkalpinang",
    estimasi_biaya: "Gratis - Rp 10.000 (Parkir)",
    jam_buka: "08.00 - 17.00 WIB",
    tips: "Berjalanlah di sepanjang gang pinus untuk berfoto ala film-film romantis, dan jangan lupa membeli susu murni segar asli buatan langsung dari BBG.",
    kategori: "spot_foto",
    wilayah: "Bangka"
  },
  {
    id: "w6",
    nama: "Otak-Otak Amui",
    deskripsi: "Kedai legendaris kuliner khas Bangka yang menyajikan otak-otak panggang ikan tenggiri premium, pempek kulit, dan bujan goreng renyah dengan sambal tauco hangat.",
    lokasi: "Pangkalpinang, Kota Pangkalpinang",
    estimasi_biaya: "Rp 3.000 - Rp 5.000 per buah",
    jam_buka: "09.00 - 21.00 WIB",
    tips: "Cicipi perpaduan sambal tauco khas Bangka yang gurih pedas manis dengan otak-otak hangat yang dipanggang dengan daun pisang segar.",
    kategori: "restoran",
    wilayah: "Bangka"
  },
  {
    id: "w7",
    nama: "Mie Koba Iskandar",
    deskripsi: "Warung kuliner legendaris yang menyajikan mie kenyal khas Bangka disiram dengan kuah kaldu ikan tenggiri yang kental, beraroma harum cengkeh dan disajikan dengan telur rebus setengah matang.",
    lokasi: "Taman Sari, Kota Pangkalpinang",
    estimasi_biaya: "Rp 15.000 - Rp 25.000",
    jam_buka: "08.00 - 20.00 WIB",
    tips: "Sangat cocok disantap selagi hangat dengan perasan air jeruk kunci (jeruk nipis lokal) untuk menambah kesegaran rasa kaldu ikannya.",
    kategori: "restoran",
    wilayah: "Bangka"
  },
  {
    id: "w8",
    nama: "Kedai Kopi Babel",
    deskripsi: "Cafe kekinian di Sungailiat yang menyajikan kopi saring lokal bergaya tradisional berpadu nuansa modern yang estetik bagi para anak muda.",
    lokasi: "Sungailiat, Kabupaten Bangka",
    estimasi_biaya: "Rp 15.000 - Rp 35.000",
    jam_buka: "10.00 - 23.00 WIB",
    tips: "Coba Kopi Susu Aren lokal dan roti bakar mentega tradisional untuk santai sore menjelang malam.",
    kategori: "cafe",
    wilayah: "Bangka"
  },
  {
    id: "w9",
    nama: "Pantai Matras",
    deskripsi: "Pantai terpanjang di Bangka dengan hamparan pasir putih halus sepanjang 3 km dibingkai oleh pohon kelapa melambai dan bebatuan granit indah.",
    lokasi: "Sungailiat, Kabupaten Bangka",
    estimasi_biaya: "Rp 5.000",
    jam_buka: "06.00 - 18.00 WIB",
    tips: "Pantai ini sangat luas, menjadikannya lokasi sempurna untuk piknik keluarga atau menikmati sore hari yang damai sambil memakan kelapa muda.",
    kategori: "pantai",
    wilayah: "Bangka"
  },
  {
    id: "w10",
    nama: "Lempah Kuning Muara",
    deskripsi: "Restoran terbaik untuk menikmati hidangan sup Lempah Kuning tradisional khas Bangka — ikan tenggiri atau sembilang segar dimasak bumbu kuning kunyit belacan dengan tambahan irisan nanas pedas manis.",
    lokasi: "Pelabuhan Acuan, Kota Pangkalpinang",
    estimasi_biaya: "Rp 35.000 - Rp 70.000",
    jam_buka: "10.00 - 22.00 WIB",
    tips: "Pesan kepala ikan tenggiri Lempah Kuning untuk rasa maksimal, disantap dengan nasi hangat dan lalapan daun singkong.",
    kategori: "restoran",
    wilayah: "Bangka"
  },
  // Belitung
  {
    id: "w11",
    nama: "Pantai Tanjung Tinggi",
    deskripsi: "Pantai ikonik berpasir seputih salju dengan ratusan bongkahan batu granit raksasa setinggi rumah yang menjadi lokasi syuting film legendaris 'Laskar Pelangi'. Air lautnya sangat tenang dan jernih seperti kolam renang alami.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Gratis (Hanya Parkir Rp 5.000)",
    jam_buka: "24 Jam",
    tips: "Sangat aman untuk berenang bagi anak-anak. Panjat celah bebatuan granit besar di bagian kanan pantai untuk menikmati pemandangan sunset yang magis.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w12",
    nama: "Pantai Tanjung Kelayang",
    deskripsi: "Semenanjung pasir putih indah yang menjadi dermaga keberangkatan utama untuk kegiatan island hopping di Belitung, berlatar pemandangan pulau batu berbentuk kepala burung Garuda.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Gratis (Sewa Perahu Island Hopping Rp 450.000/kapal)",
    jam_buka: "07.00 - 18.00 WIB",
    tips: "Sewalah perahu tradisional di pantai ini semenjak pagi hari (pukul 08.00 WIB) untuk berkeliling ke pulau-pulau eksotis di sekeliling Sijuk.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w13",
    nama: "Pulau Lengkuas",
    deskripsi: "Pulau kecil tercantik di Belitung yang terkenal dengan Mercusuar bersejarah peninggalan kolonial Belanda tahun 1882 yang masih kokoh berdiri, dikelilingi taman laut terumbu karang yang menakjubkan untuk snorkeling.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Biaya Snorkeling + Penyeberangan (Rp 150.000/orang)",
    jam_buka: "08.00 - 17.00 WIB",
    tips: "Bawalah roti mentega kering untuk menarik gerombolan ikan badut dan ikan karang warna-warni saat ber-snorkeling aman di perairan dangkal.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w14",
    nama: "Danau Kaolin Belitung",
    deskripsi: "Bekas penambangan mineral kaolin yang membentuk cekungan air biru muda laksana susu yang kontras dengan bebatuan tanah berkapur putih salju. Sangat berbeda dari bekas tambang lainnya karena tidak mengeluarkan bau belerang.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Gratis (Hanya Parkir Rp 5.000)",
    jam_buka: "06.00 - 18.00 WIB",
    tips: "Disarankan berkunjung sebelum matahari terlalu terik (pukul 08.00 WIB atau sore hari pukul 16.30 WIB) demi mendapatkan pantulan cahaya air dan langit yang maksimal.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w15",
    nama: "Warkop Kong Djie Sejak 1943",
    deskripsi: "Cafe kopi saring tradisional legendaris di Belitung yang mempertahankan proses memasak kopi menggunakan arang kayu bakar dan teko kuningan tinggi sejak zaman penjajahan Belanda.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp 12.000 - Rp 20.000",
    jam_buka: "06.00 - 23.00 WIB",
    tips: "Pesan Kopi O (Kopi Hitam Pekat) atau Kopi Susu hangat pendamping roti panggang srikayanya untuk memulai pagi hari yang menenangkan.",
    kategori: "cafe",
    wilayah: "Belitung"
  },
  {
    id: "w16",
    nama: "Mie Belitung Atep",
    deskripsi: "Warung mie paling melegenda di Belitung milik Ny. Atep, menyajikan mie kuning gurih dengan kuah kaldu udang manis kental khas Belitung, diberi topping potongan udang, emping renyah, kentang rebus, timun segar, dan dibungkus daun simpor.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp 20.000",
    jam_buka: "08.00 - 19.30 WIB",
    tips: "Cicipi kuahnya yang manis gurih beraroma rempah dan nikmati kesegarannya bersamaan dengan segelas es jeruk kunci peras segar.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w17",
    nama: "Rumah Adat Belitung",
    deskripsi: "Rumah panggung tradisional kayu ulin khas melayu Belitung yang megah dengan ornamen kerajinan lokal dan pakaian adat pengantin Belitung di bagian dalamnya.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Donasi sukarela",
    jam_buka: "08.00 - 17.00 WIB",
    tips: "Kita diwajibkan melepas alas kaki di tangga luar rumah panggung kayu ini untuk menghormati tradisi kesopanan lokal.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w18",
    nama: "Pantai Bukit Batu",
    deskripsi: "Pantai unik berpagar bukit batuan granit bertumpuk yang berbatasan langsung dengan rimbunnya kebun kelapa dan laut luas di Belitung Timur.",
    lokasi: "Manggar, Kabupaten Belitung Timur",
    estimasi_biaya: "Rp 10.000",
    jam_buka: "08.00 - 18.00 WIB",
    tips: "Mendakilah ke bagian batu granit teratas untuk melihat panorama melengkung semenanjung timur Belitung secara luas.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w19",
    nama: "Pantai Penyabong",
    deskripsi: "Pantai di pelosok selatan Belitung dengan formasi silsilah batuan granit raksasa berbentuk memanjang seperti dermaga pelabuhan alami berair jernih kehijauan.",
    lokasi: "Membalong, Kabupaten Belitung",
    estimasi_biaya: "Rp 5.000",
    jam_buka: "08.00 - 18.00 WIB",
    tips: "Karena lokasinya yang tersembunyi jauh dari kota, pastikan bahan bakar kendaraan Anda penuh sebelum melakukan perjalanan ke Membalong.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w20",
    nama: "Rumah Keong Belitung Timur",
    deskripsi: "Spot foto instagramable unik berupa dermaga kayu terapung dengan kubah rajutan bambu melengkung berbentuk rumah siput/keong yang romantis di pinggiran danau bekas tambang.",
    lokasi: "Gantung, Kabupaten Belitung Timur",
    estimasi_biaya: "Rp 5.000 (Sumbangan Desa)",
    jam_buka: "08.00 - 18.00 WIB",
    tips: "Sangat bagus berlatar foto matahari tenggelam di danau tenang. Lokasinya persis di seberang SD Laskar Pelangi replika.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  }
];

// --- Real Seed Culinary Data ---
const defaultKuliner = [
  {
    id: "k1",
    nama: "Lempah Kuning Ikan",
    deskripsi: "Masakan sup ikan khas Bangka berbumbu kuah kuning kunyit yang dibumbui belacan (terasi), jeruk kunci, cabe rawit, dan diberi potongan nanas asam segar.",
    tipe: "seafood",
    estimasi_biaya: "Rp 35.000 - Rp 65.000",
    rekomendasi_tempat: "Lempah Kuning Muara, Pangkalpinang",
    tips: "Sangat enak dimakan selagi kuah mendidih berpasangan dengan nasi putih pulen dan lalapan mentah pancar gas.",
    wilayah: "Bangka"
  },
  {
    id: "k2",
    nama: "Mie Belitung Atep",
    deskripsi: "Mie kuning basah legendaris disiram kuah udang kental yang manis gurih beraroma rempah bumbu, dilengkapi toge, udang rebus, potongan tahu, emping, berwadahkan daun simpor alam.",
    tipe: "sarapan",
    estimasi_biaya: "Rp 20.000 per porsi",
    rekomendasi_tempat: "Warung Mie Belitung Atep, Tanjung Pandan",
    tips: "Selalu pesan Es Jeruk Kunci khas Belitung pendamping mie ini untuk menetralisir kemanisan udang bumbu di lidah.",
    wilayah: "Belitung"
  },
  {
    id: "k3",
    nama: "Gangan Belitung",
    deskripsi: "Sup ikan berkuah kuning cerah bercita rasa pedas-asam khas Belitung, sekilas mirip lempah kuning Bangka namun menggunakan ketumbar sangrai serta potongan nanas parut segar didalamnya.",
    tipe: "seafood",
    estimasi_biaya: "Rp 40.000 - Rp 80.000",
    rekomendasi_tempat: "Warung Gangan Sari, Tanjung Pandan",
    tips: "Mintalah gangan dengan ikan 'ketarap' segar karena dagingnya yang putih dan padat sangat pas menyerap bumbu kuning.",
    wilayah: "Belitung"
  },
  {
    id: "k4",
    nama: "Otak-Otak Tenggiri Panggang",
    deskripsi: "Sajian pembuka terbuat dari lulur daging ikan tenggiri yang dihaluskan bersama sagu tani dan kelapa parut santan kental, dibungkus daun pisang lalu dipanggang bara api.",
    tipe: "murah meriah",
    estimasi_biaya: "Rp 3.000 - Rp 5.000 per buah",
    rekomendasi_tempat: "Otak-Otak Amui, Pangkalpinang",
    tips: "Celupkan otak-otak ke tiga pilihan saus khas Babel: sambal tauco manis, sambal belacan pedas, atau saus cuka merah.",
    wilayah: "Bangka"
  },
  {
    id: "k5",
    nama: "Mie Koba",
    deskripsi: "Mie tradisi khas daerah Koba, Bangka Tengah dengan kuah khas ikan tenggiri bersantan kuning tipis beraroma kapulaga, cengkeh, dan kayumanis.",
    tipe: "sarapan",
    estimasi_biaya: "Rp 15.000",
    rekomendasi_tempat: "Mie Koba Iskandar, Pangkalpinang",
    tips: "Tambahkan satu butir telur rebus setengah matang langsung ke dalam mangkok mie agar kuah terasa lebih creamy.",
    wilayah: "Bangka"
  },
  {
    id: "k6",
    nama: "Bujan & Pempek Kulit Panggang",
    deskripsi: "Gorengan khas Bangka berbahan dasar keladi / talas yang diparut halus bersinergi dengan daging ikan tenggiri cincang dan digoreng garing renyah.",
    tipe: "murah meriah",
    estimasi_biaya: "Rp 3.000 per biji",
    rekomendasi_tempat: "Kedai Otak-Otak Ase, Pangkalpinang",
    tips: "Nikmati bujan selagi hangat karena kulit luarnya sangat garing renyah namun lembut pulen di bagian dalamnya.",
    wilayah: "Bangka"
  },
  {
    id: "k7",
    nama: "Kopi Saring Kong Djie",
    deskripsi: "Seduhan kopi robusta pekat tradisional legendaris beraroma arang kayu bakar dengan susu kental manis porsi pas.",
    tipe: "sarapan",
    estimasi_biaya: "Rp 12.000 - Rp 18.000",
    rekomendasi_tempat: "Warkop Kong Djie Sejak 1943, Tanjung Pandan",
    tips: "Sangat nikmat ditemani oleh Roti Bakar Selai Srikaya buatan rumahan buatan Kong Djie sendiri.",
    wilayah: "Belitung"
  },
  {
    id: "k8",
    nama: "Sotong Pangkong",
    deskripsi: "Cumi-cumi kering yang dibakar di atas bara arang lalu dipukul-pukul (dipangkong) dengan palu agar seratnya empuk, disajikan bersama siraman kuah cabe pedas manis.",
    tipe: "seafood",
    estimasi_biaya: "Rp 20.000 - Rp 40.000",
    rekomendasi_tempat: "Penjual Gerobak Kuliner Sore di Pantai Tanjung Pendam",
    tips: "Makanan cemilan ini sangat cocok dicicipi saat malam hari bersantai membakar sate cumi.",
    wilayah: "Belitung"
  }
];

// --- Lazy Initialize Gemini AI Client Safely ---
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiInstance;
}

// --- Local File Database Controls ---
function readDatabase(): { users: any[]; wisata: any[]; kuliners: any[]; reviews: any[]; itineraries: any[]; transaksi: any[] } {
  try {
    if (!fs.existsSync(DB_PATH)) {
      writeDatabase({
        users: [],
        wisata: defaultWisata,
        kuliners: defaultKuliner,
        reviews: [],
        itineraries: [],
        transaksi: []
      });
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Gagal membaca database:", error);
    return {
      users: [],
      wisata: defaultWisata,
      kuliners: defaultKuliner,
      reviews: [],
      itineraries: [],
      transaksi: []
    };
  }
}

function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Gagal menulis database:", error);
  }
}

// Ensure database file is ready upon start
const db = readDatabase();

// Sync database of kuliners to have correct 'wilayah' properties and match seed data
let dbUpdated = false;
if (db.kuliners && Array.isArray(db.kuliners)) {
  db.kuliners = db.kuliners.map((k: any) => {
    const seedMatch = defaultKuliner.find(dk => dk.id === k.id);
    if (seedMatch && (!k.wilayah || k.wilayah !== seedMatch.wilayah)) {
      dbUpdated = true;
      return { ...k, wilayah: seedMatch.wilayah };
    }
    return k;
  });
}

// In case the wisata seed data got new items, synchronize them without overwriting user changes
if (db.wisata && Array.isArray(db.wisata)) {
  defaultWisata.forEach((dw: any) => {
    const exists = db.wisata.some((w: any) => w.id === dw.id);
    if (!exists) {
      db.wisata.push(dw);
      dbUpdated = true;
    }
  });
}

if (dbUpdated) {
  writeDatabase(db);
  console.log("Database LocalTrip Babel berhasil dimigrasikan dengan properti wilayah kuliner & data tambahan.");
}

console.log(`Database LocalTrip Babel diinisialisasi dengan ${db.wisata.length} tempat wisata & ${db.kuliners.length} jenis kuliner khas.`);

// --- Authentication Middleware ---
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak terdeteksi, silakan masuk terlebih dahulu.' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Sesi kedaluwarsa atau token tidak valid. Silakan login kembali.' });
    }
    req.user = user;
    next();
  });
}

// --- Endpoints ---

// 1. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, tier } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Harap lengkapi username, email, dan password' });
    }

    const currentDb = readDatabase();
    const existingUser = currentDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Alamat e-mail ini sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'usr_' + Date.now(),
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      tier: tier === 'premium' ? 'premium' : 'free'
    };

    currentDb.users.push(newUser);
    writeDatabase(currentDb);

    // Sign JWT
    const tokenPayload = { id: newUser.id, username: newUser.username, email: newUser.email, tier: newUser.tier };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registrasi berhasil',
      token,
      user: tokenPayload
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Kesalahan sistem dalam pendaftaran' });
  }
});

// 2. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Harap lengkapi email dan password Anda' });
    }

    const currentDb = readDatabase();
    const user = currentDb.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Akun e-mail atau password tidak cocok' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Akun e-mail atau password tidak cocok' });
    }

    const tokenPayload = { id: user.id, username: user.username, email: user.email, tier: user.tier };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Masuk berhasil',
      token,
      user: tokenPayload
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Kesalahan sistem saat masuk' });
  }
});

// 3. Upgrade Tier to Premium
app.post('/api/auth/upgrade', authenticateToken, (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const currentDb = readDatabase();
    const userIndex = currentDb.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    currentDb.users[userIndex].tier = 'premium';
    writeDatabase(currentDb);

    // Save transaction
    const newTx = {
      id: 'tx_' + Date.now(),
      userId,
      amount: 29000,
      description: 'Upgrade to LocalTrip Babel Premium - 2 Bulan',
      date: new Date().toISOString()
    };
    currentDb.transaksi.push(newTx);
    writeDatabase(currentDb);

    // Re-sign Token
    const updatedUser = currentDb.users[userIndex];
    const tokenPayload = { id: updatedUser.id, username: updatedUser.username, email: updatedUser.email, tier: 'premium' };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Transaksi berhasil! Hubungan Anda telah ditingkatkan menjadi PREMIUM.',
      token,
      user: tokenPayload,
      transaction: newTx
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Kesalahan sistem pemutakhiran akun' });
  }
});

// 4. Rekomendasi Wisata (Tier-Bound)
app.post('/api/wisata/rekomendasi', (req, res) => {
  try {
    const { wilayah, kategori, tier } = req.body;
    if (!wilayah || !kategori) {
      return res.status(400).json({ error: 'Wilayah dan Kategori wajib diisi.' });
    }

    const currentDb = readDatabase();
    // Filter by wilayah and kategori
    let filtered = currentDb.wisata.filter(w => 
      w.wilayah.toLowerCase() === wilayah.toLowerCase() &&
      w.kategori.toLowerCase() === kategori.toLowerCase()
    );

    // Apply Tier Limitations
    const limit = (tier && tier.toLowerCase() === 'premium') ? 100 : 8;
    const result = filtered.slice(0, limit);

    res.json({ rekomendasi: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Dynamic Rekomendasi by Mood
app.post('/api/wisata/mood', (req, res) => {
  try {
    const { mood, wilayah, tier } = req.body;
    if (!mood || !wilayah) {
      return res.status(400).json({ error: 'Mood dan Wilayah wajib ditentukan.' });
    }

    const currentDb = readDatabase();
    // filter by wilayah
    let regionSpots = currentDb.wisata.filter(w => w.wilayah.toLowerCase() === wilayah.toLowerCase());
    
    // mood rules in backend
    let filteredSpots = [];
    const m = mood.toLowerCase();
    
    if (m === 'romantic' || m === 'honeymoon') {
      filteredSpots = regionSpots.filter(w => 
        w.kategori === 'pantai' || 
        w.kategori === 'cafe' || 
        w.nama.toLowerCase().includes('parai') || 
        w.nama.toLowerCase().includes('tinggi') || 
        w.nama.toLowerCase().includes('lengkuas') || 
        w.nama.toLowerCase().includes('keong') || 
        w.nama.toLowerCase().includes('benteng') || 
        w.nama.toLowerCase().includes('kelisut') ||
        w.nama.toLowerCase().includes('garden') ||
        w.nama.toLowerCase().includes('bolak') ||
        w.nama.toLowerCase().includes('puri') ||
        w.nama.toLowerCase().includes('pagoda') ||
        w.nama.toLowerCase().includes('aroma') ||
        w.nama.toLowerCase().includes('prizen') ||
        w.nama.toLowerCase().includes('acun') ||
        w.nama.toLowerCase().includes('pesona') ||
        w.nama.toLowerCase().includes('rambak') ||
        w.nama.toLowerCase().includes('aban') ||
        w.nama.toLowerCase().includes('bintang')
      );
    } else if (m === 'keluarga' || m === 'gathering') {
      filteredSpots = regionSpots.filter(w => 
        w.kategori === 'restoran' || 
        w.kategori === 'pantai' || 
        w.nama.toLowerCase().includes('botanical') || 
        w.nama.toLowerCase().includes('tikus emas') || 
        w.nama.toLowerCase().includes('pukan') ||
        w.nama.toLowerCase().includes('museum') ||
        w.nama.toLowerCase().includes('transmart') ||
        w.nama.toLowerCase().includes('cinema') ||
        w.nama.toLowerCase().includes('btc') ||
        w.nama.toLowerCase().includes('esenbi') ||
        w.nama.toLowerCase().includes('amertha') ||
        w.nama.toLowerCase().includes('d\'val') ||
        w.nama.toLowerCase().includes('temberan') ||
        w.nama.toLowerCase().includes('takari')
      );
    } else if (m === 'healing' || m === 'solo') {
      filteredSpots = regionSpots.filter(w => 
        w.kategori === 'cafe' || 
        w.nama.toLowerCase().includes('kaolin') || 
        w.nama.toLowerCase().includes('penyabong') || 
        w.nama.toLowerCase().includes('kong djie') || 
        w.nama.toLowerCase().includes('belimbing') ||
        w.nama.toLowerCase().includes('tunggal') ||
        w.nama.toLowerCase().includes('lensa') ||
        w.nama.toLowerCase().includes('ruang waktu') ||
        w.nama.toLowerCase().includes('feel') ||
        w.nama.toLowerCase().includes('tomoro') ||
        w.nama.toLowerCase().includes('kelae') ||
        w.nama.toLowerCase().includes('haluan') ||
        w.nama.toLowerCase().includes('kilometer') ||
        w.nama.toLowerCase().includes('d\'leb')
      );
    } else { // petualangan
      filteredSpots = regionSpots.filter(w => 
        w.kategori === 'spot_foto' || 
        w.nama.toLowerCase().includes('lengkuas') || 
        w.nama.toLowerCase().includes('kelayang') || 
        w.nama.toLowerCase().includes('bukit') || 
        w.nama.toLowerCase().includes('matras') || 
        w.nama.toLowerCase().includes('benteng') || 
        w.nama.toLowerCase().includes('gladox') ||
        w.nama.toLowerCase().includes('jembatan') ||
        w.nama.toLowerCase().includes('pagoda') ||
        w.nama.toLowerCase().includes('aban') ||
        w.nama.toLowerCase().includes('pesona') ||
        w.nama.toLowerCase().includes('bintang')
      );
    }

    // fallback if filter is too restrictive
    if (filteredSpots.length === 0) {
      filteredSpots = regionSpots;
    }

    const limit = (tier && tier.toLowerCase() === 'premium') ? 100 : 8;
    const result = filteredSpots.slice(0, limit);

    res.json({
      mood,
      wilayah,
      tier,
      rekomendasi: result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Estimasi Budget Otomatis (Premium Only, with fallback calculator)
app.post('/api/budget/estimate', authenticateToken, async (req: any, res: any) => {
  try {
    const { wilayah, jumlah_hari, jumlah_orang, tipe, asal_kota } = req.body;
    if (!wilayah || !jumlah_hari || !jumlah_orang) {
      return res.status(400).json({ error: 'Harap tentukan wilayah, jumlah hari, dan jumlah orang.' });
    }

    const days = parseInt(jumlah_hari) || 1;
    const people = parseInt(jumlah_orang) || 1;
    const targetType = (tipe || 'standar').toLowerCase();
    const origin = asal_kota || 'Jakarta';

    // Base math calculations (realistic values in IDR)
    // Packages cost calculations
    const calcPackage = (pkgType: 'hemat' | 'standar' | 'nyaman') => {
      let transportPerDay = 150000; // sewa motor
      let lodgingPerDay = 150000; // guesthouse
      let eatPerPersonPerDay = 50000;
      let ticketPerPerson = 20000;
      let flightEstimate = 0; // flight per person if not local

      if (origin.toLowerCase() !== 'pangkalpinang' && origin.toLowerCase() !== 'belitung') {
        flightEstimate = pkgType === 'hemat' ? 800000 : pkgType === 'standar' ? 1200000 : 1800000;
      }

      if (pkgType === 'standar') {
        transportPerDay = 450000; // sewa mobil avanza
        lodgingPerDay = 350000; // hotel bintang 3
        eatPerPersonPerDay = 100000;
        ticketPerPerson = 50000;
      } else if (pkgType === 'nyaman') {
        transportPerDay = 800000; // sewa mobil tipe premium Innova Reborn
        lodgingPerDay = 900000; // hotel bintang 4/5 tepi pantai
        eatPerPersonPerDay = 250000;
        ticketPerPerson = 120000;
      }

      // Total transport cost (depends on number of vehicles needed)
      const vehiclesNeeded = Math.ceil(people / (pkgType === 'hemat' ? 2 : 5));
      const totalTransport = transportPerDay * days * vehiclesNeeded;
      
      // Total lodging cost
      const roomsNeeded = Math.ceil(people / 2);
      const totalLodging = lodgingPerDay * days * roomsNeeded;

      // Eating & tickets
      const totalEat = eatPerPersonPerDay * days * people;
      const totalTickets = ticketPerPerson * people;
      const totalFlight = flightEstimate * people;

      const sum = totalTransport + totalLodging + totalEat + totalTickets + totalFlight;

      return {
        nama: pkgType.toUpperCase(),
        total_estimasi: `Rp ${sum.toLocaleString('id-ID')}`,
        rincian: {
          transportasi: `Rp ${totalTransport.toLocaleString('id-ID')} (${vehiclesNeeded} unit kendaraan)`,
          akomodasi: `Rp ${totalLodging.toLocaleString('id-ID')} (${roomsNeeded} kamar, harian)`,
          makan: `Rp ${totalEat.toLocaleString('id-ID')} (makan & minum)`,
          tiket_masuk: `Rp ${totalTickets.toLocaleString('id-ID')} (wisata & retribusi)`,
          lain_lain: totalFlight > 0 ? `Rp ${totalFlight.toLocaleString('id-ID')} (Tiket Pesawat bandara)` : "Rp 50.000 (antisipasi bensin)"
        },
        catatan: pkgType === 'hemat' 
          ? `Opsi sangat hemat menggunakan sewa motor roda dua, menginap di homestay bersih, makan kuliner murah meriah seperti Mie Belitung/Mie Koba.`
          : pkgType === 'standar'
          ? `Sewa mobil keluarga ber-AC, hotel nyaman berkolam renang, menikmati makan seafood lempah kuning malam hari.`
          : `Gaya santai berkelas, sewa mobil premium dengan supir, resor pantai bintang 4 terkemuka, snorkeling privat island hopping.`
      };
    };

    const packages = {
      HEMAT: calcPackage('hemat'),
      STANDAR: calcPackage('standar'),
      NYAMAN: calcPackage('nyaman')
    };

    const defaultTips = [
      "Pesanlah tiket penerbangan / kapal jauh hari menjelang musim liburan untuk memotong biaya hingga 30%.",
      "Sewa kendaraan motor lebih hemat jika Anda melakukan perjalanan solo atau berdua.",
      "Kuliner lokal di pinggir jalan seperti Lempah Kuning di Pangkalpinang atau Mie Belitung Atep rasanya sangat otentik dengan harga bersahabat."
    ];

    // Try Gemini AI enhancement for contextual descriptions
    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `Analisis rencana perjalanan wisata ke ${wilayah} untuk ${jumlah_orang} orang selama ${jumlah_hari} hari berasal dari ${origin}. Berikan tips hemat perjalanan khusus untuk situasi ini dalam bahasa Indonesia. Balas dalam struktur JSON yang memiliki kunci: "tips_hemat" (dalam bentuk array teks berisi 3 tips spesifik).`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text.trim());
          if (parsed.tips_hemat) {
            return res.json({
              packages,
              tips_hemat: parsed.tips_hemat
            });
          }
        }
      } catch (e) {
        console.warn("Gemini budget tips gagal, memakai default:", e);
      }
    }

    res.json({
      packages,
      tips_hemat: defaultTips
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Kuliner Khas Endpoint
app.post('/api/kuliner', (req, res) => {
  try {
    const { wilayah, preferensi, tier } = req.body;
    const currentDb = readDatabase();

    let list = currentDb.kuliners;
    if (preferensi && preferensi !== 'semua') {
      list = list.filter(k => k.tipe.toLowerCase() === preferensi.toLowerCase());
    }

    const limit = (tier && tier.toLowerCase() === 'premium') ? 10 : 3;
    const result = list.slice(0, limit);

    res.json({
      kategori: preferensi || 'semua',
      wilayah,
      tier,
      kuliner: result
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Admin: Wisata Validasi Konten (Skor Kelengkapan 0-100)
app.post('/api/admin/validate-wisata', (req, res) => {
  try {
    const { nama, lokasi, kategori, deskripsi, estimasi_biaya, jam_buka, tips, wilayah } = req.body;
    
    let scores = [];
    let issues = [];

    // Check nama
    if (nama && nama.length > 3) scores.push(15); else { scores.push(0); issues.push("Nama wisata kosong atau terlalu pendek (minimal 4 karakter)."); }
    // Check lokasi
    if (lokasi && lokasi.includes(',')) scores.push(15); else { scores.push(0); issues.push("Lokasi harus mengandung kabupaten dan kecamatan yang dipisah koma."); }
    // Check kategori
    if (['pantai', 'restoran', 'cafe', 'spot_foto', 'kuliner'].includes(kategori)) scores.push(15); else { scores.push(0); issues.push("Kategori wisata tidak sesuai daftar standard."); }
    // Check deskripsi
    if (deskripsi && deskripsi.length >= 20) scores.push(20); else { scores.push(0); issues.push("Deskripsi kurang dari 20 karakter, kurang informatif."); }
    // Check estimasi_biaya
    if (estimasi_biaya && (estimasi_biaya.includes('Rp') || estimasi_biaya.toLowerCase().includes('gratis'))) scores.push(15); else { scores.push(0); issues.push("Estimasi biaya wajib disertai unit Rupiah (Rp) atau keterangan 'Gratis'."); }
    // Check jam_buka
    if (jam_buka && jam_buka.toLowerCase().includes('wib')) scores.push(10); else { scores.push(0); issues.push("Jam operasional buka wajib menyertakan penanda zona waktu 'WIB'."); }
    // Check tips & wilayah
    if (tips && tips.length > 5) scores.push(10); else { scores.push(0); issues.push("Tips bepergian belum diisi atau terlalu ringkas."); }

    const finalScore = scores.reduce((sum, current) => sum + current, 0);
    const valid = finalScore >= 70;

    res.json({
      nama: nama || "Wisata Baru",
      score: finalScore,
      isValid: valid,
      issues: issues.length > 0 ? issues : ["Sempurna! Semua kelengkapan data terpenuhi."]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Trip Planner (Premium Only, AI Generator)
app.post('/api/trip/plan', authenticateToken, async (req: any, res: any) => {
  try {
    const { wilayah, budget, durasi, jumlah_orang, preferensi } = req.body;
    if (!wilayah || !budget || !durasi) {
      return res.status(400).json({ error: 'Harap lengkapi wilayah, budget maksimal, dan durasi trip.' });
    }

    const maxBudget = parseFloat(budget) || 1000000;
    const durasiDays = parseInt(durasi) || 1;
    const peopleStr = jumlah_orang || "1 orang";
    const prefStr = preferensi || "pantai, kuliner";

    // Standard Fallback Generator if Gemini AI is down or not set up
    const generateFallbackPlan = () => {
      const currentDb = readDatabase();
      const ads = currentDb.wisata.filter(w => w.wilayah.toLowerCase() === wilayah.toLowerCase());
      
      const selectCount = Math.min(ads.length, durasiDays * 2);
      const selectedSpots = ads.slice(0, selectCount);

      const itineraryDays = [];
      let calculatedTotal = 0;

      for (let d = 1; d <= durasiDays; d++) {
        const indexOffset = (d - 1) * 2;
        const spot1 = selectedSpots[indexOffset] || selectedSpots[0];
        const spot2 = selectedSpots[indexOffset + 1] || selectedSpots[1] || selectedSpots[0];

        itineraryDays.push({
          day: d,
          activities: [
            {
              waktu: "08.30 - 11.30 WIB",
              aktivitas: `Mengunjungi panorama indah ${spot1.nama}`,
              lokasi: spot1.lokasi,
              estimasi_durasi: "3 jam",
              estimasi_biaya: "Rp 15.000"
            },
            {
              waktu: "12.00 - 14.30 WIB",
              aktivitas: `Santap siang kuliner khas di area sekitar ${spot2.nama}`,
              lokasi: spot2.lokasi,
              estimasi_durasi: "2.5 jam",
              estimasi_biaya: "Rp 45.000"
            },
            {
              waktu: "15.00 - 17.30 WIB",
              aktivitas: `Menikmati sore hari yang teduh dan mengambil foto kenang-kenangan di ${spot2.nama}`,
              lokasi: spot2.lokasi,
              estimasi_durasi: "2.5 jam",
              estimasi_biaya: "Rp 10.000"
            }
          ]
        });
        calculatedTotal += (15000 + 45000 + 10000);
      }

      return {
        itinerary: itineraryDays,
        estimasi_total_biaya: `Rp ${(calculatedTotal * parseInt(peopleStr)).toLocaleString('id-ID')}`,
        tips_perjalanan: [
          "Gunakan sewa kendaraan seharga Rp 80.000/hari untuk berpindah lokasi dengan bebas.",
          "Mintalah bantuan pemandu warga apabila ingin menyeberang pulau karang luar.",
          "Nikmati makanan tradisional pempek panggang atau lempah di warung warga sekitar destinasi."
        ]
      };
    };

    const ai = getGeminiClient();
    if (!ai) {
      console.log("Kunci Gemini API tidak terdeteksi. Memakai perencana cerdas internal.");
      return res.json(generateFallbackPlan());
    }

    try {
      const currentDb = readDatabase();
      const ads = currentDb.wisata.filter(w => w.wilayah.toLowerCase() === wilayah.toLowerCase());
      const localKuliners = currentDb.kuliners.filter(k => k.wilayah && k.wilayah.toLowerCase() === wilayah.toLowerCase());

      const avSpots = ads.map(w => `- [Nama: ${w.nama}] Kategori: ${w.kategori}, Lokasi: ${w.lokasi}, Biaya: ${w.estimasi_biaya}, Jam Buka: ${w.jam_buka}, Deskripsi: ${w.deskripsi}`).join('\n');
      const avKuliners = localKuliners.map(k => `- [Nama Kuliner: ${k.nama}] Tipe: ${k.tipe}, Estimasi Biaya: ${k.estimasi_biaya}, Tempat Rekomendasi: ${k.rekomendasi_tempat}, Deskripsi: ${k.deskripsi}`).join('\n');

      const promptText = `
        Sebagai pemandu wisata handal "LocalTrip Babel", rancang itinerary liburan ke wilayah ${wilayah} untuk durasi ${durasiDays} hari bagi kelompok berukuran ${peopleStr} dengan total dana maksimal Rp ${maxBudget.toLocaleString('id-ID')}. Preferensi minat: ${prefStr}.
        
        Pilihlah dari daftar destinasi wisata terverifikasi di ${wilayah} berikut untuk menyusun aktivitas sehari-hari:
        ${avSpots}

        Pilihlah dari menu kuliner tradisional khas ${wilayah} berikut untuk dicantumkan saat waktu santap siang atau malam:
        ${avKuliners}

        Wajib penuhi aturan kriteria ini:
        1. HANYA gunakan destinasi wisata dan tempat makan dari daftar terverifikasi di atas. JANGAN mengarang nama-nama tempat lain yang tidak ada dalam daftar yang disediakan.
        2. Kelompokkan dan urutkan lokasi bepergian yang saling berdekatan (misal area Pangkalpinang, Sungailiat, atau Bangka Selatan) agar efisien waktu perjalanan dan hemat bensin.
        3. Total nominal estimasi biaya akumulasi per orang tidak boleh melebihi budget Rp ${maxBudget}.
        4. Setiap item aktivitas sertakan rincian estimasi jamnya dalam zona WIB, durasi ringkas (misal "2 jam"), biaya masuk, dan lokasi spesifik.
        5. Sertakan minimal 3 review tips perjalanan berfaedah dan personal di akhir respons.

        Keluarkan STRICTLY format JSON sesuai schema typescript ini:
        {
          "itinerary": [
            {
              "day": 1,
              "activities": [
                {
                  "waktu": "08.00 - 10.00 WIB",
                  "aktivitas": "Keterangan aktivitas singkat yang seru di tempat tersebut",
                  "lokasi": "Lokasi spesifik destinasi",
                  "estimasi_durasi": "2 jam",
                  "estimasi_biaya": "Rp 15.000"
                }
              ]
            }
          ],
          "estimasi_total_biaya": "Rp 250.000",
          "tips_perjalanan": ["tips 1", "tips 2"]
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptText,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              itinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          waktu: { type: Type.STRING },
                          aktivitas: { type: Type.STRING },
                          lokasi: { type: Type.STRING },
                          estimasi_durasi: { type: Type.STRING },
                          estimasi_biaya: { type: Type.STRING },
                        },
                        required: ["waktu", "aktivitas", "lokasi", "estimasi_durasi", "estimasi_biaya"]
                      }
                    }
                  },
                  required: ["day", "activities"]
                }
              },
              estimasi_total_biaya: { type: Type.STRING },
              tips_perjalanan: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["itinerary", "estimasi_total_biaya", "tips_perjalanan"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (aiErr) {
      console.warn("Panggilan inteligensi buatan gagal atau ditolak. Dialihkan ke generator lokal:", aiErr);
    }

    res.json(generateFallbackPlan());

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. AI Chat Assistant (Premium Only)
app.post('/api/chat', authenticateToken, async (req: any, res: any) => {
  try {
    const { pertanyaan, nama_user, wilayah, budget } = req.body;
    if (!pertanyaan) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const userName = nama_user || req.user.username || 'Traveler';
    const region = wilayah || 'Bangka Belitung';
    const totalBudget = budget ? `Rp ${parseInt(budget).toLocaleString('id-ID')}` : 'ekonomis';

    const cleanQuestion = pertanyaan.toLowerCase();
    const isOutOfTopic = !cleanQuestion.includes('wisata') && !cleanQuestion.includes('pantai') && 
                         !cleanQuestion.includes('kuliner') && !cleanQuestion.includes('makan') && 
                         !cleanQuestion.includes('hotel') && !cleanQuestion.includes('trip') && 
                         !cleanQuestion.includes('belitung') && !cleanQuestion.includes('bangka') && 
                         !cleanQuestion.includes('babel') && !cleanQuestion.includes('biaya') &&
                         !cleanQuestion.includes('itinerary') && !cleanQuestion.includes('kopi') &&
                         !cleanQuestion.includes('lempah') && !cleanQuestion.includes('mie') &&
                         !cleanQuestion.includes('transport') && !cleanQuestion.includes('rekomendasi') &&
                         !cleanQuestion.includes('halo') && !cleanQuestion.includes('hi') && !cleanQuestion.includes('pagi');

    if (isOutOfTopic) {
      return res.json({
        jawaban: `Halo ${userName}! Saya adalah pemandu wisata resmi LocalTrip Babel yang berdedikasi tinggi membantu Anda mengeksplorasi keindahan Bangka Belitung. 😊\n\nMengingat fokus utama saya, mari kita bincangkan topik seputar pariwisata, rahasia kuliner sedap Lempah Kuning, pantai eksotis berbatu granit, maupun penyusunan rute trip seru di Babel saja ya!\n\nAda destinasi indah di Bangka atau Belitung mana yang ingin Anda kepoin hari ini?`
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response with beautiful helpful local copy
      let fallbackText = `Halo Kak ${userName}! Senang sekali bisa membantu merencanakan liburanmu ke wilayah ${region}. `;
      if (cleanQuestion.includes('pantai')) {
        fallbackText += `Untuk pantai, rekomendasi utama di Belitung sudah pasti Pantai Tanjung Tinggi yang sangat legendaris dengan bebatuan batu granit raksasanya laksana latar film Laskar Pelangi. Di Bangka, cobalah mampir ke Pantai Parai Tenggiri di Sungailiat yang ombaknya tenang dan tosnya air laut sangat bersih. `;
      } else if (cleanQuestion.includes('makan') || cleanQuestion.includes('kuliner') || cleanQuestion.includes('lempah') || cleanQuestion.includes('mie')) {
        fallbackText += `Terkait sajian kuliner lezat yang wajib dicoba, usahakan tidak terlewat menyantap Mie Belitung Atep di Tanjung Pandan berbungkus daun simpor alami atau masakan Lempah Kuning Ikan khas Bangka yang menggunakan kuah terasi mangga muda pedas menantang di Pangkalpinang! `;
      } else {
        fallbackText += `Bangka Belitung menawarkan sejuta harmoni alam pantai pasir seputih salju dan kearifan masyarakat lokal yang ramah. Berbekal dana ${totalBudget}, Kakak sudah bisa mendapatkan fasilitas rental sepeda motor/mobil harian untuk menjelajahi keindahan desa wisata tepi barat secara fleksibel. `;
      }
      fallbackText += `\n\nSilakan tanyakan info lebih detail mengenai tiket masuk, lokasi berfoto estetik, maupun warung makan seafood nikmat ramah kantong lainnya ya Kak ${userName}!`;
      return res.json({ jawaban: fallbackText });
    }

    try {
      const currentDb = readDatabase();
      const regionFilter = region && region.toLowerCase() !== 'bangka belitung' ? region : null;

      let relevantSpots = currentDb.wisata;
      let relevantKuliners = currentDb.kuliners;

      if (regionFilter) {
        relevantSpots = relevantSpots.filter(w => w.wilayah.toLowerCase() === regionFilter.toLowerCase());
        relevantKuliners = relevantKuliners.filter(k => k.wilayah && k.wilayah.toLowerCase() === regionFilter.toLowerCase());
      }

      // Format a concise catalog of up to 45 spots so we don't exceed model limits while remaining extremely detailed
      const spotSummary = relevantSpots.map(w => `- ${w.nama} (Kategori: ${w.kategori}, Wilayah: ${w.wilayah}, Lokasi: ${w.lokasi}, Biaya: ${w.estimasi_biaya}, Jam Buka: ${w.jam_buka}, Tips: ${w.tips})`).slice(0, 45).join('\n');
      const kulinerSummary = relevantKuliners.map(k => `- ${k.nama} (Wilayah: ${k.wilayah}, Tipe: ${k.tipe}, Biaya: ${k.estimasi_biaya}, Rekomendasi Tempat: ${k.rekomendasi_tempat}, Deskripsi: ${k.deskripsi})`).join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: pertanyaan,
        config: {
          systemInstruction: `
            Kamu adalah AI Assistant (pemandu wisata lokal ramah dan berpengetahuan luas) dari platform "LocalTrip Babel".
            Nama user yang kamu layani saat ini adalah ${userName}.
            Detail situasi user: Wilayah perjalanan saat ini: ${region}, Budget bepergian: ${totalBudget}.

            Berikut adalah daftar riil destinasi wisata pariwisata berlisensi di database kita (${region}):
            ${spotSummary}

            Berikut adalah daftar riil menu kuliner tradisional khas yang berlisensi di database kita:
            ${kulinerSummary}

            Aturan wajib:
            - Jawab dengan Bahasa Indonesia yang santun, ramah, dan penuh keramahan lokal (selalu gunakan sapaan sapaan hangat Kak ${userName}).
            - Manfaatkan daftar wisata dan kuliner riil di atas untuk memberikan jawaban yang akurat, detail, dan mencantumkan keterangan biaya asli, lokasi, atau tips penting dari database.
            - JANGAN merekomendasikan tempat fiktif atau lokasi di luar data di atas bila ditanya tentang rekomendasi spesifik.
            - Batasi jawaban maksimal 3 paragraf pendek yang informatif, menarik, dan menyenangkan demi keterbacaan yang ringkas.
            - Selalu sebutkan nama user "${userName}" di awal percakapan sapaan agar terasa personal.
            - Jika ditanya di luar topik pariwisata Babel, alihkan kembali ke topik wisata atau kuliner dengan sopan, ceria, dan bersahabat.
          `
        }
      });

      if (response.text) {
        return res.json({ jawaban: response.text });
      }
    } catch (apiErr) {
      console.warn("Kesalahan panggilan chat Gemini:", apiErr);
    }

    // Default return
    res.json({ jawaban: `Halo ${userName}! Mohon maaf, koneksi asisten AI kami sedang mengalami penyesuaian jaringan. Namun demikian, pastikan Anda berkunjung ke Pulau Lengkuas yang cantik guna menyaksikan mercusuar kuno bergaya kolonial, serta mencicipi Mie Belitung Atep yang sangat manis gurih bumbu udangnya saat berkunjung ke Belitung ya!` });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Vite Middleware & Fallback ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server LocalTrip Babel berjalan pada http://localhost:${PORT}`);
  });
}

startServer();
