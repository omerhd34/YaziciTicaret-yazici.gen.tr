"use client";

import { useEffect } from "react";

/**
 * Modal/drawer açıkken body scroll'unu kilitle.
 * @param {boolean} locked - true ise scroll kilitlenir
 * @param {Object} options
 * @param {string} [options.className] - body'ye eklenecek opsiyonel class (örn. "filters-modal-open")
 */
export function useBodyScrollLock(locked, { className } = {}) {
 useEffect(() => {
  if (!locked) {
   if (className) document.body.classList.remove(className);
   document.body.style.overflow = "";
   return;
  }
  if (className) document.body.classList.add(className);
  document.body.style.overflow = "hidden";
  return () => {
   if (className) document.body.classList.remove(className);
   document.body.style.overflow = "";
  };
 }, [locked, className]);
}
