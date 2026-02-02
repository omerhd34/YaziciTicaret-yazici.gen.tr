"use client";
import Link from "next/link";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import ComparisonWidget from "../components/ui/ComparisonWidget";
import { usePathname } from "next/navigation";
import { OrganizationSchema, WebSiteSchema } from "../components/seo/StructuredData";

export default function PagesLayout({ children }) {
 const pathname = usePathname();
 const isAdminPage = pathname?.startsWith("/admin");
 const baseUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BASE_URL || 'https://yazici.gen.tr');

 return (
  <>
   {!isAdminPage && (
    <>
     <OrganizationSchema baseUrl={baseUrl} />
     <WebSiteSchema baseUrl={baseUrl} />
    </>
   )}
   {!isAdminPage && <Header />}
   <main className="flex-1" id="main-content">
    {children}
   </main>
   {!isAdminPage && <Footer />}
   {!isAdminPage && <ScrollToTop />}
   {!isAdminPage && <ComparisonWidget />}
  </>
 );
}
