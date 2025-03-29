import React from "react";
import { motion } from "framer-motion";
import { BookOpen, User } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Globe, BookOpen, User } from 'lucide-react';

// Language interface
// interface Language {
//   code: string;
//   name: string;
//   flag: string;
// }

const Home: React.FC = () => {
  // Sample languages data
  //   const languages: Language[] = [
  //     { code: 'en', name: 'ENGLISH', flag: '🇺🇸' },
  //     { code: 'es', name: 'SPANISH', flag: '🇪🇸' },
  //     { code: 'fr', name: 'FRENCH', flag: '🇫🇷' },
  //     { code: 'de', name: 'GERMAN', flag: '🇩🇪' },
  //     { code: 'it', name: 'ITALIAN', flag: '🇮🇹' },
  //     { code: 'pt', name: 'PORTUGUESE', flag: '🇧🇷' },
  //     { code: 'nl', name: 'DUTCH', flag: '🇳🇱' },
  //   ];

//   const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const navigate= useNavigate()

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-5 flex flex-col items-center justify-around min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col items-center md:justify-between w-full mb-8 md:mb-16">
          {/* Animated Mascot */}
          <motion.div
            className="w-64 md:w-72 mb-6 md:mb-0"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="100%" height="100%" viewBox="0 0 300 300">
              <motion.circle
                cx="150"
                cy="150"
                r="60"
                fill="#8BE75A"
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  repeatType: "reverse",
                }}
              />
              <circle cx="130" cy="130" r="15" fill="white" />
              <motion.circle
                cx="130"
                cy="130"
                r="7"
                fill="black"
                animate={{
                  y: [0, 2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
              />
              <circle cx="170" cy="130" r="15" fill="white" />
              <motion.circle
                cx="170"
                cy="130"
                r="7"
                fill="black"
                animate={{
                  y: [0, 2, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  repeatType: "reverse",
                }}
              />
              <motion.ellipse
                cx="150"
                cy="170"
                rx="15"
                ry="10"
                fill="#FF7979"
                animate={{
                  ry: [10, 8, 10],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  repeatType: "reverse",
                }}
              />
            </svg>
          </motion.div>

          {/* Content */}
          <div className="flex flex-col items-center">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-gray-700 max-w-xs md:max-w-lg text-center leading-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The free, fun, and effective way to learn a language!
            </motion.h1>

            {/* Buttons */}
            <div className="flex flex-col w-full gap-3">
              {/* <motion.button
                className={`py-2 sm:py-4 px-3 sm:px-4 rounded-xl font-bold text-white border-b-4 border-green-700 text-xs sm:text-sm md:text-base ${
                  hoveredButton === "start" ? "bg-green-500" : "bg-green-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredButton("start")}
                onMouseLeave={() => setHoveredButton(null)}
              >
              </motion.button> */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    className="button-30-purple flex items-center justify-center"
                    role="button"
                    onClick={()=>{navigate('/register')}}
                  >
                  <BookOpen size={16} className="sm:w-5 mx-2 sm:h-5" />
                    GET STARTED
                  </button>
                </div>

              {/* <motion.button
                className={`py-2 sm:py-4 px-3 sm:px-4 rounded-xl font-bold text-blue-500 border-2 border-gray-200 text-xs sm:text-sm md:text-base ${
                  hoveredButton === "account" ? "bg-gray-100" : "bg-white"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredButton("account")}
                onMouseLeave={() => setHoveredButton(null)}
              >
              </motion.button> */}
                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    className="button-30-default flex items-center justify-center"
                    role="button"
                    onClick={()=>{navigate('/login')}}
                  >
                  <User size={16} className="sm:w-5 mx-2 sm:h-5" />
                    I ALREADY HAVE AN ACCOUNT
                  </button>
                </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        {/* <motion.div 
        className="flex justify-between items-center w-full mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      >
        <button title='left' className="text-gray-400 hover:text-gray-600">
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex overflow-x-auto gap-4 py-2 px-2 scrollbar-hide md:justify-center">
          {languages.map((lang) => (
            <motion.div 
              key={lang.code} 
              className="flex items-center gap-2 text-gray-600 whitespace-nowrap cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="text-sm">{lang.name}</span>
            </motion.div>
          ))}
        </div>
        
        <button title='right' className="text-gray-400 hover:text-gray-600">
          <ChevronRight size={24} />
        </button>
      </motion.div> */}
      </div>
    </>
  );
};

export default Home;
