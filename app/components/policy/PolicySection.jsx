"use client";

export default function PolicySection({ icon, title, children }) {
 return (
  <section>
   {title && (
    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
     {icon}
     <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
    </div>
   )}
   <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
    {children}
   </div>
  </section>
 );
}
