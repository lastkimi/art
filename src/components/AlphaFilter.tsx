import { useI18n } from '../i18n/context';

interface AlphaFilterProps {
  availableLetters: string[];
  selectedLetter: string | null;
  onLetterSelect: (letter: string | null) => void;
}

export function AlphaFilter({ availableLetters, selectedLetter, onLetterSelect }: AlphaFilterProps) {
  const { t } = useI18n();
  
  // All letters from A to Z
  const allLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
  
  return (
    <div className="sticky top-[73px] z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          <button
            onClick={() => onLetterSelect(null)}
            className={`px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
              selectedLetter === null
                ? 'text-gray-900 bg-gray-100 rounded-full'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('all')}
          </button>
          {allLetters.map((letter) => {
            const isAvailable = availableLetters.includes(letter);
            const isSelected = selectedLetter === letter;
            
            return (
              <button
                key={letter}
                onClick={() => isAvailable && onLetterSelect(letter)}
                disabled={!isAvailable}
                className={`px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'text-gray-900 bg-gray-100 rounded-full'
                    : isAvailable
                    ? 'text-gray-600 hover:text-gray-900'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {letter}
              </button>
            );
          })}
          {availableLetters.includes('#') && (
            <button
              onClick={() => onLetterSelect('#')}
              className={`px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
                selectedLetter === '#'
                  ? 'text-gray-900 bg-gray-100 rounded-full'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              #
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
