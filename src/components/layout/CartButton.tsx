"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore, selectItemCount } from "@/stores/useCartStore";

export function CartButton() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore(selectItemCount);
  const hasHydrated = useCartStore((s) => s.hasHydrated);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Abrir carrito${count > 0 ? ` (${count} items)` : ""}`}
      className="relative inline-flex items-center gap-2 rounded-full bg-[var(--color-coffee)] px-4 py-2 text-sm font-semibold text-[var(--color-cream)] transition-all hover:bg-[var(--color-orange)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2"
    >
      <ShoppingBag className="w-4 h-4" strokeWidth={2} />
      <span className="hidden sm:inline">Carrito</span>
      {hasHydrated && count > 0 && (
        <span
          className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[22px] h-[22px] rounded-full bg-[var(--color-orange)] px-1.5 text-[11px] font-bold text-white ring-2 ring-[var(--color-background)] animate-in zoom-in-50 duration-200"
          aria-hidden
        >
          {count}
        </span>
      )}
    </button>
  );
}
