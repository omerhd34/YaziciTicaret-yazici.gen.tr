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

 useEffect(() => {
  setMounted(true);
 }, []);

 const cartTotal = useMemo(() => {
  return (cart || []).reduce((sum, item) => {
   const price =
    item.discountPrice && item.discountPrice < item.price
     ? item.discountPrice
     : item.price;
   return sum + (price || 0) * (item.quantity || 1);
  }, 0);
 }, [cart]);

 const shippingCost = cartTotal >= 500 ? 0 : 29.99;
 const grandTotal = cartTotal + shippingCost;

 const [addresses, setAddresses] = useState([]);
 const [addressesLoading, setAddressesLoading] = useState(true);
 const [selectedAddressId, setSelectedAddressId] = useState("");

 const [cards, setCards] = useState([]);
 const [cardsLoading, setCardsLoading] = useState(true);
 const [paymentMethod, setPaymentMethod] = useState({ type: "card", cardId: "" });

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

 const fetchCards = useCallback(async () => {
  try {
   setCardsLoading(true);
   const res = await axiosInstance.get("/api/user/cards", {
    cache: "no-store",
   });
   const data = res.data || {};
   if (!data.success) {
    setCards([]);
    return;
   }
   const list = data.cards || [];
   const sorted = [...list].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
   setCards(sorted);

   const defaultCard = sorted.find((c) => c.isDefault) || sorted[0];
   const id = defaultCard?._id?.toString ? defaultCard._id.toString() : defaultCard?._id;
   if (id) setPaymentMethod({ type: "card", cardId: id });
  } finally {
   setCardsLoading(false);
  }
 }, []);

 useEffect(() => {
  if (cart && cart.length > 0) {
   fetchAddresses();
   fetchCards();
  }
 }, [cart, fetchAddresses, fetchCards]);

 const canPay = useMemo(() => {
  if (!cart || cart.length === 0) return false;
  if (!acceptedTerms) return false;
  if (!selectedAddressId) return false;
  if (paymentMethod.type === "card" && !paymentMethod.cardId) return false;
  if (paymentMethod.type === "havale") return true;
  return true;
 }, [acceptedTerms, cart, paymentMethod, selectedAddressId]);

 const handlePay = async () => {
  if (isSubmitting) return; // Çift tıklamayı engelle

  if (!selectedAddressId) {
   setError("Lütfen teslimat adresi seçin.");
   return;
  }
  if (paymentMethod.type === "card" && !paymentMethod.cardId) {
   setError("Lütfen bir kart seçin veya diğer ödeme yöntemlerini kullanın.");
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

    const payloadItems = (cart || []).map((i) => {
     const price =
      i.discountPrice && i.discountPrice < i.price ? i.discountPrice : i.price;
     return {
      productId: String(i._id || i.id),
      name: i.name,
      slug: i.slug,
      image: i?.images?.[0] || i.image || "",
      price: Number(price || 0),
      quantity: Number(i.quantity || 1),
      size: i.selectedSize || "",
      color: i.selectedColor || "",
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
   setError("Kart ile ödeme henüz aktif değil. Şimdilik diğer ödeme yöntemlerini kullanın.");
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
       cards={cards}
       cardsLoading={cardsLoading}
       onPaymentMethodChange={setPaymentMethod}
       onCardSelect={(cardId) => setPaymentMethod({ type: "card", cardId })}
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
      />
     </div>
    </div>
   </div>
  </div>
 );
}
