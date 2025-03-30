// src/data.ts
import { Theme, Unit } from '../Types/types';

// --- Themes ---
// Replace with your actual image URLs
const hogwartsTheme: Theme = {
  name: 'Hogwarts Great Hall',
  backgroundImage: 'url("/images/hogwarts-great-hall.jpg")', // Example path
  primaryColor: 'indigo-800', // Deep blue/purple
  secondaryColor: 'yellow-400', // Gold accents
  textColor: 'white',
  nodeBackgroundColor: 'gray-600',
  nodeActiveColor: 'yellow-500', // Active nodes stand out
  nodeCompletedColor: 'green-600', // Completed nodes
};

const forbiddenForestTheme: Theme = {
  name: 'Forbidden Forest',
  backgroundImage: 'url("/images/forbidden-forest.jpg")', // Example path
  primaryColor: 'emerald-900', // Dark green
  secondaryColor: 'lime-400', // Eerie glow
  textColor: 'gray-200',
  nodeBackgroundColor: 'gray-700',
  nodeActiveColor: 'lime-500',
  nodeCompletedColor: 'teal-600',
};

const diagonAlleyTheme: Theme = {
    name: 'Diagon Alley',
    backgroundImage: 'url("/images/diagon-alley.jpg")', // Example path
    primaryColor: 'amber-800', // Warm brown bricks
    secondaryColor: 'red-600', // Shop signs
    textColor: 'white', // Or maybe a dark text on lighter areas
    nodeBackgroundColor: 'stone-600',
    nodeActiveColor: 'red-700',
    nodeCompletedColor: 'orange-500',
};


// --- Units ---
export const units: Unit[] = [
  {
    id: 'unit-1',
    title: 'Charms Basics - Level 1',
    theme: hogwartsTheme,
    levels: [
      { id: 101, type: 'start', status: 'active', title: 'Start Charms' },
      { id: 102, type: 'lesson', status: 'locked', title: 'Lumos' },
      { id: 103, type: 'lesson', status: 'locked', title: 'Wingardium Leviosa' },
      { id: 104, type: 'chest', status: 'locked', title: 'Reward: Chocolate Frog' },
      { id: 105, type: 'trophy', status: 'locked', title: 'Unit 1 Complete' },
    ],
  },
  {
    id: 'unit-2',
    title: 'Exploring the Grounds',
    theme: forbiddenForestTheme,
    levels: [
      // Assuming Unit 1 completion unlocks this 'jump'
      { id: 201, type: 'jump', status: 'active', title: 'Venture Out' },
      { id: 202, type: 'lesson', status: 'locked', title: 'Identify Magical Creatures' },
      { id: 203, type: 'lesson', status: 'locked', title: 'Navigate the Forest' },
      { id: 204, type: 'chest', status: 'locked', title: 'Reward: Bezoar' },
      { id: 205, type: 'trophy', status: 'locked', title: 'Unit 2 Complete' },
    ],
  },
    {
    id: 'unit-3',
    title: 'Shopping Spree',
    theme: diagonAlleyTheme,
    levels: [
      { id: 301, type: 'jump', status: 'active', title: 'Enter Diagon Alley' },
      { id: 302, type: 'lesson', status: 'locked', title: 'Visit Ollivanders' },
      { id: 303, type: 'lesson', status: 'locked', title: 'Flourish and Blotts' },
      { id: 304, type: 'chest', status: 'locked', title: 'Reward: Galleons' },
      { id: 305, type: 'trophy', status: 'locked', title: 'Unit 3 Complete' },
    ],
  },
  // Add more units as needed
];