"use client";
import Link from "next/link";

export default function ContactInfoCard({ icon: Icon, title, children, link, linkText }) {
 return (
  <div className="flex items-center gap-4">
   <div className="bg-indigo-100 p-3 rounded-lg">
    <Icon className="text-indigo-600" size={24} />
   </div>
   <div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    {link && linkText ? (
     <>
      <Link
       href={link}
       className="text-indigo-600 hover:text-indigo-700 font-medium"
      >
       {linkText}
      </Link>
      {children}
     </>
    ) : (
     children
    )}
   </div>
  </div>
 );
}
