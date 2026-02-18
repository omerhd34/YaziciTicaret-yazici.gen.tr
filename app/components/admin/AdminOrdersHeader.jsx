"use client";

export default function AdminOrdersHeader({ title = "Son Siparişler" }) {
 return (
  <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white">
   <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center">
     <div>
      <h1 className="text-3xl font-bold mb-2">Admin Paneli</h1>
      <p className="text-indigo-100">{title}</p>
     </div>
    </div>
   </div>
  </div>
 );
}
