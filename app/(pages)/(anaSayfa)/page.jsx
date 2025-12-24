"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import ProductSection from "@/app/components/home/ProductSection";
import BrandLogosSection from "@/app/components/home/BrandLogosSection";
import FAQSection from "@/app/components/home/FAQSection";

export default function AnaSayfa() {
 const [featuredProducts, setFeaturedProducts] = useState([]);
 const [newProducts, setNewProducts] = useState([]);
 const [discountedProducts, setDiscountedProducts] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProducts();
 }, []);

 const fetchProducts = async () => {
  try {
   const [featuredRes, newRes, discountedRes] = await Promise.all([
    fetch("/api/products?isFeatured=true"),
    fetch("/api/products?isNew=true"),
    fetch("/api/products?category=İndirimler"),
   ]);

   const featuredData = await featuredRes.json();
   const newData = await newRes.json();
   const discountedData = await discountedRes.json();

   if (featuredData.success) setFeaturedProducts(featuredData.data);
   if (newData.success) setNewProducts(newData.data);
   if (discountedData.success) setDiscountedProducts(discountedData.data);
  } catch (error) {
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-gray-50 overflow-x-hidden">
   <HeroSection />
   <FeaturesSection />
   <ProductSection
    title="Öne Çıkan Ürünler"
    description="En çok tercih edilen ürünlerimiz"
    products={featuredProducts}
    loading={loading}
    viewAllLink="/one-cikan-urunler"
   />
   <ProductSection
    title="Yeni Ürünler"
    description="Son eklenen ürünlerle en yenileri keşfedin"
    products={newProducts}
    loading={loading}
    viewAllLink="/kategori/yeniler"
   />
   <ProductSection
    title="İndirimli Ürünler"
    description="Özel fiyatlarla kaçırılmayacak fırsatlar"
    products={discountedProducts}
    loading={loading}
    viewAllLink="/kategori/indirim"
   />
   <BrandLogosSection />
   <FAQSection />
  </div>
 );
}
