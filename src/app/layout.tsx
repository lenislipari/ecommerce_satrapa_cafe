import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastContainer } from "@/components/toast/Toast";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { MetaPixelTracker } from "@/components/analytics/MetaPixel";
import { SITE_URL } from "@/lib/site";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const gotham = Inter({
  variable: "--font-gotham",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sátrapa Café — Celebrar lo cotidiano",
    template: "%s · Sátrapa Café",
  },
  description:
    "Café de especialidad de Sierras Chicas. Un refugio para esos pequeños momentos que hacen la vida más linda.",
  keywords: ["café", "especialidad", "Sierras Chicas", "blend", "Córdoba", "Argentina"],
  authors: [{ name: "Sátrapa Café" }],
  creator: "Sátrapa",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: "Sátrapa Café",
    title: "Sátrapa Café — Celebrar lo cotidiano",
    description: "Un refugio para esos pequeños momentos que hacen la vida más linda.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Sátrapa Café",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sátrapa Café",
    description: "Café de especialidad de Sierras Chicas",
  },
  // Ojo: no se define `alternates.canonical` acá. La metadata se hereda hacia
  // abajo, así que un canonical en el layout haría que toda página que no lo
  // sobrescriba (ej. /producto/*) se declarara como copia del home. Cada ruta
  // declara el suyo.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${gotham.variable} ${garamond.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
        {META_PIXEL_ID && (
          <>
            <Script id="meta-pixel" strategy="beforeInteractive">
              {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <MetaPixelTracker />
          </>
        )}
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <CartDrawer />
        <ToastContainer />
        <WhatsAppFAB />
      </body>
    </html>
  );
}
