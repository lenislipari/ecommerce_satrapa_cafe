"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2, Truck, X } from "lucide-react";
import {
  useCartStore,
  selectSubtotal,
  selectShipping,
  selectTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/stores/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { generatePedidoId, getWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { trackInitiateCheckout, trackPurchase } from "@/lib/metaPixel";
import { useState } from "react";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const clear = useCartStore((s) => s.clear);
  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const updateCustomer = useCartStore((s) => s.updateCustomer);
  const subtotal = useCartStore(selectSubtotal);
  const shipping = useCartStore(selectShipping);
  const total = useCartStore(selectTotal);
  const isSierrasChicas = !!customer.sierrasChicas;
  const freeShipping = isSierrasChicas || subtotal >= FREE_SHIPPING_THRESHOLD;
  const missingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string; direccion?: string }>({});

  const handleCheckout = async () => {
    if (items.length === 0 || sending) return;

    const newErrors: { nombre?: string; direccion?: string } = {};
    if (!customer.nombre.trim()) newErrors.nombre = "Ingresá tu nombre";
    if (!customer.direccion?.trim()) newErrors.direccion = "Ingresá tu dirección";
    if (newErrors.nombre || newErrors.direccion) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSending(true);

    const pedidoId = generatePedidoId();

    trackInitiateCheckout({ items, value: total });

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId, items, customer, subtotal, shipping, total }),
    }).catch(() => {});

    const link = getWhatsAppLink(items, customer, pedidoId);
    window.open(link, "_blank", "noopener,noreferrer");
    trackPurchase({ items, value: total, orderId: pedidoId });
    setSending(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(v) => (v ? null : closeCart())}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-[var(--color-coffee)]/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
                className="fixed right-0 top-0 z-50 h-dvh w-full max-w-md flex flex-col bg-[var(--color-background)] shadow-[var(--shadow-warm-lg)]"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-coffee)]/10">
                  <Dialog.Title className="font-sans font-extrabold text-xl text-[var(--color-coffee)]">
                    Tu pausa sátrapa
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Cerrar carrito"
                      className="grid place-items-center w-9 h-9 rounded-full text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </div>

                {items.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="relative w-48 h-48"
                    >
                      <Image
                        src="/images/ilustracion-ojos-tapados.webp"
                        alt="Perrito tapándose los ojos"
                        fill
                        sizes="192px"
                        className="object-contain"
                      />
                    </motion.div>
                    <div className="space-y-1">
                      <p className="font-sans font-bold text-lg text-[var(--color-coffee)]">
                        Todavía no hay nada acá.
                      </p>
                      <p className="font-serif italic text-[var(--color-ink)]/70">
                        Date un gusto, te lo merecés.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        closeCart();
                        setTimeout(() => {
                          document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" });
                        }, 350);
                      }}
                      className="rounded-full bg-[var(--color-coffee)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)] transition-colors hover:bg-[var(--color-orange)]"
                    >
                      Explorar la tienda
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-3 sm:py-4">
                      <ul className="flex flex-col gap-2 sm:gap-3">
                        <AnimatePresence initial={false}>
                          {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                          ))}
                        </AnimatePresence>
                      </ul>

                      <div className="mt-6 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sienna)]">
                          Tus datos
                        </p>
                        <div>
                          <input
                            type="text"
                            placeholder="Tu nombre *"
                            value={customer.nombre}
                            onChange={(e) => { updateCustomer({ nombre: e.target.value }); setErrors((p) => ({ ...p, nombre: undefined })); }}
                            className={`w-full rounded-[var(--radius-md)] bg-[var(--color-paper)] border px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)] ${errors.nombre ? "border-red-400" : "border-[var(--color-coffee)]/15"}`}
                          />
                          {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Dirección (para envío) *"
                            value={customer.direccion}
                            onChange={(e) => { updateCustomer({ direccion: e.target.value }); setErrors((p) => ({ ...p, direccion: undefined })); }}
                            className={`w-full rounded-[var(--radius-md)] bg-[var(--color-paper)] border px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)] ${errors.direccion ? "border-red-400" : "border-[var(--color-coffee)]/15"}`}
                          />
                          {errors.direccion && <p className="mt-1 text-xs text-red-500">{errors.direccion}</p>}
                        </div>
                        <label className="flex items-start gap-2.5 cursor-pointer select-none rounded-[var(--radius-md)] border border-[var(--color-coffee)]/15 bg-[var(--color-paper)] px-3 py-2.5 text-sm text-[var(--color-coffee)] transition-colors hover:border-[var(--color-orange)]/40">
                          <input
                            type="checkbox"
                            checked={!!customer.sierrasChicas}
                            onChange={(e) => updateCustomer({ sierrasChicas: e.target.checked })}
                            className="mt-0.5 h-4 w-4 accent-[var(--color-orange)]"
                          />
                          <span className="leading-tight">
                            Soy de Sierras Chicas
                            <span className="ml-1 font-serif italic text-[var(--color-ink)]/60">— envío gratis 🎉</span>
                          </span>
                        </label>
                        <textarea
                          placeholder="Notas (aclaraciones, horario...)"
                          value={customer.notas}
                          rows={2}
                          onChange={(e) => updateCustomer({ notas: e.target.value })}
                          className="w-full resize-none rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/15 px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)]"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[var(--color-coffee)]/10 bg-[var(--color-cream-soft)] px-5 py-2.5 sm:py-4 space-y-2 sm:space-y-3">
                      <div
                        className={`rounded-[var(--radius-md)] border px-3 py-1.5 sm:py-2.5 ${
                          freeShipping
                            ? "border-[var(--color-orange)]/40 bg-[var(--color-orange)]/10"
                            : "border-[var(--color-coffee)]/15 bg-[var(--color-paper)]"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-coffee)]">
                          <Truck className="w-4 h-4 text-[var(--color-orange)]" />
                          {isSierrasChicas ? (
                            <span>Envío gratis en Sierras Chicas 🎉</span>
                          ) : freeShipping ? (
                            <span>¡Tenés envío gratis! 🎉</span>
                          ) : (
                            <span>
                              Te faltan{" "}
                              <span className="text-[var(--color-orange)]">
                                {formatPrice(missingForFreeShipping)}
                              </span>{" "}
                              para envío gratis
                            </span>
                          )}
                        </div>
                        {!isSierrasChicas && (
                          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-coffee)]/10">
                            <div
                              className="h-full rounded-full bg-[var(--color-orange)] transition-all duration-500"
                              style={{ width: `${freeShippingProgress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-0.5 sm:space-y-1.5 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[var(--color-ink)]/70">Subtotal</span>
                          <span className="font-sans font-semibold text-[var(--color-coffee)]">
                            {formatPrice(subtotal)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-[var(--color-ink)]/70">Envío</span>
                          <span
                            className={`font-sans font-semibold ${
                              freeShipping ? "text-[var(--color-orange)]" : "text-[var(--color-coffee)]"
                            }`}
                          >
                            {freeShipping ? "Gratis" : formatPrice(shipping)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--color-coffee)]/10">
                          <span className="font-serif text-sm text-[var(--color-ink)]/70">Total</span>
                          <span className="font-sans font-extrabold text-xl sm:text-2xl text-[var(--color-coffee)]">
                            {formatPrice(total)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-2 sm:py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[#128C7E] hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                          className="w-5 h-5"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        Enviar pedido
                      </button>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            closeCart();
                            setTimeout(() => {
                              document.getElementById("tienda")?.scrollIntoView({ behavior: "smooth" });
                            }, 350);
                          }}
                          className="text-sm font-semibold text-[var(--color-orange)] underline-offset-2 hover:underline"
                        >
                          ← Seguir comprando
                        </button>
                        <button
                          type="button"
                          onClick={clear}
                          className="inline-flex items-center gap-1 text-xs text-[var(--color-ink)]/50 underline-offset-2 hover:underline hover:text-[var(--color-coffee)]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Vaciar carrito
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
