import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { CartButton } from "@/components/layout/CartButton";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-coffee)]/10 bg-[var(--color-background)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2"
          aria-label="Ir al inicio de Sátrapa Café"
        >
          <Logo variant="inline" className="h-11 w-auto" priority />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-coffee)]">
          <Link href="/#tienda" className="hover:text-[var(--color-orange)] transition-colors">
            Tienda
          </Link>
          <Link href="/#contacto" className="hover:text-[var(--color-orange)] transition-colors">
            Contacto
          </Link>
        </nav>

        <CartButton />
      </div>
    </header>
  );
}
