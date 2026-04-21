import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-5 py-24 gap-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-orange)]">
        404
      </p>
      <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-[var(--color-coffee)] leading-tight">
        Esta página
        <br />
        <span className="font-serif italic font-normal text-[var(--color-orange)]">
          no existe
        </span>
      </h1>
      <p className="font-serif text-lg text-[var(--color-ink)]/70 max-w-sm">
        Puede que el producto fue dado de baja o la URL es incorrecta.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-coffee)] px-6 py-3 text-sm font-semibold text-[var(--color-cream)] transition-all hover:bg-[var(--color-orange)] hover:-translate-y-0.5"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  );
}
