import { useState, useEffect } from 'react';
import type { Style, StylesData } from '../types';

export function useStyles() {
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await fetch('/data/styles.json');
        if (!response.ok) {
          throw new Error('Failed to fetch styles');
        }
        const data: StylesData = await response.json();
        setStyles(data.styles);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchStyles();
  }, []);

  return { styles, loading, error };
}
