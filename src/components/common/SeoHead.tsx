import React, { useEffect } from 'react';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
  ogType?: string;
  structuredData?: object;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalUrl,
  keywords,
  ogType = 'website',
  structuredData,
}) => {
  useEffect(() => {
    document.title = `${title} | ReadTriangle`;

    // Meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', canonicalUrl);
    }
  }, [title, description, canonicalUrl]);

  return null;
};
