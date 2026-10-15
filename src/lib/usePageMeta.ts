import { useEffect } from 'react';

export type FaviconType = 'main' | 'icrast' | 'festival';

const FAVICONS: Record<FaviconType, { href: string; type: string }> = {
  main: { href: '/logo.png', type: 'image/png' },
  icrast: { href: '/icrast-favicon.png', type: 'image/png' },
  festival: { href: '/festival-favicon.png', type: 'image/png' },
};

/**
 * Updates the browser favicon dynamically across subdomains and routes.
 */
export function setFavicon(faviconType: FaviconType) {
  if (typeof document === 'undefined') return;

  const config = FAVICONS[faviconType] || FAVICONS.main;

  const existingLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
  if (existingLinks.length > 0) {
    existingLinks.forEach((link) => {
      link.href = config.href;
      link.type = config.type;
    });
  } else {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = config.href;
    link.type = config.type;
    document.head.appendChild(link);
  }
}

/**
 * Updates document.title safely.
 */
export function setDocumentTitle(title: string) {
  if (typeof document === 'undefined') return;
  document.title = title;
}

/**
 * React hook for pages that want to set their own custom page title and favicon.
 */
export function usePageMeta({
  title,
  favicon,
}: {
  title: string;
  favicon?: FaviconType;
}) {
  useEffect(() => {
    setDocumentTitle(title);
    if (favicon) {
      setFavicon(favicon);
    }
  }, [title, favicon]);
}
