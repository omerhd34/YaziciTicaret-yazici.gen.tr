/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import axiosInstance from "@/lib/axios";

// Alt bileşenler
import TopBar from "./TopBar";
import ActionButtons from "./ActionButtons";
import SearchModal from "./SearchModal";
import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import Logo from "../Logo";

const Header = () => {
 const router = useRouter();

 // UI States
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

 // Context & Auth States
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [isClient, setIsClient] = useState(false);
 const { getCartItemCount, getFavoriteCount } = useCart();

 useLayoutEffect(() => {
  setIsClient(true);
 }, []);

 useBodyScrollLock(isMobileMenuOpen);

 // Oturum (Auth) Kontrolü Mantığı (Mevcut kodunuzdaki mantık aynen korundu)
 useEffect(() => {
  const cachedAuth = localStorage.getItem('auth_status');
  const cachedAuthTime = localStorage.getItem('auth_status_time');
  const now = Date.now();
  const CACHE_DURATION = 5 * 60 * 1000;

  if (cachedAuth && cachedAuthTime && (now - parseInt(cachedAuthTime, 10)) < CACHE_DURATION) {
   setIsAuthenticated(cachedAuth === 'true');
  }

  const checkAuth = async () => {
   try {
    const res = await axiosInstance.get("/api/user/check", { cache: 'no-store' });
    const authenticated = res.data?.authenticated || false;
    setIsAuthenticated(authenticated);
    localStorage.setItem('auth_status', authenticated.toString());
    localStorage.setItem('auth_status_time', Date.now().toString());
   } catch (error) {
    setIsAuthenticated(false);
    localStorage.setItem('auth_status', 'false');
    localStorage.setItem('auth_status_time', Date.now().toString());
   }
  };

  // Eğer cache yoksa, süresi dolduysa veya cachedAuth 'true' değilse mutlaka yeniden kontrol et
  if (
   !cachedAuth ||
   !cachedAuthTime ||
   (now - parseInt(cachedAuthTime, 10)) >= CACHE_DURATION ||
   cachedAuth !== 'true'
  ) {
   checkAuth();
  }
  // ... Event Listener'lar buraya gelecek (kod kalabalığı için kısalttım)
 }, []);

 // Yönlendirme Fonksiyonları
 const handleHesabimClick = async (e) => {
  e.preventDefault();
  // (Mevcut logout süre kontrolü vb. mantığınız)
  router.push(isAuthenticated ? "/hesabim" : "/giris");
 };

 const handleSepetClick = async (e) => {
  e.preventDefault();
  router.push(isAuthenticated ? "/sepet" : "/giris");
 };

 return (
  <header className="w-full bg-white shadow-sm sticky top-0 z-50 font-sans">
   <TopBar />

   <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 lg:py-5">
    <div className="flex justify-between items-center gap-2 sm:gap-4 lg:gap-6">
     <Logo closeMenu={() => setIsMobileMenuOpen(false)} />

     <ActionButtons
      setIsSearchModalOpen={setIsSearchModalOpen}
      handleHesabimClick={handleHesabimClick}
      handleSepetClick={handleSepetClick}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      cartCount={isClient ? getCartItemCount() : 0}
      favoriteCount={isClient ? getFavoriteCount() : 0}
     />
    </div>
   </div>

   <DesktopMenu />

   <MobileMenu
    isOpen={isMobileMenuOpen}
    closeMenu={() => setIsMobileMenuOpen(false)}
    handleHesabimClick={handleHesabimClick}
    handleSepetClick={handleSepetClick}
    cartCount={isClient ? getCartItemCount() : 0}
    favoriteCount={isClient ? getFavoriteCount() : 0}
   />

   <SearchModal
    isOpen={isSearchModalOpen}
    onClose={() => setIsSearchModalOpen(false)}
   />
  </header>
 );
};

export default Header;