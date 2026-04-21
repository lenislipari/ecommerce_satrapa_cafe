import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "stacked" | "inline" | "inline-white";
  className?: string;
  priority?: boolean;
};

const VARIANTS = {
  stacked: { src: "/images/logo-vertical-color.png", width: 500, height: 550 },
  inline: { src: "/images/logo-horizontal-color.png", width: 600, height: 320 },
  "inline-white": { src: "/images/logo-horizontal-blanco.png", width: 600, height: 320 },
} as const;

export function Logo({ variant = "stacked", className, priority = false }: LogoProps) {
  const { src, width, height } = VARIANTS[variant];

  return (
    <Image
      src={src}
      alt="Sátrapa Café"
      width={width}
      height={height}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
