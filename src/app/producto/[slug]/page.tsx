import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Coffee, Leaf, MapPin } from "lucide-react";
import { getProducts, getProductBySlug } from "@/lib/sheets";
import { CoffeePurchasePanel } from "@/components/product/CoffeePurchasePanel";
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import { formatPrice, formatCategoria } from "@/lib/utils";
import { cloudinaryUrl } from "@/lib/cloudinary";

export const revalidate = 300;

async function fetchBlurDataURL(url: string): Promise<string | undefined> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    return `data:${mime};base64,${base64}`;
  } catch {
    return undefined;
  }
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  const ogImage = product.imagenPrincipal
    ? cloudinaryUrl(product.imagenPrincipal, { width: 1200, height: 630, crop: "fill" })
    : undefined;

  return {
    title: product.nombre,
    description: product.descripcionCorta,
    openGraph: {
      title: `${product.nombre} · Sátrapa Café`,
      description: product.descripcionCorta,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

const VISUAL_ACCENTS = [
  "bg-[var(--color-coffee)] text-[var(--color-cream)]",
  "bg-[var(--color-orange)] text-[var(--color-coffee)]",
  "bg-[var(--color-cream-soft)] text-[var(--color-coffee)]",
];

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const accentIndex =
    product.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    VISUAL_ACCENTS.length;
  const accent = VISUAL_ACCENTS[accentIndex];

  const rawPubIds = [
    product.imagenPrincipal,
    ...product.imagenesExtra,
  ].filter((id): id is string => Boolean(id));

  const carouselImages = rawPubIds.map((pubId) =>
    cloudinaryUrl(pubId, { width: 900, height: 1125, crop: "fill" }),
  );

  const blurDataURLs = await Promise.all(
    rawPubIds.map((pubId) =>
      fetchBlurDataURL(
        cloudinaryUrl(pubId, { width: 20, height: 25, crop: "fill", quality: 1, format: "jpg" }),
      ),
    ),
  );

  const fallback = (
    <>
      <Coffee
        className="absolute top-8 right-8 w-14 h-14 opacity-40"
        strokeWidth={1.5}
        aria-hidden
      />
      <h2 className="font-sans font-extrabold text-5xl md:text-7xl leading-[0.9] tracking-tight">
        {product.nombre.split(" ").map((word, i) => (
          <span key={i} className="block">
            {word.toUpperCase()}
          </span>
        ))}
      </h2>
    </>
  );

  return (
    <article className="mx-auto max-w-6xl px-5 py-10 md:py-16">
      <Link
        href="/#tienda"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-coffee)]/70 transition-colors hover:text-[var(--color-orange)] mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la tienda
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-start">
        <ProductImageCarousel
          images={carouselImages}
          blurDataURLs={blurDataURLs}
          alt={product.nombre}
          accent={accent}
          fallback={fallback}
        />

        {/* Info + CTA */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-sienna)] mb-3">
              {formatCategoria(product.categoria)}
            </p>
            <h1 className="font-sans font-extrabold text-4xl md:text-5xl text-[var(--color-coffee)] leading-tight">
              {product.nombre}
            </h1>
          </div>

          <p className="font-serif italic text-xl text-[var(--color-ink)]/80 leading-relaxed">
            {product.descripcionCorta}
          </p>

          <div className="flex items-baseline gap-3">
            <span className="font-sans font-extrabold text-4xl text-[var(--color-coffee)]">
              {formatPrice(product.precio)}
            </span>
            {product.stock > 0 && product.stock < 5 && (
              <span className="rounded-full bg-[var(--color-orange)] px-3 py-1 text-xs font-semibold text-white">
                ¡Quedan pocos!
              </span>
            )}
          </div>

          <CoffeePurchasePanel product={product} />

          <div className="mt-2 rounded-[var(--radius-lg)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/10 p-6 space-y-5">
            <p className="font-serif text-[var(--color-ink)]/85 leading-relaxed">
              {product.descripcionLarga}
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {product.origen && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sienna)]">
                      Origen
                    </p>
                    <p className="font-serif text-sm text-[var(--color-ink)]/80">
                      {product.origen}
                    </p>
                  </div>
                </div>
              )}

              {product.notasCata.length > 0 && (
                <div className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-[var(--color-orange)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-sienna)]">
                      Notas de cata
                    </p>
                    <p className="font-serif text-sm text-[var(--color-ink)]/80">
                      {product.notasCata.join(" · ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
