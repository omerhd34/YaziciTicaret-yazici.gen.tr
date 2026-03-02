import Link from "next/link";
import { useState, useEffect } from "react";
import { HiTruck, HiClipboardList, HiPhone } from "react-icons/hi";

const HEADER_MESSAGES = [
 "Tüm Türkiye'ye nakliye ve montaj hizmeti !",
 "Bursa'ya özel ücretsiz kargo fırsatı !"
];

export default function TopBar({ setShowProductRequestModal }) {
 const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

 useEffect(() => {
  const interval = setInterval(() => {
   setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % HEADER_MESSAGES.length);
  }, 5000);
  return () => clearInterval(interval);
 }, []);

 return (
  <div className="bg-slate-900 text-white text-[10px] sm:text-[11px] font-medium py-2 sm:py-2.5 tracking-wide">
   <div className="container mx-auto px-3 sm:px-4 flex justify-between items-center">
    <p className="hidden sm:flex items-center gap-1 sm:gap-1.5 text-xs sm:text-[11px]">
     <HiTruck color="red" size={18} />
     <span>{HEADER_MESSAGES[currentMessageIndex]}</span>
    </p>
    <div className="flex items-center justify-end gap-3 sm:gap-4 lg:gap-5">
     <button
      onClick={() => setShowProductRequestModal(true)}
      className="flex items-center gap-1 sm:gap-1.5 hover:text-slate-300 transition cursor-pointer text-xs sm:text-[11px]"
     >
      <HiClipboardList size={18} />
      <span>Ürün İsteği</span>
     </button>
     <Link href="/destek" className="flex items-center gap-1 sm:gap-1.5 hover:text-slate-300 transition text-xs sm:text-[11px]">
      <HiPhone size={18} />
      <span>Destek</span>
     </Link>
    </div>
   </div>
  </div>
 );
}