"use client";

import { useState } from "react";
import { HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "@/lib/axios";
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

export default function AdminCancelOrderModal({ show, orderId, onConfirm, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleCancel = () => {
    setPassword("");
    setMessage("");
    setVerificationError("");
    setMessageError("");
    onCancel();
  };

  const handleOpenChange = (open) => {
    if (!open && !loading) handleCancel();
  };

  const handleConfirm = async () => {
    if (loading) return;

    if (!password.trim()) {
      setVerificationError("Lütfen şifrenizi giriniz.");
      return;
    }
    if (!message.trim()) {
      setMessageError("Müşteriye ileteceğiniz iptal mesajını yazınız.");
      return;
    }

    setVerificationError("");
    setMessageError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/verify-password", {
        password: password.trim(),
      });

      if (!res.data?.success) {
        setVerificationError(res.data?.message || "Şifre hatalı. Lütfen tekrar deneyin.");
        setLoading(false);
        return;
      }

      await onConfirm(orderId, message.trim());
      setPassword("");
      setMessage("");
    } catch (error) {
      setVerificationError("Bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={!!show} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Siparişi İptal Et</AlertDialogTitle>
          <AlertDialogDescription>
            Siparişi iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
            Admin Şifresi
          </label>
          <div className="relative">
            <HiLockClosed
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setVerificationError("");
              }}
              placeholder="Şifrenizi giriniz"
              disabled={loading}
              className={`w-full pl-11 pr-11 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                verificationError ? "border-red-500" : "border-gray-300"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading && password.trim()) handleConfirm();
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {verificationError && (
            <p className="text-xs text-red-600 mt-1">{verificationError}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="admin-cancel-message"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Müşteriye iletilen mesaj <span className="text-red-500">*</span>
          </label>
          <textarea
            id="admin-cancel-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setMessageError("");
            }}
            placeholder="İptal nedenini veya müşteriye iletmek istediğiniz mesajı yazınız. Bu mesaj sipariş detayında ve e-postada görünecektir."
            disabled={loading}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${
              messageError ? "border-red-500" : "border-gray-300"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          {messageError && <p className="text-xs text-red-600 mt-1">{messageError}</p>}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Vazgeç</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading || !password.trim() || !message.trim()}
            onClick={handleConfirm}
            className="relative"
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
