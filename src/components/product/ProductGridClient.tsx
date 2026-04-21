"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types/product";
import { CATEGORIES } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

type ProductGridClientProps = {
  products: Product[];
};

type Filter = "todos" | (typeof CATEGORIES)[number];

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "cafe x 250gr", label: "Café 250g" },
  { value: "cafe x 500gr", label: "Café 500g" },
  { value: "cafe x 1kg", label: "Café 1kg" },
  { value: "cafeteras", label: "Cafeteras" },
  { value: "accesorios", label: "Accesorios" },
];

export function ProductGridClient({ products }: ProductGridClientProps) {
  const [filter, setFilter] = useState<Filter>("todos");

  const filtered = useMemo(() => {
    if (filter === "todos") return products;
    return products.filter(
      (p) => p.categoria.trim().toLowerCase() === filter.toLowerCase(),
    );
  }, [products, filter]);

  const availableFilters = useMemo(() => {
    const present = new Set(
      products.map((p) => p.categoria.trim().toLowerCase()),
    );
    return FILTERS.filter(
      (f) => f.value === "todos" || present.has(f.value.toLowerCase()),
    );
  }, [products]);

  return (
    <div className="flex flex-col gap-8">
      <div
        role="tablist"
        aria-label="Filtrar productos por categoría"
        className="flex flex-wrap gap-2"
      >
        {availableFilters.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all",
                "border",
                active
                  ? "bg-[var(--color-coffee)] text-[var(--color-cream)] border-[var(--color-coffee)] shadow-[var(--shadow-warm-sm)]"
                  : "bg-transparent text-[var(--color-coffee)] border-[var(--color-coffee)]/20 hover:bg-[var(--color-coffee)]/5 hover:border-[var(--color-coffee)]/40",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif italic text-[var(--color-ink)]/60 py-12 text-center"
        >
          No hay productos en esta categoría por ahora.
        </motion.p>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
