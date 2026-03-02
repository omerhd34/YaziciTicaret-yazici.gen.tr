import axiosInstance from "@/lib/axios";
import HeroSection from "@/app/components/home/HeroSection";
import FeaturesSection from "@/app/components/home/FeaturesSection";
import ProductSection from "@/app/components/home/ProductSection";
import FAQSection from "@/app/components/home/FAQSection";

export const revalidate = 60;

async function fetchProducts() {
 try {
  const [featuredRes, newRes, discountedRes] = await Promise.all([
   axiosInstance.get("/api/products?isFeatured=true"),
   axiosInstance.get("/api/products?isNewProduct=true"),
   axiosInstance.get("/api/products?category=İndirimler"),
  ]);

  return {
   featuredProducts: featuredRes.data?.success ? featuredRes.data.data : [],
   newProducts: newRes.data?.success ? newRes.data.data : [],
   discountedProducts: discountedRes.data?.success ? discountedRes.data.data : [],
  };
 } catch {
  return {
   featuredProducts: [],
   newProducts: [],
   discountedProducts: [],
  };
 }
}

export default async function AnaSayfa() {
 const { featuredProducts, newProducts, discountedProducts } = await fetchProducts();

 return (
  <div className="min-h-screen bg-gray-50 overflow-x-hidden">
   <HeroSection />
   <FeaturesSection />
   <ProductSection
    title="Öne Çıkan Ürünler"
    description="En çok tercih edilen ürünlerimiz"
    products={featuredProducts}
    loading={false}
    viewAllLink="/one-cikan-urunler"
    viewAllLabel="Öne çıkan ürünleri tümünü gör"
   />
   <ProductSection
    title="Yeni Ürünler"
    description="Son eklenen ürünlerle en yenileri keşfedin"
    products={newProducts}
    loading={false}
    viewAllLink="/kategori/yeniler"
    viewAllLabel="Yeni ürünleri tümünü gör"
   />
   <ProductSection
    title="İndirimli Ürünler"
    description="Özel fiyatlarla kaçırılmayacak fırsatlar"
    products={discountedProducts}
    loading={false}
    viewAllLink="/kategori/indirim"
    viewAllLabel="İndirimli ürünleri tümünü gör"
   />
   <FAQSection />
  </div>
 );
}
