export const products = [
 {
  name: "Televizyon, 75 inç, Siyah, 3840 x 2160 px, 16:9",
  description: "Televizyon, 75 inç, Siyah, 3840 x 2160 px, 16:9",
  category: "Televizyon",
  brand: "Profilo",
  isNew: false,
  isFeatured: false,
  specifications: [
   {
    category: "Genel Özellikler",
    items: [
     { key: "Smart TV", value: "Var" },
     { key: "Çözünürlük", value: "UHD" },
     { key: "Ekran Formatı", value: "16:9" },
     { key: "HDR", value: "HDR (High Dynamic Range)" },
     { key: "Video Formatları", value: "3GPP, AVI, FLV, MKV, MP4, VOB, WMV" },
     { key: "Ses Çıkışı", value: "2 x 12W" },
     { key: "Ses", value: "Dolby Digital" },
     { key: "Ses Formatları", value: "AAC, MP3, WAV, WMA" },
     { key: "Tuner", value: "2" },
     { key: "HDMI Port Sayısı", value: "3" },
     { key: "USB Port Sayısı", value: "2" },
     { key: "Kablosuz Ağ Bağlantısı (WLAN)", value: "Var" },
     { key: "Enerji Verimlilik Sınıfı", value: "F" },
     { key: "EPG", value: "Var" },
     { key: "Panel Drive", value: "4K 1000 Hz" },
     { key: "Frekans (Hz)", value: "50" },
     { key: "Sistem", value: "PAl BG" },
    ]
   },
   {
    category: "Boyutlar",
    items: [
     { key: "Ekran Büyüklüğü", value: "75 inç (190,0 cm)" },
     { key: "Piksel (Yatay-Dikey)", value: "3840 x 2160" },
     { key: "Genişlik (mm)", value: "1460" },
     { key: "Yükseklik (mm)", value: "840" }
    ]
   },
  ],
  colors: [
   {
    name: "Gri",
    hexCode: "#6B7280",
    price: 82819,
    serialNumber: "85PA725EQG",
    images: ["/products/tv/85PA725EQG-1.webp", "/products/tv/85PA725EQG-2.webp", "/products/tv/85PA725EQG-3.webp", "/products/tv/85PA725EQG-4.webp", "/products/tv/85PA725EQG-5.webp", "/products/tv/85PA725EQG-6.webp"],
    stock: 1000,
   },
  ],
 },
];

if (typeof module !== 'undefined' && module.exports) {
 module.exports = { products };
}