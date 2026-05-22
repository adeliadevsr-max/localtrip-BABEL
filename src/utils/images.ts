/**
 * Helpful mapping of destination IDs (w1 to w20, k1 to k8) to high-quality,
 * curated, and context-appropriate Unsplash travel & lifestyle images.
 */

const SPOT_IMAGES: Record<string, string> = {
  // Bangka
  "w1": "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Parai Tenggiri (Beautiful wide turquoise water with stones/plams)
  "w2": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Tongaci
  "w3": "https://images.unsplash.com/photo-1528150395403-992a693e26c8?auto=format&fit=crop&w=1200&h=800&q=80", // Danau Kaolin Air Bara (Blue water vibe)
  "w4": "https://images.unsplash.com/photo-1445023086979-7244a12345a8?auto=format&fit=crop&w=1200&h=800&q=80", // Jembatan Emas (Sunset bridge vibe)
  "w5": "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&h=800&q=80", // Bangka Botanical Garden (Pine avenue vibe)
  "w6": "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&h=800&q=80", // Otak-Otak Amui (Dumpling/appetizer)
  "w7": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&h=800&q=80", // Mie Koba Iskandar (Noodle bowl)
  "w8": "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=800&q=80", // Kedai Kopi Babel (Cozy Cafe)
  "w9": "https://images.unsplash.com/photo-1437419764061-2473afe69fc2?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Matras (Long sandy palm beach)
  "w10": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&h=800&q=80", // Lempah Kuning Muara (Yellow asian seafood broth)

  // Belitung
  "w11": "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Tanjung Tinggi (Iconic granite rocks & clear turquoise water)
  "w12": "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Tanjung Kelayang (Tropical shore & island hopping boats)
  "w13": "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&h=800&q=80", // Pulau Lengkuas (Lighthouse island vibe)
  "w14": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&h=800&q=80", // Danau Kaolin Belitung (Beautiful white-rock turquoise crater lake)
  "w15": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&h=800&q=80", // Warkop Kong Djie (Brewing coffee/teahouse)
  "w16": "https://images.unsplash.com/photo-1625220194771-7ebded0c968e?auto=format&fit=crop&w=1200&h=800&q=80", // Mie Belitung Atep (Delicious Indonesian noodle plate)
  "w17": "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&h=800&q=80", // Rumah Adat Belitung (Traditional wooden house vibe)
  "w18": "https://images.unsplash.com/photo-1473116763269-25541579ff6f?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Bukit Batu (Granite shoreline, tropical)
  "w19": "https://images.unsplash.com/photo-1468413253725-0d518102634d?auto=format&fit=crop&w=1200&h=800&q=80", // Pantai Penyabong (Huge beautiful rock formations)
  "w20": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=800&q=80", // Rumah Keong Belitung Timur (Bamboo lakeside pagoda vibe)

  // Kuliners
  "k1": "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&h=800&q=80", // Lempah Kuning Ikan (Spicy boiling yellow seafood broth)
  "k2": "https://images.unsplash.com/photo-1625220194771-7ebded0c968e?auto=format&fit=crop&w=1200&h=800&q=80", // Mie Belitung Ny. Atep
  "k3": "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&h=800&q=80", // Gangan Belitung
  "k4": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&h=800&q=80", // Otak-Otak Tenggiri
  "k5": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&h=800&q=80", // Mie Koba
  "k6": "https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=1200&h=800&q=80", // Bujan & Pempek Kulit
  "k7": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&h=800&q=80", // Kopi Saring Kong Djie
  "k8": "https://images.unsplash.com/photo-1534080391025-09795d197360?auto=format&fit=crop&w=1200&h=800&q=80"  // Sotong Pangkong
};

const DEFAULT_SPOT_IMAGE = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";
const DEFAULT_KULINER_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

