import { cache } from "react";
import type { Product } from "@/types/product";
import { MOCK_PRODUCTS } from "@/lib/mock-products";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SA_EMAIL = process.env.GOOGLE_SA_EMAIL;
const SA_KEY = process.env.GOOGLE_SA_KEY;

export const getProducts = cache(async (): Promise<Product[]> => {
  if (!SHEET_ID || !SA_EMAIL || !SA_KEY) {
    return MOCK_PRODUCTS.filter((p) => p.activo);
  }

  try {
    const { google } = await import("googleapis");

    const auth = new google.auth.JWT({
      email: SA_EMAIL,
      key: SA_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "productos!A2:M",
    });

    const rows = res.data.values ?? [];
    return rows
      .map(rowToProduct)
      .filter((p): p is Product => p !== null && p.activo);
  } catch (error) {
    console.error("[sheets] Error fetching products, falling back to mock:", error);
    return MOCK_PRODUCTS.filter((p) => p.activo);
  }
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | null> => {
    const products = await getProducts();
    return products.find((p) => p.slug === slug) ?? null;
  },
);

function rowToProduct(row: string[]): Product | null {
  const [
    id,
    slug,
    nombre,
    categoria,
    precio,
    stock,
    descripcionCorta,
    descripcionLarga,
    origen,
    notasCata,
    imagenPrincipal,
    imagenesExtra,
    activo,
  ] = row;

  if (!id || !slug || !nombre) return null;

  return {
    id,
    slug,
    nombre,
    categoria: categoria ?? "",
    precio: Number(precio) || 0,
    stock: Number(stock) || 0,
    descripcionCorta: descripcionCorta ?? "",
    descripcionLarga: descripcionLarga ?? "",
    origen: origen || undefined,
    notasCata: (notasCata ?? "").split(",").map((n) => n.trim()).filter(Boolean),
    imagenPrincipal: imagenPrincipal ?? "",
    imagenesExtra: (imagenesExtra ?? "").split(",").map((i) => i.trim()).filter(Boolean),
    activo: String(activo).toUpperCase() === "TRUE" || activo === "1",
  };
}
