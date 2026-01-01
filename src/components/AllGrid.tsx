import type { Style } from '../types';
import { ArtistCard } from './ArtistCard';
import { useI18n } from '../i18n/context';

interface AllGridProps {
  styles: Style[];
  onImageClick?: (style: Style) => void;
}

export function AllGrid({ styles, onImageClick }: AllGridProps) {
  const { t } = useI18n();

  if (styles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">{t('noResults')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {styles.map((style) => (
          <ArtistCard key={style.id} style={style} onImageClick={onImageClick} />
        ))}
      </div>
    </div>
  );
}
