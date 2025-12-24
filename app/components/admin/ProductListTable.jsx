"use client";
import Image from "next/image";
import { HiPlus, HiX } from "react-icons/hi";
import { MdDelete, MdEdit, MdInventory2, MdStar, MdCheckCircle, MdNewReleases } from "react-icons/md";
import { MENU_ITEMS } from "@/app/components/ui/Header";

export default function ProductListTable({ products, onEdit, onDelete, onAddNew, selectedCategory, selectedSubCategory, selectedStockFilter, selectedFeaturedFilter, selectedNewFilter, onCategoryChange, onSubCategoryChange, onStockFilterChange, onFeaturedFilterChange, onNewFilterChange }) {
 const categoryFilteredProducts = products.filter((product) => {
  if (selectedCategory && product.category !== selectedCategory) {
   return false;
  }
  if (selectedSubCategory && product.subCategory !== selectedSubCategory) {
   return false;
  }
  return true;
 });

 const expandedProducts = [];
 categoryFilteredProducts.forEach((product) => {
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
   product.colors.forEach((color) => {
    if (typeof color === 'object' && color.serialNumber) {
     expandedProducts.push({
      ...product,
      _colorVariantId: `${product._id}-${color.serialNumber}`,
      _selectedColor: color,
     });
    }
   });
  } else {
   expandedProducts.push(product);
  }
 });

 const filteredProducts = expandedProducts.filter((product) => {
  if (selectedStockFilter) {
   const colorVariant = product._selectedColor;
   const variantStock = colorVariant
    ? (colorVariant.stock !== undefined ? Number(colorVariant.stock) || 0 : 0)
    : (product.stock !== undefined ? Number(product.stock) || 0 : 0);

   switch (selectedStockFilter) {
    case 'inStock':
     if (variantStock <= 0) return false;
     break;
    case 'outOfStock':
     if (variantStock > 0) return false;
     break;
    case 'lowStock':
     if (variantStock >= 10 || variantStock === 0) return false;
     break;
    default:
     break;
   }
  }

  if (selectedFeaturedFilter) {
   if (selectedFeaturedFilter === 'featured' && !product.isFeatured) {
    return false;
   }
   if (selectedFeaturedFilter === 'notFeatured' && product.isFeatured) {
    return false;
   }
  }

  if (selectedNewFilter) {
   if (selectedNewFilter === 'new' && !product.isNew) {
    return false;
   }
   if (selectedNewFilter === 'notNew' && product.isNew) {
    return false;
   }
  }

  return true;
 });

 const totalProductCount = products.reduce((count, product) => {
  if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
   return count + product.colors.filter(c => typeof c === 'object' && c.serialNumber).length;
  }
  return count + 1;
 }, 0);

 const selectedMenuItem = MENU_ITEMS.find(item => item.name === selectedCategory);
 const availableSubCategories = selectedMenuItem?.subCategories || [];

 return (
  <div className="bg-white rounded-xl shadow-md p-6">
   <div className="flex justify-between items-center mb-6">
    <div>
     <h2 className="text-2xl font-bold">Ürün Yönetimi</h2>
     <p className="text-sm text-gray-600 mt-2">
      {selectedCategory || selectedSubCategory || selectedStockFilter || selectedFeaturedFilter || selectedNewFilter ? (
       <>
        <span className="font-semibold text-indigo-600">{filteredProducts.length}</span> ürün bulundu
       </>
      ) : (
       <>
        <span className="font-semibold text-indigo-600">{totalProductCount}</span> ürün
       </>
      )}
     </p>
    </div>
    <button
     onClick={onAddNew}
     className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer"
    >
     <HiPlus size={20} />
     Yeni Ürün Ekle
    </button>
   </div>

   {/* Kategori Filtreleri */}
   <div className="mb-6 bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-5 shadow-sm border border-indigo-100">
    <div className="flex flex-wrap gap-4 items-end">
     <div className="flex-1 min-w-[200px]">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
       <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
       Ana Kategori
      </label>
      <select
       value={selectedCategory || ""}
       onChange={(e) => {
        onCategoryChange(e.target.value || null);
        onSubCategoryChange(null);
       }}
       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer appearance-none bg-white text-gray-800 font-medium shadow-sm hover:border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
       style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%234F46E5' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '16px'
       }}
      >
       <option value="">Tüm Kategoriler</option>
       {MENU_ITEMS.filter(item => !item.isSpecial).map((item) => (
        <option key={item.name} value={item.name}>{item.name}</option>
       ))}
      </select>
     </div>
     {selectedCategory && availableSubCategories.length > 0 && (
      <div className="flex-1 min-w-[200px]">
       <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
        <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
        Alt Kategori
       </label>
       <select
        value={selectedSubCategory || ""}
        onChange={(e) => onSubCategoryChange(e.target.value || null)}
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer appearance-none bg-white text-gray-800 font-medium shadow-sm hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
        style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%239333EA' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
         backgroundRepeat: 'no-repeat',
         backgroundPosition: 'right 1rem center',
         backgroundSize: '16px'
        }}
       >
        <option value="">Tüm Alt Kategoriler</option>
        {availableSubCategories.map((subCat) => (
         <option key={subCat.name} value={subCat.name}>{subCat.name}</option>
        ))}
       </select>
      </div>
     )}
     <div className="flex-1 min-w-[200px]">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
       <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
       Stok Durumu
      </label>
      <select
       value={selectedStockFilter || ""}
       onChange={(e) => onStockFilterChange(e.target.value || null)}
       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer appearance-none bg-white text-gray-800 font-medium shadow-sm hover:border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
       style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%2316A34A' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '16px'
       }}
      >
       <option value="">Tümü</option>
       <option value="inStock">Stokta</option>
       <option value="outOfStock">Stokta Yok</option>
       <option value="lowStock">Düşük Stok (&lt;10)</option>
      </select>
     </div>
     <div className="flex-1 min-w-[200px]">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
       <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></span>
       Öne Çıkan
      </label>
      <select
       value={selectedFeaturedFilter || ""}
       onChange={(e) => onFeaturedFilterChange(e.target.value || null)}
       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer appearance-none bg-white text-gray-800 font-medium shadow-sm hover:border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
       style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23CA8A04' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '16px'
       }}
      >
       <option value="">Tümü</option>
       <option value="featured">Öne Çıkanlar</option>
       <option value="notFeatured">Öne Çıkan Olmayanlar</option>
      </select>
     </div>
     <div className="flex-1 min-w-[200px]">
      <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2.5">
       <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
       Yeni Ürünler
      </label>
      <select
       value={selectedNewFilter || ""}
       onChange={(e) => onNewFilterChange(e.target.value || null)}
       className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 cursor-pointer appearance-none bg-white text-gray-800 font-medium shadow-sm hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
       style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%232563EB' d='M8 11L3 6h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 1rem center',
        backgroundSize: '16px'
       }}
      >
       <option value="">Tümü</option>
       <option value="new">Yeni Ürünler</option>
       <option value="notNew">Yeni Olmayanlar</option>
      </select>
     </div>
     {(selectedCategory || selectedSubCategory || selectedStockFilter || selectedFeaturedFilter || selectedNewFilter) && (
      <button
       onClick={() => {
        onCategoryChange(null);
        onSubCategoryChange(null);
        onStockFilterChange(null);
        onFeaturedFilterChange(null);
        onNewFilterChange(null);
       }}
       className="px-6 py-3 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
      >
       <HiX className="w-5 h-5" />
       Filtreleri Temizle
      </button>
     )}
    </div>
   </div>

   {filteredProducts.length === 0 ? (
    <div className="text-center py-12 text-gray-500">
     <MdInventory2 size={64} className="mx-auto mb-4 text-gray-300" />
     <p className="text-lg font-semibold">
      {products.length === 0 ? "Henüz ürün eklenmemiş" : "Filtreye uygun ürün bulunamadı"}
     </p>
     <p className="text-sm">
      {products.length === 0 ? "Yeni ürün eklemek için yukarıdaki butona tıklayın" : "Farklı bir kategori seçmeyi deneyin"}
     </p>
    </div>
   ) : (
    <div className="overflow-x-auto">
     <table className="w-full">
      <thead className="bg-gray-50">
       <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ürün</th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Kategori</th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Fiyat (₺)</th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stok</th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Durum</th>
        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">İşlemler</th>
       </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
       {filteredProducts.map((product) => {
        const colorVariant = product._selectedColor;
        const displayPrice = colorVariant ? (colorVariant.price || product.price) : product.price;
        const displayDiscountPrice = colorVariant ? (colorVariant.discountPrice !== undefined ? colorVariant.discountPrice : product.discountPrice) : product.discountPrice;
        const displayStock = colorVariant ? (colorVariant.stock !== undefined ? colorVariant.stock : 0) : product.stock;
        const displaySerialNumber = colorVariant ? colorVariant.serialNumber : product.serialNumber;
        const displayImage = colorVariant && colorVariant.images && colorVariant.images.length > 0
         ? colorVariant.images[0]
         : (product.images?.[0] || null);

        return (
         <tr key={product._colorVariantId || product._id} className="hover:bg-gray-50">
          <td className="px-4 py-4">
           <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0 flex items-center justify-center p-1">
             {displayImage ? (
              <Image src={displayImage} alt={product.name} width={64} height={64} className="w-16 h-16 object-contain" />
             ) : (
              <div className="w-16 h-16 flex items-center justify-center text-gray-400">
               <MdInventory2 size={28} />
              </div>
             )}
            </div>
            <div>
             <div className="font-bold text-gray-900">{product.name}</div>
             <div className="text-xs text-gray-500 flex items-center gap-2 flex-wrap">
              {product.brand && <span>{product.brand}</span>}
              {displaySerialNumber ? (
               <span className="font-mono text-gray-600">- {displaySerialNumber}</span>
              ) : (
               <span className="text-gray-400 italic">- Seri No: Yok</span>
              )}
             </div>
            </div>
           </div>
          </td>
          <td className="px-4 py-4 text-sm text-gray-700">
           <div className="font-semibold">{product.category}</div>
           <div className="text-xs text-gray-500">{product.subCategory || ""}</div>
          </td>
          <td className="px-4 py-4 text-sm">
           <div className="font-bold text-gray-900">{Number(displayPrice || 0).toFixed(2)}</div>
           {displayDiscountPrice ? (
            <div className="text-xs text-green-600 font-semibold">{Number(displayDiscountPrice || 0).toFixed(2)}</div>
           ) : null}
          </td>
          <td className="px-4 py-4 text-sm font-semibold">
           {displayStock || 0}
          </td>
          <td className="px-4 py-4">
           <div className="flex flex-col gap-2">
            {displayStock > 0 ? (
             <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
              <MdCheckCircle size={14} />
              Stokta
             </span>
            ) : (
             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
              Stok Yok
             </span>
            )}
            {product.isNew && (
             <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              <MdNewReleases size={14} />
              Yeni Ürün
             </span>
            )}
            {product.isFeatured && (
             <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
              <MdStar size={14} />
              Öne Çıkan
             </span>
            )}
           </div>
          </td>
          <td className="px-4 py-4 text-right">
           <div className="flex gap-2 justify-end">
            <button
             onClick={() => onEdit(product)}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
             <MdEdit size={16} />
             Düzenle
            </button>
            <button
             onClick={() => {
              if (colorVariant && colorVariant.serialNumber) {
               onDelete(product._id, colorVariant.serialNumber);
              } else {
               onDelete(product._id);
              }
             }}
             className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 cursor-pointer"
            >
             <MdDelete size={16} />
             Sil
            </button>
           </div>
          </td>
         </tr>
        );
       })}
      </tbody>
     </table>
    </div>
   )}
  </div>
 );
}
