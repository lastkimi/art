import { Link } from 'react-router-dom';
import type { Style } from '../types';
import { ImageWithFallback } from './ImageWithFallback';
import { getArtistUrl } from '../utils/seo';

interface ArtistCardProps {
  style: Style;
  onImageClick?: (style: Style) => void;
}

export function ArtistCard({ style, onImageClick }: ArtistCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If onImageClick is provided, use it (for modal)
    if (onImageClick) {
      e.preventDefault();
      // Copy artist name to clipboard
      navigator.clipboard.writeText(style.name).catch((err) => {
        console.error('Failed to copy:', err);
      });
      // Open modal
      onImageClick(style);
    }
    // Otherwise, let the Link handle navigation
  };

  // Generate fallback URLs
  const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(style.imageUrl)}`;
  const fallbacks = [wsrvUrl, style.imageUrl];

  const artistUrl = getArtistUrl(style.name);
  const content = (
    <>
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square card-shadow">
        <ImageWithFallback
          src={style.proxyImageUrl}
          fallbackSrcs={fallbacks}
          alt={style.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-900 line-clamp-1">
        {style.name}
      </h3>
    </>
  );

  // If onImageClick is provided, use div with onClick (for modal)
  // Otherwise, use Link for navigation
  if (onImageClick) {
    return (
      <div className="group cursor-pointer" onClick={handleClick}>
        {content}
      </div>
    );
  }

  return (
    <Link to={artistUrl} className="group block">
      {content}
    </Link>
  );
}
