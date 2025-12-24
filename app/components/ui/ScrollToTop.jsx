"use client";
import { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi";

export default function ScrollToTop() {
 const [isVisible, setIsVisible] = useState(false);

 useEffect(() => {
  const toggleVisibility = () => {
   if (window.pageYOffset > 300) {
    setIsVisible(true);
   } else {
    setIsVisible(false);
   }
  };

  window.addEventListener("scroll", toggleVisibility);

  return () => {
   window.removeEventListener("scroll", toggleVisibility);
  };
 }, []);

 const scrollToTop = () => {
  window.scrollTo({
   top: 0,
   behavior: "smooth",
  });
 };

 return (
  <>
   {isVisible && (
    <button
     onClick={scrollToTop}
     className="fixed bottom-8 right-5 z-50 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
     aria-label="Yukarı çık"
    >
     <HiArrowUp size={24} />
    </button>
   )}
  </>
 );
}
