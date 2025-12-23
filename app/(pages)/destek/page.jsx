import SupportHeader from "@/app/components/support/SupportHeader";
import ContactInfoSection from "@/app/components/support/ContactInfoSection";
import QuickHelpSection from "@/app/components/support/QuickHelpSection";
import ContactForm from "@/app/components/support/ContactForm";
import FAQSection from "@/app/components/support/FAQSection";
import StoreCard from "@/app/components/support/StoreCard";

const magaza1 = {
 title: "Mağaza 1 - Profilo",
 adres: "Kemalpaşa mahallesi, Atatürk bulvarı, no:54/E, İnegöl/Bursa",
 telefon: "0544 796 77 70",
 whatsappLink: "https://wa.me/905447967770",
 email: "info@yazici.gen.tr",
 mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d763.2495888466105!2d29.50960293840372!3d40.075448782807726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cbcbe261a787e9%3A0xeaaf69fe9fc53432!2zS2VtYWxwYcWfYSwgQXRhdMO8cmsgQmx2LiBObzo1NCBEOkUsIDE2NDAwIMSwbmVnw7ZsL0J1cnNh!5e0!3m2!1str!2str!4v1760307949632!5m2!1str!2str",
 images: [
  { url: "/prof2_ibo.jpg", alt: "Mağaza 1 - Görsel 1" },
  { url: "/prof1_ibo.png", alt: "Mağaza 1 - Görsel 2" }
 ]
};

const magaza2 = {
 title: "Mağaza 2 - Profilo",
 adres: "Cuma mahallesi, Atatürk bulvarı, no:51, İnegöl/Bursa",
 telefon: "0501 349 69 91",
 whatsappLink: "https://wa.me/905013496991",
 email: "info@yazici.gen.tr",
 mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1526.4792750305462!2d29.50977807551087!3d40.07633667155123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cbcbe26d13d6b1%3A0xf747693e7d275e1!2zQ3VtYSwgQXRhdMO8cmsgQmx2LiBOTzo1MSwgMTY0MDAgxLBuZWfDtmwvQnVyc2E!5e0!3m2!1str!2str!4v1760308051136!5m2!1str!2str",
 images: [
  { url: "/prof2_bedo.jpg", alt: "Mağaza 2 - Görsel 1" },
  { url: "/prof1_bedo.jpg", alt: "Mağaza 2 - Görsel 2" }
 ]
};

export default function DestekPage() {
 return (
  <div className="min-h-screen bg-gray-50 py-12">
   <div className="container mx-auto px-4">
    <SupportHeader />

    {/* Mağaza Kartları */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
     <StoreCard {...magaza1} />
     <StoreCard {...magaza2} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     <div className="lg:col-span-1 space-y-6">
      <ContactInfoSection />
      <QuickHelpSection />
     </div>

     <div className="lg:col-span-2">
      <div className="bg-white rounded-xl shadow-md p-8">
       <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
       <ContactForm />
      </div>

      <div className="mt-8">
       <FAQSection />
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
