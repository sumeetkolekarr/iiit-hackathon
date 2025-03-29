import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, User, Loader2 } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        // Replace this with your actual auth check
        // For example: const authResponse = await authService.checkAuth();
        // This is a placeholder implementation
        const token = localStorage.getItem("auth_token");
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleAccountAction = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Checking login status...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-5 flex flex-col items-center justify-around min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col items-center md:justify-between w-full mb-16 md:mb-16">
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
              className="text-2xl md:text-3xl font-bold text-gray-700 max-w-xs md:max-w-lg text-center leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The free, fun, and effective way to learn a language!
            </motion.h1>
            
            <motion.p
              className="text-gray-600 text-center max-w-xs md:max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join millions of learners worldwide and discover the fastest way to learn a new language through interactive lessons and games.
            </motion.p>

            {/* Features Section */}
            {/* <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="bg-blue-100 p-3 rounded-full inline-flex mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Personalized Learning</h3>
                <p className="text-sm text-gray-600">Lessons adapted to your level and learning style</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="bg-green-100 p-3 rounded-full inline-flex mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Daily Practice</h3>
                <p className="text-sm text-gray-600">Short, effective lessons to build a daily habit</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md text-center">
                <div className="bg-purple-100 p-3 rounded-full inline-flex mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Community Support</h3>
                <p className="text-sm text-gray-600">Learn along with millions of other students</p>
              </div>
            </motion.div> */}

            {/* Buttons */}
            <div className="flex flex-col w-full gap-3">
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <motion.button
                  type="button"
                  className="button-30-purple flex items-center justify-center"
                  role="button"
                  onClick={handleGetStarted}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookOpen size={16} className="sm:w-5 mx-2 sm:h-5" />
                  {isLoggedIn ? "CONTINUE LEARNING" : "GET STARTED"}
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <motion.button
                  type="button"
                  className="button-30-default flex items-center justify-center"
                  role="button"
                  onClick={handleAccountAction}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User size={16} className="sm:w-5 mx-2 sm:h-5" />
                  {isLoggedIn ? "MY PROFILE" : "I ALREADY HAVE AN ACCOUNT"}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="w-full bg-gray-50 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Join Our Global Community</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">50M+</p>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">30+</p>
              <p className="text-gray-600">Languages</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">500M+</p>
              <p className="text-gray-600">Lessons Completed</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-green-600">192</p>
              <p className="text-gray-600">Countries</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Home;