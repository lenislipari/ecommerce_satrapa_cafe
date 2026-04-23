import { getProducts } from "@/lib/sheets";
import { CafeTestClient } from "./CafeTestClient";

export async function CafeTestSection() {
  const products = await getProducts();

  return (
    <section
      id="test"
      className="relative overflow-hidden bg-[var(--color-paper)]"
    >
      <div className="mx-auto max-w-5xl px-5 py-16 md:py-24 relative z-10">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-sienna)] mb-3">
            Test del café
          </p>
          <h2 className="font-sans text-4xl md:text-5xl font-extrabold text-[var(--color-coffee)]">
            Encontrá tu
            <span className="font-serif italic font-medium text-[var(--color-orange)]">
              {" "}
              café ideal
            </span>
          </h2>
          <p className="font-serif text-[var(--color-ink)]/70 max-w-md mx-auto mt-4">
            Dos preguntas rápidas y te recomendamos el Sátrapa perfecto para tu paladar.
          </p>
        </div>

        <CafeTestClient products={products} />
      </div>

      <div
        className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[var(--color-orange)]/10 blur-3xl"
        aria-hidden
      />
    </section>
  );
}
