"use client";
import "../globals.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({ children }) {
 return (
  <html lang="tr">
   <body className="antialiased min-h-screen flex flex-col">
    <CartProvider>
     <Header />
     <div className="flex-1">
      {children}
     </div>
     <Footer />
     <ScrollToTop />
    </CartProvider>
   </body>
  </html>
 );
}
