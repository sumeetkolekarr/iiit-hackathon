import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, User, Loader2, LayoutDashboard } from "lucide-react";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<{ id?: string | null }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check authentication status
    const checkAuthStatus = async () => {
      try {
        // Replace this with your actual auth check
        // For example: const authResponse = await authService.checkAuth();

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Instead of setting isLoggedIn, set the auth object with id
        // This is a placeholder implementation - replace with your actual auth logic
        const mockAuth = { id: "user123" }; // In a real implementation, this would come from your auth service
        setAuth(mockAuth);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuth({}); // No auth.id will be present on error
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGetStarted = () => {
    if (auth.id) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center bg-[#2E3A4D] min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 size={48} className="animate-spin text-green-600 mb-4" />
          <h2 className="text-xl font-semibold text-white">
            Checking login status...
          </h2>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto p-5 pt-6 flex bg-custom-gradient flex-col items-center justify-around min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col items-center md:justify-between w-full mb-16 md:mb-16">
          <img
            src="home.jpg"
            className="rounded-full mt-12 mb-6"
            width={275}
            alt="HomeImg"
          />

          {/* Content */}
          <div className="flex flex-col items-center">
            <motion.h1
              className="text-2xl md:text-3xl font-bold text-white max-w-xs md:max-w-lg text-center leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Help Harry Potter Journey to India by teaching him your language
              and culture!
            </motion.h1>

            <motion.p
              className="text-white text-center max-w-xs md:max-w-lg mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join millions of players worldwide and discover the rich Indian
              Heritage through Interactive Lessons and Quizzes.
            </motion.p>

            {/* Buttons */}
            <div className="flex flex-col w-full gap-3">
              {/* {auth.id ? (
                // Dashboard button only shown when auth.id is present
                <motion.button
                  type="button"
                  className="button-30-purple flex items-center justify-center"
                  role="button"
                  onClick={handleDashboard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LayoutDashboard size={16} className="sm:w-5 mx-2 sm:h-5" />
                  GO TO DASHBOARD
                </motion.button>
              ) : (
                // Two buttons shown when auth.id is not present
                <div className="flex flex-col w-full gap-3">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      className="button-30-purple flex items-center justify-center"
                      role="button"
                      onClick={handleGetStarted}
                    >
                      <BookOpen size={16} className="sm:w-5 mx-2 sm:h-5" />
                      GET STARTED
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <button
                      type="button"
                      className="button-30-default flex items-center justify-center"
                      role="button"
                      onClick={handleLogin}
                    >
                      <User size={16} className="sm:w-5 mx-2 sm:h-5" />I ALREADY
                      HAVE AN ACCOUNT
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* New Feature Section (like shown in the image) */}
        <div className="w-full max-w-5xl mx-auto pb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Text content - Left side on desktop */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="space-y-6"
              >
                <motion.h2
                  className="text-4xl md:text-5xl font-bold tracking-tight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <span className="text-green-500">free.</span>{" "}
                  <span className="text-green-500">fun.</span>{" "}
                  <span className="text-green-500">effective.</span>
                </motion.h2>

                <motion.div
                  className="text-lg text-gray-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <p>
                    Playing with IndoPedia is fun, and{" "}
                    <span className="text-blue-400">
                      research shows that it works!
                    </span>
                  </p>
                  <p className="mt-2">
                    With quick, bite-sized games, you'll earn points and
                    unlock new levels while gaining real-world communication
                    skills.
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* Illustration - Right side on desktop */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative"
              >
                {/* Phone frame */}
                <motion.div
                  className="relative w-64 md:w-72 h-auto bg-yellow-400 rounded-3xl p-3 border-4 border-yellow-500 shadow-xl"
                  initial={{ y: 10 }}
                  animate={{ y: -10 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3,
                  }}
                >
                  {/* Screen */}
                  <div className="bg-gray-100 rounded-2xl p-4 h-full">
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
                      <motion.div
                        className="h-full bg-green-500 rounded-full w-1/4"
                        initial={{ width: "10%" }}
                        animate={{ width: "30%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                      />
                    </div>

                    {/* Character grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div
                        className="bg-gray-200 rounded-lg p-4 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 bg-blue-400 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        className="bg-gray-200 rounded-lg p-4 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 bg-green-500 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        className="bg-gray-200 rounded-lg p-4 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 bg-orange-400 rounded-full"></div>
                      </motion.div>
                      <motion.div
                        className="bg-gray-200 rounded-lg p-4 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-12 h-12 bg-amber-700 rounded-full"></div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Character */}
                <motion.div
                  className="absolute -bottom-16 -left-16 w-32 h-32"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 5 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                >
                  <div className="w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center relative">
                    <div className="w-10 h-10 bg-green-500 rounded-md absolute -bottom-10"></div>
                    <div className="w-8 h-3 bg-gray-800 rounded-full absolute top-4"></div>
                    <div className="w-8 h-3 bg-gray-800 rounded-full absolute bottom-2"></div>
                  </div>
                </motion.div>

                {/* Number One Badge */}
                <motion.div
                  className="absolute -bottom-12 left-24 bg-yellow-300 px-4 py-1 rounded-lg text-lg font-bold"
                  initial={{ y: 0 }}
                  animate={{ y: -5 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                  }}
                >
                  #1
                </motion.div>

                {/* Curved line */}
                <motion.div
                  className="absolute -bottom-8 left-12 w-32 h-12 border-b-4 border-l-0 border-r-0 border-t-0 border-red-400 rounded-b-full"
                  initial={{ scaleX: 0.9 }}
                  animate={{ scaleX: 1.1 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2,
                  }}
                />

                {/* Trophy/Award */}
                <motion.div
                  className="absolute -right-4 -bottom-4 w-12 h-16"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 2.5,
                  }}
                >
                  <div className="w-8 h-12 bg-yellow-500 rounded-t-lg"></div>
                  <div className="w-12 h-4 bg-yellow-400 rounded-md -mt-1"></div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
