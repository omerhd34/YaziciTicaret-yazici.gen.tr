"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ComparisonContext = createContext();

// Menüde Ankastre: "Ankastre Bulaşık Makinesi", Beyaz Eşya: "Bulaşık Makinesi". Aynı tip = karşılaştırılabilir.
// "Set Üstü Ocak" (Beyaz) ile "Ankastre Ocak" aynı grupta.
const normalizeComparisonSubCategory = (sub) => {
 let s = (sub || "").trim();
 if (!s) return "";
 if (s.startsWith("Ankastre ")) s = s.slice("Ankastre ".length).trim();
 if (s === "Set Üstü Ocak") return "Ocak";
 return s;
};

const getComparisonCategoryKey = (product) => {
 if (!product) return "";
 const sub = normalizeComparisonSubCategory(product.subCategory);
 if (sub) return sub;
 return (product.category || "").trim();
};

// Ekran boyutuna göre maksimum ürün sayısını hesapla
const getMaxComparisonItems = () => {
 if (typeof window === "undefined") return 4;
 const width = window.innerWidth;
 if (width < 768) return 2;
 if (width < 1024) return 3;
 return 4;
};

export function ComparisonProvider({ children }) {
 const [comparisonItems, setComparisonItems] = useState(() => {
  if (typeof window === "undefined") return [];
  try {
   const saved = localStorage.getItem("comparison");
   return saved ? JSON.parse(saved) : [];
  } catch (error) {
   return [];
  }
 });

 const [maxItems, setMaxItems] = useState(() => {
  if (typeof window === "undefined") return 4;
  return getMaxComparisonItems();
 });

 useEffect(() => {
  if (typeof window === "undefined") return;

  const updateMaxItems = () => {
   const newMaxItems = getMaxComparisonItems();
   setMaxItems(newMaxItems);

   setComparisonItems((prev) => {
    if (prev.length > newMaxItems) {
     const trimmed = prev.slice(0, newMaxItems);
     return trimmed;
    }
    return prev;
   });
  };

  // İlk yüklemede kontrol et
  updateMaxItems();

  // Resize olayını dinle
  window.addEventListener("resize", updateMaxItems);
  return () => window.removeEventListener("resize", updateMaxItems);
 }, []);

 useEffect(() => {
  if (typeof window === "undefined") return;
  if (comparisonItems.length > 0) {
   localStorage.setItem("comparison", JSON.stringify(comparisonItems));
  } else {
   localStorage.removeItem("comparison");
  }
  window.dispatchEvent(new Event("comparisonUpdated"));
 }, [comparisonItems]);

 useEffect(() => {
  if (typeof window === "undefined") return;

  const handleStorageChange = (e) => {
   if (e.key === "comparison" || e.key === null) {
    try {
     const saved = localStorage.getItem("comparison");
     if (saved) {
      const parsed = JSON.parse(saved);
      setComparisonItems((prev) => {
       const prevIds = new Set(prev.map(item => String(item._id)));
       const newIds = new Set(parsed.map(item => String(item._id)));
       if (prevIds.size !== newIds.size ||
        [...prevIds].some(id => !newIds.has(id)) ||
        [...newIds].some(id => !prevIds.has(id))) {
        return parsed;
       }
       return prev;
      });
     } else {
      setComparisonItems((prev) => prev.length > 0 ? [] : prev);
     }
    } catch (error) {
     setComparisonItems([]);
    }
   }
  };

  const handleComparisonUpdate = () => {
   try {
    const saved = localStorage.getItem("comparison");
    if (saved) {
     const parsed = JSON.parse(saved);
     setComparisonItems((prev) => {
      const prevIds = new Set(prev.map(item => String(item._id)));
      const newIds = new Set(parsed.map(item => String(item._id)));
      if (prevIds.size !== newIds.size ||
       [...prevIds].some(id => !newIds.has(id)) ||
       [...newIds].some(id => !prevIds.has(id))) {
       return parsed;
      }
      return prev;
     });
    } else {
     setComparisonItems((prev) => prev.length > 0 ? [] : prev);
    }
   } catch (error) {
    setComparisonItems([]);
   }
  };

  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("comparisonUpdated", handleComparisonUpdate);

  return () => {
   window.removeEventListener("storage", handleStorageChange);
   window.removeEventListener("comparisonUpdated", handleComparisonUpdate);
  };
 }, []);

 const addToComparison = (product) => {
  if (!product || !product._id) return { success: false, message: "Ürün bulunamadı" };

  const productIdStr = String(product._id);

  // Ürün zaten karşılaştırmada mı kontrol et
  if (comparisonItems.some((item) => String(item._id) === productIdStr)) {
   return { success: false, message: "Bu ürün zaten karşılaştırmada" };
  }

  // Aynı kategori kuralı: listede ürün varsa sadece aynı category+subCategory eklenebilir
  if (comparisonItems.length > 0) {
   const listKey = getComparisonCategoryKey(comparisonItems[0]);
   const productKey = getComparisonCategoryKey(product);
   if (listKey !== productKey) {
    return {
     success: false,
     message: "Sadece aynı kategorideki ürünler karşılaştırılabilir."
    };
   }
  }

  // Maksimum ürün sayısını kontrol et
  const currentMaxItems = typeof window !== "undefined" ? getMaxComparisonItems() : maxItems;
  if (comparisonItems.length >= currentMaxItems) {
   return {
    success: false,
    message: `En fazla ${currentMaxItems} ürün karşılaştırabilirsiniz.`
   };
  }

  setComparisonItems((prev) => [...prev, product]);
  return { success: true, message: "Ürün karşılaştırmaya eklendi." };
 };

 const removeFromComparison = (productId) => {
  if (!productId) return;
  const productIdStr = String(productId);
  setComparisonItems((prev) =>
   prev.filter((item) => String(item._id) !== productIdStr)
  );
 };

 const clearComparison = () => {
  setComparisonItems([]);
  if (typeof window !== "undefined") {
   localStorage.removeItem("comparison");
  }
 };

 const isInComparison = (productId) => {
  if (!productId) return false;
  const productIdStr = String(productId);
  return comparisonItems.some((item) => String(item._id) === productIdStr);
 };

 const getComparisonCount = () => {
  return comparisonItems.length;
 };

 const canAddMore = () => {
  const currentMaxItems = typeof window !== "undefined" ? getMaxComparisonItems() : maxItems;
  return comparisonItems.length < currentMaxItems;
 };

 // Ürün karşılaştırmaya eklenebilir mi? (aynı kategori + limit)
 const canAddToComparison = (product) => {
  if (!product || !product._id) return false;
  if (comparisonItems.some((item) => String(item._id) === String(product._id))) return true;
  if (comparisonItems.length === 0) {
   const currentMaxItems = typeof window !== "undefined" ? getMaxComparisonItems() : maxItems;
   return currentMaxItems > 0;
  }
  const listKey = getComparisonCategoryKey(comparisonItems[0]);
  const productKey = getComparisonCategoryKey(product);
  if (listKey !== productKey) return false;
  const currentMaxItems = typeof window !== "undefined" ? getMaxComparisonItems() : maxItems;
  return comparisonItems.length < currentMaxItems;
 };

 const value = {
  comparisonItems,
  addToComparison,
  removeFromComparison,
  clearComparison,
  isInComparison,
  getComparisonCount,
  canAddMore,
  canAddToComparison,
  maxItems,
 };

 return (
  <ComparisonContext.Provider value={value}>
   {children}
  </ComparisonContext.Provider>
 );
}

export function useComparison() {
 const context = useContext(ComparisonContext);
 if (!context) {
  throw new Error("useComparison must be used within a ComparisonProvider");
 }
 return context;
}

