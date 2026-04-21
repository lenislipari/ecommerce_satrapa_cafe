"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import type { Molienda, Product } from "@/types/product";
import { useCartStore } from "@/stores/useCartStore";
import { useToastStore } from "@/stores/useToastStore";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: Product;
  withQuantity?: boolean;
  molienda?: Molienda;
  onAdded?: () => void;
};

export function AddToCartButton({
  product,
  withQuantity = false,
  molienda,
  onAdded,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const addToast = useToastStore((s) => s.addToast);
  const [cantidad, setCantidad] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stock === 0;
  const maxReached = cantidad >= product.stock;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem(product, cantidad, molienda);
    addToast(`${product.nombre} agregado al carrito`, "success");
    setJustAdded(true);
    onAdded?.();
    setTimeout(() => {
      setJustAdded(false);
      openCart();
    }, 900);
  };

  if (!withQuantity) {
    return (
      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all",
          "bg-[var(--color-coffee)] text-[var(--color-cream)]",
          "hover:bg-[var(--color-orange)] hover:-translate-y-0.5",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Agregado
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Agregar
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-[var(--color-coffee)]/20 bg-[var(--color-paper)]">
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.max(1, c - 1))}
            aria-label="Disminuir cantidad"
            className="grid place-items-center w-10 h-10 rounded-full text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/10 disabled:opacity-30"
            disabled={cantidad <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span
            aria-live="polite"
            className="w-10 text-center font-sans font-bold tabular-nums text-[var(--color-coffee)]"
          >
            {cantidad}
          </span>
          <button
            type="button"
            onClick={() => setCantidad((c) => Math.min(product.stock, c + 1))}
            aria-label="Aumentar cantidad"
            disabled={maxReached}
            className="grid place-items-center w-10 h-10 rounded-full text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/10 disabled:opacity-30"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-[var(--color-ink)]/60">
          {product.stock} disponibles
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all",
          "bg-[var(--color-coffee)] text-[var(--color-cream)] shadow-[var(--shadow-warm-sm)]",
          "hover:bg-[var(--color-orange)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-warm-md)]",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {justAdded ? (
            <motion.span
              key="added"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Agregado al carrito
            </motion.span>
          ) : (
            <motion.span
              key="add"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {outOfStock ? "Sin stock" : "Agregar al carrito"}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
