'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel";
import { Card, CardContent } from "@/app/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

const carouselItems = [
  {
    id: 1,
    src: '/images/carousel1.jpg',
    title: 'Community Worship',
    description: 'Join us in celebrating faith together'
  },
  {
    id: 2,
    src: '/images/carousel2.jpg',
    title: 'Youth Ministry',
    description: 'Building the next generation of believers'
  },
  {
    id: 3,
    src: '/images/carousel3.jpg',
    title: 'Fellowship',
    description: 'Growing together in Christ'
  },
  {
    id: 4,
    src: '/images/carousel4.jpg',
    title: 'Prayer & Worship',
    description: 'Seeking God through prayer'
  },
  {
    id: 5,
    src: '/images/carousel5.jpg',
    title: 'Community Service',
    description: 'Serving with love and compassion'
  },
];

export default function ImageCarousel() {
  return (
    <div className="w-full px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {carouselItems.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
              <Card className="border-0 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    </div>
  );
}
