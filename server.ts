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
    estimasi_biaya: "Entrance: Free (Parking fee Rp5,000)",
    jam_buka: "Open 24 Hours (Best time: 06:00 AM - 06:00 PM)",
    tips: "Sangat aman untuk berenang bagi anak-anak. Panjat celah bebatuan granit besar di bagian kanan pantai untuk menikmati pemandangan sunset yang magis.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w12",
    nama: "Pantai Tanjung Kelayang",
    deskripsi: "Semenanjung pasir putih indah yang menjadi dermaga keberangkatan utama untuk kegiatan island hopping di Belitung, berlatar pemandangan pulau batu berbentuk kepala burung Garuda.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Entrance: Free / Boat Rental: Rp400,000 - Rp600,000 per boat",
    jam_buka: "Open 24 Hours (Boat rental available morning-afternoon)",
    tips: "Sewalah perahu tradisional di pantai ini semenjak pagi hari (pukul 08.00 WIB) untuk berkeliling ke pulau-pulau eksotis di sekeliling Sijuk.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w13",
    nama: "Pulau Lengkuas",
    deskripsi: "Pulau kecil tercantik di Belitung yang terkenal dengan Mercusuar bersejarah peninggalan kolonial Belanda tahun 1882 yang masih kokoh berdiri, dikelilingi taman laut terumbu karang yang menakjubkan untuk snorkeling.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Island Entrance: Free (Voluntary cleanliness donation)",
    jam_buka: "Boat Access (07:00 AM - 03:00 PM)",
    tips: "Bawalah roti mentega kering untuk menarik gerombolan ikan badut dan ikan karang warna-warni saat ber-snorkeling aman di perairan dangkal.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w14",
    nama: "Danau Kaolin Belitung",
    deskripsi: "Bekas penambangan mineral kaolin yang membentuk cekungan air biru muda laksana susu yang kontras dengan bebatuan tanah berkapur putih salju. Sangat berbeda dari bekas tambang lainnya karena tidak mengeluarkan bau belerang.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Entrance: Rp2,000 - Rp5,000 (Local retribution fee)",
    jam_buka: "Daily (06:00 AM - 06:00 PM)",
    tips: "Disarankan berkunjung sebelum matahari terlalu terik (pukul 08.00 WIB atau sore hari pukul 16.30 WIB) demi mendapatkan pantulan cahaya air dan langit yang maksimal.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w15",
    nama: "Kopi Kong Djie Siburik",
    deskripsi: "Kedai kopi legendaris Kong Djie pusat di pertigaan Siburik, Tanjung Pandan yang meracik kopi menggunakan teko tembaga kuno tinggi sejak tahun 1943 dengan keharuman gosong arang khasnya.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp10,000 - Rp25,000 per cup",
    jam_buka: "Daily (06:00 AM - 12:00 AM)",
    tips: "Pesan Kopi O (Kopi Hitam Pekat) atau Kopi Susu hangat pendamping roti panggang srikayanya untuk memulai pagi hari yang menenangkan.",
    kategori: "cafe",
    wilayah: "Belitung"
  },
  {
    id: "w16",
    nama: "Mie Belitung Atep",
    deskripsi: "Warung mie paling melegenda di Belitung milik Ny. Atep, menyajikan mie kuning gurih dengan kuah kaldu udang manis kental khas Belitung, diberi topping potongan udang, emping renyah, kentang rebus, timun segar, dan dibungkus daun simpor.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp15,000 - Rp30,000 per portion",
    jam_buka: "Daily (08:00 AM - 08:00 PM)",
    tips: "Cicipi kuahnya yang manis gurih beraroma rempah dan nikmati kesegarannya bersamaan dengan segelas es jeruk kunci peras segar.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w17",
    nama: "Rumah Adat Belitung",
    deskripsi: "Rumah panggung tradisional kayu ulin khas melayu Belitung yang megah dengan ornamen kerajinan lokal dan pakaian adat pengantin Belitung di bagian dalamnya.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Voluntary donation / Rp5,000",
    jam_buka: "08:00 AM - 04:00 PM",
    tips: "Replika rumah bangsawan melayu Belitung terbuat dari kayu besi ulin hitam. Sangat megah berciri jendela adat, ideal untuk latar potret klasik Melayu kuno.",
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
  },
  {
    id: "w21",
    nama: "RM Belitong Timpo Duluk",
    deskripsi: "Restoran bernuansa etnik Belitung tempo dulu yang menyajikan hidangan legendaris dalam tradisi makan bersama khas Belitung bernama 'Makan Bedulang'.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Bedulang Package: Rp150,000 - Rp250,000 (for 4 people)",
    jam_buka: "Daily (11:00 AM - 09:00 PM)",
    tips: "Pesan paket Bedulang otentik bersama teman atau keluarga dengan lauk khas gangan, sate cumi, dan sambal serai khas Melayu Belitung tempo dulu.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w22",
    nama: "Kampong Dedaun",
    deskripsi: "Sebuah restoran santai tepi pantai dengan pepohonan rindang dan area beanbag nyaman di tepi laut yang tenang, menawarkan kuliner laut khas Belitung yang nikmat.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Rp50,000 - Rp150,000 per person",
    jam_buka: "Daily (10:00 AM - 09:00 PM)",
    tips: "Sangat asyik berkunjung menjelang sore hari untuk bersantai menikmati jus kelapa muda andalan sambil menunggu pemandangan langit senja jingga damai.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w23",
    nama: "Pantai Burung Mandi",
    deskripsi: "Pantai timur Belitung berlatar pemandangan Gunung Burung Mandi yang megah dengan pesona khas barisan kapal tradisional Kater nelayan penuh warna berpajangkan ornamen unik burung.",
    lokasi: "Damar, Kabupaten Belitung Timur",
    estimasi_biaya: "Rp5,000 (Tiket masuk)",
    jam_buka: "24 Hours (Buka 24 Jam)",
    tips: "Nikmati kelapa muda lokal berbaur angin sepoi di jajaran warung rakyat tepi pantai sambil memandangi hamparan laut lepas berlatar gunung.",
    kategori: "pantai",
    wilayah: "Belitung"
  },
  {
    id: "w24",
    nama: "Pulau Batu Berlayar",
    deskripsi: "Pulau pasir putih nan imut bercirikan gugusan batuan granit besar yang berdiri tegak laksana layar kapal yang sedang mengarungi kristal air laut Belitung.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Termasuk Paket Perahu Island Hopping",
    jam_buka: "Depends on sea tides (Best time: 09:00 AM - 02:00 PM)",
    tips: "Datanglah saat pasang surut siang hari agar hamparan pasirnya timbul utuh, memberikan latar swafoto bebatuan raksasa bagaikan melayang di air jernih.",
    kategori: "spot_foto",
    wilayah: "Belitung"
  },
  {
    id: "w25",
    nama: "Rumah Makan Raja Seafood Belitung",
    deskripsi: "Spesialis hidangan laut premium nan bersih di Tanjung Pandan dengan menu andalan sup Gangan Karang kelapa muda super segar penuh rempah dambaan wisatawan.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp40,000 - Rp120,000 per seafood menu item",
    jam_buka: "10:00 AM - 10:00 PM",
    tips: "Coba Gangan kepala ikan ketarap yang gurih berpadu sajian bumbu lada hitam kepiting lokal yang tebal legit.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w26",
    nama: "Raja Rasa Seafood",
    deskripsi: "Menyediakan santapan ikan bakar rempah otentik dari tangkapan nelayan harian dan cumi goreng tepung krispis yang lezat persis di pesisir pantai sejuk.",
    lokasi: "Sijuk, Kabupaten Belitung",
    estimasi_biaya: "Rp35,000 - Rp90,000 per portion",
    jam_buka: "08:00 AM - 07:00 PM",
    tips: "Lokasi terbaik makan berat seafood santai seusai asyik berenang bermain air laut di sepanjang semenanjung pantai Sijuk.",
    kategori: "restoran",
    wilayah: "Belitung"
  },
  {
    id: "w27",
    nama: "Batu Garuda Beach Club & Resto",
    deskripsi: "Beach club bernuansa modern tropikal satu-satunya di seberang landmark batu mulia Batu Garuda, dilengkapi kolam renang tak bertepi dan sajian kuliner ala barat serta nusantara.",
    lokasi: "Pantai Tanjung Kelayang, Kabupaten Belitung",
    estimasi_biaya: "Rp35,000 - Rp120,000",
    jam_buka: "11:00 AM - 10:00 PM",
    tips: "Ini adalah spot paling estetik merayakan petang senja sembari meneguk jus segar bernostalgia dengan tarian laut luar.",
    kategori: "cafe",
    wilayah: "Belitung"
  },
  {
    id: "w28",
    nama: "Kopi Kita Belitung",
    deskripsi: "Coffee shop berarsitektur industrial minimalis di pusat Tanjung Pandan yang menghidangkan aneka teh artisan, racikan espresso modern, dan sajian manual brew biji lokal berkualitas tinggi.",
    lokasi: "Tanjung Pandan, Kabupaten Belitung",
    estimasi_biaya: "Rp20,000 - Rp45,000",
    jam_buka: "09:00 AM - 11:00 PM",
    tips: "Gedungnya sejuk bersahabat, sangat cocok dijadikan tempat bersinggah kerja remote laptopan (WFC) atau ngobrol intim sore hari.",
    kategori: "cafe",
    wilayah: "Belitung"
  },
  {
    id: "w29",
    nama: "SD Laskar Pelangi & Museum Kata",
    deskripsi: "Replika sekolah dasar legendaris dari kayu berlantai pasir bersebelahan dengan Museum Kata Andrea Hirata — pusat kesenian sastra yang kaya corak piringan klasik berwarna puitis dramatis.",
    lokasi: "Gantung, Kabupaten Belitung Timur",
    estimasi_biaya: "Rp5,000 (Replika SD) & Rp50,000 (Museum Kata - gratis buku saku)",
    jam_buka: "09:00 AM - 05:00 PM",
    tips: "Bawa kamera terbaik Anda untuk berfoto di ruang-ruang sastra estetik dan abadikan aura kenangan perjuangan mengejar impian masa kecil Laskar Pelangi.",
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
    estimasi_biaya: "Rp15,000 - Rp30,000 per portion",
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
  },
  {
    id: "k9",
    nama: "Asui Seafood",
    deskripsi: "Asui Seafood is one of the most popular and legendary seafood restaurants in Pangkalpinang. This restaurant serves a wide variety of fresh Bangka-style seafood dishes with rich and flavorful local spices.",
    tipe: "seafood",
    estimasi_biaya: "Rp50,000 - Rp200,000",
    rekomendasi_tempat: "Jalan Yang Zubaidah No. 242, Pangkalpinang",
    tips: "Casual dining atmosphere suitable for family meals or business gatherings.",
    rating: 4.3,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Seafood Restaurant",
    highlights: [
      "Serves fresh local fish, crab, and squid dishes.",
      "Casual dining atmosphere suitable for family meals or business gatherings.",
      "Features authentic Bangka-style original seasonings."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k10",
    nama: "Restaurant Seafood Mr. Adox",
    deskripsi: "Restaurant Seafood Mr. Adox offers various seafood menu selections with a spacious and comfortable dining area. It is a favorite destination for both tourists and local residents because of its fresh seafood ingredients.",
    tipe: "seafood",
    estimasi_biaya: "Rp75,000 - Rp150,000",
    rekomendasi_tempat: "Jalan Raya Pasir Padi, Pangkalpinang",
    tips: "Spacious restaurant area with facilities suitable for large groups.",
    rating: 4.6,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Seafood Restaurant",
    highlights: [
      "Signature dishes include grilled fish, prawns, and Bangka-style Lempah Kuning.",
      "Spacious restaurant area with facilities suitable for large groups.",
      "Strategically located on a main road and easily accessible."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k11",
    nama: "SEAFOOD BANG GOOD",
    deskripsi: "SEAFOOD BANG GOOD is an excellent option for visitors looking for affordable seafood dishes without compromising taste quality. It is highly recommended for a casual dinner experience.",
    tipe: "seafood",
    estimasi_biaya: "Rp50,000 - Rp75,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Friendly service highly appreciated by visitors.",
    rating: 4.3,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Restaurant",
    highlights: [
      "Affordable and budget-friendly seafood menu options.",
      "Wide variety of sauce and seasoning choices.",
      "Friendly service highly appreciated by visitors."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k12",
    nama: "Tsahang La Mira",
    deskripsi: "Tsahang La Mira integrates a modern restaurant concept with traditional Bangka cuisine, presenting dynamic local flavors in an elegant manner.",
    tipe: "halal",
    estimasi_biaya: "Rp50,000 - Rp150,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Clean, aesthetic, and comfortable dining atmosphere.",
    rating: 4.5,
    jam_buka: "Open daily — closes at 11:00 PM",
    kategori: "Restaurant",
    highlights: [
      "Signature local dishes include Rusip, Lempah Kulat, and fresh seafood specialties.",
      "Clean, aesthetic, and comfortable dining atmosphere.",
      "Open until late evening, especially on weekends."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k13",
    nama: "Gale-Gale Seafood Bangka",
    deskripsi: "Gale-Gale Seafood Bangka is widely known for its exceptionally high ratings due to the consistency of its seafood flavors. Uniquely, this restaurant starts operating from the morning.",
    tipe: "seafood",
    estimasi_biaya: "Rp75,000 - Rp100,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Opens from 08:00 AM, making it suitable for early heavy meals.",
    rating: 4.9,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Family Restaurant",
    highlights: [
      "Complete seafood menu with strong authentic Bangka seasonings.",
      "Opens from 08:00 AM, making it suitable for early heavy meals.",
      "Maintains excellent cleanliness and seafood freshness standards."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k14",
    nama: "Warung Yok Ngopi",
    deskripsi: "Warung Yok Ngopi offers a relaxing morning atmosphere with traditional local filtered coffee and various snacks perfect for breakfast.",
    tipe: "sarapan",
    estimasi_biaya: "Rp25,000 - Rp50,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Relaxed open-space atmosphere ideal for starting the day.",
    rating: 4.2,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Café",
    highlights: [
      "Serves traditional black filtered coffee and legendary milk coffee.",
      "Variety of Bangka traditional cakes and snacks.",
      "Relaxed open-space atmosphere ideal for starting the day."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k15",
    nama: "Tung Tau Semabung",
    deskripsi: "Tung Tau Semabung is a branch of one of the most legendary coffee shops in Bangka, famous since the colonial era for its old-style toast and traditional filtered coffee.",
    tipe: "sarapan",
    estimasi_biaya: "Rp25,000 - Rp50,000",
    rekomendasi_tempat: "Semabung, Pangkalpinang",
    tips: "Affordable prices with consistently authentic flavors.",
    rating: 4.3,
    jam_buka: "Open 24 Hours",
    kategori: "Coffee Shop",
    highlights: [
      "Open 24 hours, making it a highly flexible breakfast destination.",
      "Iconic menu items include Egg Toast, homemade Kaya Toast, and authentic Kopi O.",
      "Affordable prices with consistently authentic flavors."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k16",
    nama: "Kolabore",
    deskripsi: "Kolabore offers a modern gathering concept with coffee and food selections suitable for lunch, remote work, or relaxing in the afternoon.",
    tipe: "sarapan",
    estimasi_biaya: "Rp50,000 - Rp75,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Note: Opens from 11:00 AM (except Fridays at 01:00 PM).",
    rating: 4.6,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Coffee Shop",
    highlights: [
      "Modern interior design suitable for younger visitors and remote workers.",
      "Wide variety of modern coffee and snack options.",
      "Opens from 11:00 AM (except Fridays at 01:00 PM)."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k17",
    nama: "Kopitiam",
    deskripsi: "This Kopitiam in the Air Itam area provides a practical and comfortable atmosphere for enjoying warm traditional filtered coffee in the morning.",
    tipe: "sarapan",
    estimasi_biaya: "Rp25,000 - Rp50,000",
    rekomendasi_tempat: "Air Itam, Pangkalpinang",
    tips: "Very affordable and worker-friendly prices.",
    rating: 4.8,
    jam_buka: "Open daily — closes at 10:00 PM",
    kategori: "Restaurant",
    highlights: [
      "Simple breakfast menu with traditional tea and filtered coffee.",
      "Strategic location near office areas in Air Itam.",
      "Very affordable and worker-friendly prices."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k18",
    nama: "Rumah Lama Kopi",
    deskripsi: "Rumah Lama Kopi offers a warm nostalgic atmosphere with a vintage house concept, perfect for enjoying traditional morning coffee.",
    tipe: "sarapan",
    estimasi_biaya: "Rp1 - Rp25,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Traditional snack selections ideal for morning conversations.",
    rating: 4.9,
    jam_buka: "Open daily — closes at 11:59 PM",
    kategori: "Coffee Shop",
    highlights: [
      "Classic traditional house ambiance that feels calm and relaxing.",
      "Opens from 07:00 AM with strong aromatic filtered coffee.",
      "Traditional snack selections ideal for morning conversations."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k19",
    nama: "Mie Ayam Bangka Haji Aziz",
    deskripsi: "One of the most popular halal Bangka noodle spots. The noodles are homemade, chewy, topped with generous minced chicken, and served with savory broth.",
    tipe: "halal",
    estimasi_biaya: "Rp15,000 - Rp25,000",
    rekomendasi_tempat: "Pangkalpinang, Bangka",
    tips: "Simple local eatery that is always crowded in the morning with very affordable prices.",
    rating: 4.7,
    jam_buka: "06:00 AM - 12:00 PM",
    kategori: "Noodle Shop",
    highlights: [
      "Homemade, chewy, high-quality noodles.",
      "Topped with delicious generous minced chicken.",
      "Served with savory warm broth."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k20",
    nama: "Tahu Kok & Mie Belinyu",
    deskripsi: "Tahu Kok is a must-try Bangka culinary dish consisting of fish tofu soup, fried fish cakes (fukian), and boiled fish balls served in fresh seafood broth.",
    tipe: "halal",
    estimasi_biaya: "Rp20,000 - Rp35,000",
    rekomendasi_tempat: "Kampung Bintang & Belinyu area, Bangka",
    tips: "Many budget-friendly halal stalls in this area serve fresh mackerel-based dishes.",
    rating: 4.6,
    jam_buka: "07:00 AM - 02:00 PM",
    kategori: "Traditional Eatery",
    highlights: [
      "Consists of fish tofu soup, fried fish cakes (fukian), and boiled fish balls.",
      "Served in fresh hot seafood broth.",
      "Highly budget-friendly and fully halal."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k21",
    nama: "Otak-Otak Bangka",
    deskripsi: "A classic Bangka breakfast or snack made from grilled mackerel fish cake served warm with three vinegar sauce options: fermented soybean vinegar (tauco), shrimp paste vinegar, and sweet spicy vinegar.",
    tipe: "murah meriah",
    estimasi_biaya: "Rp3,000 - Rp4,000 per piece",
    rekomendasi_tempat: "Otak-Otak Amui, Pangkalpinang, Bangka",
    tips: "Relaxed food stalls with very affordable prices, allowing visitors to enjoy as much as they want.",
    rating: 4.8,
    jam_buka: "09:00 AM - 09:00 PM",
    kategori: "Snack Stall",
    highlights: [
      "Made from fresh grilled mackerel fish cake.",
      "Served warm in folded banana leaves.",
      "Comes with three distinct sauce options: tauco, shrimp paste, and sweet-spicy vinegar."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k22",
    nama: "Warkop Kong Djie",
    deskripsi: "Originally established in Belitung in 1943, the Pangkalpinang branch serves the same authentic filtered coffee using a signature tall copper kettle. The smoky charcoal aroma is highly distinctive.",
    tipe: "sarapan",
    estimasi_biaya: "Rp15,000 - Rp30,000",
    rekomendasi_tempat: "Warkop Kong Djie Branch, Pangkalpinang",
    tips: "A very local and authentic gathering place for all generations since early morning.",
    rating: 4.5,
    jam_buka: "06:00 AM - 10:00 PM",
    kategori: "Traditional Coffee Shop",
    highlights: [
      "Authentic filtered coffee using high brass or copper teko kettle.",
      "Smoky charcoal aroma that is highly distinctive.",
      "Local and welcoming atmosphere for all generations."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k23",
    nama: "Warung Kopi Kelekak",
    deskripsi: "Combines a local coffee shop concept with strong Bangka cultural influences. Besides excellent filtered coffee, they also serve traditional cakes such as rampa-rampa, jongkong, and talam at affordable prices.",
    tipe: "murah meriah",
    estimasi_biaya: "Rp2,000 - Rp15,000",
    rekomendasi_tempat: "Warung Kopi Kelekak, Pangkalpinang",
    tips: "Enjoy traditional cakes under cozy vintage wooden setups.",
    rating: 4.6,
    jam_buka: "06:35 AM - 06:00 PM",
    kategori: "Traditional Café",
    highlights: [
      "Pairs filtered coffee with traditional local snacks.",
      "Serves authentic rampa-rampa, jongkong, and talam cakes.",
      "Strong Bangka cultural influences and design."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k24",
    nama: "Lempah Kuning Muara",
    deskripsi: "Located near the harbor/coastal area, this place is famous for its extremely fresh fish, commonly using snapper or ketarap fish. Visitors can directly choose their fish before it is freshly cooked.",
    tipe: "seafood",
    estimasi_biaya: "Rp30,000 - Rp60,000",
    rekomendasi_tempat: "Pelabuhan Pasir Padi / Muara area, Pangkalpinang",
    tips: "A simple semi-open dining place focused on delivering bold authentic flavors at prices much more affordable than large seafood restaurants.",
    rating: 4.7,
    jam_buka: "09:00 AM - 05:00 PM",
    kategori: "Eatery Shop",
    highlights: [
      "Extremely fresh fish straight from the coastal harbor.",
      "Choose your own snapper or ketarap fish.",
      "Simple, semi-open dining space focused on bold authentic spices."
    ],
    wilayah: "Bangka"
  },
  {
    id: "k25",
    nama: "RM Belitong Timpo Duluk",
    deskripsi: "Sajian legendaris dalam tradisi makan bersama khas adat Melayu Belitung bernama 'Makan Bedulang' menggunakan dulang kuningan berpenutup saji merah berisi aneka piring lauk murni nusantara.",
    tipe: "halal",
    estimasi_biaya: "Bedulang Package: Rp150,000 - Rp250,000 (untuk 4 orang)",
    rekomendasi_tempat: "RM Belitong Timpo Duluk, Jalan Letjan Pilang, Tanjung Pandan",
    tips: "Nikmati pengalaman makan bedulang otentik bersama teman atau keluarga dengan lauk gangan segar, sate cumi, dan sambal serai.",
    wilayah: "Belitung"
  },
  {
    id: "k26",
    nama: "Kampong Dedaun",
    deskripsi: "Sajian kuliner khas Belitung dinikmati langsung di area bersantai beanbag tepi pantai pasir putih bernaungkan pepohonan hijau rindang.",
    tipe: "seafood",
    estimasi_biaya: "Rp50,000 - Rp150,000 per orang",
    rekomendasi_tempat: "Kampong Dedaun, Sijuk, Belitung",
    tips: "Sangat asyik berkunjung sore hari memesan kelapa muda segar peneman nikmatnya hidangan ikan kuah tim bumbu sereh.",
    wilayah: "Belitung"
  },
  {
    id: "k27",
    nama: "Rumah Makan Raja Seafood Belitung",
    deskripsi: "Restoran hidangan laut populer bersertifikat bersih di Tanjung Pandan dengan sajian Gangan Karang (sup ikan bumbu nanas asam pedas) legendaris dambaan wisatawan.",
    tipe: "seafood",
    estimasi_biaya: "Rp40,000 - Rp120,000 per menu item",
    rekomendasi_tempat: "RM Raja Seafood, Tanjung Pandan, Belitung",
    tips: "Ikan ketarap segar yang dimasak bumbu kuning gangan adalah primadona wajib dambaan pencinta rasa lokal.",
    wilayah: "Belitung"
  },
  {
    id: "k28",
    nama: "Raja Rasa Seafood",
    deskripsi: "Tempat makan seafood pinggir pantai Sijuk menyajikan kelembutan ikan bakar berbalut bumbu otentik khas tangkapan nelayan lokal harian.",
    tipe: "seafood",
    estimasi_biaya: "Rp35,000 - Rp90,000 per portion",
    rekomendasi_tempat: "Raja Rasa Seafood, Sijuk, Belitung",
    tips: "Cicipi renyahnya cumi goreng tepung krispi dan kepiting pedas padang seusai bermanja membelah air laut.",
    wilayah: "Belitung"
  },
  {
    id: "k29",
    nama: "Batu Garuda Beach Club & Resto",
    deskripsi: "Restoran berkonsep beach club tropikal modern berhadapan langsung dengan pulau beraliran Batu Garuda, menyajikan menu fusion western dan lokal lezat.",
    tipe: "seafood",
    estimasi_biaya: "Rp35,000 - Rp120,000",
    rekomendasi_tempat: "Batu Garuda Beach Club, Pantai Tanjung Kelayang, Belitung",
    tips: "Ini adalah spot paling fotogenik di Belitung untuk menghabiskan petang berlatar matahari terbenam sembari menikmat sajian pizza atau hidangan laut.",
    wilayah: "Belitung"
  },
  {
    id: "k30",
    nama: "Kopi Kita Belitung",
    deskripsi: "Cafe aesthetic industrial minimalis di kawasan pusat kota Tanjung Pandan, menyajikan kopi saring modern, espresso-based, latte art, dan camilan nikmat.",
    tipe: "sarapan",
    estimasi_biaya: "Rp20,000 - Rp45,000",
    rekomendasi_tempat: "Kopi Kita Belitung, Tanjung Pandan",
    tips: "Sangat representatif untuk tempat bersantai sejuk ber-AC mendinginkan tubuh di siang hari atau membuka laptop bekerja remote (WFC).",
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

// Sync database of kuliners to have correct 'wilayah' properties, content updates, and append new ones
let dbUpdated = false;
if (db.kuliners && Array.isArray(db.kuliners)) {
  db.kuliners = db.kuliners.map((k: any) => {
    const seedMatch = defaultKuliner.find(dk => dk.id === k.id);
    if (seedMatch) {
      // Synchronize properties if they differ from our newly updated seed definitions
      if (
        !k.wilayah || 
        k.wilayah !== seedMatch.wilayah || 
        k.nama !== seedMatch.nama || 
        k.tipe !== seedMatch.tipe || 
        k.estimasi_biaya !== seedMatch.estimasi_biaya || 
        k.rekomendasi_tempat !== seedMatch.rekomendasi_tempat || 
        k.tips !== seedMatch.tips ||
        k.deskripsi !== seedMatch.deskripsi ||
        k.rating !== seedMatch.rating ||
        k.jam_buka !== seedMatch.jam_buka ||
        k.kategori !== seedMatch.kategori ||
        JSON.stringify(k.highlights) !== JSON.stringify(seedMatch.highlights)
      ) {
        dbUpdated = true;
        return { ...k, ...seedMatch };
      }
    }
    return k;
  });

  // Also append any new seed culinary items that do not exist yet in database
  defaultKuliner.forEach((dk: any) => {
    const exists = db.kuliners.some((k: any) => k.id === dk.id);
    if (!exists) {
      db.kuliners.push(dk);
      dbUpdated = true;
    }
  });
}

// In case the wisata seed data got new items or updates, synchronize them
if (db.wisata && Array.isArray(db.wisata)) {
  db.wisata = db.wisata.map((w: any) => {
    const seedMatch = defaultWisata.find(dw => dw.id === w.id);
    if (seedMatch) {
      if (
        w.nama !== seedMatch.nama ||
        w.deskripsi !== seedMatch.deskripsi ||
        w.lokasi !== seedMatch.lokasi ||
        w.estimasi_biaya !== seedMatch.estimasi_biaya ||
        w.jam_buka !== seedMatch.jam_buka ||
        w.tips !== seedMatch.tips ||
        w.kategori !== seedMatch.kategori ||
        w.wilayah !== seedMatch.wilayah
      ) {
        dbUpdated = true;
        return { ...w, ...seedMatch };
      }
    }
    return w;
  });

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
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tips_hemat: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["tips_hemat"]
            }
          }
        });

        if (response.text) {
          let cleanText = response.text.trim();
          if (cleanText.startsWith("```json")) {
            cleanText = cleanText.substring(7);
          }
          if (cleanText.endsWith("```")) {
            cleanText = cleanText.substring(0, cleanText.length - 3);
          }
          cleanText = cleanText.trim();

          const parsed = JSON.parse(cleanText);
          if (parsed && Array.isArray(parsed.tips_hemat)) {
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
    
    // Filter by island (Bangka or Belitung) if provided
    if (wilayah) {
      list = list.filter(k => k.wilayah && k.wilayah.toLowerCase() === wilayah.toLowerCase());
    }

    if (preferensi && preferensi !== 'semua') {
      list = list.filter(k => k.tipe.toLowerCase() === preferensi.toLowerCase());
    }

    const limit = (tier && tier.toLowerCase() === 'premium') ? 35 : 3;
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
    const { pertanyaan, nama_user, wilayah, budget, history, tier, persona, interest, budgetTone, userMood } = req.body;
    if (!pertanyaan) {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const userName = nama_user || req.user.username || 'Traveler';
    const region = wilayah || 'Bangka Belitung';
    const totalBudget = budget ? `Rp ${parseInt(budget).toLocaleString('id-ID')}` : 'ekonomis';
    const userPersona = persona || 'Smart Explorer';
    const userInterest = interest || 'Menyeluruh';
    const userBudgetTone = budgetTone || 'Seimbang';
    const currentMood = userMood || 'Cheerful & Excited';
    const membershipTier = tier || 'premium'; // Default to premium for this route

    const cleanQuestion = pertanyaan.toLowerCase();
    const isOutOfTopic = !cleanQuestion.includes('wisata') && !cleanQuestion.includes('pantai') && 
                         !cleanQuestion.includes('kuliner') && !cleanQuestion.includes('makan') && 
                         !cleanQuestion.includes('hotel') && !cleanQuestion.includes('trip') && 
                         !cleanQuestion.includes('belitung') && !cleanQuestion.includes('bangka') && 
                         !cleanQuestion.includes('babel') && !cleanQuestion.includes('biaya') &&
                         !cleanQuestion.includes('itinerary') && !cleanQuestion.includes('kopi') &&
                         !cleanQuestion.includes('lempah') && !cleanQuestion.includes('mie') &&
                         !cleanQuestion.includes('transport') && !cleanQuestion.includes('rekomendasi') &&
                         !cleanQuestion.includes('halo') && !cleanQuestion.includes('hi') && !cleanQuestion.includes('pagi') &&
                         !cleanQuestion.includes('siang') && !cleanQuestion.includes('malam') && !cleanQuestion.includes('sore') &&
                         !cleanQuestion.includes('cuaca') && !cleanQuestion.includes('sunset') && !cleanQuestion.includes('tips');

    if (isOutOfTopic) {
      return res.json({
        jawaban: `Halo Kak ${userName}! Saya adalah BabelGuide PRO, asisten wisata & concierge virtual resmi dari LocalTrip Babel. 😊\n\nMengingat fokus keilmuan lokal saya, mari bincangkan topik seputar pariwisata, kuliner lezat Lempah Kuning, pantai eksotis berbatu granit raksasa di Belitung, maupun rute penyusunan itinerary khusus di Bangka Belitung saja ya!\n\nApakah ada lokasi wisata indah atau kuliner khas di Bangka atau Belitung yang ingin Kakak tanyakan?`
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response with beautiful helpful local copy
      let fallbackText = `Halo Kak ${userName}! Senang sekali bisa membantu merencana liburan Kakak ke wilayah ${region}. `;
      if (cleanQuestion.includes('pantai')) {
        fallbackText += `Untuk kategori pantai eksotis, rekomendasi utama di Belitung adalah Pantai Tanjung Tinggi (Pantai Laskar Pelangi) dengan bebatuan granit purba raksasa yang memesona, atau Pantai Tanjung Kelayang untuk titik perahu penyeberangan island-hopping. Di Bangka, cobalah singgah ke Pantai Parai Tenggiri di Sungailiat yang air lautnya toska berkilau dengan bebatuan megah serupa. `;
      } else if (cleanQuestion.includes('makan') || cleanQuestion.includes('kuliner') || cleanQuestion.includes('lempah') || cleanQuestion.includes('mie')) {
        fallbackText += `Terkait kuliner legendaris khas Babel yang wajib dicoba, pastikan Kakak mencicipi Mie Belitung Atep yang disiram kuah kental kaldu udang dibalut daun simpor segar di Tanjung Pandan, atau lezatnya sup Lempah Kuning dengan ikan tenggiri bumbu kunyit terasi nan menggugah selera di Pangkalpinang! `;
      } else {
        fallbackText += `Bangka Belitung menyimpan keindahan pantai laksana surga dunia dan keramahan lokal yang tulus. Dengan preferensi gaya ${userPersona} dan minat ${userInterest}, kami rekomendasikan Kakak menjelajahi rute darat atau menyewa kendaraan harian agar keliling pulau terasa bebas dan menakjubkan. `;
      }
      fallbackText += `\n\nSilakan tanyakan info lebih spesifik mengenai tiket, jam buka, atau kuliner khas lainnya kepada saya ya Kak ${userName}!`;
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

      // Format clean listings from db to keep LLM context perfectly factual and rich
      const spotSummary = relevantSpots.map(w => `- ${w.nama} (Kategori: ${w.kategori}, Wilayah: ${w.wilayah}, Lokasi: ${w.lokasi}, Biaya: ${w.estimasi_biaya}, Jam Buka: ${w.jam_buka}, Tips: ${w.tips}, Deskripsi: ${w.deskripsi})`).slice(0, 45).join('\n');
      const kulinerSummary = relevantKuliners.map(k => `- ${k.nama} (Wilayah: ${k.wilayah}, Tipe: ${k.tipe}, Biaya: ${k.estimasi_biaya}, Rekomendasi Tempat: ${k.rekomendasi_tempat}, Deskripsi: ${k.deskripsi})`).join('\n');

      // Build structured model content history safely
      let contents: any[] = [];
      if (history && Array.isArray(history)) {
        contents = history.map((h: any) => ({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text || '' }]
        }));
      }
      contents.push({ role: 'user', parts: [{ text: pertanyaan }] });

      const systemInstruction = `
        Kamu adalah "BabelGuide PRO" - asisten perjalanan virtual AI premium, pramuwisata lokal senior, dan concierge travel mewah eksklusif dari platform "LocalTrip Babel".
        Bicaralah bagaikan pakar pariwisata lokal Bangka Belitung yang sangat hangat, ramah, penolong, berpotensi memberikan rasa nyaman, dan peka secara emosional (emotional intelligence).

        Data Sesi Wisatawan yang sedang Kakak layani saat ini:
        - Nama Wisatawan: ${userName}
        - Wilayah Liburan: ${region}
        - Budget Tersedia: ${totalBudget}
        - Status Keanggotaan: ${membershipTier === 'premium' ? '👑 PREMIUM (VIP ACCESS)' : 'FREE USER'}
        - Persona Gaya Wisata: ${userPersona} (misal: Elite Jetsetter, Healing Wanderer, Cultural Explorer, Adventure Trailblazer, Backpackers, Families, Couples, Content Creators)
        - Minat Utama & Fokus: ${userInterest}
        - Nada Anggaran: ${userBudgetTone}
        - Suasana Hati Pelancong: ${currentMood}

        Berikut adalah Pangkalan Data Resmi Berlisensi tentang destinasi wisata di ${region}:
        ${spotSummary}

        Berikut adalah Pangkalan Data Resmi Berlisensi tentang kuliner khas Bangka Belitung:
        ${kulinerSummary}

        Aturan Pelayanan AI BabelGuide:
        1. **Keramahan Lokal**: Gunakan panggilan hangat "Kak ${userName}" secara berkala dan alami. Hadirkan nuansa batin ramah, penuh perhatian, dan tulus.
        2. **Gaya Wisata & Penyesuaian Emosional**: Sesuaikan sapaan & rekomendasi dengan Suasana Hati (${currentMood}) dan Persona (${userPersona}).
           - Jika berjiwa petualang (Adventure Trailblazer), dorong eksplorasi bebatuan granit Pantai Penyabong, panjat bukit, atau snorkeling di Pulau Lengkuas.
           - Jika pencinta kedamaian/penyembuhan diri (Healing Wanderer), tonjolkan kedamaian mercusuar jernih, keasrian Bangka Botanical Garden, atau Danau Kaolin yang tenang laksana awan susu.
           - Jika bepergian keluarga (Families), sarankan wahana aman seperti Pantai Tongaci penangkaran penyu atau Pantai Matras berpasir datar lebar.
           - Jika luxury/romantis (Elite Jetsetter, Couples), rekomendasikan private boat hire, resort premium, atau candlelit dinner seafood tepi pantai.
        3. **Hak Istimewa Premium (Exclusive Insights)**: Sebutkan informasi rahasia lokal pelancongan (hidden gems lokal, jalan pintas bebas macet, waktu sepi terbaik tanpa kerumunan turis, restoran non-turistik yang luar biasa, kuliner legendaris tersembunyi). Berikan detail instan seperti operational hours, estimasi budget riil, serta tips and trik berwisata aman di Babel.
        4. **Aliran Chat Interaktif**: Akhiri respon dengan pertanyaan penutup yang memantik ide lanjutan, menstimulasi mereka mengajukan pertanyaan berikutnya atau menawarkan pembuatan rencana perjalanan/itinerary interaktif mikro yang terpadu!
        5. **Keindahan Format**: Jawab dalam format Markdown yang sangat elegan, bersih, terstruktur, dilengkapi bullet points ber-emoji, serta batasi sampai maksimal 3 paragraf pendek agar pas visualnya di smartphone layar ramping.
        6. **Kejujuran Data**: Hanya rujuk nama destinasi dan restoran yang ada di Pangkalan Data Resmi berlisensi di atas untuk kebenaran navigasi.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.9,
          topP: 0.95
        }
      });

      if (response && response.text) {
        return res.json({ jawaban: response.text });
      }
    } catch (apiErr) {
      console.warn("Kesalahan panggilan chat Gemini (Lanjut ke fallback lokal):", apiErr);
    }

    // Default return
    res.json({ jawaban: `Halo Kak ${userName}! Terdapat sedikit penyesuaian lalu lintas satelit pada asisten virtual kami. Namun tenang saja, BabelGuide PRO menyarankan Kakak mampir ke Pantai Tanjung Tinggi di Belitung Barat guna melihat mahakarya batu granit raksasa di sepanjang pantai beralur tenang, serta menyantap Mie Belitung Atep hangat dengan siraman kaldu udang lezat bertemankan es jeruk kunci peras segar sore nanti!` });

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
