export interface Category {
  id: string;
  name: string;
  slug: string;
  iconKey?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryWithStats extends Category {
  tutorCount: number;
}

// Valid icon keys for category UI display
export const ICON_KEYS = [
  'code',
  'chart',
  'palette',
  'book',
  'globe',
  'flask',
  'music',
  'briefcase',
] as const;

export type IconKey = typeof ICON_KEYS[number];
