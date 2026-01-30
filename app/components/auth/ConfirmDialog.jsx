"use client";
import { HiX } from "react-icons/hi";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function ConfirmDialog({
 show,
 message,
 onConfirm,
 onCancel,
 confirmText = "Onayla",
 cancelText = "İptal",
 confirmColor = "red",
}) {
 useEscapeKey(onCancel, { enabled: show });

 if (!show) return null;

 const confirmBgColor = confirmColor === "red" ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700";

 return (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
   <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fadeIn relative">
    <button
     onClick={onCancel}
     className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
     aria-label="Kapat"
    >
     <HiX size={24} />
    </button>
    <div className="p-6">
     <h3 className="text-xl font-bold text-gray-900 mb-4 pr-8">Onay</h3>
     <p className="text-gray-600 mb-6">{message}</p>
     <div className="flex gap-3 justify-end">
      <button
       onClick={onCancel}
       className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-800 rounded-lg font-semibold transition-colors"
      >
       {cancelText}
      </button>
      <button
       onClick={onConfirm}
       className={`px-6 py-2.5 ${confirmBgColor} text-white cursor-pointer rounded-lg font-semibold transition-colors`}
      >
       {confirmText}
      </button>
     </div>
    </div>
   </div>
  </div>
 );

}
