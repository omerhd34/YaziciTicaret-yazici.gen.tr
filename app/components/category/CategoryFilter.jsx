"use client";

export default function CategoryFilter({
 availableCategories,
 selectedCategories,
 onCategoryToggle,
}) {
 if (!availableCategories || availableCategories.length === 0) {
  return null;
 }

 return (
  <div className="mb-6">
   <h4 className="font-semibold text-gray-900 mb-3">Kategori</h4>
   <div className="space-y-2 max-h-64 overflow-y-auto">
    {availableCategories.map((category) => (
     <label
      key={category}
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
     >
      <input
       type="checkbox"
       checked={selectedCategories.includes(category)}
       onChange={() => onCategoryToggle(category)}
       className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
      />
      <span className="text-sm text-gray-700">{category}</span>
     </label>
    ))}
   </div>
  </div>
 );
}

