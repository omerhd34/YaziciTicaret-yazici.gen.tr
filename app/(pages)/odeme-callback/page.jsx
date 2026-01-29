"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { useCart } from "@/context/CartContext";
import PaymentLoading from "@/app/components/payment/PaymentLoading";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";

export default function OdemeCallbackPage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const { clearCart } = useCart();
 const [status, setStatus] = useState("processing"); // processing, success, error
 const [message, setMessage] = useState("Ödeme işlemi kontrol ediliyor...");
 const processedRef = useRef(false);

 useEffect(() => {
  if (processedRef.current) return;
  processedRef.current = true;

  const processPayment = async () => {
   try {
    // URL'den gelen parametreleri al
    const paymentId = searchParams.get("paymentId");
    const conversationId = searchParams.get("conversationId");
    const conversationData = searchParams.get("conversationData");
    const orderId = searchParams.get("orderId") || sessionStorage.getItem("pendingOrderId");
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    // Eğer callback route'u işlemi tamamladıysa (success parametresi varsa)
    if (success === "true") {
     setStatus("success");
     setMessage("Ödeme başarıyla tamamlandı!");

     try {
      await clearCart();
     } catch (_) { }

     sessionStorage.removeItem("pendingOrderId");

     setTimeout(() => {
      router.replace(`/hesabim?tab=siparisler`);
     }, 1500);
     return;
    }

    // Eğer hata varsa
    if (error) {
     setStatus("error");
     setMessage(decodeURIComponent(error));
     return;
    }

    // Eğer success=false ise
    if (success === "false") {
     setStatus("error");
     setMessage(error ? decodeURIComponent(error) : "Ödeme işlemi başarısız oldu.");
     return;
    }

    // Eski yöntem: Eğer callback route'u işlemi tamamlamadıysa, 3ds-charge API'sini çağır
    if (!paymentId || !orderId) {
     setStatus("error");
     setMessage("Ödeme bilgileri bulunamadı. Lütfen tekrar deneyin.");
     return;
    }

    // 3D Secure charge işlemini tamamla (fallback)
    const response = await axiosInstance.post("/api/payment/3ds-charge", {
     paymentId,
     conversationId,
     conversationData,
     orderId,
    });

    const data = response.data;

    if (data.success) {
     setStatus("success");
     setMessage("Ödeme başarıyla tamamlandı!");

     try {
      await clearCart();
     } catch (_) { }

     sessionStorage.removeItem("pendingOrderId");

     // 1.5 saniye sonra siparişler sayfasına yönlendir (replace kullanarak geri dönüşü engelle)
     setTimeout(() => {
      router.replace(`/hesabim?tab=siparisler`);
     }, 1500);
    } else {
     setStatus("error");
     setMessage(data.message || "Ödeme işlemi başarısız oldu.");
    }
   } catch (error) {
    setStatus("error");
    setMessage(
     error.response?.data?.message || "Ödeme işlemi sırasında bir hata oluştu."
    );
   }
  };

  processPayment();
 }, [searchParams, router, clearCart]);

 return (
  <div className="bg-gray-50 flex justify-center px-4 py-10 md:py-46">
   <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
    {status === "processing" && (
     <>
      <PaymentLoading />
      <h2 className="text-xl font-bold text-gray-900 mt-4">Ödeme İşleniyor</h2>
      <p className="text-gray-600 mt-2">{message}</p>
     </>
    )}

    {status === "success" && (
     <>
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
       <HiCheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-green-600 mb-2">Ödeme Başarılı!</h2>
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-500 mt-4">Siparişler sayfasına yönlendiriliyorsunuz...</p>
     </>
    )}

    {status === "error" && (
     <>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
       <HiXCircle className="w-8 h-8 text-red-600" />
      </div>
      <h2 className="text-xl font-bold text-red-600 mb-2">Ödeme Başarısız</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
       onClick={() => router.push("/odeme")}
       className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition cursor-pointer"
      >
       Ödeme Sayfasına Dön
      </button>
     </>
    )}
   </div>
  </div>
 );
}
