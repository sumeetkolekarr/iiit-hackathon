export type LevelType = 'start' | 'lesson' | 'chest' | 'trophy' | 'jump';
export type LevelStatus = 'locked' | 'active' | 'completed';

export interface Level {
  sub_level(id: string | number, sub_level: any): void;
  id: string | number;
  type: LevelType;
  status: LevelStatus;
  title?: string; // Optional: for tooltips or labels
}

export interface Theme {
  name: string;
  backgroundImage: string;
  primaryColor: string; // Tailwind color name (e.g., 'blue-700')
  secondaryColor: string; // e.g. 'yellow-400' for highlights
  textColor: string; // e.g. 'white' or 'gray-900'
  nodeBackgroundColor: string; // Base for inactive/locked nodes
  nodeActiveColor: string; // Color for the active node
  nodeCompletedColor: string; // Color for completed nodes
}

export interface Unit {
  id: string;
  title: string;
  theme: Theme;
  levels: Level[];
}