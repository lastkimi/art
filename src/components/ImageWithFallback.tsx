import { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrcs?: string[];
}

export function ImageWithFallback({ src, fallbackSrcs = [], className, alt, ...props }: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attemptIndex, setAttemptIndex] = useState(-1); // -1 means using initial src
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setAttemptIndex(-1);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    const nextIndex = attemptIndex + 1;
    if (fallbackSrcs && nextIndex < fallbackSrcs.length) {
      setAttemptIndex(nextIndex);
      setCurrentSrc(fallbackSrcs[nextIndex]);
    } else {
      setHasError(true);
      if (props.onError) {
        // @ts-ignore
        props.onError();
      }
    }
  };

  const handleLoad = (e: any) => {
    setIsLoaded(true);
    if (props.onLoad) {
      props.onLoad(e);
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <svg
          className="w-1/3 h-1/3"
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
    );
  }

  return (
    <>
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`} />
      )}
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
