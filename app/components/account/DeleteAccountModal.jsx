"use client";

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
import { FaSpinner } from "react-icons/fa";

export default function DeleteAccountModal({ show, deletingAccount, onConfirm, onCancel }) {
 return (
  <AlertDialog open={!!show} onOpenChange={(open) => { if (!open) onCancel(); }}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle className="text-red-600">Hesabı Sil</AlertDialogTitle>
     <AlertDialogDescription>
      Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm
      verileriniz kalıcı olarak silinecektir.
     </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel disabled={deletingAccount}>İptal</AlertDialogCancel>
     <Button
      variant="destructive"
      disabled={deletingAccount}
      onClick={onConfirm}
      className="relative cursor-pointer"
     >
      {deletingAccount ? (
       <div>
        <span className="opacity-0 ">Evet, Hesabımı Sil</span>
        <span className="absolute inset-0 flex items-center justify-center gap-2">
         <FaSpinner className="animate-spin size-4" />
         Siliniyor...
        </span>
       </div>
      ) : (
       "Evet, Hesabımı Sil"
      )}
     </Button>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
