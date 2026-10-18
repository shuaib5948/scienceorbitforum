import { useEffect } from 'react';
import { updateSeoHead, type PageSeoConfig } from './seo';

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
 * React hook for pages that want to set custom SEO meta tags, title, and favicon.
 */
export function usePageMeta({
  title,
  favicon,
  seo,
}: {
  title: string;
  favicon?: FaviconType;
  seo?: Partial<PageSeoConfig>;
}) {
  useEffect(() => {
    setDocumentTitle(title);
    if (favicon) {
      setFavicon(favicon);
    }
    if (seo) {
      updateSeoHead({
        title,
        ...seo,
      });
    }
  }, [title, favicon, JSON.stringify(seo)]);
}

export { updateSeoHead, type PageSeoConfig } from './seo';
