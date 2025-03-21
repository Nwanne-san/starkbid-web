"use client";
import { StaticImageData } from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import Eth from "@/public/Eth.png";
import { originalCollections } from "@/data/data";

interface TrendGam {
  id: string;
  title: string;
  floorPrice: number;
  totalVolume: number;
  image: StaticImageData;
}

const BiggestGaming: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sales, setSales] = useState<TrendGam[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Initialize sales data
  useEffect(() => {
    setSales([
      ...originalCollections,
      ...originalCollections,
      ...originalCollections,
    ]);
    setCurrentIndex(originalCollections.length);
  }, []);

  // Handle carousel infinite loop
  useEffect(() => {
    if (!carouselRef.current || sales.length === 0) return;

    const originalLength = sales.length / 3;

    if (currentIndex >= originalLength * 2) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(currentIndex - originalLength);
          void carouselRef.current.offsetWidth;
          carouselRef.current.style.transition = "transform 500ms ease-in-out";
        }
      }, 500);
    } else if (currentIndex < originalLength && currentIndex !== 0) {
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(currentIndex + originalLength);
          void carouselRef.current.offsetWidth;
          carouselRef.current.style.transition = "transform 500ms ease-in-out";
        }
      }, 500);
    }
  }, [currentIndex, sales.length]);

  // Auto-play functionality
  const startAutoPlay = () => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }

    autoPlayTimeoutRef.current = setTimeout(() => {
      if (isAutoPlaying && !transitioning && sales.length > 0) {
        setTransitioning(true);
        setCurrentIndex((prev) => prev + 1);

        setTimeout(() => {
          setTransitioning(false);
        }, 500);
      }
      startAutoPlay();
    }, 5000);
  };

  useEffect(() => {
    startAutoPlay();

    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, [isAutoPlaying, transitioning, sales.length]);

  // Handle previous button click
  const handlePrevious = () => {
    if (transitioning) return;

    setIsAutoPlaying(false);
    setTransitioning(true);
    setCurrentIndex((prev) => prev - 1);

    setTimeout(() => {
      setTransitioning(false);
      setIsAutoPlaying(true);
    }, 500);
  };

  // Handle next button click
  const handleNext = () => {
    if (transitioning) return;

    setIsAutoPlaying(false);
    setTransitioning(true);
    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      setTransitioning(false);
      setIsAutoPlaying(true);
    }, 500);
  };

  const getCardWidth = () => {
    if (typeof window === "undefined") return "25%";
    const width = window.innerWidth;
    if (width < 768) {
      return "100%";
    } else if (width >= 768 && width < 1024) {
      return "33.33%";
    } else {
      return "25%";
    }
  };

  const getTransformPercentage = () => {
    if (typeof window === "undefined") return 25;
    const width = window.innerWidth;
    if (width < 768) {
      return 100;
    } else if (width >= 768 && width < 1024) {
      return 33.33;
    } else {
      return 25;
    }
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrevious(),
    trackMouse: true,
  });

  return (
    <div className="w-full xl:pl-20 lg:pl-10  bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-9 xl:pr-20 lg:pr-10">
          <h1 className="text-white text-[22px] font-bold">Biggest NFT Sales</h1>
          {/* Hide buttons on mobile */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={transitioning}
              className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              disabled={transitioning}
              className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700"
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden" {...swipeHandlers}>
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentIndex * getTransformPercentage()
              }%)`,
            }}
          >
            {sales.map((sale, index) => (
              <div
                key={`${sale.id}-${index}`}
                className={`flex-shrink-0 sm:p-2 transition-all duration-500`}
                style={{
                  width: getCardWidth(),
                }}
              >
                <div className="bg-[#1A1A1A] rounded-xl overflow-hidden transition-all duration-500">
                  <div className="aspect-square w-full overflow-hidden">
                    <Image
                      width={500}
                      height={500}
                      src={sale.image}
                      alt={sale.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white text-lg mb-4">{sale.title}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          Floor Price
                        </p>
                        <div className="flex items-center text-white">
                          <span className="w-4 h-7 mr-3">
                            <Image
                              width={500}
                              height={500}
                              src={Eth}
                              alt={sale.title}
                              className="w-full h-full object-cover"
                            />
                          </span>
                          {sale.floorPrice}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm mb-1">
                          Total Volume
                        </p>
                        <div className="flex items-center text-white">
                          <span className="w-4 h-7 mr-3">
                            <Image
                              width={500}
                              height={500}
                              src={Eth}
                              alt={sale.title}
                              className="w-full h-full object-cover"
                            />
                          </span>
                          {sale.totalVolume}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiggestGaming;
