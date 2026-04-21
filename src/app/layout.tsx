import type { Metadata } from "next";
import { Inter, EB_Garamond } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastContainer } from "@/components/toast/Toast";

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
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://satrapacafe.com"),
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
  alternates: {
    canonical: "/",
  },
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
        <Header />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <CartDrawer />
        <ToastContainer />
      </body>
    </html>
  );
}
