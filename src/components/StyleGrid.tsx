import type { Style } from '../types';
import { StyleCard } from './StyleCard';

interface StyleGridProps {
  styles: Style[];
}

export function StyleGrid({ styles }: StyleGridProps) {
  if (styles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-white/70 text-lg">未找到匹配的风格</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {styles.map((style) => (
          <StyleCard key={style.id} style={style} />
        ))}
      </div>
    </div>
  );
}
