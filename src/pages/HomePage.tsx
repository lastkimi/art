import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useStyles } from '../hooks/useStyles';
import { GACHeader } from '../components/GACHeader';
import { CategoryTabs } from '../components/CategoryTabs';
import { AlphaFilter } from '../components/AlphaFilter';
import { AllGrid } from '../components/AllGrid';
import { AZGrid } from '../components/AZGrid';
import { ImageModal } from '../components/ImageModal';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { groupStylesByLetter, getAvailableLetters } from '../utils/grouping';
import { useI18n } from '../i18n/context';
import type { Style } from '../types';
import '../App.css';

export function HomePage() {
  const { styles, loading, error } = useStyles();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'az'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number>(-1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(60);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Filter styles by search query
  const filteredStyles = useMemo(() => {
    if (loading) return [];
    if (!searchQuery.trim()) {
      return styles;
    }

    const query = searchQuery.toLowerCase();
    return styles.filter((style: Style) => {
      const nameMatch = style.name.toLowerCase().includes(query);
      const tagMatch = style.tags.some(tag => tag.toLowerCase().includes(query));
      return nameMatch || tagMatch;
    });
  }, [styles, searchQuery]);

  // Get styles list for current view (All or A-Z)
  const currentStylesList = useMemo(() => {
    if (activeTab === 'all') {
      return filteredStyles;
    } else {
      // For A-Z view, flatten grouped styles
      const grouped = groupStylesByLetter(filteredStyles);
      if (selectedLetter) {
        const group = grouped.find(g => g.letter === selectedLetter);
        return group ? group.styles : [];
      }
      return grouped.flatMap(g => g.styles);
    }
  }, [activeTab, filteredStyles, selectedLetter]);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(60);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [searchQuery, activeTab, selectedLetter]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setVisibleCount((prev) => prev + 60);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "500px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    }
  }, [handleObserver]);

  // Group styles by letter for A-Z view
  const groupedStyles = useMemo(() => {
    return groupStylesByLetter(currentStylesList);
  }, [currentStylesList]);
  
  // Get available letters for filter
  const availableLetters = useMemo(() => {
    return getAvailableLetters(filteredStyles);
  }, [filteredStyles]);

  // Reset selected letter when switching tabs
  const handleTabChange = (tab: 'all' | 'az') => {
    setActiveTab(tab);
    if (tab === 'all') {
      setSelectedLetter(null);
    }
  };

  // Handle random style selection
  const handleRandomStyle = () => {
    if (filteredStyles.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredStyles.length);
    const randomStyle = filteredStyles[randomIndex];
    handleImageClick(randomStyle);
  };

  // Handle image click: navigate to artist page
  const handleImageClick = (style: Style) => {
    const index = currentStylesList.findIndex(s => s.id === style.id);
    if (index !== -1) {
      setSelectedStyleIndex(index);
      setIsModalOpen(true);
    }
  };

  // Handle navigation in modal
  const handleNavigate = (direction: 'prev' | 'next' | number) => {
    if (currentStylesList.length === 0) return;
    
    let newIndex = selectedStyleIndex;
    
    if (typeof direction === 'number') {
      newIndex = direction;
    } else if (direction === 'prev') {
      newIndex = selectedStyleIndex > 0 ? selectedStyleIndex - 1 : currentStylesList.length - 1;
    } else {
      newIndex = selectedStyleIndex < currentStylesList.length - 1 ? selectedStyleIndex + 1 : 0;
    }
    
    // Ensure index is valid
    if (newIndex >= 0 && newIndex < currentStylesList.length) {
      setSelectedStyleIndex(newIndex);
    }
  };

  // Handle page change removed
  // const handlePageChange = ...
  // const totalPages = ...

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedStyleIndex(-1), 300);
  };

  const selectedStyle = selectedStyleIndex >= 0 && selectedStyleIndex < currentStylesList.length
    ? currentStylesList[selectedStyleIndex]
    : null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO
        artistName={selectedStyle?.name}
        artistImageUrl={selectedStyle?.imageUrl}
      />
      <GACHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <CategoryTabs 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onRandom={handleRandomStyle}
      />
      {activeTab === 'az' && (
        <AlphaFilter
          availableLetters={availableLetters}
          selectedLetter={selectedLetter}
          onLetterSelect={setSelectedLetter}
        />
      )}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-red-600 text-xl">{t('errorLoading')}{error.message}</div>
          </div>
        ) : (
          <>
            {activeTab === 'all' ? (
              <>
                <AllGrid styles={currentStylesList.slice(0, visibleCount)} onImageClick={handleImageClick} />
                {visibleCount < currentStylesList.length && (
                  <div ref={loaderRef} className="h-20 flex items-center justify-center p-4">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </>
            ) : (
              <AZGrid 
                groupedStyles={groupedStyles} 
                selectedLetter={selectedLetter}
                onImageClick={handleImageClick}
              />
            )}
          </>
        )}
      </div>
      <Footer />
      <ImageModal
        style={selectedStyle}
        stylesList={currentStylesList}
        currentIndex={selectedStyleIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
