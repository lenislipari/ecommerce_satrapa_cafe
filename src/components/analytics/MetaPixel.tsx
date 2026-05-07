"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackPageView } from "@/lib/metaPixel";

export function MetaPixelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView();
  }, [pathname]);

  return null;
}
