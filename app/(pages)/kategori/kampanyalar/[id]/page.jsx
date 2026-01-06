"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { HiArrowLeft, HiCalendar, HiCheckCircle, HiX } from "react-icons/hi";
import { FaShoppingCart } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import ProductCard from "@/app/components/ui/ProductCard";
import { useCart } from "@/context/CartContext";
import Toast from "@/app/components/ui/Toast";

export default function CampaignDetailPage() {
 const params = useParams();
 const router = useRouter();
 const campaignId = params?.id;

 const [campaign, setCampaign] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [showImageModal, setShowImageModal] = useState(false);
 const [campaignProducts, setCampaignProducts] = useState([]);
 const [productsLoading, setProductsLoading] = useState(false);
 const [addingAllToCart, setAddingAllToCart] = useState(false);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [selectedColors, setSelectedColors] = useState({}); // productId -> colorName mapping

 const { addToCart } = useCart();

 const fetchCampaign = useCallback(async () => {
  try {
   setLoading(true);
   const res = await axiosInstance.get("/api/campaigns");
   const data = res.data;

   if (data.success) {
    const foundCampaign = data.data.find(c => c._id === campaignId);
    if (foundCampaign) {
     setCampaign(foundCampaign);
    } else {
     setError("Kampanya bulunamadı");
    }
   } else {
    setError("Kampanya yüklenemedi");
   }
  } catch (error) {
   setError("Kampanya yüklenirken bir hata oluştu");
  } finally {
   setLoading(false);
  }
 }, [campaignId]);

 useEffect(() => {
  if (campaignId) {
   fetchCampaign();
  }
 }, [campaignId, fetchCampaign]);

 const fetchCampaignProducts = useCallback(async (productCodes, campaignProductCodes) => {
  if (!productCodes || !Array.isArray(productCodes) || productCodes.length === 0) {
   setCampaignProducts([]);
   return;
  }

  try {
   setProductsLoading(true);
   const res = await axiosInstance.get("/api/products?limit=1000");
   const data = res.data;

   if (data.success) {
    // Ürün kodlarına göre filtrele ve hangi kodun hangi renge ait olduğunu bul
    const filteredProducts = [];
    const productColorMap = {}; // productId -> colorName mapping

    data.data.forEach(product => {
     let matchedProductCode = null;
     let matchedColor = null;

     // Ana ürünün serialNumber'ını kontrol et
     if (productCodes.includes(product.serialNumber)) {
      matchedProductCode = product.serialNumber;
      filteredProducts.push(product);
     } else {
      // Renklerdeki serialNumber'ları kontrol et
      if (product.colors && Array.isArray(product.colors)) {
       product.colors.forEach(color => {
        if (typeof color === 'object' && color.serialNumber) {
         if (productCodes.includes(color.serialNumber)) {
          matchedProductCode = color.serialNumber;
          matchedColor = color.name;
          // Ürün daha önce eklenmemişse ekle
          if (!filteredProducts.find(p => p._id === product._id)) {
           filteredProducts.push(product);
          }
         }
        }
       });
      }
     }

     // Eğer bu ürün için kod eşleşmesi varsa, hangi rengin seçili olacağını kaydet
     if (matchedProductCode && matchedColor) {
      productColorMap[product._id] = matchedColor;
     }
    });

    setCampaignProducts(filteredProducts);

    // Kampanya kodlarına göre seçili renkleri ayarla
    if (Object.keys(productColorMap).length > 0) {
     setSelectedColors(prev => ({ ...prev, ...productColorMap }));
    }
   }
  } catch (error) {
   console.error("Kampanya ürünleri yüklenirken hata:", error);
   setCampaignProducts([]);
  } finally {
   setProductsLoading(false);
  }
 }, []);

 useEffect(() => {
  if (campaign && campaign.productCodes) {
   fetchCampaignProducts(campaign.productCodes, campaign.productCodes);
  } else {
   setCampaignProducts([]);
  }
 }, [campaign, fetchCampaignProducts]);

 // Ürünler yüklendiğinde, eğer koduna göre renk seçilmemişse varsayılan rengi seç
 useEffect(() => {
  if (campaignProducts.length > 0 && campaign && campaign.productCodes) {
   const defaultColors = {};
   campaignProducts.forEach(product => {
    // Eğer bu ürün için zaten renk seçilmemişse
    if (!selectedColors[product._id] && product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
     // Önce kampanya kodlarına ait rengi ara
     let matchedColor = null;
     product.colors.forEach(color => {
      if (typeof color === 'object' && color.serialNumber && campaign.productCodes.includes(color.serialNumber)) {
       if (!matchedColor) {
        matchedColor = color.name;
       }
      }
     });

     // Eşleşen renk yoksa, stokta olan ilk rengi seç
     if (!matchedColor) {
      const firstAvailableColor = product.colors.find(c => {
       if (typeof c === 'object' && c.serialNumber) {
        const hasStock = c.stock !== undefined ? c.stock > 0 : (product.stock > 0);
        return hasStock;
       }
       return false;
      });
      if (firstAvailableColor && typeof firstAvailableColor === 'object') {
       matchedColor = firstAvailableColor.name;
      }
     }

     if (matchedColor) {
      defaultColors[product._id] = matchedColor;
     }
    }
   });
   if (Object.keys(defaultColors).length > 0) {
    setSelectedColors(prev => ({ ...prev, ...defaultColors }));
   }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [campaignProducts, campaign]);

 const handleColorChange = (productId, colorName) => {
  setSelectedColors(prev => ({
   ...prev,
   [productId]: colorName
  }));
 };

 if (loading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-gray-600 font-semibold">Kampanya yükleniyor...</p>
    </div>
   </div>
  );
 }

 if (error || !campaign) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <h1 className="text-2xl font-black text-gray-900 mb-4">Kampanya Bulunamadı</h1>
     <p className="text-gray-600 mb-6">{error || "Aradığınız kampanya mevcut değil."}</p>
     <Link
      href="/kategori/kampanyalar"
      className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
     >
      <HiArrowLeft className="mr-2 w-5 h-5" />
      Kampanyalara Dön
     </Link>
    </div>
   </div>
  );
 }

 const handleCampaignLink = () => {
  if (campaign.link) {
   router.push(campaign.link);
  }
 };

 const handleAddAllToCart = async () => {
  if (campaignProducts.length === 0) return;

  setAddingAllToCart(true);
  let addedCount = 0;
  let skippedCount = 0;

  try {
   // Kampanya fiyatı varsa, toplam fiyatı ürün sayısına böl
   let campaignPricePerProduct = null;
   if (campaign.campaignPrice && campaignProducts.length > 0) {
    campaignPricePerProduct = campaign.campaignPrice / campaignProducts.length;
   }

   for (const product of campaignProducts) {
    // Stok kontrolü
    const hasStock = product.stock > 0;

    // Kullanıcının seçtiği rengi kullan veya varsayılan rengi
    let colorToAdd = selectedColors[product._id] || null;

    // Seçili rengin stokta olup olmadığını kontrol et
    if (colorToAdd && product.colors && Array.isArray(product.colors)) {
     const selectedColorObj = product.colors.find((c) => {
      if (typeof c === 'object' && c.name === colorToAdd) {
       return c.stock !== undefined ? c.stock > 0 : (product.stock > 0);
      }
      return false;
     });

     // Seçili renk stokta değilse, stokta olan ilk rengi kullan
     if (!selectedColorObj) {
      const availableColor = product.colors.find((c) => {
       if (typeof c === 'object' && c.serialNumber) {
        return c.stock !== undefined ? c.stock > 0 : hasStock;
       }
       return false;
      });

      if (availableColor && typeof availableColor === 'object') {
       colorToAdd = availableColor.name;
      } else {
       colorToAdd = null;
      }
     }
    } else if (!colorToAdd && product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
     // Renk seçilmemişse, stokta olan ilk rengi seç
     const availableColor = product.colors.find((c) => {
      if (typeof c === 'object' && c.serialNumber) {
       return c.stock !== undefined ? c.stock > 0 : hasStock;
      }
      return false;
     });

     if (availableColor && typeof availableColor === 'object') {
      colorToAdd = availableColor.name;
     }
    }

    if (hasStock || (colorToAdd && product.colors)) {
     // Kampanya fiyatı varsa ürünü kampanya fiyatıyla ekle (ürün başına düşen fiyat)
     const productWithCampaignPrice = campaignPricePerProduct !== null
      ? { ...product, campaignPrice: campaignPricePerProduct, campaignId: campaign._id, campaignTitle: campaign.title, campaignTotalPrice: campaign.campaignPrice }
      : product;
     await addToCart(productWithCampaignPrice, null, colorToAdd, 1);
     addedCount++;
    } else {
     skippedCount++;
    }
   }

   if (addedCount > 0) {
   } else {
    setToast({
     show: true,
     message: "Hiçbir ürün sepete eklenemedi. Stokta olmayan ürünler atlandı.",
     type: "error",
    });
   }
  } catch (error) {
   setToast({
    show: true,
    message: "Ürünler sepete eklenirken bir hata oluştu.",
    type: "error",
   });
  } finally {
   setAddingAllToCart(false);
  }
 };

 return (
  <div className="min-h-screen bg-gray-50">
   <Toast toast={toast} setToast={setToast} />
   {/* Header */}
   <div className="bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 sm:py-10 md:py-14">
    <div className="container mx-auto px-4 sm:px-6 md:px-8">
     <button
      onClick={() => router.push("/kategori/kampanyalar")}
      className="inline-flex items-center text-white/90 hover:text-white mb-4 transition-colors cursor-pointer"
     >
      <HiArrowLeft className="mr-2 w-5 h-5" />
      Kampanyalara Dön
     </button>
     <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-center">{campaign.title}</h1>
    </div>
   </div>

   {/* Content */}
   <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
    <div className="max-w-7xl mx-auto">
     {/* Image */}
     <div
      onClick={() => setShowImageModal(true)}
      className="block relative aspect-5/3 rounded-2xl overflow-hidden shadow-xl mb-8 bg-gray-100 cursor-pointer hover:shadow-2xl transition-shadow"
     >
      <Image
       src={campaign.image}
       alt={campaign.title}
       fill
       className="object-contain"
       sizes="(max-width: 768px) 100vw, 80vw"
       priority
      />
     </div>

     {/* Campaign Info */}
     <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
      {campaign.endDate && (
       <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        <div className="flex items-center text-indigo-600">
         <HiCalendar className="w-6 h-6 mr-2" />
         <div>
          <span className="text-sm font-semibold text-gray-600">Kampanya Son Günü:</span>
          <span className="ml-2 font-semibold text-gray-900">
           {new Date(campaign.endDate).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
           })}
          </span>
         </div>
        </div>
       </div>
      )}

      <div className="prose max-w-none">
       <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
        {campaign.description}
       </p>
      </div>

     </div>

     {/* Kampanya Ürünleri */}
     {campaign.productCodes && campaign.productCodes.length > 0 && (
      <div className="mb-8">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Kampanya Ürünleri</h2>
        {campaignProducts.length > 0 && (
         <button
          onClick={handleAddAllToCart}
          disabled={addingAllToCart || productsLoading}
          className="inline-flex items-center px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap cursor-pointer"
         >
          <FaShoppingCart className="mr-2 w-5 h-5" />
          {addingAllToCart ? "Ekleniyor..." : "Tümünü Sepete Ekle"}
         </button>
        )}
       </div>
       {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
         {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
           <div className="aspect-square bg-gray-200"></div>
           <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
           </div>
          </div>
         ))}
        </div>
       ) : campaignProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
         {campaignProducts.map((product) => (
          <ProductCard
           key={product._id}
           product={product}
           onColorChange={handleColorChange}
           selectedColorName={selectedColors[product._id]}
          />
         ))}
        </div>
       ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
         <p className="text-gray-500">Kampanya ürünleri bulunamadı.</p>
        </div>
       )}
      </div>
     )}

     {/* Back Button */}
     <div className="text-center">
      <Link
       href="/kategori/kampanyalar"
       className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
      >
       <HiArrowLeft className="mr-2 w-5 h-5" />
       Tüm Kampanyalara Dön
      </Link>
     </div>
    </div>
   </div>

   {/* Image Modal */}
   {showImageModal && (
    <div
     className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 "
     onClick={() => setShowImageModal(false)}
    >
     <button
      onClick={() => setShowImageModal(false)}
      className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 cursor-pointer"
     >
      <HiX size={32} />
     </button>
     <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
      <Image
       src={campaign.image}
       alt={campaign.title}
       fill
       className="object-contain"
       sizes="100vw"
       onClick={(e) => e.stopPropagation()}
      />
     </div>
    </div>
   )}
  </div>
 );
}

