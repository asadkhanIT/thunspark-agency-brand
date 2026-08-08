declare global {
  interface Window {
    dataLayer: unknown[];
  }
}

const measurementId = import.meta.env
  .VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY as string | undefined;

export const CONSENT_STORAGE_KEY = "thunspark_cookie_consent";
export type ConsentValue = "accepted" | "rejected";

let initialized = false;

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* storage unavailable */
  }
}

export function hasAnalyticsConsent() {
  return getStoredConsent() === "accepted";
}

export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

/** Loads gtag.js. Only call this once the user has accepted cookies. */
export function initAnalytics() {
  if (initialized || typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (!measurementId) {
    console.warn("Google Analytics measurement ID is not configured.");
    return;
  }
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false, anonymize_ip: true });
}

export function trackPageView(path: string) {
  if (!measurementId || !initialized || !hasAnalyticsConsent()) return;
  gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!measurementId || !initialized || !hasAnalyticsConsent()) return;
  gtag("event", name, params ?? {});
}
