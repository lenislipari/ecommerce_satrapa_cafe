import type { CartItem, CustomerData } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/stores/useCartStore";

const WA_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5493512041738";

export function generatePedidoId(): string {
  return `SAT-${Date.now().toString(36).toUpperCase()}`;
}

export function buildWhatsAppMessage(
  items: CartItem[],
  customer: CustomerData,
  pedidoId = generatePedidoId(),
): string {
  if (items.length === 0) return "";

  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const envio = customer.villaCatalina
    ? 0
    : subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST;
  const total = subtotal + envio;
  const envioLabel =
    envio === 0
      ? customer.villaCatalina
        ? "Gratis (Villa Catalina) 🎉"
        : "Gratis 🎉"
      : formatPrice(envio);

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
    `Subtotal: ${formatPrice(subtotal)}`,
    `Envío: ${envioLabel}`,
    `💰 TOTAL: ${formatPrice(total)}`,
    "",
    datosCliente,
    datosCliente ? "" : null,
    `(Pedido #${pedidoId})`,
    "",
    "💳 DATOS PARA TRANSFERENCIA:",
    "Mercado Pago",
    "Ailiñ Correa Perelmuter",
    "ALIAS: satrapacafe",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function getWhatsAppLink(items: CartItem[], customer: CustomerData, pedidoId?: string): string {
  const msg = buildWhatsAppMessage(items, customer, pedidoId);
  return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
}
