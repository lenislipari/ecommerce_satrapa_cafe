import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-cream)]/10 bg-[var(--color-coffee)]">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <Logo variant="inline-white" className="h-10 w-auto" />
        <p className="font-serif text-sm text-[var(--color-cream)]/70">
          © {new Date().getFullYear()} Sátrapa Café · Sierras Chicas, Córdoba
        </p>
      </div>
    </footer>
  );
}
