"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import PaymentHeader from "@/app/components/payment/PaymentHeader";
import PaymentLoading from "@/app/components/payment/PaymentLoading";
import PaymentEmptyCart from "@/app/components/payment/PaymentEmptyCart";
import DeliveryAddressSection from "@/app/components/payment/DeliveryAddressSection";
import PaymentMethodSection from "@/app/components/payment/PaymentMethodSection";
import OrderSummary from "@/app/components/payment/OrderSummary";

export default function OdemePage() {
 const router = useRouter();
 const { cart, clearCart } = useCart();
 const [mounted, setMounted] = useState(false);
 const [cartWithCampaigns, setCartWithCampaigns] = useState(cart || []);

 useEffect(() => {
  setMounted(true);
 }, []);

 // Sepet değiştiğinde cartWithCampaigns'i güncelle
 useEffect(() => {
  if (cart && cart.length > 0) {
   setCartWithCampaigns(cart);
  } else {
   setCartWithCampaigns([]);
  }
 }, [cart]);

 // Sepetteki ürünlere kampanya kontrolü yap ve kampanya fiyatlarını uygula
 useEffect(() => {
  const checkCampaigns = async () => {
   if (!cart || cart.length === 0) {
    setCartWithCampaigns([]);
    return;
   }

   try {
    // Ürünleri ve kampanyaları paralel olarak yükle
    const [productsRes, campaignsRes] = await Promise.all([
     axiosInstance.get("/api/products?limit=1000"),
     axiosInstance.get("/api/campaigns")
    ]);

    const productsData = productsRes.data;
    const campaignsData = campaignsRes.data;

    const allProducts = productsData.data || productsData.products || [];
    const campaigns = campaignsData.success ? campaignsData.data || [] : [];

    if (productsData.success && allProducts.length > 0) {
     // Önce sepetteki tüm ürünlerin serialNumber'larını hesapla
     const cartWithSerialNumbers = cart.map(cartItem => {
      const productId = String(cartItem._id || cartItem.id);
      const currentProduct = allProducts.find(p => String(p._id) === productId);
      if (!currentProduct) return null;

      const allColors = currentProduct._allColors || currentProduct.colors;
      const selectedColorObj = cartItem.selectedColor && allColors && Array.isArray(allColors)
       ? allColors.find(c => typeof c === 'object' && c.name === cartItem.selectedColor)
       : null;

      const colorSerialNumber = selectedColorObj?.serialNumber || currentProduct.serialNumber;

      return {
       ...cartItem,
       product: currentProduct,
       serialNumber: colorSerialNumber,
      };
     }).filter(Boolean);

     // Her kampanya için kampanyadaki tüm ürünlerin sepette olup olmadığını kontrol et
     const campaignProductCounts = {};
     campaigns.forEach(campaign => {
      if (campaign.isActive && campaign.productCodes && Array.isArray(campaign.productCodes) && campaign.campaignPrice) {
       // Kampanyadaki toplam ürün sayısı (kampanya kodlarının sayısı)
       const campaignTotalProductCount = campaign.productCodes.length;

       // Sepetteki bu kampanyaya ait ürünlerin serialNumber'larını topla (seçili renge göre)
       const cartSerialNumbers = new Set();
       cartWithSerialNumbers.forEach(item => {
        // Seçili renge göre hesaplanmış serialNumber'ı kullan
        const itemSerialNumber = item.serialNumber;
        if (campaign.productCodes.includes(itemSerialNumber)) {
         cartSerialNumbers.add(itemSerialNumber);
        }
       });

       // Kampanyadaki TÜM ürün kodlarının sepette olup olmadığını kontrol et
       const allCampaignProductsInCart = campaign.productCodes.every(code =>
        cartSerialNumbers.has(code)
       );

       // Sadece kampanyadaki TÜM ürünler sepetteyse kampanya fiyatını uygula
       if (allCampaignProductsInCart && campaignTotalProductCount > 0) {
        const campaignIdStr = String(campaign._id);
        // Kampanya fiyatını kampanyadaki toplam ürün sayısına böl (kampanya sayfasındaki mantıkla aynı)
        campaignProductCounts[campaignIdStr] = {
         cartCount: campaignTotalProductCount,
         pricePerProduct: campaign.campaignPrice / campaignTotalProductCount,
         campaign,
        };
       }
      }
     });

     // Kampanyaları kontrol et ve sepetteki ürünlere uygula
     const updatedCart = cart.map(cartItem => {
      const productId = String(cartItem._id || cartItem.id);
      const currentProduct = allProducts.find(p => String(p._id) === productId);

      if (currentProduct) {
       const allColors = currentProduct._allColors || currentProduct.colors;
       const selectedColorObj = cartItem.selectedColor && allColors && Array.isArray(allColors)
        ? allColors.find(c => typeof c === 'object' && c.name === cartItem.selectedColor)
        : null;

       const colorSerialNumber = selectedColorObj?.serialNumber || currentProduct.serialNumber;

       // Kampanya bilgilerini kontrol et ve güncelle
       let campaignPrice = cartItem.campaignPrice;
       let campaignId = cartItem.campaignId;
       let campaignTitle = cartItem.campaignTitle;
       let campaignTotalPrice = cartItem.campaignTotalPrice;

       // Eğer kampanya bilgisi yoksa, aktif kampanyalarda bu ürünü ara
       if (!campaignPrice || !campaignId) {
        // Önceden hesaplanmış kampanya bilgilerini kullan (sadece kampanyadaki TÜM ürünler sepetteyse)
        for (const [campId, campaignInfo] of Object.entries(campaignProductCounts)) {
         const isInCampaign = campaignInfo.campaign.productCodes.includes(colorSerialNumber) ||
          campaignInfo.campaign.productCodes.includes(currentProduct.serialNumber);

         if (isInCampaign) {
          campaignPrice = campaignInfo.pricePerProduct;
          campaignId = campaignInfo.campaign._id;
          campaignTitle = campaignInfo.campaign.title;
          campaignTotalPrice = campaignInfo.campaign.campaignPrice;
          break; // İlk eşleşen kampanyayı kullan
         }
        }
       }

       return {
        ...cartItem,
        ...currentProduct,
        selectedSize: cartItem.selectedSize,
        selectedColor: cartItem.selectedColor,
        serialNumber: colorSerialNumber,
        quantity: cartItem.quantity,
        addedAt: cartItem.addedAt,
        // Kampanya bilgilerini güncelle
        campaignPrice: campaignPrice,
        campaignId: campaignId,
        campaignTitle: campaignTitle,
        campaignTotalPrice: campaignTotalPrice,
       };
      }
      return cartItem;
     });

     setCartWithCampaigns(updatedCart);
    } else {
     setCartWithCampaigns(cart);
    }
   } catch (error) {
    console.error("Kampanya kontrolü yapılırken hata:", error);
    setCartWithCampaigns(cart);
   }
  };

  checkCampaigns();
 }, [cart]);

 const cartTotal = useMemo(() => {
  return (cartWithCampaigns || cart || []).reduce((sum, item) => {
   let price = item.campaignPrice;
   if (!price) {
    price = item.discountPrice && item.discountPrice < item.price
     ? item.discountPrice
     : item.price;
   }
   return sum + (price || 0) * (item.quantity || 1);
  }, 0);
 }, [cartWithCampaigns, cart]);

 const shippingCost = cartTotal >= 500 ? 0 : 29.99;
 const grandTotal = cartTotal + shippingCost;

 // Kampanya bilgilerini topla
 const campaignInfo = useMemo(() => {
  const campaignItems = (cartWithCampaigns || cart || []).filter(item => item.campaignId && item.campaignTitle);
  if (campaignItems.length === 0) return null;

  const campaignGroups = {};
  campaignItems.forEach(item => {
   const key = `${item.campaignId}_${item.campaignTitle}`;
   if (!campaignGroups[key]) {
    campaignGroups[key] = {
     campaignId: item.campaignId,
     campaignTitle: item.campaignTitle,
     items: [],
     originalTotal: 0,
     campaignTotal: 0,
    };
   }
   // Kampanya fiyatı varsa, orijinal fiyat ürünün normal fiyatı olmalı
   const originalPrice = item.price;
   campaignGroups[key].items.push(item);
   campaignGroups[key].originalTotal += originalPrice * (item.quantity || 1);
   campaignGroups[key].campaignTotal += (item.campaignPrice || originalPrice) * (item.quantity || 1);
  });

  return Object.values(campaignGroups);
 }, [cartWithCampaigns, cart]);

 const [addresses, setAddresses] = useState([]);
 const [addressesLoading, setAddressesLoading] = useState(true);
 const [selectedAddressId, setSelectedAddressId] = useState("");

 const [paymentMethod, setPaymentMethod] = useState({ type: "mailorder" });

 const [acceptedTerms, setAcceptedTerms] = useState(false);
 const [error, setError] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);

 const fetchAddresses = useCallback(async () => {
  try {
   setAddressesLoading(true);
   const res = await axiosInstance.get("/api/user/addresses", {
    cache: "no-store",
   });
   const data = res.data || {};
   if (!data.success) {
    setAddresses([]);
    return;
   }
   const list = data.addresses || [];
   const sorted = [...list].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
   setAddresses(sorted);

   const defaultAddr = sorted.find((a) => a.isDefault) || sorted[0];
   const id = defaultAddr?._id?.toString ? defaultAddr._id.toString() : defaultAddr?._id;
   if (id) setSelectedAddressId(id);
  } finally {
   setAddressesLoading(false);
  }
 }, []);

 useEffect(() => {
  if (cart && cart.length > 0) {
   fetchAddresses();
  }
 }, [cart, fetchAddresses]);

 const canPay = useMemo(() => {
  if (!cart || cart.length === 0) return false;
  if (!acceptedTerms) return false;
  if (!selectedAddressId) return false;
  if (paymentMethod.type === "havale") return true;
  if (paymentMethod.type === "mailorder") return true;
  return false;
 }, [acceptedTerms, cart, paymentMethod, selectedAddressId]);

 const handlePay = async () => {
  if (isSubmitting) return; // Çift tıklamayı engelle

  if (!selectedAddressId) {
   setError("Lütfen teslimat adresi seçin.");
   return;
  }
  if (paymentMethod.type !== "havale" && paymentMethod.type !== "mailorder") {
   setError("Lütfen geçerli bir ödeme yöntemi seçin.");
   return;
  }
  if (!acceptedTerms) {
   setError("Devam etmek için sözleşmeleri onaylamalısınız.");
   return;
  }
  setError("");
  setIsSubmitting(true);

  if (paymentMethod.type === "havale") {
   try {
    const selectedAddress = addresses.find((a) => String(a._id) === String(selectedAddressId));
    const addressSummary = selectedAddress
     ? `${selectedAddress.title} - ${selectedAddress.fullName}, ${selectedAddress.address}, ${selectedAddress.district}/${selectedAddress.city} (${selectedAddress.phone})`
     : "";
    const shippingAddress = selectedAddress
     ? {
      title: selectedAddress.title,
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      district: selectedAddress.district,
      city: selectedAddress.city,
     }
     : null;

    const payloadItems = (cartWithCampaigns || cart || []).map((i) => {
     // Kampanya fiyatı varsa onu kullan
     let price = i.campaignPrice;
     if (!price) {
      price = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
     }
     return {
      productId: String(i._id || i.id),
      name: i.name,
      slug: i.slug,
      image: i?.images?.[0] || i.image || "",
      price: Number(price || 0),
      quantity: Number(i.quantity || 1),
      size: i.selectedSize || "",
      color: i.selectedColor || "",
      campaignId: i.campaignId || null,
      campaignTitle: i.campaignTitle || null,
     };
    });

    const res = await axiosInstance.post("/api/user/orders", {
     items: payloadItems,
     total: grandTotal,
     paymentMethod: { type: paymentMethod.type },
     address: {
      id: selectedAddressId,
      summary: addressSummary,
      shippingAddress,
      billingAddress: shippingAddress,
     },
    });

    const data = res.data || {};
    if (!data.success) {
     setError(data.message || "Sipariş oluşturulamadı.");
     setIsSubmitting(false);
     return;
    }

    clearCart();
    router.push(`/hesabim?tab=siparisler`);
   } catch (e) {
    setError("Sipariş oluşturulurken bir hata oluştu.");
    setIsSubmitting(false);
   }
  } else if (paymentMethod.type === "mailorder") {
   // Kapıda ödeme (Mail Order)
   try {
    const selectedAddress = addresses.find((a) => String(a._id) === String(selectedAddressId));
    const addressSummary = selectedAddress
     ? `${selectedAddress.title} - ${selectedAddress.fullName}, ${selectedAddress.address}, ${selectedAddress.district}/${selectedAddress.city} (${selectedAddress.phone})`
     : "";
    const shippingAddress = selectedAddress
     ? {
      title: selectedAddress.title,
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      district: selectedAddress.district,
      city: selectedAddress.city,
     }
     : null;

    const payloadItems = (cartWithCampaigns || cart || []).map((i) => {
     // Kampanya fiyatı varsa onu kullan
     let price = i.campaignPrice;
     if (!price) {
      price = i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
     }
     return {
      productId: String(i._id || i.id),
      name: i.name,
      slug: i.slug,
      image: i?.images?.[0] || i.image || "",
      price: Number(price || 0),
      quantity: Number(i.quantity || 1),
      size: i.selectedSize || "",
      color: i.selectedColor || "",
      campaignId: i.campaignId || null,
      campaignTitle: i.campaignTitle || null,
     };
    });

    const res = await axiosInstance.post("/api/user/orders", {
     items: payloadItems,
     total: grandTotal,
     paymentMethod: { type: paymentMethod.type },
     address: {
      id: selectedAddressId,
      summary: addressSummary,
      shippingAddress,
      billingAddress: shippingAddress,
     },
    });

    const data = res.data || {};
    if (!data.success) {
     setError(data.message || "Sipariş oluşturulamadı.");
     setIsSubmitting(false);
     return;
    }

    clearCart();
    router.push(`/hesabim?tab=siparisler`);
   } catch (e) {
    setError("Sipariş oluşturulurken bir hata oluştu.");
    setIsSubmitting(false);
   }
  } else {
   setError("Geçersiz ödeme yöntemi.");
   setIsSubmitting(false);
  }
 };

 if (!mounted) {
  return <PaymentLoading />;
 }

 if (!cart || cart.length === 0) {
  return <PaymentEmptyCart />;
 }

 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4 max-w-5xl">
    <PaymentHeader />

    <div className="grid lg:grid-cols-3 gap-8">
     <div className="lg:col-span-2 space-y-6">
      <DeliveryAddressSection
       addresses={addresses}
       addressesLoading={addressesLoading}
       selectedAddressId={selectedAddressId}
       onAddressSelect={setSelectedAddressId}
      />

      <PaymentMethodSection
       paymentMethod={paymentMethod}
       onPaymentMethodChange={setPaymentMethod}
      />
     </div>

     <div className="lg:col-span-1">
      <OrderSummary
       cartTotal={cartTotal}
       shippingCost={shippingCost}
       grandTotal={grandTotal}
       acceptedTerms={acceptedTerms}
       onTermsChange={setAcceptedTerms}
       error={error}
       canPay={canPay && !isSubmitting}
       onPay={handlePay}
       paymentMethodType={paymentMethod.type}
       isSubmitting={isSubmitting}
       campaignInfo={campaignInfo}
      />
     </div>
    </div>
   </div>
  </div>
 );
}
