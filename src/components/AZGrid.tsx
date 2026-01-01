import type { GroupedStyles } from '../utils/grouping';
import type { Style } from '../types';
import { ArtistCard } from './ArtistCard';
import { useI18n } from '../i18n/context';

interface AZGridProps {
  groupedStyles: GroupedStyles[];
  selectedLetter: string | null;
  onImageClick?: (style: Style) => void;
}

export function AZGrid({ groupedStyles, selectedLetter, onImageClick }: AZGridProps) {
  const { t } = useI18n();

  // Filter groups based on selected letter
  const displayGroups = selectedLetter
    ? groupedStyles.filter((group) => group.letter === selectedLetter)
    : groupedStyles;

  if (displayGroups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {displayGroups.map((group) => (
        <div key={group.letter} id={`letter-${group.letter}`} className="mb-12">
          <h2 className="text-2xl font-normal text-gray-900 mb-6">{group.letter}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {group.styles.map((style) => (
              <ArtistCard key={style.id} style={style} onImageClick={onImageClick} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
