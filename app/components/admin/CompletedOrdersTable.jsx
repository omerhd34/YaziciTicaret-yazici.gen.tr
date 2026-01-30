"use client";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import normalizeText from "@/lib/normalizeText";
import ReturnStatusDropdown from "./ReturnStatusDropdown";

export default function CompletedOrdersTable({
 orders,
 filter,
 onFilterChange,
 getRowBgClass,
 onReturnStatusChange,
 onDetailClick,
 updatingReturnOrderId,
 currentPage,
 totalPages,
 onPageChange,
}) {
 const filterOptions = [
  { key: "all", label: "Tümü" },
  { key: "cancelled", label: "İptal Edildi" },
  { key: "delivered", label: "Teslim Edildi" },
  { key: `rr:${normalizeText("Talep Edildi")}`, label: "İade: Talep Edildi" },
  { key: `rr:${normalizeText("Onaylandı")}`, label: "İade: Onaylandı" },
  { key: `rr:${normalizeText("Reddedildi")}`, label: "İade: Reddedildi" },
  { key: `rr:${normalizeText("İptal Edildi")}`, label: "İade: İptal Edildi" },
  { key: `rr:${normalizeText("Tamamlandı")}`, label: "İade: Tamamlandı" },
 ];

 if (orders.length === 0) {
  return (
   <div className="bg-white rounded-xl shadow-md p-6">
    <div className="flex items-center justify-between mb-4">
     <h2 className="text-xl font-bold">Tamamlanan Siparişler</h2>
     <div className="flex flex-wrap items-center justify-end gap-2">
      {filterOptions.map((f) => {
       const active = filter === f.key;
       return (
        <button
         key={f.key}
         type="button"
         onClick={() => onFilterChange(f.key)}
         className={`px-3 py-2 rounded-full text-xs font-semibold border transition cursor-pointer
          ${active
           ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
           : "bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50"
          }`}
        >
         {f.label}
        </button>
       );
      })}
     </div>
    </div>
    <div className="text-sm text-gray-500">Tamamlanan sipariş yok.</div>
   </div>
  );
 }

 return (
  <div className="bg-white rounded-xl shadow-md p-6">
   <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold">Tamamlanan Siparişler</h2>
    <div className="flex flex-wrap items-center justify-end gap-2">
     {filterOptions.map((f) => {
      const active = filter === f.key;
      return (
       <button
        key={f.key}
        type="button"
        onClick={() => onFilterChange(f.key)}
        className={`px-3 py-2 rounded-full text-xs font-semibold border transition cursor-pointer
         ${active
          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
          : "bg-white border-gray-200 text-gray-700 hover:border-slate-300 hover:bg-gray-50"
         }`}
       >
        {f.label}
       </button>
      );
     })}
    </div>
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
       <th className="px-4 py-3 text-left font-semibold text-gray-600">İşlem Zamanı</th>
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
       const rrStatus = String(o?.returnRequest?.status || "").trim();
       const hasReturnRequest = Boolean(rrStatus);
       const rrNorm = normalizeText(rrStatus).replace(/\s+/g, "");
       const isReturnRequested = rrNorm === "talepedildi";
       const isReturnApproved = rrNorm === "onaylandi";
       const rrBadgeClass = {
        talepedildi: "bg-amber-100 text-amber-800 border-amber-200",
        onaylandi: "bg-emerald-100 text-emerald-800 border-emerald-200",
        reddedildi: "bg-red-100 text-red-800 border-red-200",
        iptaledildi: "bg-gray-100 text-gray-700 border-gray-200",
        tamamlandi: "bg-emerald-100 text-emerald-800 border-emerald-200",
       }[rrNorm] || "bg-gray-100 text-gray-800 border-gray-200";
       const statusNorm = normalizeText(o?.status || "");
       const isCancelled = statusNorm.includes("iptal");
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
             ) : isReturnApproved ? (
              <button
               type="button"
               onClick={() => onReturnStatusChange(o.orderId, "Tamamlandı")}
               disabled={!o.orderId || updatingReturnOrderId === o.orderId}
               className="px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
               İade tamamlandı
              </button>
             ) : null}
            </div>
           </div>
          ) : (
           isCancelled ? (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white border border-gray-900">
             İptal Edildi
            </span>
           ) : (
            <span className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-gray-900 text-white border border-gray-900">
             Teslim Edildi
            </span>
           )
          )}
         </td>
         <td className="pl-4 pr-16 py-3 text-right font-bold text-indigo-600">
          {Number(o.total || 0).toFixed(2)}
         </td>
         <td className="px-4 py-3 text-right">
          <button
           type="button"
           onClick={() => onDetailClick(row)}
           disabled={!o.orderId}
           className={`px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition cursor-pointer ${!o.orderId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
           Detay
          </button>
         </td>
        </tr>
       );
      })}
     </tbody>
    </table>
   </div>

   {totalPages > 1 ? (
    <div className="mt-4 flex items-center justify-center gap-3">
     <button
      type="button"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage <= 0}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      aria-label="Önceki"
     >
      <HiChevronUp className="w-5 h-5" />
     </button>
     <div className="text-sm text-gray-600">
      {currentPage + 1} / {totalPages}
     </div>
     <button
      type="button"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage >= totalPages - 1}
      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
      aria-label="Sonraki"
     >
      <HiChevronDown className="w-5 h-5" />
     </button>
    </div>
   ) : null}
  </div>
 );
}
