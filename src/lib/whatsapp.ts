import type { CartItem, CustomerData } from "@/types/product";
import { formatPrice } from "@/lib/utils";

const WA_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493515913367";

function generatePedidoId(): string {
  return `SAT-${Date.now().toString(36).toUpperCase()}`;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerData,
  pedidoId = generatePedidoId(),
): string {
  if (items.length === 0) return "";

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  const lineas = items
    .map((i) => {
      const nombre = i.molienda ? `${i.nombre} (${i.molienda})` : i.nombre;
      return `• ${i.cantidad}x ${nombre} — ${formatPrice(i.precio * i.cantidad)}`;
    })
    .join("\n");

  const datosCliente = [
    customer.nombre && `👤 ${customer.nombre}`,
    customer.direccion && `📍 ${customer.direccion}`,
    customer.notas && `📝 ${customer.notas}`,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    "¡Hola Sátrapa! Quiero hacer un pedido 🐾☕",
    "",
    "📦 PEDIDO:",
    lineas,
    "",
    `💰 TOTAL: ${formatPrice(subtotal)}`,
    "",
    datosCliente,
    datosCliente ? "" : null,
    `(Pedido #${pedidoId})`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function getWhatsAppLink(items: CartItem[], customer: CustomerData): string {
  const msg = buildWhatsAppMessage(items, customer);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
}
