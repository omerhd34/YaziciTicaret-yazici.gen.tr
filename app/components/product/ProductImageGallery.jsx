"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useEscapeKey } from "@/hooks/useEscapeKey";

export default function ProductImageGallery({
 images,
 selectedImage,
 onImageSelect,
 isNew,
 discountPercentage,
 productName,
}) {
 const [lightboxOpen, setLightboxOpen] = useState(false);
 const [lightboxIndex, setLightboxIndex] = useState(selectedImage);

 useEffect(() => {
  setLightboxIndex(selectedImage);
 }, [selectedImage]);

 const closeLightbox = () => setLightboxOpen(false);
 useEscapeKey(closeLightbox, { enabled: lightboxOpen });

 const openLightbox = (index) => {
  setLightboxIndex(index);
  setLightboxOpen(true);
 };

 const nextImage = () => {
  setLightboxIndex((prev) => (prev + 1) % images.length);
 };

 const prevImage = () => {
  setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
 };

 const handleNextImage = (e) => {
  e.stopPropagation();
  const nextIndex = (selectedImage + 1) % images.length;
  onImageSelect(nextIndex);
 };

 const handlePrevImage = (e) => {
  e.stopPropagation();
  const prevIndex = (selectedImage - 1 + images.length) % images.length;
  onImageSelect(prevIndex);
 };

 return (
  <>
   <div className="space-y-3 sm:space-y-4">
    <div
     className="relative aspect-square sm:aspect-5/5 bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-lg cursor-pointer"
     onClick={() => openLightbox(selectedImage)}
    >
     {isNew && (
      <span className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full z-10">
       YENİ
      </span>
     )}
     {discountPercentage > 0 && (
      <span className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-600 text-white text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full z-10">
       İNDİRİM
      </span>
     )}
     {images.length > 1 && (
      <>
       <button
        onClick={handlePrevImage}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-indigo-600 transition z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg cursor-pointer"
        aria-label="Önceki resim"
       >
        <HiChevronLeft size={24} />
       </button>
       <button
        onClick={handleNextImage}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-indigo-600 transition z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg cursor-pointer"
        aria-label="Sonraki resim"
       >
        <HiChevronRight size={24} />
       </button>
      </>
     )}
     <Image
      width={1200}
      height={1200}
      src={images[selectedImage]}
      alt={productName}
      quality={70}
      priority={selectedImage === 0}
      className="w-full h-full object-contain p-3 sm:p-4 md:p-6"
     />
    </div>

    {images.length > 1 && (
     <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
      {images.map((img, idx) => (
       <button
        key={idx}
        onClick={() => onImageSelect(idx)}
        className={`aspect-square rounded-lg overflow-hidden border-2 bg-white transition cursor-pointer ${selectedImage === idx
         ? "border-indigo-600"
         : "border-gray-200 hover:border-gray-300"
         }`}
       >
        <Image
         width={300}
         height={300}
         src={img}
         alt={`${productName} ${idx + 1}`}
         quality={70}
         className="w-full h-full object-cover"
        />
       </button>
      ))}
     </div>
    )}
   </div>

   {/* Lightbox Modal */}
   {lightboxOpen && (
    <div
     className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4"
     onClick={closeLightbox}
    >
     <button
      onClick={closeLightbox}
      className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2 cursor-pointer"
      aria-label="Kapat"
     >
      <HiX size={24} />
     </button>

     {images.length > 1 && (
      <>
       <button
        onClick={(e) => {
         e.stopPropagation();
         prevImage();
        }}
        className="absolute left-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2 cursor-pointer"
        aria-label="Önceki resim"
       >
        <HiChevronLeft size={24} />
       </button>
       <button
        onClick={(e) => {
         e.stopPropagation();
         nextImage();
        }}
        className="absolute right-4 text-white hover:text-gray-300 transition z-10 bg-black/50 rounded-full p-2 cursor-pointer"
        aria-label="Sonraki resim"
       >
        <HiChevronRight size={24} />
       </button>
      </>
     )}

     <div
      className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
     >
      <Image
       width={1600}
       height={1600}
       src={images[lightboxIndex]}
       alt={`${productName} - Resim ${lightboxIndex + 1}`}
       quality={70}
       className="max-w-full max-h-full object-contain"
      />
     </div>

     {images.length > 1 && (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
       {images.map((_, idx) => (
        <button
         key={idx}
         onClick={(e) => {
          e.stopPropagation();
          setLightboxIndex(idx);
         }}
         className={`w-2 h-2 rounded-full transition ${lightboxIndex === idx ? "bg-white" : "bg-white/50 hover:bg-white/75"
          }`}
         aria-label={`Resim ${idx + 1}`}
        />
       ))}
      </div>
     )}
    </div>
   )}
  </>
 );
}