"use client";
import { HiCheckCircle } from "react-icons/hi";

export default function PaymentAddressCard({ address, selected, onSelect }) {
 const id = address?._id?.toString ? address._id.toString() : address?._id;

 return (
  <label
   className={`cursor-pointer border-2 rounded-xl p-5 transition ${selected
    ? "border-indigo-600 bg-indigo-50"
    : "border-gray-200 hover:border-indigo-300"
    }`}
   onClick={() => onSelect(String(id))}
  >
   <div className="flex items-start justify-between gap-3">
    <div>
     <div className="flex items-center gap-2">
      <input
       type="radio"
       name="address"
       checked={selected}
       onChange={() => onSelect(String(id))}
      />
      <span className="font-bold text-gray-900">{address.title}</span>
      {address.isDefault && (
       <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
        Varsayılan
       </span>
      )}
     </div>
     <p className="text-sm text-gray-700 mt-2 font-semibold">
      {address.firstName && address.lastName
       ? `${address.firstName} ${address.lastName}`
       : address.fullName || ''}
     </p>
     <p className="text-sm text-gray-600 mt-1 line-clamp-2">{address.address}</p>
     <p className="text-sm text-gray-600 mt-1">
      {address.district} / {address.city}
     </p>
     <p className="text-sm text-gray-600 mt-1">{address.phone}</p>
    </div>
    {selected && (
     <HiCheckCircle className="text-indigo-600 shrink-0" size={22} />
    )}
   </div>
  </label>
 );
}
