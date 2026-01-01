import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStyles } from '../hooks/useStyles';
import { SEO } from '../components/SEO';
import { GACHeader } from '../components/GACHeader';
import { ImageModal } from '../components/ImageModal';
import { Footer } from '../components/Footer';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { getArtistUrl, generateSlug } from '../utils/seo';
import { useI18n } from '../i18n/context';
import { useSwipe } from '../hooks/useSwipe';
import type { Style } from '../types';
import './ArtistPage.css';

export function ArtistPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { styles, loading, error } = useStyles();
  const { t } = useI18n();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Swipe handlers for mobile image navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      // Show next image (if available)
      if (currentImageIndex === 0 && (artist?.imageUrl2 || artist?.proxyImageUrl2)) {
        setCurrentImageIndex(1);
      }
    },
    onSwipeRight: () => {
      // Show prev image
      if (currentImageIndex === 1) {
        setCurrentImageIndex(0);
      }
    }
  });

  // Find the artist by slug
  const artist = styles.find((style: Style) => {
    const styleSlug = generateSlug(style.name);
    return styleSlug === slug;
  });

  // Reset current image index when artist changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [artist]);

  // Redirect to homepage if artist not found
  useEffect(() => {
    if (!loading && !artist && slug) {
      // Artist not found, redirect to homepage after a short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 2000);
    }
  }, [loading, artist, slug, navigate]);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = () => {
    // Navigation within modal is not needed for single artist page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600 text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-red-600 text-xl">{t('errorLoading')}{error.message}</div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-gray-600 text-xl mb-4">艺术家未找到</div>
          <div className="text-gray-500 text-sm">正在跳转到首页...</div>
        </div>
      </div>
    );
  }

  // Generate fallback URLs for first image
  const wsrvUrl = `https://wsrv.nl/?url=${encodeURIComponent(artist.imageUrl)}`;
  const fallbacks = [wsrvUrl, artist.imageUrl];
  
  // Generate fallback URLs for second image (if available)
  const wsrvUrl2 = artist.imageUrl2 ? `https://wsrv.nl/?url=${encodeURIComponent(artist.imageUrl2)}` : null;
  const fallbacks2 = artist.imageUrl2 ? [wsrvUrl2!, artist.imageUrl2] : [];

  // Generate example prompts
  const examplePrompt1En = t('examplePrompt1En').replace('{name}', artist.name);
  const examplePrompt1Zh = t('examplePrompt1Zh').replace('{name}', artist.name);
  const examplePrompt2En = t('examplePrompt2En').replace('{name}', artist.name);
  const examplePrompt2Zh = t('examplePrompt2Zh').replace('{name}', artist.name);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        artistName={artist.name}
        artistImageUrl={artist.imageUrl}
        canonicalUrl={getArtistUrl(artist.name)}
      />
      <GACHeader searchQuery="" onSearchChange={() => {}} />
      
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Artist Images - Carousel */}
          <div className="p-4">
            <div className="relative group">
              <div 
                className="relative w-full h-[50vh] md:h-[70vh] bg-gray-100 flex items-center justify-center cursor-zoom-in rounded-lg overflow-hidden touch-pan-y"
                onClick={() => {
                  // Update ImageModal with current image
                  handleImageClick();
                }}
                {...swipeHandlers}
              >
                <ImageWithFallback
                  src={currentImageIndex === 0 ? artist.proxyImageUrl : (artist.proxyImageUrl2 || artist.proxyImageUrl)}
                  fallbackSrcs={currentImageIndex === 0 ? fallbacks : fallbacks2}
                  alt={`${artist.name} - Image ${currentImageIndex + 1}`}
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

              {/* Dots - Hidden on mobile, visible on desktop */}
              <div className="hidden md:flex justify-center gap-2 mt-4">
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
            </div>
          </div>

          {/* Artist Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
              {artist.name}
            </h1>

            {artist.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {artist.tags.map((tag, index) => (
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
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                {t('examplePrompts')}
              </h2>
              <div className="space-y-3">
                {/* English prompt 1 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 font-mono">{examplePrompt1En}</p>
                </div>
                {/* Chinese prompt 1 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{examplePrompt1Zh}</p>
                </div>
                {/* English prompt 2 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 font-mono">{examplePrompt2En}</p>
                </div>
                {/* Chinese prompt 2 */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{examplePrompt2Zh}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Image Modal */}
      <ImageModal
        style={{
          ...artist,
          // Use the currently selected image for the modal
          imageUrl: currentImageIndex === 0 ? artist.imageUrl : (artist.imageUrl2 || artist.imageUrl),
          proxyImageUrl: currentImageIndex === 0 ? artist.proxyImageUrl : (artist.proxyImageUrl2 || artist.proxyImageUrl)
        }}
        stylesList={[artist]}
        currentIndex={0}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
