import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/context';

interface GACHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function GACHeader({ searchQuery, onSearchChange }: GACHeaderProps) {
  const { t, language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3 text-xl font-normal text-gray-900 hover:text-gray-700 transition-colors">
              <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
              <span>{t('siteTitle')}</span>
            </Link>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="切换语言"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
