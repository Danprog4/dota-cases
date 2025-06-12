import Lottie from "lottie-react";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y } from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";
import animation2 from "../assets/onBoarding/_010_SYNC_N_OUT.json";
import animation3 from "../assets/onBoarding/_DUCK14_MONEY_OUT.json";
import animation1 from "../assets/onBoarding/_DUCK16_HEY_OUT.json";

// Import Swiper styles
import { useNavigate } from "@tanstack/react-router";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export const Carousel = ({ onFinish }: { onFinish: () => void }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperType | null>(null);
  const totalSlides = 3;
  const slideInterval = 3000; // 3 seconds

  //for smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (swiperRef.current) {
      if (activeIndex < totalSlides - 1) {
        swiperRef.current.slideNext();
      } else {
        onFinish();
      }
    }
  };

  useEffect(() => {
    if (showSpinner) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / (slideInterval / 50);
      });
    }, 50);

    const slideTimer = setInterval(() => {
      if (swiperRef.current) {
        if (activeIndex < totalSlides - 1) {
          swiperRef.current.slideNext();
        } else {
          onFinish();
        }
      }
      setProgress(0);
    }, slideInterval);

    return () => {
      clearInterval(progressInterval);
      clearInterval(slideTimer);
    };
  }, [activeIndex, totalSlides, showSpinner]);

  if (showSpinner) {
    return;
  }

  return (
    <div className="relative h-screen w-full">
      <Swiper
        // install Swiper modules
        modules={[A11y]}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          setProgress(0);
        }}
        className="h-full w-full"
      >
        <SwiperSlide className="flex h-full w-full items-center justify-center">
          <div className="flex w-full flex-col items-center text-center text-white">
            <div className="mt-20 flex h-[300px] w-[300px] items-center justify-center">
              <Lottie animationData={animation1} loop={true} />
            </div>
            <h1 className="mt-5 text-[52px] font-bold">DOTA 2 CASES</h1>
            <p className="pr-4 pl-4 text-start text-xl">
              Крупнейший магазин кейсов по Dota 2 в России
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex h-full w-full items-center justify-center">
          <div className="flex w-full flex-col items-center text-center text-white">
            <div className="mt-20 flex h-[300px] w-[300px] items-center justify-center">
              <Lottie animationData={animation2} loop={true} />
            </div>
            <h1 className="mt-5 pr-4 pl-4 text-start text-4xl font-bold">
              Весь движ в сообществе — подписывайся
            </h1>
          </div>
        </SwiperSlide>
        <SwiperSlide className="flex h-full w-full items-center justify-center">
          <div className="flex w-full flex-col items-center text-center text-white">
            <div className="mt-20 flex h-[300px] w-[300px] items-center justify-center">
              <Lottie animationData={animation3} loop={true} />
            </div>
            <h1 className="mt-5 pr-4 pl-4 text-start text-4xl font-bold">
              Приглашай друзей — получай стикеры, наклейки, кейсы
            </h1>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Progress bar */}
      <div className="absolute top-12 right-4 left-4 z-10">
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div key={index} className="h-1 flex-1 rounded-full bg-white/30">
              <div
                className={`h-full rounded-full bg-white transition-all duration-75 ease-linear ${
                  index < activeIndex
                    ? "w-full"
                    : index === activeIndex
                      ? `w-[${progress}%]`
                      : "w-0"
                }`}
                style={{
                  width:
                    index < activeIndex
                      ? "100%"
                      : index === activeIndex
                        ? `${progress}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Next button */}

      <div className="absolute right-4 bottom-8 left-4 z-10">
        <button
          onClick={handleNext}
          className="w-full cursor-pointer rounded-2xl bg-red-500 py-4 text-lg font-semibold text-white"
        >
          Далее
        </button>
      </div>
    </div>
  );
};
