"use client";

import { useEffect } from "react";

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
