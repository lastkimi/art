import { useI18n } from '../i18n/context';

interface CategoryTabsProps {
  activeTab: 'all' | 'az';
  onTabChange: (tab: 'all' | 'az') => void;
  onRandom: () => void;
}

export function CategoryTabs({ activeTab, onTabChange, onRandom }: CategoryTabsProps) {
  const { t } = useI18n();

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-8">
          <h2 className="text-3xl font-normal text-gray-900 py-4">{t('artists')}</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('all')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('all')}
            </button>
            <button
              onClick={() => onTabChange('az')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'az'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('az')}
            </button>
            <button
              onClick={onRandom}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t('random')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
