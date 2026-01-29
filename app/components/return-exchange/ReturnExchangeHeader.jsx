"use client";

export default function ReturnExchangeHeader({ activeTab, onTabChange }) {
 return (
  <>
   <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
     İade & Değişim
    </h1>
    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
     Ürünlerinizi 14 gün içinde iade edebilir veya değiştirebilirsiniz.
    </p>
   </div>

   <div className="flex justify-center mb-8">
    <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
     <button
      onClick={() => onTabChange("iade")}
      className={`px-8 py-3 rounded-lg font-semibold transition cursor-pointer ${activeTab === "iade"
       ? "bg-indigo-600 text-white"
       : "text-gray-600 hover:bg-gray-100"
       }`}
     >
      İade
     </button>
     <button
      onClick={() => onTabChange("degisim")}
      className={`px-8 py-3 rounded-lg font-semibold transition cursor-pointer ${activeTab === "degisim"
       ? "bg-indigo-600 text-white"
       : "text-gray-600 hover:bg-gray-100"
       }`}
     >
      Değişim
     </button>
    </div>
   </div>
  </>
 );
}
