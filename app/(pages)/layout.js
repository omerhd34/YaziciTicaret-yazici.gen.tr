"use client";
import "../globals.css";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import ComparisonWidget from "../components/ui/ComparisonWidget";
import { CartProvider } from "@/context/CartContext";
import { ComparisonProvider } from "@/context/ComparisonContext";

export default function RootLayout({ children }) {
 return (
  <html lang="tr">
   <body className="antialiased min-h-screen flex flex-col">
    <CartProvider>
     <ComparisonProvider>
      <Header />
      <div className="flex-1">
       {children}
      </div>
      <Footer />
      <ScrollToTop />
      <ComparisonWidget />
     </ComparisonProvider>
    </CartProvider>
   </body>
  </html>
 );
}
