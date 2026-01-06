"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiPlus } from "react-icons/hi";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import ConfirmDialog from "@/app/components/auth/ConfirmDialog";
import AdminProductsHeader from "@/app/components/admin/AdminProductsHeader";
import CampaignModal from "@/app/components/admin/CampaignModal";

export default function AdminKampanyalarPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);

 const [campaigns, setCampaigns] = useState([]);
 const [loading, setLoading] = useState(false);
 const [showCampaignModal, setShowCampaignModal] = useState(false);
 const [editingCampaign, setEditingCampaign] = useState(null);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [confirmDialog, setConfirmDialog] = useState({ show: false, message: "", onConfirm: null });

 useEffect(() => {
  checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, []);

 useEffect(() => {
  if (isAuthenticated) {
   fetchCampaigns();
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

 const fetchCampaigns = async () => {
  setLoading(true);
  try {
   const res = await axiosInstance.get("/api/admin/campaigns");
   const data = res.data;
   if (data.success) {
    setCampaigns(data.data || []);
   }
  } catch (error) {
   setToast({ show: true, message: "Kampanyalar yüklenemedi", type: "error" });
  } finally {
   setLoading(false);
  }
 };

 const editCampaign = (campaign) => {
  setEditingCampaign(campaign);
  setShowCampaignModal(true);
 };

 const resetForm = () => {
  setEditingCampaign(null);
  setShowCampaignModal(false);
 };

 const handleCampaignSuccess = () => {
  setToast({
   show: true,
   message: editingCampaign ? "Kampanya güncellendi" : "Kampanya eklendi",
   type: "success",
  });
  setShowCampaignModal(false);
  setEditingCampaign(null);
  fetchCampaigns();
 };

 const handleDeleteCampaign = async (campaignId) => {
  setConfirmDialog({
   show: true,
   message: "Bu kampanyayı silmek istediğinize emin misiniz?",
   onConfirm: async () => {
    try {
     const res = await axiosInstance.delete(`/api/admin/campaigns/${campaignId}`);
     if (!res.data?.success) {
      setToast({ show: true, message: res.data?.error || "Kampanya silinemedi", type: "error" });
      return;
     }
     setToast({ show: true, message: "Kampanya silindi", type: "success" });
     fetchCampaigns();
    } catch {
     setToast({ show: true, message: "Kampanya silinemedi", type: "error" });
    } finally {
     setConfirmDialog({ show: false, message: "", onConfirm: null });
    }
   },
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

   <div className="container mx-auto px-4 py-8">
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
     <div className="flex items-center justify-between mb-6">
      <div>
       <h1 className="text-2xl font-black text-gray-900">Kampanya Yönetimi</h1>
       <p className="text-gray-600 mt-1">Kampanyaları ekleyin, düzenleyin ve yönetin.</p>
      </div>
      <button
       onClick={() => {
        setEditingCampaign(null);
        setShowCampaignModal(true);
       }}
       className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
      >
       <HiPlus size={20} />
       Yeni Kampanya
      </button>
     </div>

     {loading ? (
      <div className="text-center py-12">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
       <p className="text-gray-600">Kampanyalar yükleniyor...</p>
      </div>
     ) : campaigns.length === 0 ? (
      <div className="text-center py-12">
       <p className="text-gray-600 mb-4">Henüz kampanya eklenmemiş</p>
       <button
        onClick={() => {
         setEditingCampaign(null);
         setShowCampaignModal(true);
        }}
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
       >
        İlk Kampanyayı Ekle
       </button>
      </div>
     ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       {campaigns.map((campaign) => (
        <div
         key={campaign._id}
         className="border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow flex flex-col"
        >
         <div className="relative aspect-video bg-gray-100">
          <Image
           src={campaign.image}
           alt={campaign.title}
           fill
           className="object-cover"
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
           <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${campaign.isActive
             ? "bg-green-100 text-green-800"
             : "bg-gray-100 text-gray-800"
             }`}
           >
            {campaign.isActive ? "Aktif" : "Pasif"}
           </span>
          </div>
         </div>
         <div className="p-4 flex flex-col grow">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h3>
          {campaign.description && (
           <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
          )}
          <div className="mt-auto">
           <div className="flex items-center gap-2 flex-wrap">
            <button
             onClick={() => editCampaign(campaign)}
             className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
             Düzenle
            </button>
            <button
             onClick={() => handleDeleteCampaign(campaign._id)}
             className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
             Sil
            </button>
           </div>
          </div>
         </div>
        </div>
       ))}
      </div>
     )}
    </div>
   </div>

   {showCampaignModal && (
    <CampaignModal
     campaign={editingCampaign}
     onClose={resetForm}
     onSuccess={handleCampaignSuccess}
     onError={(message) => setToast({ show: true, message, type: "error" })}
    />
   )}
  </div>
 );
}

