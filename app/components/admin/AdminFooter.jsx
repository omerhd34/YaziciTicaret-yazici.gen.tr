"use client";
import Link from "next/link";

const AdminFooter = () => {
 const currentYear = new Date().getFullYear();

 return (
  <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
   <div className="container mx-auto px-4 py-6">
    <div className="flex flex-col gap-6">
     {/* Navigation Links */}
     <nav className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
      <Link
       href="/admin"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Ana Sayfa
      </Link>
      <Link
       href="/admin/son-siparisler"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Siparişler
      </Link>
      <Link
       href="/admin/urun-yonetimi"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Ürünler
      </Link>
      <Link
       href="/admin/paket-fiyatlari"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Kampanyalar
      </Link>
      <Link
       href="/admin/mesajlar"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Mesajlar
      </Link>
      <Link
       href="/admin/urun-istekleri"
       className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
       Ürün İstekleri
      </Link>
     </nav>

     {/* Copyright and Info */}
     <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-800">
      <p className="text-sm text-gray-400">
       © {currentYear} YAZICI TİCARET - Tüm hakları saklıdır.
      </p>
      <p className="text-xs text-gray-500">
       Bu alan sadece yetkili personel içindir.
      </p>
     </div>
    </div>
   </div>
  </footer>
 );
};

export default AdminFooter;

