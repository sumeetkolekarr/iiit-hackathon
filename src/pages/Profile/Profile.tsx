import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Type definitions
interface ProgressStats {
  lessonsTaught: number;
  quizzesCompleted: number;
  phrasesArchived: number;
  regionsExplored: number;
}

interface CardData {
  name: string;
  image: string;
  alt: string;
}

interface CardDataMap {
  [key: string]: CardData;
}

const Profile: React.FC = () => {
  // Constants
  const XP_STORAGE_KEY = 'wizardProfileXP_v2';
  const STATS_STORAGE_KEY = 'wizardProfileStats_v2';
  const SHOWCASE_STORAGE_KEY = 'wizardProfileShowcase_v2';

  const RANK_THRESHOLDS = [
    { xp: 20000, rank: "Keeper of Tongues" },
    { xp: 10000, rank: "Master Linguist" },
    { xp: 5000, rank: "Regional Expert" },
    { xp: 1500, rank: "Language Scholar" },
    { xp: 500, rank: "Adept Speaker" },
    { xp: 100, rank: "Apprentice Translator" },
    { xp: 0, rank: "Novice Linguist" }
  ];

  const DEMO_CARD_DATA: CardDataMap = {
    'cf-card-common': { name: 'C. Frog Card', image: 'c1.jpeg', alt: 'Common Chocolate Frog Card' },
    'bb-sticker': { name: 'B. Bott\'s Sticker', image: 'c2.jpeg', alt: 'Bertie Bott\'s Sticker' },
    'cf-card-rare': { name: 'Rare C.F. Card', image: 'c3.jpeg', alt: 'Rare Chocolate Frog Card' },
    'snitch-sticker': { name: 'Snitch Sticker', image: 'c4.jpeg', alt: 'Golden Snitch Sticker' },
    'map-page': { name: 'Map Page', image: '/api/placeholder/100/80', alt: 'Marauder\'s Map Page' },
    'hogwarts-crest': { name: 'H. Crest Sticker', image: '/api/placeholder/100/80', alt: 'Hogwarts Crest Sticker' }
  };
  
  const DEMO_CARD_IDS = Object.keys(DEMO_CARD_DATA);

  // State
  const [currentXP, setCurrentXP] = useState<number>(250);
  const [progressStats, setProgressStats] = useState<ProgressStats>({
    lessonsTaught: 3,
    quizzesCompleted: 1,
    phrasesArchived: 3,
    regionsExplored: 1
  });
  const [selectedCards, setSelectedCards] = useState<(string | null)[]>([null, null, null, null]);
  const [isXPAnimating, setIsXPAnimating] = useState<boolean>(false);

  // Utility Functions
  const getFromStorage = (key: string, defaultValue: any = null): any => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) return JSON.parse(storedValue);
    } catch (error) {
      console.error(`Error parsing localStorage key "${key}":`, error);
      localStorage.removeItem(key);
    }
    return defaultValue;
  };

  const saveToStorage = (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  };

  const getRank = (xp: number): string => {
    for (const threshold of RANK_THRESHOLDS) {
      if (xp >= threshold.xp) return threshold.rank;
    }
    return RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1].rank;
  };

  // Actions
  const completeQuiz = (): void => {
    const xpGained = 50;
    const phrasesGained = Math.floor(Math.random() * 3) + 1;

    setIsXPAnimating(true);
    
    setCurrentXP(prev => prev + xpGained);
    setProgressStats(prev => ({
      ...prev,
      quizzesCompleted: prev.quizzesCompleted + 1,
      phrasesArchived: prev.phrasesArchived + phrasesGained
    }));

    setTimeout(() => setIsXPAnimating(false), 600);
  };

  const cycleShowcaseCard = (slotIndex: number): void => {
    if (slotIndex < 0 || slotIndex >= 4 || DEMO_CARD_IDS.length === 0) return;

    setSelectedCards(prev => {
      const newCards = [...prev];
      const currentCardId = prev[slotIndex];
      const availableOptions = [...DEMO_CARD_IDS, null];
      let nextIndex = 0;

      if (currentCardId) {
        const currentIndexInOptions = availableOptions.indexOf(currentCardId);
        if (currentIndexInOptions !== -1) {
          nextIndex = (currentIndexInOptions + 1) % availableOptions.length;
        }
      }

      newCards[slotIndex] = availableOptions[nextIndex];
      return newCards;
    });
  };

  const resetProfile = (): void => {
    if (confirm("Are you sure you want to reset all profile progress (XP, Stats, Showcase)? This cannot be undone.")) {
      setCurrentXP(0);
      setProgressStats({
        lessonsTaught: 3,
        quizzesCompleted: 1,
        phrasesArchived: 3,
        regionsExplored: 1
      });
      setSelectedCards([null, null, null, null]);
    }
  };

  // Load and Save Effect
  useEffect(() => {
    // Load data on component mount
    const storedXP = getFromStorage(XP_STORAGE_KEY, 0);
    setCurrentXP(!isNaN(parseInt(storedXP)) ? parseInt(storedXP) : 250);

    const defaultStats = { lessonsTaught: 3, quizzesCompleted: 1, phrasesArchived: 3, regionsExplored: 1 };
    const storedStats = getFromStorage(STATS_STORAGE_KEY, defaultStats);
    const validatedStats = { ...defaultStats };
    
    // Basic validation
    for (const key in storedStats) {
      if (key in defaultStats && typeof storedStats[key] === 'number' && !isNaN(storedStats[key])) {
        validatedStats[key as keyof ProgressStats] = storedStats[key];
      }
    }
    setProgressStats(validatedStats);

    const defaultCards = [null, null, null, null];
    const storedCards = getFromStorage(SHOWCASE_STORAGE_KEY, defaultCards);
    if (Array.isArray(storedCards) && storedCards.length === 4) {
      setSelectedCards(storedCards);
    } else {
      setSelectedCards(defaultCards);
    }
  }, []);

  // Save data when state changes
  useEffect(() => {
    saveToStorage(XP_STORAGE_KEY, currentXP);
    saveToStorage(STATS_STORAGE_KEY, progressStats);
    saveToStorage(SHOWCASE_STORAGE_KEY, selectedCards);
  }, [currentXP, progressStats, selectedCards]);

  return (
    <div className="min-h-screen bg-stone-800 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-fixed p-4 md:p-5 font-['MedievalSharp']">
      {/* Main Profile Container */}
      <div className="max-w-6xl mx-auto my-5 flex flex-wrap bg-[rgba(245,245,220,0.85)] border-4 border-red-900 rounded-lg shadow-2xl overflow-hidden">
        
        {/* Left Panel */}
        <div className="flex-1 min-w-[300px] border-r-2 border-red-900 md:border-r-2 md:border-b-0 sm:border-r-0 sm:border-b-2">
          {/* Banner & Profile Pic */}
          <div className="h-44 bg-[url('/api/placeholder/800/300')] bg-cover bg-center relative border-b-3 border-yellow-600">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <img 
                src="car2.jpeg" 
                alt="Player Avatar" 
                className="w-24 h-24 rounded-full border-4 border-yellow-600 bg-[#f5f5dc] shadow-md object-cover"
              />
            </motion.div>
          </div>

          {/* User Info */}
          <div className="pt-16 pb-5 px-5 text-center border-b border-gray-200">
            <motion.h1 
              className="font-['Cinzel_Decorative'] text-3xl md:text-4xl text-red-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Sumeet Kolekarr
            </motion.h1>
            <p className="text-lg text-gray-700">
              <i className="fas fa-map-marker-alt text-red-900 mr-1"></i> Chosen Region: Maharashtra
            </p>
            <p className="italic text-gray-600 mt-2">"Jai Maharashtra"</p>
          </div>

          {/* Main Stats */}
          <div className="p-5 border-b border-gray-200">
            <motion.div 
              className="bg-red-900/10 border border-red-900/20 rounded-md p-3 mb-3 flex justify-between items-center"
              animate={isXPAnimating ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-red-900 font-bold">Magical Aptitude (XP)</span>
              <span className="font-['Cinzel_Decorative'] text-xl font-bold text-yellow-600">{currentXP}</span>
            </motion.div>
            <div className="bg-red-900/10 border border-red-900/20 rounded-md p-3 flex justify-between items-center">
              <span className="text-sm text-red-900 font-bold">Wizarding Rank</span>
              <span className="font-['Cinzel_Decorative'] text-lg font-bold text-blue-900">{getRank(currentXP)}</span>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="p-5">
            <h2 className="font-['Cinzel_Decorative'] text-xl text-center text-red-900 mb-4">Progress Report</h2>
            <ul>
              <li className="flex items-center py-2 border-b border-dashed border-gray-300">
                <i className="fas fa-scroll text-yellow-600 mr-2 w-5 text-center"></i>
                <span className="flex-grow">Lessons Taught:</span>
                <span className="font-bold text-red-900">{progressStats.lessonsTaught}</span>
              </li>
              <li className="flex items-center py-2 border-b border-dashed border-gray-300">
                <i className="fas fa-feather-alt text-yellow-600 mr-2 w-5 text-center"></i>
                <span className="flex-grow">Quizzes Completed:</span>
                <span className="font-bold text-red-900">{progressStats.quizzesCompleted}</span>
              </li>
              <li className="flex items-center py-2 border-b border-dashed border-gray-300">
                <i className="fas fa-language text-yellow-600 mr-2 w-5 text-center"></i>
                <span className="flex-grow">Phrases Archived:</span>
                <span className="font-bold text-red-900">{progressStats.phrasesArchived}</span>
              </li>
              <li className="flex items-center py-2">
                <i className="fas fa-graduation-cap text-yellow-600 mr-2 w-5 text-center"></i>
                <span className="flex-grow">Regions Explored:</span>
                <span className="font-bold text-red-900">{progressStats.regionsExplored}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-[1.5] min-w-[320px] p-6 flex flex-col">
          <div className="text-center mb-6 pb-3 border-b-2 border-yellow-600">
            <h2 className="font-['Cinzel_Decorative'] text-2xl text-red-900 mb-1">Card Showcase</h2>
            <p className="text-sm italic text-gray-600">(Your 4 favorite cards)</p>
          </div>

          {/* Showcase Grid */}
          <div className="grid grid-cols-2 gap-5 max-w-md mx-auto">
            {selectedCards.map((cardId, index) => (
              <motion.div 
                key={`showcase-${index}`}
                className={`
                  relative aspect-4/3 flex flex-col justify-center items-center 
                  ${cardId ? 'bg-white/70' : 'bg-black/5'} 
                  ${cardId ? 'border-2 border-yellow-600' : 'border-2 border-dashed border-yellow-600'} 
                  ${cardId ? 'opacity-100' : 'opacity-70'} 
                  rounded-lg p-4 shadow-md cursor-pointer
                  transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg
                `}
                onClick={() => cycleShowcaseCard(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`card-content-${cardId || 'empty'}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full flex flex-col justify-center items-center"
                  >
                    {cardId && DEMO_CARD_DATA[cardId] ? (
                      <>
                        <img 
                          src={DEMO_CARD_DATA[cardId].image} 
                          alt={DEMO_CARD_DATA[cardId].alt}
                          className="max-w-[90%] max-h-[65%] object-contain mb-2 pointer-events-none" 
                        />
                        <p className="text-sm font-bold text-gray-800 truncate w-full text-center pointer-events-none">
                          {DEMO_CARD_DATA[cardId].name}
                        </p>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus-circle text-4xl text-yellow-600 mb-2 pointer-events-none"></i>
                        <p className="text-sm text-gray-500 pointer-events-none">Select Card</p>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Dev Controls */}
      <div className="text-center mt-5 mb-0 opacity-70">
        <motion.button 
          className="bg-blue-900 text-amber-50 border border-yellow-600 py-1 px-3 mx-1 cursor-pointer rounded text-sm"
          whileHover={{ backgroundColor: '#2a3eb1' }}
          whileTap={{ scale: 0.95 }}
          onClick={completeQuiz}
        >
          Complete Quiz (+50 XP)
        </motion.button>
        <motion.button 
          className="bg-red-900 text-amber-50 border border-yellow-600 py-1 px-3 mx-1 cursor-pointer rounded text-sm"
          whileHover={{ backgroundColor: '#a00001' }}
          whileTap={{ scale: 0.95 }}
          onClick={resetProfile}
        >
          Reset Profile (Test)
        </motion.button>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 w-full p-4">
        <motion.a 
          href="#"
          className="font-['Cinzel_Decorative'] text-yellow-600 no-underline py-2 px-4 bg-gray-900/80 rounded border border-yellow-600"
          whileHover={{ backgroundColor: '#d3a625', color: '#2a2a2a' }}
          transition={{ duration: 0.2 }}
        >
          Return to Flourish & Blotts
        </motion.a>
      </div>
    </div>
  );
};

export default Profile;