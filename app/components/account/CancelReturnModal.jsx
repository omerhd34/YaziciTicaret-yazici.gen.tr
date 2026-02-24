"use client";

import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import {
 AlertDialog,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function CancelReturnModal({ show, orderId, onConfirm, onCancel }) {
 const [loading, setLoading] = useState(false);

 const handleConfirm = async () => {
  if (loading) return;
  setLoading(true);
  try {
   await onConfirm(orderId);
  } finally {
   setLoading(false);
  }
 };

 return (
  <AlertDialog open={!!show} onOpenChange={(open) => { if (!open) onCancel(); }}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>İade Talebini İptal Et</AlertDialogTitle>
     <AlertDialogDescription>
      İade talebinizi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
     </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel disabled={loading}>Vazgeç</AlertDialogCancel>
     <Button
      variant="destructive"
      disabled={loading}
      onClick={handleConfirm}
      className="relative cursor-pointer"
     >
      {loading ? (
       <>
        <span className="opacity-0">Evet, İptal Et</span>
        <span className="absolute inset-0 flex items-center justify-center gap-2">
         <FaSpinner className="animate-spin size-4" />
        </span>
       </>
      ) : (
       "Evet, İptal Et"
      )}
     </Button>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
