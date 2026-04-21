import { getProducts } from "@/lib/sheets";
import { ProductGridClient } from "./ProductGridClient";

export async function ProductGrid() {
  const products = await getProducts();
  return <ProductGridClient products={products} />;
}
