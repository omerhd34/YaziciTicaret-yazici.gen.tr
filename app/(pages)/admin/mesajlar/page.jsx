"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import Toast from "@/app/components/ui/Toast";
import AdminOrdersHeader from "@/app/components/admin/AdminOrdersHeader";
import ConfirmDialog from "@/app/components/auth/ConfirmDialog";
import {
 HiMail,
 HiX,
 HiCheck,
 HiTrash,
 HiReply,
 HiPaperAirplane,
 HiDotsVertical,
 HiClock,
 HiCalendar
} from "react-icons/hi";
import { MdDelete, MdReplyAll } from "react-icons/md";

export default function AdminMesajlarPage() {
 const router = useRouter();
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [authLoading, setAuthLoading] = useState(true);
 const [contacts, setContacts] = useState([]);
 const [loading, setLoading] = useState(true);
 const [toast, setToast] = useState({ show: false, message: "", type: "success" });
 const [filter, setFilter] = useState("all"); // all, read, unread
 const [selectedContact, setSelectedContact] = useState(null);
 const [unreadCount, setUnreadCount] = useState(0);
 const [totalCount, setTotalCount] = useState(0);
 const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

 const fetchContacts = useCallback(async (readFilter = filter) => {
  try {
   setLoading(true);
   const readParam = readFilter === "all" ? null : readFilter === "read" ? "true" : "false";
   const url = readParam ? `/api/admin/contacts?read=${readParam}` : "/api/admin/contacts";

   const response = await axiosInstance.get(url);

   if (response.data.success) {
    setContacts(response.data.contacts || []);
    setUnreadCount(response.data.unreadCount || 0);
    if (readFilter === "all") {
     setTotalCount(response.data.pagination?.total || 0);
    }
   }
  } catch (error) {
   setToast({ show: true, message: "Mesajlar yüklenemedi", type: "error" });
  } finally {
   setLoading(false);
  }
 }, [filter]);

 useEffect(() => {
  (async () => {
   try {
    const checkRes = await axiosInstance.get("/api/auth/check");
    const checkData = checkRes.data;

    if (!checkData?.authenticated) {
     router.push("/admin-giris");
     return;
    }

    setIsAuthenticated(true);
    fetchContacts();
   } catch {
    router.push("/admin-giris");
   } finally {
    setAuthLoading(false);
   }
  })();
 }, [router, fetchContacts]);

 const handleFilterChange = (newFilter) => {
  setFilter(newFilter);
  fetchContacts(newFilter);
 };

 const handleMarkAsRead = async (id, readStatus) => {
  try {
   const response = await axiosInstance.patch("/api/admin/contacts", {
    id,
    read: readStatus,
   });

   if (response.data.success) {
    setContacts(contacts.map(contact =>
     contact._id === id ? { ...contact, read: readStatus } : contact
    ));
    if (!readStatus) {
     setUnreadCount(unreadCount + 1);
    } else {
     setUnreadCount(Math.max(0, unreadCount - 1));
    }
   }
  } catch (error) {
   setToast({ show: true, message: "İşlem başarısız", type: "error" });
  }
 };

 const handleDelete = async (id) => {
  setDeleteConfirm({ show: true, id });
 };

 const confirmDelete = async () => {
  const id = deleteConfirm.id;
  setDeleteConfirm({ show: false, id: null });

  try {
   const response = await axiosInstance.delete(`/api/admin/contacts?id=${id}`);

   if (response.data.success) {
    setContacts(contacts.filter(contact => contact._id !== id));
    setToast({ show: true, message: "Mesaj silindi", type: "success" });
    if (selectedContact?._id === id) {
     setSelectedContact(null);
    }
   }
  } catch (error) {
   setToast({ show: true, message: "Mesaj silinemedi", type: "error" });
  }
 };

 const handleLogout = async () => {
  try {
   await axiosInstance.post("/api/auth/logout");
   router.push("/admin-giris");
  } catch {
   setToast({ show: true, message: "Çıkış yapılamadı", type: "error" });
  }
 };

 if (authLoading) {
  return (
   <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
     <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
     <p className="mt-4 text-gray-600">Yükleniyor...</p>
    </div>
   </div>
  );
 }

 const filteredContacts = contacts;

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const dayName = days[date.getDay()];
  const formatted = date.toLocaleDateString("tr-TR", {
   day: "2-digit",
   month: "2-digit",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
  });
  return formatted.replace(',', ` ${dayName}`);
 };

 return (
  <div className="min-h-screen bg-gray-50 pb-12">
   <Toast toast={toast} setToast={setToast} />
   <ConfirmDialog
    show={deleteConfirm.show}
    message="Bu mesajı silmek istediğinize emin misiniz?"
    onConfirm={confirmDelete}
    onCancel={() => setDeleteConfirm({ show: false, id: null })}
    confirmText="Sil"
    cancelText="İptal"
    confirmColor="red"
   />
   <AdminOrdersHeader title="Mesajlar" onLogout={handleLogout} />

   <div className="container mx-auto px-4 py-6">
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
     <div className="p-6">
      {/* Üst Bar - Filtreler */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
       <div className="flex flex-wrap gap-3">
        <button
         onClick={() => handleFilterChange("all")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "all"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Tümü ({totalCount || contacts.length})
        </button>
        <button
         onClick={() => handleFilterChange("unread")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "unread"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Okunmamış ({unreadCount})
        </button>
        <button
         onClick={() => handleFilterChange("read")}
         className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 cursor-pointer ${filter === "read"
          ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
         Okunmuş ({totalCount - unreadCount})
        </button>
       </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {/* Mesaj Listesi */}
       <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
         <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Yükleniyor...</p>
         </div>
        ) : filteredContacts.length === 0 ? (
         <div className="text-center py-12 text-gray-500">
          <HiMail size={56} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium">Mesaj bulunamadı</p>
         </div>
        ) : (
         filteredContacts.map((contact) => (
          <div
           key={contact._id}
           onClick={() => {
            setSelectedContact(contact);
            if (!contact.read) {
             handleMarkAsRead(contact._id, true);
            }
           }}
           className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${selectedContact?._id === contact._id
            ? "border-indigo-500 bg-linear-to-br from-indigo-50 to-purple-50 shadow-lg"
            : contact.read
             ? "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
             : "border-amber-300 bg-linear-to-br from-amber-50/80 to-yellow-50/80 hover:border-amber-400 hover:shadow-md"
            }`}
          >
           <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
             <div className="flex items-center gap-2 mb-1">
              <p className="font-bold truncate text-gray-900 text-base">
               {contact.name}
              </p>
              {!contact.read && (
               <span className="w-3 h-3 bg-linear-to-r from-amber-500 to-orange-500 rounded-full shrink-0 animate-pulse shadow-md"></span>
              )}
             </div>
             <p className="text-sm truncate text-gray-600 font-medium">
              {contact.subject}
             </p>
            </div>
            <button
             onClick={(e) => {
              e.stopPropagation();
              handleDelete(contact._id);
             }}
             className="ml-2 p-2 rounded-lg transition-all duration-200 shrink-0 text-red-500 hover:bg-red-50 hover:text-red-700 hover:scale-110"
             title="Sil"
            >
             <HiTrash size={18} />
            </button>
           </div>
           <p className="text-xs line-clamp-2 mb-3 text-gray-500 leading-relaxed">
            {contact.message}
           </p>
           <div className="flex items-center gap-1.5">
            <HiClock size={14} className="text-gray-400" />
            <p className="text-xs text-gray-400" suppressHydrationWarning>
             {new Date(contact.createdAt).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
             })}
            </p>
           </div>
          </div>
         ))
        )}
       </div>

       {/* Mesaj Detayı - E-posta Görünümü */}
       <div className="lg:col-span-2">
        {selectedContact ? (
         <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden transition-all duration-300">
          {/* E-posta Header */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-5">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shrink-0 shadow-lg">
             <span className="text-white font-bold text-xl">
              {selectedContact.name.charAt(0).toUpperCase()}
             </span>
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
             <div className="flex items-center gap-3 flex-wrap">
              <p className="font-bold text-gray-900 text-lg">
               {selectedContact.name}
              </p>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${selectedContact.read
               ? 'bg-gray-200 text-gray-700'
               : 'bg-linear-to-r from-indigo-100 to-purple-100 text-indigo-700 border border-indigo-200'
               }`}>
               {selectedContact.read ? 'Okundu' : 'Yeni'}
              </span>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 shrink-0">
              <HiCalendar size={16} className="text-indigo-500" />
              <span suppressHydrationWarning className="font-medium">{formatDate(selectedContact.createdAt)}</span>
             </div>
            </div>
           </div>
          </div>

          {/* E-posta İçeriği */}
          <div className="px-6 py-6">
           <div className="mb-6">
            <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 mb-4">
             <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
              <HiMail className="text-indigo-600" size={24} />
              İletişim Formu Mesajı
             </h2>

             <div className="space-y-4">
              {/* İletişim Bilgileri */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
               <div className="space-y-4">
                <div className="flex items-start gap-4 pb-3 border-b border-gray-100">
                 <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">
                  Konu:
                 </span>
                 <span className="text-gray-900 flex-1 wrap-break-word font-medium">
                  {selectedContact.subject}
                 </span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-gray-100">
                 <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">
                  Gönderen:
                 </span>
                 <span className="text-gray-900 flex-1 wrap-break-word font-medium">
                  {selectedContact.name}
                 </span>
                </div>
                <div className="flex items-start gap-4 pb-3 border-b border-gray-100">
                 <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">
                  E-posta:
                 </span>
                 <a
                  href={`mailto:${selectedContact.email}`}
                  className="hover:underline text-indigo-600 flex-1 wrap-break-word font-medium hover:text-indigo-700 transition-colors"
                 >
                  {selectedContact.email}
                 </a>
                </div>
                {selectedContact.phone && (
                 <div className="flex items-start gap-4">
                  <span className="font-bold text-gray-700 w-28 shrink-0 text-sm">
                   Telefon:
                  </span>
                  <a
                   href={`tel:${selectedContact.phone}`}
                   className="hover:underline text-indigo-600 flex-1 wrap-break-word font-medium hover:text-indigo-700 transition-colors"
                  >
                   {selectedContact.phone}
                  </a>
                 </div>
                )}
               </div>
              </div>

              {/* Mesaj İçeriği */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-5 shadow-sm">
               <h3 className="font-bold mb-4 text-gray-700 text-lg flex items-center gap-2">

                Mesaj:
               </h3>
               <p className="whitespace-pre-wrap leading-relaxed text-gray-900 wrap-break-word text-base">
                {selectedContact.message}
               </p>
              </div>
             </div>
            </div>
           </div>

           {/* Alt Butonlar */}
           <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <div className="flex flex-wrap gap-3">
             <button
              onClick={() => handleMarkAsRead(selectedContact._id, !selectedContact.read)}
              className={`px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${selectedContact.read
               ? "bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-md"
               : "bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30"
               }`}
             >
              {selectedContact.read ? (
               <>
                <HiX size={18} />
                Okunmadı İşaretle
               </>
              ) : (
               <>
                <HiCheck size={18} />
                Okundu İşaretle
               </>
              )}
             </button>
             <button
              onClick={() => handleDelete(selectedContact._id)}
              className="px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 shadow-md transform hover:scale-105"
             >
              <MdDelete size={18} />
              Sil
             </button>
            </div>
            <div className="flex items-center gap-2">
             <button
              onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`, '_blank')}
              className="px-5 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md transform hover:scale-105"
             >
              <HiReply size={18} />
              Yanıtla
             </button>
            </div>
           </div>
          </div>
         </div>
        ) : (
         <div className="bg-linear-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-16 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
           <HiMail size={48} className="text-indigo-400" />
          </div>
          <p className="text-xl font-bold text-gray-700 mb-2">
           Bir mesaj seçin
          </p>
          <p className="text-sm text-gray-500">
           Detayları görmek için soldaki listeden bir mesaj seçin
          </p>
         </div>
        )}
       </div>
      </div>
     </div>
    </div>
   </div>

   <style jsx>{`
    .custom-scrollbar::-webkit-scrollbar {
     width: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
     background: #f3f4f6;
     border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
     background: linear-gradient(to bottom, #6366f1, #8b5cf6);
     border-radius: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
     background: linear-gradient(to bottom, #4f46e5, #7c3aed);
    }
   `}</style>
  </div>
 );
}

