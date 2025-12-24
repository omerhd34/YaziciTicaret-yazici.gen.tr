"use client";
import { HiX } from "react-icons/hi";
import SubCategoryFilter from "./SubCategoryFilter";
import PriceFilter from "./PriceFilter";
import BrandFilter from "./BrandFilter";
import CategoryFilter from "./CategoryFilter";

export default function CategoryFiltersModal({
 show,
 slug,
 filters,
 availableBrands,
 availableCategories,
 onClose,
 onClearFilters,
 onMinPriceChange,
 onMaxPriceChange,
 onBrandToggle,
 onCategoryToggle,
}) {
 if (!show) return null;

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
   <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
    <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
     <h3 className="font-bold text-lg">Filtreler</h3>
     <button onClick={onClose}>
      <HiX size={24} />
     </button>
    </div>

    <div className="p-4 space-y-6">
     <SubCategoryFilter slug={slug} onLinkClick={onClose} />

     {availableCategories && availableCategories.length > 0 && (
      <CategoryFilter
       availableCategories={availableCategories}
       selectedCategories={filters.categories || []}
       onCategoryToggle={onCategoryToggle}
      />
     )}

     <PriceFilter
      minPrice={filters.minPrice}
      maxPrice={filters.maxPrice}
      onMinPriceChange={onMinPriceChange}
      onMaxPriceChange={onMaxPriceChange}
      isMobile={true}
     />

     <BrandFilter
      availableBrands={availableBrands}
      selectedBrands={filters.brands}
      onBrandToggle={onBrandToggle}
      isMobile={true}
     />
    </div>

    <div className="sticky bottom-0 bg-white border-t p-4">
     <button
      onClick={onClearFilters}
      className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold"
     >
      Temizle
     </button>
    </div>
   </div>
  </div>
 );
}
