"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useCartStore, selectSubtotal } from "@/stores/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { generatePedidoId, getWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const clear = useCartStore((s) => s.clear);
  const items = useCartStore((s) => s.items);
  const customer = useCartStore((s) => s.customer);
  const updateCustomer = useCartStore((s) => s.updateCustomer);
  const subtotal = useCartStore(selectSubtotal);
  const [sending, setSending] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0 || sending) return;
    setSending(true);

    const pedidoId = generatePedidoId();

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pedidoId, items, customer, subtotal }),
    }).catch(() => {});

    const link = getWhatsAppLink(items, customer, pedidoId);
    window.open(link, "_blank", "noopener,noreferrer");
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
                        src="/images/ilustracion-ojos-tapados.png"
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
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="rounded-full bg-[var(--color-coffee)] px-5 py-2.5 text-sm font-semibold text-[var(--color-cream)] transition-colors hover:bg-[var(--color-orange)]"
                      >
                        Explorar la tienda
                      </button>
                    </Dialog.Close>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto px-5 py-4">
                      <ul className="flex flex-col gap-3">
                        <AnimatePresence initial={false}>
                          {items.map((item) => (
                            <CartItem key={item.id} item={item} />
                          ))}
                        </AnimatePresence>
                      </ul>

                      <div className="mt-6 space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-sienna)]">
                          Tus datos (opcional)
                        </p>
                        <input
                          type="text"
                          placeholder="Tu nombre"
                          value={customer.nombre}
                          onChange={(e) => updateCustomer({ nombre: e.target.value })}
                          className="w-full rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/15 px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)]"
                        />
                        <input
                          type="text"
                          placeholder="Dirección (para envío)"
                          value={customer.direccion}
                          onChange={(e) => updateCustomer({ direccion: e.target.value })}
                          className="w-full rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/15 px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)]"
                        />
                        <textarea
                          placeholder="Notas (aclaraciones, horario...)"
                          value={customer.notas}
                          rows={2}
                          onChange={(e) => updateCustomer({ notas: e.target.value })}
                          className="w-full resize-none rounded-[var(--radius-md)] bg-[var(--color-paper)] border border-[var(--color-coffee)]/15 px-4 py-2.5 text-sm text-[var(--color-coffee)] placeholder:text-[var(--color-ink)]/40 focus:outline-none focus:border-[var(--color-orange)]"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[var(--color-coffee)]/10 px-5 py-3">
                      <Dialog.Close asChild>
                        <a
                          href="/#tienda"
                          className="block w-full text-center rounded-full border border-[var(--color-coffee)]/25 px-6 py-3 text-sm font-semibold text-[var(--color-coffee)] transition-colors hover:bg-[var(--color-coffee)]/5"
                        >
                          ← Seguir comprando
                        </a>
                      </Dialog.Close>
                    </div>

                    <div className="border-t border-[var(--color-coffee)]/10 bg-[var(--color-cream-soft)] px-5 py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm text-[var(--color-ink)]/70">
                          Subtotal
                        </span>
                        <span className="font-sans font-extrabold text-2xl text-[var(--color-coffee)]">
                          {formatPrice(subtotal)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-warm-sm)] transition-all hover:bg-[#128C7E] hover:shadow-[var(--shadow-warm-md)] hover:-translate-y-0.5"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Finalizar compra por WhatsApp
                      </button>

                      <div className="flex items-center justify-between text-xs">
                        <p className="font-serif italic text-[var(--color-ink)]/60">
                          El envío se coordina por chat
                        </p>
                        <button
                          type="button"
                          onClick={clear}
                          className="text-[var(--color-ink)]/50 underline-offset-2 hover:underline hover:text-[var(--color-coffee)]"
                        >
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
