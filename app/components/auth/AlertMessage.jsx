"use client";
import { MdError, MdCheckCircle } from "react-icons/md";

export default function AlertMessage({ message, type = "error", onClose }) {
 if (!message) return null;

 const isError = type === "error";
 const Icon = isError ? MdError : MdCheckCircle;
 const bgColor = isError ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200";
 const textColor = isError ? "text-red-800" : "text-green-800";
 const iconColor = isError ? "text-red-600" : "text-green-600";

 const sentences = message.split('. ').filter(s => s.trim());

 return (
  <div className={`${bgColor} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
   <Icon className={`${iconColor} shrink-0`} size={20} />
   <div className={`${textColor} text-sm flex-1`}>
    {sentences.map((sentence, idx) => (
     <p key={idx} className={idx > 0 ? 'mt-1' : ''}>
      {sentence}{idx < sentences.length - 1 ? '.' : ''}
     </p>
    ))}
   </div>
   {onClose && (
    <button
     onClick={onClose}
     className={`${iconColor} hover:opacity-70 transition shrink-0`}
     aria-label="Kapat"
    >
     <span className="text-xl">×</span>
    </button>
   )}
  </div>
 );
}
