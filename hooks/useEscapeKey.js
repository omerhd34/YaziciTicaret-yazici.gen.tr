"use client";
import { useEffect } from "react";

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