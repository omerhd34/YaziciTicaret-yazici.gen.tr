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

export default function ConfirmDialog({
 show,
 message,
 title = "Onay",
 onConfirm,
 onCancel,
 confirmText = "Onayla",
 cancelText = "İptal",
 confirmColor = "red",
}) {
 return (
  <AlertDialog open={!!show} onOpenChange={(open) => { if (!open) onCancel(); }}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>{title}</AlertDialogTitle>
     <AlertDialogDescription>{message}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel>{cancelText}</AlertDialogCancel>
     <Button
      variant={confirmColor === "red" ? "destructive" : "default"}
      onClick={onConfirm}
      className="cursor-pointer"
     >
      {confirmText}
     </Button>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
