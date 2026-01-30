"use client";
import normalizeText from "@/lib/normalizeText";
import { HiX } from "react-icons/hi";
import StatusDropdown from "./StatusDropdown";
import ReturnStatusDropdown from "./ReturnStatusDropdown";

export default function ActiveOrdersTable({
 orders,
 getRowBgClass,
 onStatusChange,
 onReturnStatusChange,
 onDetailClick,
 onCancelClick,
 updatingOrderId,
 updatingReturnOrderId,
 onRefresh,
}) {
 if (orders.length === 0) {
  return (
   <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
     <h2 className="text-xl font-bold">Son Siparişler</h2>
     <button onClick={onRefresh} className="text-sm cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800">
      Yenile
     </button>
    </div>
    <div className="text-sm text-gray-500">Henüz sipariş yok.</div>
   </div>
  );
 }

 return (
  <div className="bg-white rounded-xl shadow-md p-6">
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Son Siparişler</h2>
    <button onClick={onRefresh} className="text-sm cursor-pointer font-semibold text-indigo-600 hover:text-indigo-800">
     Yenile
    </button>
   </div>

   <div className="overflow-x-auto border rounded-lg">
    <table className="w-full text-sm table-fixed">
     <colgroup>
      <col style={{ width: "22%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "22%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "6%" }} />
     </colgroup>
     <thead className="bg-gray-50">
      <tr>
       <th className="px-4 py-3 text-left font-semibold text-gray-600">Sipariş No</th>
       <th className="px-4 py-3 text-left font-semibold text-gray-600">Müşteri</th>
       <th className="px-4 py-3 text-left font-semibold text-gray-600">Tarih</th>
       <th className="px-4 py-3 text-left font-semibold text-gray-600">Durum</th>
       <th className="pl-4 pr-16 py-3 text-right font-semibold text-gray-600">Tutar (₺)</th>
       <th className="px-4 py-3 text-right font-semibold text-gray-600">İşlem</th>
      </tr>
     </thead>
     <tbody className="divide-y divide-gray-200">
      {orders.map((row, idx) => {
       const o = row.order || {};
       const u = row.user || {};
       const d = o.date ? new Date(o.date) : null;
       const dateText = d ? d.toLocaleString("tr-TR") : "-";
       const rawStatus = (o.status || "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
       const statusNorm = normalizeText(rawStatus);
       const isCancelled = statusNorm.includes("iptal");
       const isDelivered = statusNorm.includes("teslim");
       const canCancel = !isCancelled && !isDelivered;
       const rrStatus = String(o?.returnRequest?.status || "").trim();
       const hasReturnRequest = Boolean(rrStatus);
       const rrNorm = normalizeText(rrStatus).replace(/\s+/g, "");
       const isReturnRequested = rrNorm === "talepedildi";
       const rrBadgeClass = {
        talepedildi: "bg-amber-100 text-amber-800 border-amber-200",
        onaylandi: "bg-emerald-100 text-emerald-800 border-emerald-200",
        reddedildi: "bg-red-100 text-red-800 border-red-200",
        iptaledildi: "bg-gray-100 text-gray-700 border-gray-200",
        tamamlandi: "bg-emerald-100 text-emerald-800 border-emerald-200",
       }[rrNorm] || "bg-gray-100 text-gray-800 border-gray-200";
       return (
        <tr key={idx} className={getRowBgClass(o)}>
         <td className="px-4 py-3 font-semibold">{o.orderId || "-"}</td>
         <td className="px-4 py-3">
          <div className="font-semibold">{u.name || "-"}</div>
          <div className="text-xs text-gray-500">{u.email || ""}</div>
         </td>
         <td className="px-4 py-3">{dateText}</td>
         <td className="px-4 py-3">
          {hasReturnRequest ? (
           <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
             <span className={`inline-flex items-center px-3 py-2 rounded-xl text-sm font-semibold border ${rrBadgeClass}`}>
              İade: {rrStatus}
             </span>
             {isReturnRequested ? (
              <ReturnStatusDropdown
               value={rrStatus}
               onChange={(e) => onReturnStatusChange(o.orderId, e.target.value)}
               disabled={!o.orderId || updatingReturnOrderId === o.orderId}
              />
             ) : null}
            </div>
           </div>
          ) : isCancelled ? (
           <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white border border-gray-900">
            İptal Edildi
           </span>
          ) : (
           <StatusDropdown
            value={rawStatus}
            onChange={(e) => onStatusChange(o.orderId, e.target.value)}
            disabled={!o.orderId || updatingOrderId === o.orderId}
           />
          )}
          {updatingOrderId === o.orderId ? (
           <div className="text-xs text-gray-500 mt-1">Güncelleniyor...</div>
          ) : updatingReturnOrderId === o.orderId ? (
           <div className="text-xs text-gray-500 mt-1">İade güncelleniyor...</div>
          ) : null}
         </td>
         <td className="pl-4 pr-16 py-3 text-right font-bold text-indigo-600">
          {Number(o.total || 0).toFixed(2)}
         </td>
         <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
           {canCancel && onCancelClick && (
            <button
             type="button"
             onClick={() => onCancelClick(o.orderId)}
             disabled={!o.orderId || updatingOrderId === o.orderId}
             className={`p-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
             title="Siparişi İptal Et"
            >
             <HiX size={18} />
            </button>
           )}
           <button
            type="button"
            onClick={() => onDetailClick(row)}
            disabled={!o.orderId}
            className={`px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer ${!o.orderId ? "opacity-50 cursor-not-allowed" : ""}`}
           >
            Detay
           </button>
          </div>
         </td>
        </tr>
       );
      })}
     </tbody>
    </table>
   </div>
  </div>
 );
}