export function getSpotImageUrl(id: string): string {
  // If id looks like w1_xxx or anything, match substring
  const cleanId = id.split('_')[0];
  if (SPOT_IMAGES[cleanId]) return SPOT_IMAGES[cleanId];
  if (SPOT_IMAGES[id]) return SPOT_IMAGES[id];

  const numId = parseInt(cleanId.replace(/\D/g, ""), 10);
  if (!isNaN(numId)) {
    const oceanImages = [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&h=800&q=80", // white sand beach
      "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=1200&h=800&q=80", // turquoise water
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&h=800&q=80", // boat beach shore
      "https://images.unsplash.com/photo-1473116763269-25541579ff6f?auto=format&fit=crop&w=1200&h=800&q=80", // tropical island
      "https://images.unsplash.com/photo-1468413253725-0d518102634d?auto=format&fit=crop&w=1200&h=800&q=80", // granite coast
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&h=800&q=80"  // sunny sea
    ];
    const cafeImages = [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&h=800&q=80", // warm coffee shop
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&h=800&q=80", // pour over coffee
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&h=800&q=80", // coffee tables
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&h=800&q=80"  // cozy glass cafe
    ];
    const foodImages = [
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&h=800&q=80", // asian dishes
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&h=800&q=80", // rich ramen / noodles
      "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=1200&h=800&q=80", // yellow soup kettle
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&h=800&q=80"  // grilled skewered bbq
    ];
    const photoImages = [
      "https://images.unsplash.com/photo-1445023086979-7244a12345a8?auto=format&fit=crop&w=1200&h=800&q=80", // golden hour twilight Bridge
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&h=800&q=80", // pine forest avenue
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&h=800&q=80", // lakeside pagoda
      "https://images.unsplash.com/photo-1528150395403-992a693e26c8?auto=format&fit=crop&w=1200&h=800&q=80", // blue crater lagoon
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&h=800&q=80", // panoramic hill overlook
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1200&h=800&q=80"  // traditional dutch heritage house
    ];

    // Assign categories deterministically based on list sequences
    if (
      numId === 21 || numId === 22 || (numId >= 48 && numId <= 54) || (numId >= 67 && numId <= 74 && numId !== 69)
    ) {
      return oceanImages[numId % oceanImages.length];
    } else if (
      (numId >= 29 && numId <= 38) || (numId >= 60 && numId <= 66)
    ) {
      return cafeImages[numId % cafeImages.length];
    } else if (
      numId >= 39 && numId <= 47
    ) {
      return foodImages[numId % foodImages.length];
    } else {
      return photoImages[numId % photoImages.length];
    }
  }

  return DEFAULT_SPOT_IMAGE;
}

export function getKulinerImageUrl(id: string): string {
  const cleanId = id.split('_')[0];
  return SPOT_IMAGES[cleanId] || SPOT_IMAGES[id] || DEFAULT_KULINER_IMAGE;
}

export function getImageUrlByNama(nama: string): string {
  const clean = nama.toLowerCase();
  if (clean.includes("tenggiri") || clean.includes("parai")) return SPOT_IMAGES["w1"];
  if (clean.includes("tongaci") || clean.includes("locomotief")) return SPOT_IMAGES["w2"];
  if (clean.includes("kaolin air bara") || (clean.includes("kaolin") && clean.includes("bara"))) return SPOT_IMAGES["w3"];
  if (clean.includes("jembatan emas")) return SPOT_IMAGES["w4"];
  if (clean.includes("botanical") || clean.includes("bbg")) return SPOT_IMAGES["w5"];
  if (clean.includes("amui")) return SPOT_IMAGES["w6"];
  if (clean.includes("koba")) return SPOT_IMAGES["w7"] || SPOT_IMAGES["k5"];
  if (clean.includes("kopi babel")) return SPOT_IMAGES["w8"];
  if (clean.includes("matras")) return SPOT_IMAGES["w9"];
  if (clean.includes("lempah kuning")) return SPOT_IMAGES["w10"] || SPOT_IMAGES["k1"];
  if (clean.includes("tanjung tinggi") || clean.includes("laskar pelangi")) return SPOT_IMAGES["w11"];
  if (clean.includes("tanjung kelayang")) return SPOT_IMAGES["w12"];
  if (clean.includes("lengkuas")) return SPOT_IMAGES["w13"];
  if (clean.includes("kaolin belitung") || (clean.includes("kaolin") && clean.includes("belitung"))) return SPOT_IMAGES["w14"];
  if (clean.includes("kong djie") || clean.includes("warkop kong")) return SPOT_IMAGES["w15"] || SPOT_IMAGES["k7"];
  if (clean.includes("atep")) return SPOT_IMAGES["w16"] || SPOT_IMAGES["k2"];
  if (clean.includes("rumah adat")) return SPOT_IMAGES["w17"];
  if (clean.includes("bukit batu")) return SPOT_IMAGES["w18"];
  if (clean.includes("penyabong")) return SPOT_IMAGES["w19"];
  if (clean.includes("keong")) return SPOT_IMAGES["w20"];
  if (clean.includes("gangan")) return SPOT_IMAGES["k3"];
  if (clean.includes("bujan") || clean.includes("pempek")) return SPOT_IMAGES["k6"];
  if (clean.includes("sotong")) return SPOT_IMAGES["k8"];
  
  if (clean.includes("pantai") || clean.includes("reef") || clean.includes("pulau")) return DEFAULT_SPOT_IMAGE;
  return DEFAULT_KULINER_IMAGE;
}
