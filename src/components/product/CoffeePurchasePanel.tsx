"use client";

import { useState } from "react";
import type { Molienda, Product } from "@/types/product";
import { MOLIENDAS, isCoffeeCategory } from "@/types/product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { cn } from "@/lib/utils";

type CoffeePurchasePanelProps = {
  product: Product;
};

const MOLIENDA_LABELS: Record<Molienda, string> = {
  grano: "En grano",
  "molido filtro": "Molido · filtro",
  "molido moka": "Molido · moka",
  "molido espresso": "Molido · espresso",
};

const MOLIENDA_HINTS: Record<Molienda, string> = {
  grano: "Para los que muelen en casa",
  "molido filtro": "Prensa francesa, Chemex, cafetera de filtro",
  "molido moka": "Cafetera italiana / moka",
  "molido espresso": "Máquina espresso",
};

export function CoffeePurchasePanel({ product }: CoffeePurchasePanelProps) {
  const isCoffee = isCoffeeCategory(product.categoria);
  const [molienda, setMolienda] = useState<Molienda>("grano");

  if (!isCoffee) {
    return <AddToCartButton product={product} withQuantity />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-sienna)]">
            Molienda
          </p>
          <p className="font-serif italic text-xs text-[var(--color-ink)]/60">
            {MOLIENDA_HINTS[molienda]}
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Elegí la molienda del café"
          className="grid grid-cols-2 gap-2"
        >
          {MOLIENDAS.map((m) => {
            const active = molienda === m;
            return (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setMolienda(m)}
                className={cn(
                  "rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold transition-all",
                  "border",
                  active
                    ? "bg-[var(--color-coffee)] text-[var(--color-cream)] border-[var(--color-coffee)] shadow-[var(--shadow-warm-sm)]"
                    : "bg-[var(--color-paper)] text-[var(--color-coffee)] border-[var(--color-coffee)]/15 hover:border-[var(--color-coffee)]/40",
                )}
              >
                {MOLIENDA_LABELS[m]}
              </button>
            );
          })}
        </div>
      </div>

      <AddToCartButton product={product} withQuantity molienda={molienda} />
    </div>
  );
}
