import { Suspense } from "react";
import Image from "next/image";
import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";

export const revalidate = 300;

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493515913367";
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "satrapacafe@gmail.com";

export default async function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid gap-10 md:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-coffee)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-coffee)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-orange)] animate-pulse" />
              Café de especialidad · Sierras Chicas
            </span>

            <h1 className="text-display text-[var(--color-coffee)]">
              Celebrar
              <br />
              <span className="italic font-serif font-medium text-[var(--color-orange)]">
                lo cotidiano
              </span>
            </h1>

            <p className="font-serif text-lg md:text-xl text-[var(--color-ink)]/80 max-w-lg leading-relaxed">
              Un café al sol, una pausa robada al apuro, un ratito solo para vos.
              De ahí viene <strong className="font-sans">Sátrapa</strong>: un refugio
              para esos pequeños momentos que hacen la vida más linda.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#tienda"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-coffee)] px-6 py-3 text-sm font-semibold text-[var(--color-cream)] shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[var(--color-orange)] hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5"
              >
                Ver la tienda
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-coffee)]/30 px-6 py-3 text-sm font-semibold text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/5"
              >
                Contacto
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Logo variant="stacked" className="w-full max-w-md h-auto" priority />
          </div>
        </div>

        <div
          className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--color-orange)]/10 blur-3xl"
          aria-hidden
        />
      </section>

      {/* Manifiesto */}
      <section className="relative overflow-hidden bg-[var(--color-coffee)] text-[var(--color-cream)]">
        <div className="mx-auto max-w-4xl px-5 py-16 md:py-24 text-center space-y-6 relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-orange)]">
            El costado sátrapa
          </p>
          <h2 className="font-sans text-3xl md:text-5xl font-extrabold leading-tight text-[var(--color-cream)]">
            Con azúcar o sin azúcar.
            <br />
            <span className="font-serif italic font-normal text-[var(--color-orange)]">
              lo importante es disfrutarlo.
            </span>
          </h2>
          <p className="font-serif text-lg text-[var(--color-cream)]/85 max-w-2xl mx-auto leading-relaxed">
            Ser sátrapa es encontrar disfrute en lo real, en lo que pasa todos los días.
            Es elegir lo que a uno le hace bien, a su manera y sin dar explicaciones.
          </p>
        </div>

        <div
          className="pointer-events-none absolute -bottom-6 -left-8 md:-left-4 w-32 md:w-44 opacity-25 select-none"
          aria-hidden
        >
          <Image
            src="/images/ilustracion-tomando-cafe.png"
            alt=""
            width={400}
            height={500}
            className="w-full h-auto"
          />
        </div>

        <div
          className="pointer-events-none absolute -bottom-6 -right-8 md:-right-4 w-32 md:w-44 opacity-25 select-none"
          aria-hidden
        >
          <Image
            src="/images/ilustracion-molinillo.png"
            alt=""
            width={400}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Tienda */}
      <section
        id="tienda"
        className="relative mx-auto max-w-6xl px-5 py-16 md:py-24"
      >
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10 relative z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-sienna)] mb-2">
              La tienda
            </p>
            <h2 className="font-sans text-4xl md:text-5xl font-extrabold text-[var(--color-coffee)]">
              Café para tus mañanas
              <span className="font-serif italic font-medium text-[var(--color-orange)]">
                {" "}
                descaradas
              </span>
            </h2>
          </div>
          <p className="font-serif text-[var(--color-ink)]/70 max-w-md">
            Seleccionamos granos de origen y un blend propio, tostados en tanda corta
            para que cada taza sea una pausa de verdad.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </section>

      {/* Contacto */}
      <section
        id="contacto"
        className="relative overflow-hidden bg-[var(--color-coffee)] text-[var(--color-cream)]"
      >
        <div className="mx-auto max-w-3xl px-5 py-16 md:py-24 text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-orange)]">
              Contacto
            </p>
            <h2 className="font-sans text-3xl md:text-5xl font-extrabold leading-tight text-[var(--color-cream)]">
              ¿Hablamos?
            </h2>
            <p className="font-serif text-lg text-[var(--color-cream)]/80 max-w-lg mx-auto leading-relaxed">
              Para pedidos, consultas o simplemente saludar —
              estamos al otro lado del chat.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("¡Hola Sátrapa! Quería consultarte algo ☕")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-sm font-semibold text-white shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[#128C7E] hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Escribinos por WhatsApp
            </a>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-3 rounded-full border border-[var(--color-cream)]/25 px-8 py-4 text-sm font-semibold text-[var(--color-cream)] transition-all hover:bg-[var(--color-cream)]/10 hover:border-[var(--color-cream)]/50 hover:-translate-y-0.5"
            >
              <Mail className="w-5 h-5" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div
          className="pointer-events-none absolute -bottom-6 -left-8 md:-left-4 w-32 md:w-44 opacity-20 select-none"
          aria-hidden
        >
          <Image
            src="/images/ilustracion-ojos-tapados.png"
            alt=""
            width={400}
            height={500}
            className="w-full h-auto"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 bg-[var(--color-orange)]/5 blur-3xl"
          aria-hidden
        />
      </section>
    </>
  );
}
