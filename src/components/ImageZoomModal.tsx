import { useEffect } from 'react';
import type { Style } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface ImageZoomModalProps {
  style: Style | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoomModal({ style, isOpen, onClose }: ImageZoomModalProps) {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !style) return null;

  // Generate fallback URLs
  const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(style.imageUrl)}`;
  const fallbacks = [wsrvUrl, style.imageUrl];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Zoomed image */}
        <div className="relative w-full h-full flex items-center justify-center cursor-zoom-out">
          <ImageWithFallback
            src={style.imageUrl}
            fallbackSrcs={fallbacks}
            alt={style.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
