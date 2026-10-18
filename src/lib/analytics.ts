/**
 * Science Orbit Forum — Web Analytics & Conversion Tracking Service.
 *
 * Integrates Google Analytics 4 (GA4) with client-side SPA routing (TanStack Router).
 * Tracks page transitions, interaction events (paper submission, membership, donations, downloads),
 * and provides diagnostic tools for verifying analytics health.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    __SOF_ANALYTICS_INITIALIZED__?: boolean;
    __SOF_ANALYTICS_EVENTS__?: Array<{ time: string; event: string; params: any }>;
  }
}

// Default or environment-provided GA4 Measurement ID
const GA_MEASUREMENT_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-QPCHQGZ05X'
).trim();

let isInitialized = false;

/**
 * Initializes Google Analytics 4 dynamically and safely.
 */
export function initAnalytics(measurementId: string = GA_MEASUREMENT_ID): boolean {
  if (typeof window === 'undefined') return false;

  const id = (measurementId || GA_MEASUREMENT_ID).trim();

  // If already initialized with this ID
  if (window.__SOF_ANALYTICS_INITIALIZED__) {
    return true;
  }

  window.dataLayer = window.dataLayer || [];
  window.__SOF_ANALYTICS_EVENTS__ = window.__SOF_ANALYTICS_EVENTS__ || [];

  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  if (!id) {
    if (import.meta.env.DEV) {
      console.info(
        '[Analytics: Dev Mode] No VITE_GA_MEASUREMENT_ID specified in .env. Events are tracked locally in window.__SOF_ANALYTICS_EVENTS__.'
      );
    }
    window.__SOF_ANALYTICS_INITIALIZED__ = true;
    isInitialized = true;
    return false;
  }

  try {
    // Only inject script tag if not already on the page
    const scriptId = 'google-analytics-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);
    }

    // Configure GA
    window.gtag('js', new Date());
    // Disable default auto page_view because TanStack Router dispatches virtual route views
    window.gtag('config', id, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure',
    });

    window.__SOF_ANALYTICS_INITIALIZED__ = true;
    isInitialized = true;

    if (import.meta.env.DEV) {
      console.info(`[Analytics] Successfully initialized Google Analytics 4 with ID: ${id}`);
    }

    return true;
  } catch (err) {
    console.error('[Analytics] Initialization failed:', err);
    return false;
  }
}

/**
 * Dispatches a virtual pageview event to Google Analytics on SPA route transitions.
 */
export function trackPageView(pagePath: string, pageTitle?: string) {
  if (typeof window === 'undefined') return;

  const title = pageTitle || document.title;
  const location = window.location.href;
  const timestamp = new Date().toISOString();

  // Log in internal debug queue
  window.__SOF_ANALYTICS_EVENTS__ = window.__SOF_ANALYTICS_EVENTS__ || [];
  window.__SOF_ANALYTICS_EVENTS__.push({
    time: timestamp,
    event: 'page_view',
    params: { page_path: pagePath, page_title: title, page_location: location },
  });

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: title,
      page_location: location,
    });
  }

  // Microsoft Clarity virtual page tracking
  if (typeof window.clarity === 'function') {
    window.clarity('set', 'page', pagePath);
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics: PageView] ${pagePath} — "${title}"`);
  }
}

/**
 * Tracks custom conversion and interaction events (abstract submissions, downloads, CTA clicks).
 */
export function trackEvent(
  action: string,
  category: string = 'engagement',
  label?: string,
  value?: number,
  customParams?: Record<string, any>
) {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    event_category: category,
    event_label: label,
    value: value,
    ...customParams,
  };

  window.__SOF_ANALYTICS_EVENTS__ = window.__SOF_ANALYTICS_EVENTS__ || [];
  window.__SOF_ANALYTICS_EVENTS__.push({
    time: new Date().toISOString(),
    event: action,
    params: eventPayload,
  });

  if (window.gtag) {
    window.gtag('event', action, eventPayload);
  }

  // Microsoft Clarity custom event tagging
  if (typeof window.clarity === 'function') {
    window.clarity('event', action);
  }

  if (import.meta.env.DEV) {
    console.debug(`[Analytics: Event] ${action} (${category}):`, eventPayload);
  }
}

/**
 * Helper shortcuts for primary Science Orbit Forum conversions.
 */
export const Analytics = {
  // ICRAST Abstract Submissions
  trackIcrastSubmission: (status: 'opened' | 'submitted' | 'failed') => {
    trackEvent('icrast_submission', 'conversion', status);
  },

  // Membership Application Form
  trackMembershipApplication: (status: 'viewed' | 'submitted') => {
    trackEvent('membership_application', 'conversion', status);
  },

  // Brochure & Document Downloads
  trackDownload: (fileName: string, fileType: string = 'pdf') => {
    trackEvent('file_download', 'download', fileName, undefined, {
      file_name: fileName,
      file_extension: fileType,
    });
  },

  // External Links (Google Form, Social Links, University Partner)
  trackOutboundClick: (url: string, targetName: string) => {
    trackEvent('outbound_click', 'engagement', targetName, undefined, {
      destination_url: url,
    });
  },

  // Donation / Funding Support interest
  trackDonationInterest: (amount?: string | number) => {
    trackEvent('donation_interest', 'conversion', 'Donate CTA Clicked', typeof amount === 'number' ? amount : undefined);
  },
};
