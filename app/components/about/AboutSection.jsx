"use client";

export default function AboutSection({ icon: Icon, title, children }) {
 return (
  <section>
   <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
    <Icon className="text-indigo-600 w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
   </div>
   <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
    {children}
   </div>
  </section>
 );
}
