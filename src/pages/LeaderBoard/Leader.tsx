import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
}

interface LeaderboardConfig {
  leagueName: string;
  timeRemaining: string;
  promotionZoneSize: number;
  demotionZoneSize: number;
}

interface LeaderboardProps {
  initialData: LeaderboardUser[];
  config: LeaderboardConfig;
  currentUserId: string;
  simulateUpdates?: boolean;
}

const Leader: React.FC<LeaderboardProps> = ({
  initialData,
  config,
  currentUserId,
  simulateUpdates = false,
}) => {
  const [data, setData] = useState<LeaderboardUser[]>([...initialData]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Sort the data by score
  const sortedData = [...data].sort((a, b) => b.score - a.score);
  const totalEntries = sortedData.length;
  const promotionCutoffIndex = config.promotionZoneSize;
  const demotionCutoffIndex = totalEntries - config.demotionZoneSize;

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Simulate score changes
  const simulateScoreChanges = () => {
    const newData = [...data];
    const numberOfChanges = Math.floor(Math.random() * 4) + 1;

    for (let i = 0; i < numberOfChanges; i++) {
      const userIndex = Math.floor(Math.random() * newData.length);
      const scoreChange = Math.floor(Math.random() * 101) - 30;
      newData[userIndex].score = Math.max(0, newData[userIndex].score + scoreChange);
    }

    setData(newData);
  };

  // Apply theme from saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  // Simulate updates if enabled
  useEffect(() => {
    if (!simulateUpdates) return;

    const intervalId = setInterval(simulateScoreChanges, 4000);
    return () => clearInterval(intervalId);
  }, [simulateUpdates, data]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  // Whether an item needs a separator before it
  const needsPromotionSeparator = (index: number) => 
    config.promotionZoneSize > 0 && index === promotionCutoffIndex;
  
  const needsDemotionSeparator = (index: number) => 
    config.demotionZoneSize > 0 && 
    index === demotionCutoffIndex && 
    index !== promotionCutoffIndex;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 p-8 transition-colors duration-300">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-800 dark:text-gray-100">
            Leaderboard
          </h1>

          {/* Controls */}
          {/* <div className="mb-6 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </motion.button>
          </div> */}

          {/* Leaderboard */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Leaderboard Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 text-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {config.leagueName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {config.timeRemaining}
              </p>
            </div>

            {/* Leaderboard List */}
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {sortedData.length === 0 ? (
                  <motion.li
                    variants={itemVariants}
                    className="p-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    Leaderboard is currently empty.
                  </motion.li>
                ) : (
                  sortedData.map((entry, index) => {
                    const rank = index + 1;
                    const isCurrentUser = entry.id === currentUserId;
                    const isPromotionZone = rank <= config.promotionZoneSize;
                    const isDemotionZone = rank > demotionCutoffIndex;
                    const isSafeZone = !isPromotionZone && !isDemotionZone;

                    // Determine rank display (medals for top 3)
                    let rankDisplay;
                    if (rank === 1) rankDisplay = "🥇";
                    else if (rank === 2) rankDisplay = "🥈";
                    else if (rank === 3) rankDisplay = "🥉";
                    else rankDisplay = rank;

                    return (
                      <React.Fragment key={entry.id}>
                        {/* Promotion Zone Separator */}
                        {needsPromotionSeparator(index) && (
                          <motion.li 
                            variants={itemVariants}
                            className="relative py-2 text-center"
                          >
                            <div className="absolute inset-x-3 top-1/2 h-px bg-green-300 dark:bg-green-700"></div>
                            <span className="relative inline-block px-2 text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 bg-white dark:bg-gray-800">
                              Promotion Zone
                            </span>
                          </motion.li>
                        )}

                        {/* Demotion Zone Separator */}
                        {needsDemotionSeparator(index) && (
                          <motion.li 
                            variants={itemVariants}
                            className="relative py-2 text-center"
                          >
                            <div className="absolute inset-x-3 top-1/2 h-px bg-red-300 dark:bg-red-700"></div>
                            <span className="relative inline-block px-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 bg-white dark:bg-gray-800">
                              Demotion Zone
                            </span>
                          </motion.li>
                        )}

                        {/* Leaderboard Item */}
                        <motion.li
                          variants={itemVariants}
                          className={`flex items-center p-3 ${
                            isCurrentUser
                              ? "bg-blue-50 dark:bg-blue-900/20 outline outline-2 outline-blue-400 relative z-10"
                              : rank === 1
                              ? "bg-yellow-100 dark:bg-yellow-900/15"
                              : rank === 2
                              ? "bg-gray-200 dark:bg-gray-700/30"
                              : rank === 3
                              ? "bg-orange-100 dark:bg-orange-900/15"
                              : ""
                          }`}
                          whileHover={{ backgroundColor: isCurrentUser ? "rgba(219, 234, 254, 0.8)" : "rgba(243, 244, 246, 0.8)" }}
                          transition={{ duration: 0.15 }}
                        >
                          {/* Rank */}
                          <div 
                            className={`w-8 text-center font-semibold mr-3 flex-shrink-0 ${
                              rank === 1 
                                ? "text-yellow-600 dark:text-yellow-400" 
                                : rank === 2 
                                ? "text-gray-700 dark:text-gray-300" 
                                : rank === 3 
                                ? "text-orange-700 dark:text-orange-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            <span className={rank <= 3 ? "text-xl leading-none inline-block" : ""}>
                              {rankDisplay}
                            </span>
                          </div>

                          {/* User detail container (replacing avatar) */}
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-semibold border-2 border-gray-300 dark:border-gray-600">
                            {entry.name.charAt(0).toUpperCase()}
                          </div>

                          {/* User Details */}
                          <div className="flex-1 flex justify-between items-center min-w-0">
                            <span 
                              className={`font-medium text-gray-800 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis mr-2 ${
                                isCurrentUser ? "font-bold" : ""
                              }`}
                            >
                              {entry.name}
                            </span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                              {entry.score.toLocaleString()} XP
                            </span>
                          </div>
                        </motion.li>
                      </React.Fragment>
                    );
                  })
                )}
              </AnimatePresence>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leader;