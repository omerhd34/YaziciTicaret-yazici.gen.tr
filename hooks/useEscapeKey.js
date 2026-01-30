"use client";
import { useEffect } from "react";

/**
 * ESC tuşuna basıldığında callback'i çağırır.
 * @param {Function} callback - ESC'de çağrılacak fonksiyon
 * @param {Object} options
 * @param {boolean} [options.enabled=true] - Dinleyici aktif mi
 * @param {boolean} [options.skipWhen=false] - true ise ESC'de callback çağrılmaz (örn. loading sırasında)
 */

export function useEscapeKey(callback, { enabled = true, skipWhen = false } = {}) {
 useEffect(() => {
  if (!enabled) return;
  const handleEsc = (e) => {
   if (e.key === "Escape" && !skipWhen) callback?.();
  };
  window.addEventListener("keydown", handleEsc);
  return () => window.removeEventListener("keydown", handleEsc);
 }, [enabled, skipWhen, callback]);
}