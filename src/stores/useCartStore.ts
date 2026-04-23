"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, CustomerData, Molienda, Product } from "@/types/product";

type CartState = {
  items: CartItem[];
  customer: CustomerData;
  isOpen: boolean;
  hasHydrated: boolean;

  addItem: (product: Product, cantidad?: number, molienda?: Molienda) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, cantidad: number) => void;
  clear: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  updateCustomer: (patch: Partial<CustomerData>) => void;
  setHasHydrated: (v: boolean) => void;
};

const INITIAL_CUSTOMER: CustomerData = { nombre: "", direccion: "", notas: "" };

function buildItemId(productId: string, molienda?: Molienda): string {
  return molienda ? `${productId}::${molienda}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      customer: INITIAL_CUSTOMER,
      isOpen: false,
      hasHydrated: false,

      addItem: (product, cantidad = 1, molienda) =>
        set((state) => {
          const id = buildItemId(product.id, molienda);
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            const nuevaCantidad = Math.min(existing.cantidad + cantidad, product.stock);
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, cantidad: nuevaCantidad } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id,
                productId: product.id,
                slug: product.slug,
                nombre: product.nombre,
                precio: product.precio,
                cantidad: Math.min(cantidad, product.stock),
                stock: product.stock,
                imagenPrincipal: product.imagenPrincipal,
                molienda,
              },
            ],
          };
        }),

      removeItem: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== itemId) })),

      updateQuantity: (itemId, cantidad) =>
        set((state) => ({
          items:
            cantidad <= 0
              ? state.items.filter((i) => i.id !== itemId)
              : state.items.map((i) =>
                  i.id === itemId
                    ? { ...i, cantidad: Math.min(cantidad, i.stock ?? 9999) }
                    : i,
                ),
        })),

      clear: () => set({ items: [], customer: INITIAL_CUSTOMER }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      updateCustomer: (patch) =>
        set((state) => ({ customer: { ...state.customer, ...patch } })),

      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "satrapa-cart",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, customer: state.customer }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      migrate: (persistedState: unknown, version) => {
        const ps = (persistedState ?? {}) as { items?: Array<Record<string, unknown>> };
        let items = ps.items ?? [];
        if (version < 2) {
          items = items.map((raw) => ({
            ...raw,
            id: String(raw.productId ?? ""),
          }));
        }
        if (version < 3) {
          items = items.map((raw) => ({
            ...raw,
            stock: typeof raw.stock === "number" ? raw.stock : 9999,
          }));
        }
        return { ...ps, items } as unknown as Partial<CartState>;
      },
    },
  ),
);

export const selectItemCount = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.cantidad, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
