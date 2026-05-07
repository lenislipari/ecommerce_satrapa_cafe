type FbqArgs =
  | ["track", string, Record<string, unknown>?]
  | ["trackCustom", string, Record<string, unknown>?]
  | ["init", string];

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function fbq(...args: FbqArgs) {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq(...args);
}

export function trackPageView() {
  fbq("track", "PageView");
}

type AddToCartParams = {
  contentId: string;
  contentName: string;
  value: number;
  quantity: number;
};

export function trackAddToCart({
  contentId,
  contentName,
  value,
  quantity,
}: AddToCartParams) {
  fbq("track", "AddToCart", {
    content_ids: [contentId],
    content_name: contentName,
    content_type: "product",
    value: value * quantity,
    currency: "ARS",
    contents: [{ id: contentId, quantity }],
  });
}

type CartLine = {
  productId: string;
  cantidad: number;
};

type CheckoutParams = {
  items: CartLine[];
  value: number;
};

export function trackInitiateCheckout({ items, value }: CheckoutParams) {
  fbq("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.productId),
    content_type: "product",
    contents: items.map((i) => ({ id: i.productId, quantity: i.cantidad })),
    num_items: items.reduce((acc, i) => acc + i.cantidad, 0),
    value,
    currency: "ARS",
  });
}

type PurchaseParams = CheckoutParams & {
  orderId: string;
};

export function trackPurchase({ items, value, orderId }: PurchaseParams) {
  fbq("track", "Purchase", {
    content_ids: items.map((i) => i.productId),
    content_type: "product",
    contents: items.map((i) => ({ id: i.productId, quantity: i.cantidad })),
    num_items: items.reduce((acc, i) => acc + i.cantidad, 0),
    value,
    currency: "ARS",
    order_id: orderId,
  });
}
