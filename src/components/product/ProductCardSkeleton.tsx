"use client";

import { motion } from "framer-motion";

export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-paper)] shadow-[var(--shadow-warm-sm)]">
      {/* Image skeleton */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)] bg-size-200">
        <motion.div
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["−100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="flex flex-col flex-1 gap-3 p-5">
        {/* Category skeleton */}
        <div className="h-3 w-20 rounded bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ["−100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="h-4 w-3/4 rounded bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-1.5 pt-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 w-12 rounded-full bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]"
            >
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ["−100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ))}
        </div>

        {/* Footer skeleton */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div className="h-8 w-16 rounded bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="h-8 w-20 rounded-full bg-gradient-to-r from-[var(--color-paper)] via-[var(--color-cream)] to-[var(--color-paper)]">
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: ["−100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
