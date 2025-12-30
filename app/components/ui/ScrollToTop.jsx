"use client";
import { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi";

export default function ScrollToTop() {
 const [isVisible, setIsVisible] = useState(false);
 const [mounted, setMounted] = useState(false);
 const [filtersModalOpen, setFiltersModalOpen] = useState(false);

 // Client-side mount kontrolü
 useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setMounted(true);
 }, []);

 useEffect(() => {
  if (!mounted) return;

  const toggleVisibility = () => {
   if (window.pageYOffset > 300) {
    setIsVisible(true);
   } else {
    setIsVisible(false);
   }
  };

  // İlk kontrol
  toggleVisibility();

  window.addEventListener("scroll", toggleVisibility);

  return () => {
   window.removeEventListener("scroll", toggleVisibility);
  };
 }, [mounted]);

 // Filtre modalının açık olup olmadığını kontrol et
 useEffect(() => {
  if (!mounted) return;

  const checkFiltersModal = () => {
   setFiltersModalOpen(document.body.classList.contains("filters-modal-open"));
  };

  // MutationObserver ile body class değişikliklerini izle
  const observer = new MutationObserver(checkFiltersModal);
  observer.observe(document.body, {
   attributes: true,
   attributeFilter: ["class"],
  });

  // İlk kontrol
  checkFiltersModal();

  return () => {
   observer.disconnect();
  };
 }, [mounted]);

 const scrollToTop = () => {
  window.scrollTo({
   top: 0,
   behavior: "smooth",
  });
 };

 // Server-side render'da hiçbir şey render etme
 if (!mounted) {
  return null;
 }

 return (
  <>
   {isVisible && !filtersModalOpen && (
    <button
     onClick={scrollToTop}
     className="hidden md:flex fixed bottom-8 right-5 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer items-center justify-center"
     aria-label="Yukarı çık"
    >
     <HiArrowUp size={24} />
    </button>
   )}
  </>
 );
}
