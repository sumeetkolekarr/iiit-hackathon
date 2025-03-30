import { useState, useEffect } from "react";
import { LibraryBig, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase"; // Adjust this import to match your project structure

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReached, setIsReached] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  // Check authentication status and onboarding completion
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsAuthenticated(!!user);
      
      if (user) {
        // Check if onboardingCompleted is true in the user document
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setOnboardingCompleted(!!userDoc.data().onboardingCompleted);
          } else {
            setOnboardingCompleted(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setOnboardingCompleted(false);
        }
      }
    });
    
    return () => unsubscribe();
  }, [auth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    if (onboardingCompleted) {
      navigate("/quizmap");
    } else {
      navigate("/onboarding");
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleElement = () => {
      if (window.scrollY > window.innerHeight) {
        setIsReached(true);
      } else {
        setIsReached(false);
      }
    };

    window.addEventListener("scroll", handleElement);
    return () => window.removeEventListener("scroll", handleElement);
  }, []);

  return (
    <nav
      className={`fixed py-6 top-0 w-full z-50 px-4 transition-all duration-300 ${
        isScrolled
          ? "bg-white/50 backdrop-blur-xl border-b border-gray-300"
          : "bg-transparent"
      }`}
    >
      <div
        className={`flex items-center ${
          !isReached ? "justify-between" : "justify-center"
        }`}
      >
        <div className="flex text-white items-center justify-center">
          <LibraryBig />
          <h4 className="text-white">IndoTrivia</h4>
        </div>
        {!isReached && (
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={handleDashboard}
                  className="button-30-purple flex items-center"
                  role="button"
                >
                  <LayoutDashboard className="mr-2" size={16} />
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="button-30-purple flex items-center"
                  role="button"
                >
                  <LogOut className="mr-2" size={16} />
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  navigate("/register");
                }}
                className="button-30-purple"
                role="button"
              >
                Get Started
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;