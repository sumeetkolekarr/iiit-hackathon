import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { units as allUnits } from "../../Data/data";
import {
  Book,
  Home,
  Trophy,
  Scroll,
  ShoppingBag,
  MoreHorizontal,
  Star,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  getAuth, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  DocumentData 
} from "firebase/firestore";

const QuizMap: React.FC = () => {
  // State to track the current unit being viewed
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  // State for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // State for authentication and user data
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  // State to track unlocked levels based on sub_level
  const [unlockedLevel, setUnlockedLevel] = useState(0);
  // Animation trigger for star unlocking
  const [animateUnlock, setAnimateUnlock] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Authentication listener
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        // User is logged in
        setUser(authUser);
        
        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, "users", authUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            
            // Set unlocked level based on sub_level
            // If sub_level is 0, unlock level 1
            // If sub_level is 1, unlock level 2, and so on
            const subLevel = data.sub_level || 0;
            setUnlockedLevel(subLevel + 1);
            
            // Trigger animation after a short delay
            setTimeout(() => {
              setAnimateUnlock(true);
            }, 500);
          } else {
            console.error("No user data found in Firestore");
            setUnlockedLevel(1); // Default to first level
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUnlockedLevel(1); // Default to first level
        }
        
        setLoading(false);
      } else {
        // User is not logged in, redirect to login
        setLoading(false);
        navigate("/login");
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const currentUnit = allUnits[currentUnitIndex];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // This should not normally be reached due to the redirect in useEffect
    navigate("/login");
    return null;
  }

  if (!currentUnit) {
    return <div>No units available or invalid unit index.</div>;
  }

  const { title, levels } = currentUnit;

  // Function to handle clicks on levels
  const handleLevelClick = (levelId: string | number, subLevel?: string) => {
    console.log(`Level ${levelId} clicked in map!`);
    // Navigate to quiz page with level and sublevel info
    navigate(`/quiz`, { 
      state: { 
        levelId, 
        subLevel: subLevel || "default",
        unitId: currentUnit.id,
        userId: user.uid
      } 
    });
  };

  // Function to start the first level
  const handleStart = () => {
    if (levels.length > 0) {
      handleLevelClick(levels[0].id, levels[0].sub_level);
    }
  };

  // Unit navigation functions
  const goToNextUnit = () => {
    if (currentUnitIndex < allUnits.length - 1) {
      setCurrentUnitIndex(currentUnitIndex + 1);
    }
  };

  const goToPreviousUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex(currentUnitIndex - 1);
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Star animation variants
  const starVariants = {
    locked: {
      scale: 1,
      rotate: 0,
      opacity: 0.5,
      fill: "gray",
      stroke: "gray",
    },
    unlocking: {
      scale: [1, 1.5, 1],
      rotate: [0, 360, 0],
      opacity: [0.5, 1, 1],
      fill: ["gray", "#10B981", "#10B981"],
      stroke: ["gray", "white", "white"],
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
    unlocked: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      fill: "#10B981",
      stroke: "white",
    },
  };

  // Navigation items for sidebar
  const navItems = [
    { name: "LEARN", icon: <Home size={20} />, path: "/quizmap" },
    { name: "LEADERBOARDS", icon: <Trophy size={20} />, path: "/leader" },
    { name: "QUESTS", icon: <Scroll size={20} />, path: "/quests" },
    { name: "SHOP", icon: <ShoppingBag size={20} />, path: "/shop" },
    { name: "PROFILE", icon: <Users size={20} />, path: "/profile" },
    { name: "MORE", icon: <MoreHorizontal size={20} />, path: "/more" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white">
      {/* Sidebar Toggle Button - Visible on all devices */}
      <motion.button
        className="fixed top-4 left-4 z-50 p-2 bg-green-500 rounded-full shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar - Toggleable on all devices */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-gray-900 flex-col items-center py-8 border-r border-gray-800 z-40"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="mb-10 pl-14">
              {/* Logo placeholder */}
            </div>

            {/* User info section */}
            {userData && (
              <div className="px-4 py-3 mb-4 bg-gray-800 mx-4 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{userData.displayName || user.email}</p>
                    <p className="text-xs text-gray-400">
                      Level: {userData.level || 1} • Points: {userData.points || 0}
                    </p>
                    <p className="text-xs text-gray-400">
                      Sub Level: {userData.sub_level || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <nav className="w-full mt-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  className="flex items-center p-4 my-2 mx-4 rounded-xl hover:bg-gray-800 cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => navigate(item.path)}
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center mr-4 text-green-500">
                    {item.icon}
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.header
          className="bg-green-500 p-4 flex items-center justify-between"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center ml-10 sm:ml-0">
            <motion.button
              onClick={goToPreviousUnit}
              disabled={currentUnitIndex === 0}
              className={`flex items-center mr-2 ${
                currentUnitIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-80"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* <ChevronLeft size={24} /> */}
            </motion.button>
            <div className="ml-2 md:ml-12">
              <div className="text-sm font-medium text-gray-100">
                SECTION {currentUnitIndex + 1}, UNIT {currentUnitIndex + 1}
              </div>
              <h1 className="text-xl font-bold">{title}</h1>
            </div>
          </div>

          {/* <motion.button
            className="bg-white text-green-500 py-2 px-4 rounded-2xl flex items-center font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Book size={20} className="mr-2" />
            GUIDEBOOK
          </motion.button> */}
        </motion.header>

        {/* Level Path */}
        <motion.main
          className="flex flex-col items-center py-10 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Start button for first level */}
          <motion.div variants={itemVariants} className="mb-6">
            <motion.button
              className="bg-gray-800 text-green-500 font-bold py-2 px-6 rounded-lg mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
            >
              START
            </motion.button>
          </motion.div>

          {/* Level nodes path with animated unlocking stars */}
          {levels.map((level, index) => {
            // Determine if this level should be unlocked
            const isUnlocked = index < unlockedLevel;
            // For levels that should be unlocked and animation is triggered
            const isUnlocking = isUnlocked && animateUnlock && index === unlockedLevel - 1;
            // Animation state based on unlocking status
            const starState = isUnlocking ? "unlocking" : (isUnlocked ? "unlocked" : "locked");
            
            return (
              <motion.div
                key={level.id}
                variants={itemVariants}
                className="relative mb-6"
                onClick={() => isUnlocked && handleLevelClick(level.id, level.sub_level)}
              >
                {/* Path connector (line) */}
                {index < levels.length - 1 && (
                  <motion.div 
                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-16"
                    style={{
                      backgroundColor: index < unlockedLevel - 1 ? "#10B981" : "#374151"
                    }}
                    animate={{
                      backgroundColor: index < unlockedLevel - 1 ? "#10B981" : "#374151"
                    }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                  />
                )}

                {/* Level node */}
                <motion.div
                  className={`w-20 h-20 rounded-full flex items-center justify-center cursor-pointer ${
                    isUnlocked ? "bg-green-500" : "bg-gray-700"
                  }`}
                  whileHover={{ scale: isUnlocked ? 1.1 : 1 }}
                  whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                  animate={{ backgroundColor: isUnlocked ? "#10B981" : "#374151" }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                >
                  <motion.div
                    initial="locked"
                    animate={starState}
                    variants={starVariants}
                  >
                    <Star size={36} />
                  </motion.div>
                </motion.div>
                
                {/* Level number */}
                <motion.div 
                  className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 * index }}
                >
                  Level {index + 1}
                </motion.div>
              </motion.div>
            );
          })}
          
          {/* Unlocked level display */}
          {userData && (
            <motion.div 
              className="mt-6 px-4 py-2 bg-gray-800 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-gray-300">
                Current Progress: <span className="text-green-500 font-bold">Level {unlockedLevel}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Based on your sub_level: {userData.sub_level || 0}
              </p>
            </motion.div>
          )}
        </motion.main>

        {/* Unit Navigation */}
        <motion.footer
          className="mt-auto p-4 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {currentUnitIndex < allUnits.length - 1 && (
            <motion.button
              onClick={goToNextUnit}
              className="py-2 px-6 rounded-lg bg-green-500 text-white font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Unit: {allUnits[currentUnitIndex + 1]?.title} →
            </motion.button>
          )}
        </motion.footer>
      </div>
    </div>
  );
};

export default QuizMap;