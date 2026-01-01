import { useState, useMemo } from 'react';
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

  // Group styles by letter for A-Z view
  const groupedStyles = useMemo(() => {
    return groupStylesByLetter(filteredStyles);
  }, [filteredStyles]);

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

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(currentStylesList.length / ITEMS_PER_PAGE);

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
              <AllGrid styles={paginatedStyles} onImageClick={handleImageClick} />
            ) : (
              <AZGrid 
                groupedStyles={paginatedGroupedStyles} 
                selectedLetter={selectedLetter}
                onImageClick={handleImageClick}
              />
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 py-8 mt-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-gray-600 font-medium">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
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
