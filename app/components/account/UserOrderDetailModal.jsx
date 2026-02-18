"use client";
import { useMemo, useState, useEffect } from "react";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { HiX } from "react-icons/hi";
import normalizeText from "@/lib/normalizeText";
import axiosInstance from "@/lib/axios";

export default function UserOrderDetailModal({ show, order, addresses, onClose, onCancel, onReturn, onCancelReturn, formatOrderStatus }) {
 const [currentTime, setCurrentTime] = useState(() => Date.now());
 const [productsData, setProductsData] = useState(new Map());

 useEffect(() => {
  const timer = setInterval(() => {
   setCurrentTime(Date.now());
  }, 1000);
  return () => clearInterval(timer);
 }, []);


 useEffect(() => {
  const fetchProducts = async () => {
   const items = Array.isArray(order?.items) ? order.items : [];
   if (items.length === 0) return;

   const productIds = items
    .map(item => item.productId || item._id || item.id)
    .filter(Boolean)
    .map(id => String(id));

   if (productIds.length === 0) return;

   try {
    const res = await axiosInstance.get("/api/products?limit=1000");
    const data = res.data;
    const allProducts = data.data || data.products || [];

    if (data.success && allProducts.length > 0) {
     const productsMap = new Map();
     allProducts.forEach(product => {
      const productId = String(product._id);
      if (productIds.includes(productId)) {
       // Orijinal fiyatı hesapla: discountPrice varsa ve price'dan küçükse onu kullan, yoksa price'ı kullan
       const originalPrice = product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price;
       productsMap.set(productId, {
        price: product.price,
        discountPrice: product.discountPrice,
        originalPrice: originalPrice,
       });
      }
     });
     setProductsData(productsMap);
    }
   } catch (_) { }
  };

  if (show && order) {
   fetchProducts();
  }
 }, [show, order]);

 useEscapeKey(onClose, { enabled: show });

 const addrFromSaved = useMemo(() => {
  if (!order?.addressId) return null;
  return addresses.find(a => String(a._id) === String(order.addressId)) || null;
 }, [order, addresses]);

 const shipping = useMemo(() => {
  return order?.shippingAddress || (addrFromSaved ? {
   title: addrFromSaved.title,
   firstName: addrFromSaved.firstName,
   lastName: addrFromSaved.lastName,
   fullName: addrFromSaved.fullName || (addrFromSaved.firstName && addrFromSaved.lastName ? `${addrFromSaved.firstName} ${addrFromSaved.lastName}` : ''),
   phone: addrFromSaved.phone,
   address: addrFromSaved.address,
   district: addrFromSaved.district,
   city: addrFromSaved.city,
  } : null);
 }, [order?.shippingAddress, addrFromSaved]);

 const billing = order?.billingAddress || shipping;

 const billingIsSame = useMemo(() => {
  if (!shipping || !billing) return true;
  const pick = (x) => ({
   title: x?.title || "",
   firstName: x?.firstName || "",
   lastName: x?.lastName || "",
   fullName: x?.fullName || (x?.firstName && x?.lastName ? `${x.firstName} ${x.lastName}` : ""),
   phone: x?.phone || "",
   address: x?.address || "",
   district: x?.district || "",
   city: x?.city || "",
  });
  return JSON.stringify(pick(shipping)) === JSON.stringify(pick(billing));
 }, [shipping, billing]);

 const payment = order?.payment || null;
 const paymentText = "Kart ile Ödeme";

 const items = useMemo(() => Array.isArray(order?.items) ? order.items : [], [order]);
 const groups = new Map();


 for (const it of items) {
  const name = it?.name || it?.productName || it?.title || "Ürün";
  const key = `${name}`;
  const qty = Number(it?.quantity || 1) || 1;
  const price = Number(it?.price || 0) || 0;
  const color = it?.color ? String(it.color).trim() : "";
  const serialNumber = it?.serialNumber ? String(it.serialNumber).trim() : "";
  if (!groups.has(key)) {
   groups.set(key, {
    name,
    totalQty: 0,
    totalAmount: 0,
    originalAmount: 0,
    colorCounts: new Map(),
    serialNumber: serialNumber || "",
   });
  }
  const g = groups.get(key);
  g.totalQty += qty;
  g.totalAmount += price * qty;

  // Orijinal fiyatı hesapla
  const productId = String(it?.productId || it?._id || it?.id || "");
  const productInfo = productsData.get(productId);
  const originalPrice = productInfo ? productInfo.originalPrice : price;
  g.originalAmount += originalPrice * qty;
  if (color) {
   g.colorCounts.set(color, (g.colorCounts.get(color) || 0) + qty);
  }
  // Seri numarasını ilk bulunan değerle set et (eğer yoksa)
  if (serialNumber && !g.serialNumber) {
   g.serialNumber = serialNumber;
  }
 }
 const grouped = Array.from(groups.values());

 const s = normalizeText(order?.status || "");
 const isCancelled = s.includes("iptal");
 const isShipped = s.includes("kargo") || s.includes("shipped") || s.includes("shipping");
 const isDelivered = s.includes("teslim") || s.includes("delivered") || s.includes("completed");
 const canCancel = !isCancelled && !isShipped && !isDelivered;
 // İade talebi var mı kontrolü (İptal Edildi durumu hariç, çünkü iptal edilen talepler tekrar iade edilemez)
 const returnRequestStatus = order?.returnRequest?.status;
 const hasReturnRequestCancelled = returnRequestStatus && normalizeText(returnRequestStatus).includes("iptal");
 const hasReturnRequest = Boolean(returnRequestStatus) && !hasReturnRequestCancelled;

 const withinReturnWindow = useMemo(() => {
  if (!isDelivered) return false;

  // Eğer iade talebi iptal edilmişse, tekrar iade edilemez
  if (hasReturnRequestCancelled) {
   return false;
  }

  const deliveredAtRaw = order?.deliveredAt || order?.updatedAt || order?.date;
  if (!deliveredAtRaw) return false;
  const deliveredAt = new Date(deliveredAtRaw);
  if (isNaN(deliveredAt.getTime())) return false;
  const diffMs = currentTime - deliveredAt.getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  return diffMs <= sevenDaysMs;
 }, [isDelivered, hasReturnRequestCancelled, order?.deliveredAt, order?.updatedAt, order?.date, currentTime]);

 const canCancelReturnRequest = useMemo(() => {
  if (!hasReturnRequest || !order?.returnRequest) return false;

  const statusNorm = normalizeText(order.returnRequest.status);
  const isRequested = statusNorm.includes("talep");
  const isApproved = statusNorm.includes("onay");
  const isCancelled = statusNorm.includes("iptal");
  const isRejected = statusNorm.includes("red");
  const isCompleted = statusNorm.includes("tamam");

  // Sadece "Talep Edildi" durumundaki iade talepleri iptal edilebilir
  if (!isRequested || isApproved || isCancelled || isRejected || isCompleted) {
   return false;
  }

  // 2 gün kontrolü (talep tarihinden itibaren)
  const requestedAt = order.returnRequest.requestedAt ? new Date(order.returnRequest.requestedAt) : null;
  if (!requestedAt || isNaN(requestedAt.getTime())) return false;

  const diffMs = currentTime - requestedAt.getTime();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  return diffMs <= twoDaysMs;
 }, [hasReturnRequest, order, currentTime]);

 // Fatura: sadece Kargoya Verildi veya Teslim Edildi durumunda görünsün (Hazırlanıyor'da görünmez)
 const canShowInvoice = useMemo(() => {
  const s = normalizeText(order?.status || "");
  return s.includes("kargo") || s.includes("teslim");
 }, [order?.status]);

 if (!show || !order) return null;

 return (
  <div
   className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
   onClick={onClose}
  >
   <div
    className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
   >
    <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
     <div>
      <h3 className="text-xl font-bold">Sipariş Detayları</h3>
      {order.orderId && (
       <p className="text-sm text-gray-500">Sipariş No: {order.orderId}</p>
      )}
     </div>
     <div className="flex items-center gap-3">
      {canShowInvoice && order?.orderId && (
       <button
        type="button"
        onClick={() => window.open(`${typeof window !== "undefined" ? window.location.origin : ""}/api/user/orders/${order.orderId}/invoice`, "_blank")}
        className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition cursor-pointer"
       >
        Fatura
       </button>
      )}
      <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition cursor-pointer">
       <HiX size={24} />
      </button>
     </div>
    </div>

    <div className="p-6 space-y-6 bg-gray-50">
     {/* İptal edildiyse iptal nedeni / yönetici mesajı */}
     {isCancelled && (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs font-semibold text-red-700 mb-1">İptal nedeni:</div>
       <div className="text-sm text-gray-800 whitespace-pre-wrap">
        {order?.adminCancelMessage && String(order.adminCancelMessage).trim()
         ? order.adminCancelMessage
         : "İptal nedeni belirtilmemiş."}
       </div>
      </div>
     )}

     {/* Sipariş özeti  */}
     <div className="grid md:grid-cols-4 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs text-gray-500 mb-1">Durum:</div>
       <div className="font-bold text-gray-900">{formatOrderStatus(order.status)}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs text-gray-500 mb-1">Tarih ve Saat:</div>
       <div className="font-bold text-gray-900">
        {order.date ? new Date(order.date).toLocaleString("tr-TR") : "-"}
       </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs text-gray-500 mb-1">Ödeme:</div>
       <div className="font-bold text-gray-900">{paymentText}</div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       <div className="text-xs text-gray-500 mb-1">Toplam:</div>
       <div className="font-black text-indigo-600">{Number(order.total || 0).toFixed(2)} ₺</div>
      </div>
     </div>

     {/* Adres - Admin ile aynı 2 sütun düzeni */}
     <div className="grid md:grid-cols-2 gap-4">
      <div className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${billingIsSame ? "md:col-span-2" : ""}`}>
       <div className="text-xs text-gray-500 mb-1">
        {billingIsSame ? "Teslimat Adresi, Fatura Adresi ve İletişim Bilgileri:" : "Teslimat Adresi ve İletişim Bilgileri:"}
       </div>
       {shipping ? (
        <div className="text-sm text-gray-800">
         <div className="font-semibold">{shipping.title || "Adres"}</div>
         <div>{shipping.firstName && shipping.lastName ? `${shipping.firstName} ${shipping.lastName}` : shipping.fullName || ''}</div>
         <div className="text-gray-600">{shipping.address}</div>
         <div className="text-gray-600">{shipping.district} / {shipping.city}</div>
         <div className="text-gray-600">{shipping.phone}</div>
         {billingIsSame ? (
          <div className="text-xs text-gray-400 mt-2">Fatura adresi teslimat adresi ile aynıdır.</div>
         ) : null}
        </div>
       ) : (
        <div className="text-sm text-gray-600">
         <div>Adres bilgisi bulunamadı.</div>
         {order.addressSummary && (
          <div className="text-xs text-gray-500 mt-2">{order.addressSummary}</div>
         )}
        </div>
       )}
      </div>

      {!billingIsSame && (
       <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="text-xs text-gray-500 mb-1">Fatura Adresi:</div>
        {billing ? (
         <div className="text-sm text-gray-800">
          <div className="font-semibold">{billing.title || "Adres"}</div>
          <div>{billing.firstName && billing.lastName ? `${billing.firstName} ${billing.lastName}` : billing.fullName || ''}</div>
          <div className="text-gray-600">{billing.address}</div>
          <div className="text-gray-600">{billing.district} / {billing.city}</div>
          <div className="text-gray-600">{billing.phone}</div>
         </div>
        ) : (
         <div className="text-sm text-gray-600">
          <div>Adres bilgisi bulunamadı.</div>
          {order.addressSummary && (
           <div className="text-xs text-gray-500 mt-2">{order.addressSummary}</div>
          )}
         </div>
        )}
       </div>
      )}
     </div>

     {hasReturnRequest ? (
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
       <span className="text-xs text-gray-600">
        İade talebi: <span className="text-sm font-semibold text-indigo-600">{order.returnRequest.status}</span>
        {normalizeText(order?.returnRequest?.status) === normalizeText("Talep Edildi") ? (
         <span className="text-gray-500"> — Geri dönüşümüzü bekleyin.</span>
        ) : null}
       </span>
       {canCancelReturnRequest && onCancelReturn ? (
        <button
         onClick={() => onCancelReturn(order.orderId)}
         className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer whitespace-nowrap text-sm"
        >
         İade Talebini İptal Et
        </button>
       ) : null}
      </div>
     ) : null}

     {hasReturnRequest && order?.returnRequest?.adminExplanation ? (
      <div className="text-sm text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
       <span className="text-xs text-gray-500">Mağaza iade açıklaması: </span>
       <span className="font-semibold text-gray-900">{order.returnRequest.adminExplanation}</span>
      </div>
     ) : null}

     {/* Ürünler - Admin ile aynı stil */}
     <div>
      <div className="text-sm font-bold text-gray-900 mb-3">Sipariş Ürünleri:</div>
      <div className="space-y-3">
       {grouped.map((g, idx) => {
        return (
         <div key={`${g.name}-${idx}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between gap-4">
          <div>
           <div className="font-semibold text-gray-900">{g.name}</div>
           <div className="text-sm text-gray-600">
            {g.serialNumber && (
             <span>
              <span className="font-bold">Seri No:</span> <span className="font-mono">{g.serialNumber}</span>
             </span>
            )}
           </div>
          </div>
          <div className="text-right">
           <div className="text-sm text-gray-600">Adet: {g.totalQty}</div>
           {g.originalAmount > g.totalAmount ? (
            <div className="flex flex-col items-end gap-1">
             <div className="font-bold text-gray-900">{g.totalAmount.toFixed(2)} ₺</div>
             <div className="text-sm text-gray-400 line-through">{g.originalAmount.toFixed(2)} ₺</div>
            </div>
           ) : (
            <div className="font-bold text-gray-900">{g.totalAmount.toFixed(2)} ₺</div>
           )}
          </div>
         </div>
        );
       })}
      </div>
     </div>
    </div>

    {!isCancelled && (
     <div className="flex items-center justify-between gap-3 px-6 py-4 border-t">
      {canCancel ? (
       <button
        onClick={() => onCancel(order.orderId)}
        className="ml-auto px-5 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition cursor-pointer"
       >
        Siparişi İptal Et
       </button>
      ) : isDelivered ? (
       hasReturnRequest ? null : hasReturnRequestCancelled ? (
        <span className="text-sm text-gray-500">Bu sipariş için iade talebi daha önce iptal edilmiş. Tekrar iade talebi oluşturulamaz.</span>
       ) : withinReturnWindow ? (
        <>
         <div className="text-sm text-gray-600">Sipariş teslim edildi. 7 gün içinde iade talebi oluşturabilirsiniz.</div>
         <button onClick={() => onReturn(order.orderId)} className="px-5 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition cursor-pointer">
          İade Et
         </button>
        </>
       ) : (
        <span className="text-sm text-gray-500">İade süresi doldu. Ürün teslim edildikten sonra 7 gün içinde iade talebi oluşturabilirsiniz.</span>
       )
      ) : isShipped ? (
       <span className="text-sm text-gray-500">Sipariş kargoya verildi. Teslim edildikten sonra iade talebi oluşturabilirsiniz.</span>
      ) : (
       <span className="text-sm text-gray-500">Bu sipariş için işlem yapılamaz.</span>
      )}
     </div>
    )}
   </div>
  </div>
 );
}