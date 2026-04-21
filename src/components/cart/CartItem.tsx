"use client";

import { motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/product";
import { useCartStore } from "@/stores/useCartStore";
import { useToastStore } from "@/stores/useToastStore";
import { formatPrice } from "@/lib/utils";

type CartItemProps = {
  item: CartItemType;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const addToast = useToastStore((s) => s.addToast);

  const handleRemove = () => {
    removeItem(item.id);
    addToast(`${item.nombre} removido del carrito`, "info");
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="flex gap-3 p-3 rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/10"
    >
      {/* Placeholder visual del producto */}
      <div
        className="shrink-0 w-16 h-20 rounded-[var(--radius-sm)] bg-[var(--color-coffee)] text-[var(--color-cream)] grid place-items-center p-2"
        aria-hidden
      >
        <span className="font-sans font-extrabold text-[10px] leading-tight text-center tracking-tight uppercase line-clamp-3">
          {item.nombre}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-sans font-semibold text-sm text-[var(--color-coffee)] leading-snug line-clamp-2">
              {item.nombre}
            </h4>
            {item.molienda && (
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-sienna)]">
                {item.molienda}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRemove}
            aria-label={`Remover ${item.nombre}`}
            className="shrink-0 grid place-items-center w-7 h-7 rounded-full text-[var(--color-ink)]/50 transition-colors hover:bg-[var(--color-coffee)]/10 hover:text-[var(--color-coffee)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center rounded-full border border-[var(--color-coffee)]/15 bg-[var(--color-background)]">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.cantidad - 1)}
              aria-label="Disminuir cantidad"
              className="grid place-items-center w-7 h-7 rounded-full text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/10"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-7 text-center text-xs font-bold tabular-nums text-[var(--color-coffee)]">
              {item.cantidad}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.id, item.cantidad + 1)}
              aria-label="Aumentar cantidad"
              className="grid place-items-center w-7 h-7 rounded-full text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/10"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <span className="font-sans font-bold text-sm text-[var(--color-coffee)] tabular-nums">
            {formatPrice(item.precio * item.cantidad)}
          </span>
        </div>
      </div>
    </motion.li>
  );
}
