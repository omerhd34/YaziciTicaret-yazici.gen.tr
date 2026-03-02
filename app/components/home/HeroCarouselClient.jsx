"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
 Carousel,
 CarouselContent,
 CarouselItem,
} from "@/components/ui/carousel";

const AUTOPLAY_INTERVAL_MS = 10000;

export default function HeroCarouselClient() {
 const [carouselApi, setCarouselApi] = useState(null);

 useEffect(() => {
  if (!carouselApi) return;
  const id = setInterval(() => {
   carouselApi.scrollNext();
  }, AUTOPLAY_INTERVAL_MS);
  return () => clearInterval(id);
 }, [carouselApi]);

 return (
  <div className="hidden lg:flex flex-1 max-w-2xl xl:max-w-3xl ml-auto w-full lg:items-center lg:justify-end">
   <div className="relative w-full max-w-2xl xl:max-w-3xl">
    <Carousel
     opts={{ loop: true, align: "center", duration: 150, draggable: false }}
     setApi={setCarouselApi}
     interactive={false}
     className="w-full"
    >
     <CarouselContent>
      <CarouselItem>
       <Image
        src="/products/ankastre/ankastre.jpg"
        alt="Ankastre ürünler"
        width={1200}
        height={800}
        sizes="(min-width: 1024px) 50vw, 0vw"
        className="w-full h-auto object-contain border-4 border-white/20 rounded-2xl lg:rounded-3xl xl:rounded-4xl"
        priority
       />
      </CarouselItem>
      <CarouselItem>
       <Image
        src="/products/beyaz-esya.webp"
        alt="Beyaz eşya"
        width={1200}
        height={800}
        sizes="(min-width: 1024px) 50vw, 0vw"
        className="w-full h-auto object-contain border-4 border-white/20 rounded-2xl lg:rounded-3xl xl:rounded-4xl"
        loading="lazy"
       />
      </CarouselItem>
      <CarouselItem>
       <Image
        src="/products/fix.webp"
        alt="Kampanyalı ürünler"
        width={1200}
        height={800}
        sizes="(min-width: 1024px) 50vw, 0vw"
        className="w-full h-auto object-contain border-4 border-white/20 rounded-2xl lg:rounded-3xl xl:rounded-4xl"
        loading="lazy"
       />
      </CarouselItem>
     </CarouselContent>
    </Carousel>
   </div>
  </div>
 );
}

