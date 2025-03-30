// src/components/LevelNode.tsx
import React from 'react';
import { Level, Theme } from '../../Types/types';

// --- Simple Icon Components (Replace with actual SVGs) ---
const StarIcon = () => <span className="text-xl">⭐</span>;
const ChestIcon = () => <span className="text-3xl">🎁</span>;
const TrophyIcon = () => <span className="text-2xl">🏆</span>;
const StartIcon = () => <span className="text-xl">▶️</span>; // Or 'START' text
const JumpIcon = () => <span className="text-2xl">⚡</span>; // Jump Here icon

interface LevelNodeProps {
  level: Level;
  theme: Theme;
  onLevelClick: (levelId: string | number) => void;
}

const LevelNode: React.FC<LevelNodeProps> = ({ level, theme, onLevelClick }) => {
  const { type, status, id } = level;

  const getStatusClasses = (): string => {
    switch (status) {
      case 'locked':
        return `bg-${theme.nodeBackgroundColor} opacity-60 cursor-not-allowed`;
      case 'active':
        // Use theme's active color. Ensure Tailwind recognizes these classes.
        // You might need to safelist them in tailwind.config.js if dynamically generated.
        // For simplicity, we assume the color names exist in Tailwind's default palette.
        return `bg-${theme.nodeActiveColor} cursor-pointer hover:scale-110 transition-transform animate-pulse`;
      case 'completed':
        return `bg-${theme.nodeCompletedColor} cursor-pointer opacity-80`; // Or 'cursor-default' if completed means non-interactive
      default:
        return `bg-${theme.nodeBackgroundColor}`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'start': return <StartIcon />;
      case 'lesson': return <StarIcon />;
      case 'chest': return <ChestIcon />;
      case 'trophy': return <TrophyIcon />;
      case 'jump': return <JumpIcon />;
      default: return null;
    }
  };

  const handleClick = () => {
    if (status === 'active' || status === 'completed') { // Allow clicking active/completed
       console.log(`Attempting to start level: ${id}`);
       onLevelClick(id);
       // Here you would navigate or open the quiz modal/page
       // Example: history.push(`/quiz/${id}`) or setQuizModalOpen(true)
    } else {
        console.log(`Level ${id} is locked.`);
    }
  };

  const baseClasses = `w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                     text-white font-bold shadow-lg relative mb-10 md:mb-16 transition-all duration-300`;

  const statusClasses = getStatusClasses();

  return (
    <div
      className={`${baseClasses} ${statusClasses}`}
      onClick={handleClick}
      role="button" // Accessibility
      aria-label={level.title || `Level ${id} - ${status}`}
      tabIndex={status !== 'locked' ? 0 : -1} // Keyboard accessible if not locked
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }} // Keyboard activation
    >
        {/* Optional: Add a subtle border or inner shadow */}
         <div className="absolute inset-0 rounded-full ring-2 ring-black ring-opacity-20"></div>

       {/* Icon Container */}
        <div className="z-10"> {getIcon()}</div>

       {/* Optional: Add title below node */}
       {level.title && (
         <span className={`absolute -bottom-6 text-xs text-${theme.textColor} opacity-80 whitespace-nowrap`}>
           {level.title}
         </span>
       )}

        {/* You could add connecting line pseudo-elements here if desired */}
         {/* Example (very basic line):
            <div className="absolute top-full left-1/2 w-0.5 h-10 md:h-16 bg-gray-500 -translate-x-1/2 -z-10"></div>
         */}
    </div>
  );
};

export default LevelNode;