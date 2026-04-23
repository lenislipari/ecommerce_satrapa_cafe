"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { cn, formatPrice } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/cloudinary";
import { useCartStore } from "@/stores/useCartStore";
import {
  CAFE_GROUPS,
  CAFE_500G_MAP,
  INTENSITY_META,
  type IntensityLevel,
} from "@/lib/cafe-test";

type Step = 1 | 2 | 3;

export function CafeTestClient({ products }: { products: Product[] }) {
  const [step, setStep] = useState<Step>(1);
  const [intensity, setIntensity] = useState<IntensityLevel | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const candidates = intensity
    ? products.filter((p) => {
        const normalized = p.slug.trim().toLowerCase();
        return CAFE_GROUPS[intensity].some(
          (s) => s.toLowerCase() === normalized,
        );
      })
    : [];

  const chooseIntensity = (lvl: IntensityLevel) => {
    setIntensity(lvl);
    setStep(2);
  };

  const chooseCoffee = (p: Product) => {
    setSelected(p);
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setIntensity(null);
    setSelected(null);
  };

  const back = () => {
    if (step === 3) {
      setSelected(null);
      setStep(2);
    } else if (step === 2) {
      setIntensity(null);
      setStep(1);
    }
  };

  const addToCart = () => {
    if (!selected) return;
    addItem(selected);
    openCart();
  };

  const slug500 = selected ? CAFE_500G_MAP[selected.slug] : null;
  const product500 = slug500
    ? products.find((p) => p.slug.trim().toLowerCase() === slug500.toLowerCase())
    : null;

  return (
    <div className="relative">
      {/* Progress */}
      <div className="flex justify-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            aria-hidden
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              step >= n
                ? "bg-[var(--color-orange)] w-10"
                : "bg-[var(--color-coffee)]/20 w-4",
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-sans font-extrabold text-3xl md:text-4xl text-[var(--color-coffee)] text-center mb-2">
              ¿Cómo te gusta tu café?
            </h3>
            <p className="font-serif italic text-[var(--color-ink)]/70 text-center mb-10">
              Elegí la intensidad que más va con vos.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(INTENSITY_META) as IntensityLevel[]).map((lvl) => {
                const meta = INTENSITY_META[lvl];
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => chooseIntensity(lvl)}
                    className={cn(
                      "group relative rounded-[var(--radius-lg)] border p-6 text-left transition-all duration-200",
                      "hover:-translate-y-1 hover:shadow-[var(--shadow-warm-md)]",
                      meta.accent,
                    )}
                  >
                    <span
                      className={cn(
                        "block h-2 w-2 rounded-full mb-4",
                        meta.dot,
                      )}
                    />
                    <span className="block font-sans font-extrabold text-2xl mb-1">
                      {meta.label}
                    </span>
                    <span className="block font-serif italic text-sm opacity-85">
                      {meta.description}
                    </span>
                    <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && intensity && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-coffee)]/70 hover:text-[var(--color-orange)] transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>

            <h3 className="font-sans font-extrabold text-3xl md:text-4xl text-[var(--color-coffee)] text-center mb-2">
              ¿Qué notas te atraen?
            </h3>
            <p className="font-serif italic text-[var(--color-ink)]/70 text-center mb-10">
              Elegí el perfil de sabor que más te tiente.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {candidates.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => chooseCoffee(p)}
                  className={cn(
                    "group relative rounded-[var(--radius-lg)] border border-[var(--color-coffee)]/15 bg-[var(--color-paper)] p-6 text-left transition-all duration-200",
                    "hover:-translate-y-1 hover:shadow-[var(--shadow-warm-md)] hover:border-[var(--color-orange)]",
                  )}
                >
                  <span className="block font-sans font-bold text-xl text-[var(--color-coffee)] leading-tight mb-3">
                    {p.notasCata.join(" y ")}
                  </span>
                  {p.notasCata.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5">
                      {p.notasCata.map((n) => (
                        <li
                          key={n}
                          className="rounded-full bg-[var(--color-cream-soft)] px-2.5 py-0.5 text-[11px] text-[var(--color-coffee)]/70"
                        >
                          {n}
                        </li>
                      ))}
                    </ul>
                  )}
                  <ArrowRight className="absolute bottom-5 right-5 w-5 h-5 text-[var(--color-coffee)]/50 transition-all group-hover:text-[var(--color-orange)] group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && selected && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-orange)] text-center mb-3">
              Tu café ideal es
            </p>
            <h3 className="font-sans font-extrabold text-4xl md:text-5xl text-[var(--color-coffee)] text-center mb-8">
              {selected.nombre}
            </h3>

            <div className="mx-auto max-w-2xl rounded-[var(--radius-xl)] bg-[var(--color-paper)] shadow-[var(--shadow-warm-md)] overflow-hidden grid sm:grid-cols-[0.9fr_1.1fr]">
              <div className="relative aspect-square sm:aspect-auto sm:min-h-[280px] bg-[var(--color-cream-soft)]">
                {selected.imagenPrincipal ? (
                  <Image
                    src={cloudinaryUrl(selected.imagenPrincipal, {
                      width: 600,
                      height: 600,
                      crop: "fill",
                    })}
                    alt={selected.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                ) : (
                  <div className="grid h-full place-items-center p-6 text-center font-sans font-extrabold text-2xl text-[var(--color-coffee)]">
                    {selected.nombre}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 p-6">
                <p className="font-serif italic text-[var(--color-ink)]/80 leading-relaxed">
                  {selected.descripcionCorta}
                </p>

                {selected.notasCata.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {selected.notasCata.map((n) => (
                      <li
                        key={n}
                        className="rounded-full border border-[var(--color-coffee)]/15 px-2.5 py-0.5 text-[11px] text-[var(--color-coffee)]/80"
                      >
                        {n}
                      </li>
                    ))}
                  </ul>
                )}

                <span className="font-sans font-extrabold text-3xl text-[var(--color-coffee)] mt-auto">
                  {formatPrice(selected.precio)}
                </span>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={addToCart}
                    disabled={selected.stock === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--color-coffee)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)] shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[var(--color-orange)] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {selected.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                  </button>
                  <Link
                    href={`/producto/${selected.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--color-coffee)]/25 px-5 py-2.5 text-sm font-semibold text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/5"
                  >
                    Ver detalle
                  </Link>
                </div>

              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-coffee)]/80 hover:text-[var(--color-orange)] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Hacer el test de nuevo
              </button>
              {product500 && (
                <button
                  type="button"
                  onClick={() => setSelected(product500)}
                  className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-coffee)]/80 hover:text-[var(--color-orange)] transition-colors"
                >
                  Soy muy fan, necesito 500g
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <a
                href="#tienda"
                className="inline-flex items-center gap-2 text-base font-semibold text-[var(--color-coffee)]/80 hover:text-[var(--color-orange)] transition-colors"
              >
                Ver más opciones en la tienda
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
