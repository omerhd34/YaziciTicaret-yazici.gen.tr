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

export default function DeleteConfirmModal({ show, type, onConfirm, onCancel }) {
 const isAddress = type === "address";
 const title = isAddress ? "Adresi Sil" : "Kartı Sil";
 const description = isAddress
  ? "Bu adresi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
  : "Bu kartı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.";

 return (
  <AlertDialog open={!!show} onOpenChange={(open) => { if (!open) onCancel(); }}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>{title}</AlertDialogTitle>
     <AlertDialogDescription>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel>İptal</AlertDialogCancel>
     <Button variant="destructive" onClick={onConfirm} className="cursor-pointer">
      Evet, Sil
     </Button>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
