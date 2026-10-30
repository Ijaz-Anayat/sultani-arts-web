"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_ID_KEY = "sultani-arts-analytics-visitor";

function getVisitorId(): string {
  const storedId = window.localStorage.getItem(VISITOR_ID_KEY);
  if (storedId && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(storedId)) {
    return storedId;
  }

  const visitorId = window.crypto.randomUUID();
  window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
  return visitorId;
}

export function PageViewTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) return;
    lastTrackedPath.current = pathname;

    async function trackPageView() {
      try {
        const visitorId = getVisitorId();
        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: pathname, visitorId }),
          keepalive: true,
        });

        if (!response.ok) {
          console.warn("Page view could not be recorded", response.status);
        }
      } catch (error) {
        console.warn("Page view tracking is unavailable", error);
      }
    }

    void trackPageView();
  }, [pathname]);

  return null;
}
