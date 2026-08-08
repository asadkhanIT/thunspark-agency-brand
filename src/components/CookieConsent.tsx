import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useEffect, useState } from "react";

import {
  getStoredConsent,
  initAnalytics,
  setStoredConsent,
  trackPageView,
  type ConsentValue,
} from "../lib/analytics";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored === "accepted") {
      initAnalytics();
      trackPageView(window.location.pathname);
    } else if (stored === null) {
      setVisible(true);
    }
  }, []);

  const decide = (value: ConsentValue) => {
    setStoredConsent(value);
    setVisible(false);
    if (value === "accepted") {
      initAnalytics();
      trackPageView(window.location.pathname);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-sm"
        >
          <div className="glass-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Cookie className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold">We use cookies</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  We use analytics cookies to understand how visitors use our site.
                  Nothing is loaded until you say yes.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => decide("accepted")}
                className="flex-1 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition-transform hover:scale-[1.02]"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => decide("rejected")}
                className="flex-1 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
