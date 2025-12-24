"use client";
import Link from "next/link";
import { HiChevronDown, HiChevronUp, HiArrowRight } from "react-icons/hi";
import { FaShoppingBag } from "react-icons/fa";
import normalizeText from "@/lib/normalizeText";

export default function OrdersTab({ orders, ordersLoading, showAllOrders, setShowAllOrders, onOrderClick, getOrderStatusLabel, formatOrderStatus }) {
 if (ordersLoading) {
  return (
   <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-6">Siparişlerim</h2>
    <div className="text-center py-12">
     <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-gray-600">Siparişler yükleniyor...</p>
    </div>
   </div>
  );
 }

 if (orders.length === 0) {
  return (
   <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-6">Siparişlerim</h2>
    <div className="text-center py-12">
     <FaShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
     <p className="text-gray-500 text-lg mb-4">Henüz siparişiniz yok</p>
     <Link
      href="/kategori"
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition"
     >
      Alışverişe Başla
     </Link>
    </div>
   </div>
  );
 }

 const getStatusColor = (status) => {
  const statusNorm = normalizeText(status || "");
  if (statusNorm.includes("teslim") || statusNorm.includes("tamam")) {
   return 'bg-green-100 text-green-800';
  } else if (statusNorm.includes("kargo") || statusNorm.includes("kargoya") || statusNorm.includes("yolda")) {
   return 'bg-blue-100 text-blue-800';
  } else if (statusNorm.includes("hazir")) {
   return 'bg-orange-100 text-orange-800';
  } else if (statusNorm.includes("bekle")) {
   return 'bg-yellow-100 text-yellow-800';
  } else if (statusNorm.includes("iptal")) {
   return 'bg-red-100 text-red-800';
  }
  return 'bg-gray-100 text-gray-800';
 };

 return (
  <div className="space-y-4">
   <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-2xl font-bold mb-6">Siparişlerim</h2>
    <div className="space-y-4">
     {(showAllOrders ? orders : orders.slice(0, 5)).map((order) => {
      const orderDate = new Date(order.date);
      const formattedDate = orderDate.toLocaleDateString('tr-TR', {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
      });

      const itemsArr = Array.isArray(order.items) ? order.items : [];
      const itemCount = itemsArr.length;
      const firstProductName = itemsArr[0]?.name || itemsArr[0]?.productName || itemsArr[0]?.title;
      const orderTitle = firstProductName
       ? firstProductName
       : `Sipariş #${order.orderId || (order._id ? order._id.toString().slice(-6).toUpperCase() : '')}`;

      return (
       <div
        key={order._id || order.orderId}
        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
       >
        <div className="flex justify-between items-start mb-4">
         <div>
          <h3 className="font-bold text-lg mb-1">{orderTitle}</h3>
          <p className="text-sm text-gray-500">{formattedDate}</p>
          {order.orderId && (
           <p className="text-xs text-gray-400 mt-1">Sipariş No: {order.orderId}</p>
          )}
         </div>
         <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${order?.returnRequest?.status ? "bg-purple-100 text-purple-800" : getStatusColor(order.status)}`}
         >
          {getOrderStatusLabel(order)}
         </span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
         <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{itemCount} Ürün</span>
          <span className="font-bold text-lg text-gray-900">
           {order.total ? order.total.toFixed(2) : '0.00'} ₺
          </span>
         </div>
         <button
          onClick={() => onOrderClick(order)}
          className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer flex items-center gap-1"
         >
          Detayları Gör <HiArrowRight size={18} />
         </button>
        </div>
       </div>
      );
     })}
     {orders.length > 5 ? (
      <div className="pt-2 flex justify-center">
       {!showAllOrders ? (
        <button
         type="button"
         onClick={() => setShowAllOrders(true)}
         className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition inline-flex items-center gap-2 cursor-pointer"
        >
         Diğerleri <HiChevronDown className="w-5 h-5" />
        </button>
       ) : (
        <button
         type="button"
         onClick={() => setShowAllOrders(false)}
         className="px-5 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold transition inline-flex items-center gap-2 cursor-pointer"
        >
         Son 5 <HiChevronUp className="w-5 h-5" />
        </button>
       )}
      </div>
     ) : null}
    </div>
   </div>
  </div>
 );
}
