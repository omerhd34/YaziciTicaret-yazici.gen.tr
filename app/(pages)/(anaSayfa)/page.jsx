"use client";
import { useEffect, useState } from "react";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import ProductSection from "@/app/components/home/ProductSection";
import BannerSection from "@/app/components/home/BannerSection";
import CategoryGrid from "@/app/components/home/CategoryGrid";
import WhyChooseUsSection from "@/app/components/home/WhyChooseUsSection";

export default function AnaSayfa() {
 const [featuredProducts, setFeaturedProducts] = useState([]);
 const [newProducts, setNewProducts] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
  fetchProducts();
 }, []);

 const fetchProducts = async () => {
  try {
   const [featuredRes, newRes] = await Promise.all([
    fetch("/api/products?isFeatured=true&limit=8"),
    fetch("/api/products?isNew=true&limit=8"),
   ]);

   const featuredData = await featuredRes.json();
   const newData = await newRes.json();

   if (featuredData.success) setFeaturedProducts(featuredData.data);
   if (newData.success) setNewProducts(newData.data);
  } catch (error) {
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="min-h-screen bg-gray-50">
   <HeroSection />
   <FeaturesSection />
   <ProductSection
    title="Öne Çıkan Ürünler"
    description="En çok tercih edilen ürünlerimiz"
    products={featuredProducts}
    loading={loading}
    viewAllLink="/kategori"
   />
   <BannerSection />
   <CategoryGrid />
   <WhyChooseUsSection />
  </div>
 );
}
