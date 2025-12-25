"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ComparisonContext = createContext();

const MAX_COMPARISON_ITEMS = 4;

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

  // Maksimum ürün sayısını kontrol et
  if (comparisonItems.length >= MAX_COMPARISON_ITEMS) {
   return {
    success: false,
    message: `En fazla ${MAX_COMPARISON_ITEMS} ürün karşılaştırabilirsiniz.`
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
  return comparisonItems.length < MAX_COMPARISON_ITEMS;
 };

 const value = {
  comparisonItems,
  addToComparison,
  removeFromComparison,
  clearComparison,
  isInComparison,
  getComparisonCount,
  canAddMore,
  maxItems: MAX_COMPARISON_ITEMS,
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

