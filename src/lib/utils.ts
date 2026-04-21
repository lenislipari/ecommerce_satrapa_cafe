import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCategoria(categoria: string): string {
  const normalized = categoria.trim().toLowerCase();
  const map: Record<string, string> = {
    "cafe x 250gr": "Café · 250g",
    "cafe x 500gr": "Café · 500g",
    "cafe x 1kg": "Café · 1kg",
    cafeteras: "Cafeteras",
    accesorios: "Accesorios",
  };
  return map[normalized] ?? categoria;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
