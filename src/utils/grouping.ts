import type { Style } from '../types';

export interface GroupedStyles {
  letter: string;
  styles: Style[];
}

/**
 * Groups styles by the first letter of their name
 * @param styles Array of style objects
 * @returns Array of grouped styles, sorted by letter
 */
export function groupStylesByLetter(styles: Style[]): GroupedStyles[] {
  const groups: Record<string, Style[]> = {};

  styles.forEach((style) => {
    // Get first character, uppercase it
    const firstChar = style.name.charAt(0).toUpperCase();
    
    // If it's not a letter, group under '#'
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
    
    if (!groups[letter]) {
      groups[letter] = [];
    }
    groups[letter].push(style);
  });

  // Convert to array and sort
  const result: GroupedStyles[] = Object.keys(groups)
    .sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    })
    .map((letter) => ({
      letter,
      styles: groups[letter].sort((a, b) => a.name.localeCompare(b.name)),
    }));

  return result;
}

/**
 * Gets all available letters from styles
 * @param styles Array of style objects
 * @returns Array of available letters
 */
export function getAvailableLetters(styles: Style[]): string[] {
  const letters = new Set<string>();
  
  styles.forEach((style) => {
    const firstChar = style.name.charAt(0).toUpperCase();
    const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
    letters.add(letter);
  });

  return Array.from(letters).sort((a, b) => {
    if (a === '#') return 1;
    if (b === '#') return -1;
    return a.localeCompare(b);
  });
}
