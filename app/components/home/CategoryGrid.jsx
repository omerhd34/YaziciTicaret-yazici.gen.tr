"use client";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [

 { name: "Beyaz Eşya", img: "/products/beyaz-esya.webp", url: "/kategori/beyaz-esya" },
 { name: "Televizyon", img: "/products/tv/32PA225EG-1.webp", url: "/kategori/televizyon" },
 { name: "Elektrikli Süpürge", img: "/products/elektrikliSüpürge/supurge.webp", url: "/kategori/elektrikli-supurge" },
 { name: "Ankastre", img: "/products/ankastre/ankastre.jpg", url: "/kategori/ankastre" },
 { name: "Klima", img: "/products/klima/klima.webp", url: "/kategori/klima" },
 { name: "Su Sebilleri ve Su Arıtma", img: "/products/suSebiliSuAritma/SS1161-1.webp", url: "/kategori/su-sebilleri-ve-su-aritma" },
 { name: "Türk Kahve Makinesi", img: "/products/kahveMakinesi/TKP1001-1.webp", url: "/kategori/turk-kahve-makineleri" },
];

export default function CategoryGrid() {
 return (
  <section className="container mx-auto px-4 py-12">
   <h2 className="text-3xl font-black text-gray-900 mb-8">Kategoriler</h2>
   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {CATEGORIES.map((cat, idx) => (
     <Link
      key={idx}
      href={cat.url}
      className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-xl transition bg-white"
     >
      <Image
       width={500}
       height={500}
       src={cat.img}
       alt={cat.name}
       className="w-full h-full object-contain scale-90 group-hover:scale-100 transition-transform duration-500"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gray-100 group-hover:bg-gray-200 flex items-center px-4 py-3 transition-colors duration-300">
       <h3 className="text-black font-bold text-lg">{cat.name}</h3>
      </div>
     </Link>
    ))}
   </div>
  </section>
 );
}
