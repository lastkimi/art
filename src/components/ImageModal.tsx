import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Style } from '../types';
import { useI18n } from '../i18n/context';
import { ImageWithFallback } from './ImageWithFallback';
import { ImageZoomModal } from './ImageZoomModal';
import { getArtistUrl } from '../utils/seo';

interface ImageModalProps {
  style: Style | null;
  stylesList: Style[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function ImageModal({ style, stylesList, currentIndex, isOpen, onClose, onNavigate }: ImageModalProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset image index when style changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [style]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy:', err);
    });
  };

  const handleShare = async () => {
    if (!style) return;
    
    const url = window.location.origin + getArtistUrl(style.name);
    const shareData = {
      title: `${style.name} - Art Styles Gallery`,
      text: `Check out ${style.name}'s art style`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      // User cancelled or error occurred
      console.error('Error sharing:', err);
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowZoomModal(true);
  };

  // Handle button visibility: show initially, hide after 3s, show on click
  useEffect(() => {
    if (!isOpen) {
      setShowButtons(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    // Show buttons initially
    setShowButtons(true);

    // Hide after 3 seconds
    const timeout = setTimeout(() => {
      setShowButtons(false);
    }, 3000);
    timeoutRef.current = timeout;

    const handleClick = (e: MouseEvent) => {
      // Only show buttons if clicking on the container (not buttons themselves or image)
      const target = e.target as HTMLElement;
      if (target.closest('button')) return; // Don't show if clicking a button
      if (target.closest('[data-image-container]')) return; // Don't show if clicking image
      
      setShowButtons(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      const newTimeout = setTimeout(() => {
        setShowButtons(false);
      }, 3000);
      timeoutRef.current = newTimeout;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handleClick);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (container) {
        container.removeEventListener('click', handleClick);
      }
    };
  }, [isOpen, currentIndex]);

  // Close on ESC key, navigate on arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        if (showZoomModal) {
          setShowZoomModal(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && !showZoomModal) {
        e.preventDefault();
        onNavigate('prev');
        setShowButtons(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        const newTimeout = setTimeout(() => {
          setShowButtons(false);
        }, 3000);
        timeoutRef.current = newTimeout;
      } else if (e.key === 'ArrowRight' && !showZoomModal) {
        e.preventDefault();
        onNavigate('next');
        setShowButtons(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        const newTimeout = setTimeout(() => {
          setShowButtons(false);
        }, 3000);
        timeoutRef.current = newTimeout;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, onNavigate, showZoomModal]);

  if (!isOpen || !style) return null;

  // Generate fallback URLs
  const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(style.imageUrl)}`;
  const fallbacks = [wsrvUrl, style.imageUrl];

  // Generate example prompts (both languages)
  const examplePrompt1En = t('examplePrompt1En').replace('{name}', style.name);
  const examplePrompt1Zh = t('examplePrompt1Zh').replace('{name}', style.name);
  const examplePrompt2En = t('examplePrompt2En').replace('{name}', style.name);
  const examplePrompt2Zh = t('examplePrompt2Zh').replace('{name}', style.name);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          ref={containerRef}
          className="relative max-w-7xl max-h-[90vh] w-full mx-4 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 ${
              showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            aria-label="关闭"
          >
            <svg
              className="w-6 h-6 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation buttons */}
          {stylesList.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 ${
                  showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Previous"
              >
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-300 ${
                  showButtons ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                aria-label="Next"
              >
                <svg
                  className="w-6 h-6 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Image container - scrollable */}
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative group">
              <div 
                data-image-container
                className="relative w-full h-[50vh] md:h-[65vh] bg-gray-100 flex items-center justify-center flex-shrink-0 cursor-zoom-in group"
                onClick={handleImageClick}
              >
                <ImageWithFallback
                  src={currentImageIndex === 0 ? style.proxyImageUrl : (style.proxyImageUrl2 || style.proxyImageUrl)}
                  fallbackSrcs={currentImageIndex === 0 ? fallbacks : (style.imageUrl2 ? [style.imageUrl2] : fallbacks)}
                  alt={`${style.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain"
                />
              {/* Zoom icon overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                      <svg
                        className="w-8 h-8 text-gray-900"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dots - positioned below image */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1].map((index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentImageIndex === index 
                      ? 'bg-gray-800 scale-110' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Share button below image */}
            <div className="px-6 pt-4 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare();
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                {t('share')}
              </button>
            </div>
            
            {/* Artist name and info - scrollable */}
            <div className="p-6 bg-white overflow-y-auto flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 
                  className="text-2xl font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    const artistUrl = getArtistUrl(style.name);
                    navigate(artistUrl);
                    onClose();
                  }}
                  title="点击查看艺术家页面"
                >
                  {style.name}
                </h2>
                <button
                  onClick={() => handleCopy(style.name)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title={t('nameCopied')}
                >
                  {copied ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {style.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {style.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Example Prompts */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  {t('examplePrompts')}
                </h3>
                <div className="space-y-2">
                  {/* English prompt 1 */}
                  <div 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={() => handleCopy(examplePrompt1En)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 font-mono flex-1">{examplePrompt1En}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(examplePrompt1En);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Chinese prompt 1 */}
                  <div 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={() => handleCopy(examplePrompt1Zh)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 flex-1">{examplePrompt1Zh}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(examplePrompt1Zh);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* English prompt 2 */}
                  <div 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={() => handleCopy(examplePrompt2En)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 font-mono flex-1">{examplePrompt2En}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(examplePrompt2En);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Chinese prompt 2 */}
                  <div 
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={() => handleCopy(examplePrompt2Zh)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-gray-700 flex-1">{examplePrompt2Zh}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(examplePrompt2Zh);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-gray-700 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Counter */}
              {stylesList.length > 1 && (
                <div className="mt-4 text-sm text-gray-500 text-center">
                  {currentIndex + 1} / {stylesList.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      <ImageZoomModal
        style={{
          ...style,
          // Use the currently selected image for the modal
          imageUrl: currentImageIndex === 0 ? style.imageUrl : (style.imageUrl2 || style.imageUrl),
          proxyImageUrl: currentImageIndex === 0 ? style.proxyImageUrl : (style.proxyImageUrl2 || style.proxyImageUrl)
        }}
        isOpen={showZoomModal}
        onClose={() => setShowZoomModal(false)}
      />
    </>
  );
}
