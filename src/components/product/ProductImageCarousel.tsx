"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductImageCarouselProps = {
  images: string[];
  alt: string;
  accent: string;
  fallback: React.ReactNode;
};

export function ProductImageCarousel({
  images,
  alt,
  accent,
  fallback,
}: ProductImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = images.length;
  const hasMultiple = total > 1;

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setCurrent(next);
  };

  const prev = () => go((current - 1 + total) % total, -1);
  const next = () => go((current + 1) % total, 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-warm-md)] p-8 flex items-end",
          accent,
        )}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-warm-md)] bg-[var(--color-paper)]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current]}
              alt={`${alt}${total > 1 ? ` — ${current + 1} de ${total}` : ""}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-9 h-9 rounded-full bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-black/50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ver imagen ${i + 1}`}
              onClick={() => go(i, i > current ? 1 : -1)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "bg-[var(--color-coffee)] w-6"
                  : "bg-[var(--color-coffee)]/25 w-1.5 hover:bg-[var(--color-coffee)]/50",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
