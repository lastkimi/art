import { useEffect } from 'react';
import { getArtistUrl } from '../utils/seo';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  artistName?: string;
  artistImageUrl?: string;
}

/**
 * SEO component to manage meta tags and canonical links
 * Follows Google's canonical URL guidelines: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
 */
export function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  artistName,
  artistImageUrl 
}: SEOProps) {
  useEffect(() => {
    // Get base URL (origin)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Determine canonical URL
    let finalCanonicalUrl = canonicalUrl;
    if (!finalCanonicalUrl) {
      if (artistName) {
        finalCanonicalUrl = baseUrl + getArtistUrl(artistName);
      } else {
        finalCanonicalUrl = baseUrl; // Homepage
      }
    } else if (!finalCanonicalUrl.startsWith('http')) {
      // If relative URL, make it absolute
      finalCanonicalUrl = baseUrl + finalCanonicalUrl;
    }

    // Determine title
    let finalTitle = title || '艺术风格画廊 - SDXL Styles Gallery';
    if (artistName && !title) {
      finalTitle = `${artistName} - 艺术风格画廊`;
    }

    // Determine description
    let finalDescription = description;
    if (!finalDescription) {
      if (artistName) {
        finalDescription = `查看 ${artistName} 的艺术风格作品和示例图片。探索 SDXL 艺术风格画廊中的 ${artistName} 风格示例。`;
      } else {
        finalDescription = '探索超过 3000+ 种 SDXL 艺术风格。浏览来自世界各地的艺术家风格，查看示例图片，获取创作灵感。';
      }
    }

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = finalCanonicalUrl;

    // Update title
    document.title = finalTitle;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = finalDescription;

    // Update or create Open Graph tags
    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = finalTitle;

    let ogDescription = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.content = finalDescription;

    let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = finalCanonicalUrl;

    let ogType = document.querySelector('meta[property="og:type"]') as HTMLMetaElement;
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.content = artistName ? 'article' : 'website';

    // Add image if artist image is available
    if (artistImageUrl) {
      let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.content = artistImageUrl;
    }

    // Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]') as HTMLMetaElement;
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.name = 'twitter:card';
      document.head.appendChild(twitterCard);
    }
    twitterCard.content = 'summary_large_image';

    let twitterTitle = document.querySelector('meta[name="twitter:title"]') as HTMLMetaElement;
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.name = 'twitter:title';
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.content = finalTitle;

    let twitterDescription = document.querySelector('meta[name="twitter:description"]') as HTMLMetaElement;
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta');
      twitterDescription.name = 'twitter:description';
      document.head.appendChild(twitterDescription);
    }
    twitterDescription.content = finalDescription;

    if (artistImageUrl) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]') as HTMLMetaElement;
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.name = 'twitter:image';
        document.head.appendChild(twitterImage);
      }
      twitterImage.content = artistImageUrl;
    }
  }, [title, description, canonicalUrl, artistName, artistImageUrl]);

  // This component doesn't render anything
  return null;
}
