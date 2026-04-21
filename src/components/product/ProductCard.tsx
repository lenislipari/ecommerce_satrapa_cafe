"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Coffee } from "lucide-react";
import type { Product } from "@/types/product";
import { useInView } from "@/hooks/useInView";
import { cn, formatPrice, formatCategoria } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/cloudinary";

type ProductCardProps = {
  product: Product;
};

const CARD_ACCENTS = [
  { bg: "bg-[var(--color-coffee)]", fg: "text-[var(--color-cream)]", badge: "bg-[var(--color-orange)]" },
  { bg: "bg-[var(--color-orange)]", fg: "text-[var(--color-coffee)]", badge: "bg-[var(--color-coffee)] text-[var(--color-cream)]" },
  { bg: "bg-[var(--color-cream-soft)]", fg: "text-[var(--color-coffee)]", badge: "bg-[var(--color-orange)]" },
];

export function ProductCard({ product }: ProductCardProps) {
  const { ref, isInView } = useInView();

  const accentIndex =
    product.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % CARD_ACCENTS.length;
  const accent = CARD_ACCENTS[accentIndex];

  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  const imgUrl = product.imagenPrincipal
    ? cloudinaryUrl(product.imagenPrincipal, { width: 600, height: 750, crop: "fill" })
    : null;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)]",
        "bg-[var(--color-paper)] shadow-[var(--shadow-warm-sm)]",
        "transition-all duration-300 ease-out h-full",
        "hover:-translate-y-1 hover:shadow-[var(--shadow-warm-md)]",
        outOfStock && "opacity-60 saturate-50",
      )}
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2 rounded-[var(--radius-lg)]"
        aria-label={`Ver detalle de ${product.nombre}`}
      >
        <div
          className={cn(
            "relative aspect-[4/5] overflow-hidden",
            !imgUrl && cn("flex items-end p-6", accent.bg, accent.fg),
            "transition-transform duration-500 ease-out group-hover:scale-[1.02]",
          )}
        >
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={product.nombre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <>
              <Coffee
                className="absolute top-6 right-6 w-10 h-10 opacity-40"
                strokeWidth={1.5}
                aria-hidden
              />
              <h3 className="font-sans font-extrabold text-3xl md:text-4xl leading-none tracking-tight">
                {product.nombre.split(" ").map((word, i) => (
                  <span key={i} className="block">
                    {word.toUpperCase()}
                  </span>
                ))}
              </h3>
            </>
          )}

          {lowStock && (
            <span
              className={cn(
                "absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                imgUrl
                  ? "bg-[var(--color-orange)] text-white"
                  : cn(accent.badge, "text-white"),
              )}
            >
              ¡Quedan pocos!
            </span>
          )}

          {outOfStock && (
            <span className="absolute top-4 left-4 z-10 rounded-full bg-neutral-900/80 px-3 py-1 text-xs font-semibold tracking-wide text-white">
              Agotado
            </span>
          )}
        </div>

        <div className="flex flex-col flex-1 gap-2 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-sienna)]">
            {formatCategoria(product.categoria)}
          </p>

          <p className="font-serif italic text-[var(--color-ink)]/80 text-sm leading-snug">
            {product.descripcionCorta}
          </p>

          {product.notasCata.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-1">
              {product.notasCata.map((nota) => (
                <li
                  key={nota}
                  className="rounded-full border border-[var(--color-coffee)]/15 px-2.5 py-0.5 text-[11px] text-[var(--color-coffee)]/80"
                >
                  {nota}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-end justify-between pt-4">
            <span className="font-sans font-bold text-2xl text-[var(--color-coffee)]">
              {formatPrice(product.precio)}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold",
                "bg-[var(--color-coffee)] text-[var(--color-cream)]",
                "transition-all duration-200 group-hover:bg-[var(--color-orange)] group-hover:text-white",
                outOfStock && "pointer-events-none",
              )}
            >
              {outOfStock ? "Sin stock" : "Ver detalle →"}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
