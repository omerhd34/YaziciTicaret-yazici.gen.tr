"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import ConfirmDialog from "@/app/components/auth/ConfirmDialog";
import AdminProductsHeader from "@/app/components/admin/AdminProductsHeader";
import AdminProductsStats from "@/app/components/admin/AdminProductsStats";
import ProductListTable from "@/app/components/admin/ProductListTable";
import ProductFormModal from "@/app/components/admin/ProductFormModal";

export default function AdminUrunYonetimiPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);

 const [products, setProducts] = useState([]);
 const [showProductModal, setShowProductModal] = useState(false);
 const [editingProduct, setEditingProduct] = useState(null);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [confirmDialog, setConfirmDialog] = useState({ show: false, message: "", onConfirm: null });
 const [selectedCategory, setSelectedCategory] = useState(null);
 const [selectedSubCategory, setSelectedSubCategory] = useState(null);
 const [selectedStockFilter, setSelectedStockFilter] = useState(null);
 const [selectedFeaturedFilter, setSelectedFeaturedFilter] = useState(null);
 const [selectedNewFilter, setSelectedNewFilter] = useState(null);

 useEffect(() => {
  checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(() => {
  if (isAuthenticated) {
   fetchProducts();
  }
 }, [isAuthenticated]);

 const checkAuth = async () => {
  try {
   const res = await axiosInstance.get("/api/auth/check");
   const data = res.data;
   if (data.authenticated) {
    setIsAuthenticated(true);
   } else {
    router.push("/admin-giris");
   }
  } catch {
   router.push("/admin-giris");
  } finally {
   setAuthLoading(false);
  }
 };

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   router.push("/admin-giris");
  } catch {
  }
 };

 const fetchProducts = async () => {
  try {
   const res = await axiosInstance.get("/api/products?limit=1000");
   const data = res.data;
   if (data.success) {
    setProducts(data.data);
   }
  } catch {
  }
 };

 const editProduct = (product) => {
  setEditingProduct(product);
  setShowProductModal(true);
 };

 const resetForm = () => {
  setEditingProduct(null);
  setShowProductModal(false);
 };

 const handleProductSuccess = () => {
  setToast({ show: true, message: editingProduct ? "Ürün güncellendi" : "Ürün eklendi", type: "success" });
  setShowProductModal(false);
  setEditingProduct(null);
  fetchProducts();
 };

 const handleProductError = (message) => {
  setToast({ show: true, message, type: "error" });
 };

 const handleDeleteProduct = async (productId, colorSerialNumber = null) => {
  const isColorVariant = colorSerialNumber !== null;
  setConfirmDialog({
   show: true,
   message: isColorVariant
    ? "Bu renk varyantını silmek istediğinize emin misiniz?"
    : "Bu ürünü silmek istediğinize emin misiniz?",
   onConfirm: async () => {
    try {
     let url = `/api/products/${productId}`;
     if (isColorVariant) {
      url += `?colorSerialNumber=${encodeURIComponent(colorSerialNumber)}`;
     }
     const res = await axiosInstance.delete(url);
     if (!res.data?.success) {
      setToast({ show: true, message: res.data?.message || (isColorVariant ? "Renk varyantı silinemedi" : "Ürün silinemedi"), type: "error" });
      return;
     }
     setToast({ show: true, message: isColorVariant ? "Renk varyantı silindi" : "Ürün silindi", type: "success" });
     fetchProducts();
    } catch {
     setToast({ show: true, message: isColorVariant ? "Renk varyantı silinemedi" : "Ürün silinemedi", type: "error" });
    } finally {
     setConfirmDialog({ show: false, message: "", onConfirm: null });
    }
   }
  });
 };


 if (authLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
     <p className="text-gray-600 font-semibold">Yetki kontrol ediliyor...</p>
    </div>
   </div>
  );
 }

 if (!isAuthenticated) return null;

 return (
  <div className="min-h-screen bg-gray-50 pb-12">
   <Toast toast={toast} setToast={setToast} />
   <ConfirmDialog
    show={confirmDialog.show}
    message={confirmDialog.message}
    onConfirm={() => {
     if (confirmDialog.onConfirm) confirmDialog.onConfirm();
     setConfirmDialog({ show: false, message: "", onConfirm: null });
    }}
    onCancel={() => setConfirmDialog({ show: false, message: "", onConfirm: null })}
    confirmText="Sil"
    confirmColor="red"
   />
   <AdminProductsHeader onLogout={handleLogout} />
   <AdminProductsStats
    totalProducts={(() => {
     // Her ürün için tüm renk varyantlarını say
     let count = 0;
     products.forEach((product) => {
      if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
       // Her renk varyantı için ayrı bir ürün say
       product.colors.forEach((color) => {
        if (typeof color === 'object' && color.serialNumber) {
         count++;
        }
       });
      } else {
       // Renk yoksa normal ürünü say
       count++;
      }
     });
     return count;
    })()}
    outOfStockProducts={(() => {
     // Stokta olmayan ürünleri say (renk varyantları dahil)
     let count = 0;
     products.forEach((product) => {
      if (product.colors && Array.isArray(product.colors) && product.colors.length > 0) {
       product.colors.forEach((color) => {
        if (typeof color === 'object' && color.serialNumber) {
         const stock = color.stock !== undefined ? color.stock : product.stock;
         if (stock <= 0) count++;
        }
       });
      } else {
       if (!product.stock || product.stock <= 0) count++;
      }
     });
     return count;
    })()}
    featuredProducts={(() => {
     return products.filter((product) => product.isFeatured === true).length;
    })()}
    newProducts={(() => {
     return products.filter((product) => product.isNew === true).length;
    })()}
   />

   <div className="container mx-auto px-4">
    <ProductListTable
     products={products}
     onEdit={editProduct}
     onDelete={handleDeleteProduct}
     onAddNew={() => {
      resetForm();
      setShowProductModal(true);
     }}
     selectedCategory={selectedCategory}
     selectedSubCategory={selectedSubCategory}
     selectedStockFilter={selectedStockFilter}
     selectedFeaturedFilter={selectedFeaturedFilter}
     selectedNewFilter={selectedNewFilter}
     onCategoryChange={setSelectedCategory}
     onSubCategoryChange={setSelectedSubCategory}
     onStockFilterChange={setSelectedStockFilter}
     onFeaturedFilterChange={setSelectedFeaturedFilter}
     onNewFilterChange={setSelectedNewFilter}
    />
   </div>

   <ProductFormModal
    show={showProductModal}
    editingProduct={editingProduct}
    onClose={resetForm}
    onSuccess={handleProductSuccess}
    onError={handleProductError}
   />
  </div>
 );
}

