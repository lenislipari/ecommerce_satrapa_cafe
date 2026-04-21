export const CATEGORIES = [
  "cafe x 250gr",
  "cafe x 500gr",
  "cafe x 1kg",
  "cafeteras",
  "accesorios",
] as const;

export type Categoria = (typeof CATEGORIES)[number];

export const MOLIENDAS = [
  "grano",
  "molido filtro",
  "molido moka",
  "molido espresso",
] as const;

export type Molienda = (typeof MOLIENDAS)[number];

export function isCoffeeCategory(categoria: string): boolean {
  return categoria.trim().toLowerCase().startsWith("cafe");
}

export interface Product {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcionCorta: string;
  descripcionLarga: string;
  origen?: string;
  notasCata: string[];
  imagenPrincipal: string;
  imagenesExtra: string[];
  activo: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagenPrincipal: string;
  molienda?: Molienda;
}

export interface CustomerData {
  nombre: string;
  direccion?: string;
  notas?: string;
}
