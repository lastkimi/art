import { useState } from 'react';
import type { Style } from '../types';

interface StyleCardProps {
  style: Style;
}

export function StyleCard({ style }: StyleCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prompt = `in the style of ${style.name}`;
    navigator.clipboard.writeText(prompt);
    // Could add a toast notification here
  };

  return (
    <div className="group relative overflow-hidden rounded-lg glass hover:glass-strong transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="aspect-square relative overflow-hidden bg-slate-800/50">
        {!imageError ? (
          <img
            src={style.proxyImageUrl}
            alt={style.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-700/50 animate-pulse" />
        )}
      </div>
      
      {/* Glass overlay with style name */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm md:text-base truncate flex-1">
            {style.name}
          </h3>
          <button
            onClick={handleCopyPrompt}
            className="ml-2 p-2 glass rounded-md hover:glass-strong transition-all opacity-0 group-hover:opacity-100"
            title="复制提示词"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        {style.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {style.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs glass rounded-full text-white/80"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
