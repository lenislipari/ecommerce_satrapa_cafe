export type IntensityLevel = "suave" | "medio" | "intenso";

export const CAFE_GROUPS: Record<IntensityLevel, string[]> = {
  suave: ["carioca", "premium"],
  medio: ["mestizo", "colombiano"],
  intenso: ["moka", "ipanema"],
};

export const INTENSITY_META: Record<
  IntensityLevel,
  { label: string; description: string; accent: string; dot: string }
> = {
  suave: {
    label: "Suave",
    description: "Delicado, dulce y aromático",
    accent:
      "bg-[var(--color-cream-soft)] text-[var(--color-coffee)] border-[var(--color-coffee)]/15",
    dot: "bg-[var(--color-sienna)]",
  },
  medio: {
    label: "Medio",
    description: "Equilibrado, cuerpo medio",
    accent:
      "bg-[var(--color-orange)]/90 text-[var(--color-coffee)] border-[var(--color-orange)]",
    dot: "bg-[var(--color-coffee)]",
  },
  intenso: {
    label: "Intenso",
    description: "Profundo, audaz y carácter fuerte",
    accent:
      "bg-[var(--color-coffee)] text-[var(--color-cream)] border-[var(--color-coffee)]",
    dot: "bg-[var(--color-orange)]",
  },
};
