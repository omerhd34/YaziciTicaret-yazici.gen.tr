"use client";
import { HiClock, HiCheckCircle, HiXCircle, HiInformationCircle, HiTrash } from "react-icons/hi";

const STATUS_CONFIG = {
 Beklemede: {
  Icon: HiClock,
  badge: "bg-amber-500 text-white",
  card: "bg-gradient-to-br from-indigo-50 via-white to-violet-50/50 border-2 border-indigo-200 shadow-md shadow-indigo-100/50",
 },
 Onaylandı: {
  Icon: HiCheckCircle,
  badge: "bg-green-600 text-white",
  card: "bg-gradient-to-br from-green-50 via-white to-emerald-50/50 border-2 border-green-200 shadow-md shadow-green-100/50",
  msg: { title: "İsteğiniz onaylandı!", text: "Ürün en kısa sürede şubelerimize ulaşacak ve sitemizde yayınlanacaktır.", cls: "bg-green-50/80 border border-green-200 text-green-800", iconCls: "text-green-600" },
 },
 Reddedildi: {
  Icon: HiXCircle,
  badge: "bg-red-600 text-white",
  card: "bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-lg",
  msg: { title: "İsteğiniz reddedildi.", text: "Bu ürün şu anda temin edilememektedir.", cls: "bg-red-50/80 border border-red-200 text-red-800", iconCls: "text-red-600" },
 },
 "İptal Edildi": {
  Icon: HiXCircle,
  badge: "bg-gray-500 text-white",
  card: "bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-lg",
  msg: { title: "İsteğiniz iptal edildi.", text: "Ürün tedarik edilemediği için isteğiniz sonlandırılmıştır.", cls: "bg-gray-50 border border-gray-200 text-gray-700", iconCls: "text-gray-600" },
 },
};
const DEFAULT_STATUS = { Icon: HiClock, badge: "bg-gray-500 text-white", card: "bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-lg" };

export default function ProductRequestCard({ request, onCancel, formatDate }) {
 const cfg = STATUS_CONFIG[request.status] || DEFAULT_STATUS;
 const StatusIcon = cfg.Icon;
 const canCancel = request.status === "Beklemede";

 return (
  <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out ${cfg.card}`}>
   <div className="absolute top-0 right-0">
    <div className={`flex items-center gap-1 text-white text-xs font-semibold pl-3 pr-2.5 py-1 rounded-bl-xl shadow-sm ${cfg.badge}`}>
     <StatusIcon className="text-white shrink-0" size={14} />
     {request.status}
    </div>
   </div>

   <div className="p-4 pt-5">
    <p className="text-base font-bold text-gray-900 pr-24 mb-2">{request.productName}</p>
    <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
     <HiClock size={12} className="shrink-0" />
     {formatDate(request.createdAt)}
    </p>
    {(request.brand || request.model) && (
     <p className="text-sm text-gray-700 mb-1">
      <span className="text-gray-500 font-medium">Marka:</span> {request.brand || "-"}
      {request.model && <><span className="text-gray-400 mx-1">-</span><span className="text-gray-500 font-medium">Model:</span> {request.model}</>}
     </p>
    )}
    {request.productDescription && <p className="text-sm text-gray-600 leading-snug line-clamp-2 mt-1">{request.productDescription}</p>}

    {cfg.msg && (
     <div className={`mt-3 p-3 rounded-lg ${cfg.msg.cls}`}>
      <div className="flex items-start gap-2">
       <HiInformationCircle className={`${cfg.msg.iconCls} shrink-0 mt-0.5`} size={16} />
       <div className="text-xs font-medium leading-relaxed">
        <p className="font-semibold mb-0.5">{cfg.msg.title}</p>
        <p>{cfg.msg.text}</p>
       </div>
      </div>
     </div>
    )}
    {request.adminResponse && (
     <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-2 mb-1">
       <HiInformationCircle className="text-blue-600 shrink-0 mt-0.5" size={16} />
       <h4 className="font-semibold text-blue-900 text-xs">Admin Cevabı</h4>
      </div>
      <p className="text-xs text-blue-800 whitespace-pre-wrap line-clamp-3">{request.adminResponse}</p>
      {request.respondedAt && <p className="text-xs text-blue-600 mt-2">Cevap: {formatDate(request.respondedAt)}</p>}
     </div>
    )}
   </div>

   {canCancel && (
    <div className="flex justify-end items-center gap-2 px-4 py-3 bg-gray-50/70 border-t border-gray-100">
     <button
      onClick={() => onCancel(request._id?.toString ? request._id.toString() : request._id)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-red-50 border border-red-200 text-red-600 hover:text-red-700 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer"
     >
      <HiTrash size={14} />
      İsteği İptal Et
     </button>
    </div>
   )}
  </div>
 );
}