import React, { useState, useEffect, useCallback, useRef } from "react";
import { shuffle } from "lodash";
import { motion } from "framer-motion";
import { collection, doc, setDoc, onSnapshot, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const WORDS_PER_SESSION = 3;

interface Sentence {
  sentence_hindi: string;
  sentence_english: string;
}

interface Word {
  id: string;
  word_hindi: string;
  word_english: string;
  sentences: Sentence[];
}

interface QuizItem extends Word {
  selectedSentence: Sentence;
}

interface CollectedTranslation {
  wordId: string;
  wordHindi: string;
  wordEnglish: string;
  hindiSentence: string;
  userTranslation: string;
  userSelectedWord: string;
  userLanguage: string;
  userDialect: string;
  timestamp: string;
}

interface UserData {
  uid: string;
  name: string;
  email: string;
  nickname: string;
  language: string;
  district: string;
  state: string;
  level: number;
  sub_level: number;
  xp: number;
  coins: number;
  onboardingCompleted: boolean;
}

const DialectCollectionApp: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  
  // User state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  
  // Default values that will be overridden with user data
  const [userLanguage, setUserLanguage] = useState<string>("English");
  const [userDialect, setUserDialect] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  
  // Quiz states
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<
    "translation" | "wordIdentification"
  >("translation");
  const [userTranslation, setUserTranslation] = useState<string>("");
  const [selectedWord, setSelectedWord] = useState<string>("");
  const [collectedTranslations, setCollectedTranslations] = useState<
    CollectedTranslation[]
  >([]);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const usedWordIds = useRef<Set<string>>(new Set());
  const [wordConfirmed, setWordConfirmed] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showCorrectFeedback, setShowCorrectFeedback] = 
    useState<boolean>(false);

  // Check authentication and fetch user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        // Redirect to login if not authenticated
        navigate("/login");
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      
      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as UserData;
        setUserData({
          uid,
          ...data
        });
        setUsername(data.name || "");
        setUserLanguage(data.language || "English");
        setUserDialect(data.district || "");
      } else {
        console.error("No user data found");
        setError("User profile not found. Please complete onboarding.");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user profile.");
    }
  };

  // Fetch words for quiz
  useEffect(() => {
    if (!isAuthenticated || !authChecked) return;
    
    const wordsCollectionRef = collection(db, "WordsAndSentences");
    const unsubscribe = onSnapshot(
      wordsCollectionRef,
      (snapshot) => {
        const fetchedWords = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              word_hindi: doc.data().word_hindi,
              word_english: doc.data().word_english,
              sentences: doc.data().sentences as Sentence[],
            } as Word)
        );

        const validWords = fetchedWords.filter(
          (word) =>
            word.id &&
            word.word_hindi &&
            word.word_english &&
            Array.isArray(word.sentences) &&
            word.sentences.length > 0
        );

        setAllWords(validWords);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching words:", err);
        setError(
          "Could not load words from the database. Please try again later."
        );
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, authChecked]);

  useEffect(() => {
    // Update progress whenever current index changes
    if (quizItems.length > 0) {
      setProgress((currentItemIndex / quizItems.length) * 100);
    }
  }, [currentItemIndex, quizItems.length]);

  const generateQuizItems = useCallback(() => {
    if (allWords.length === 0) {
      setError("No words available to start a session.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let availableItems = allWords.filter(
      (item) => !usedWordIds.current.has(item.id)
    );

    if (availableItems.length < WORDS_PER_SESSION) {
      usedWordIds.current = new Set();
      availableItems = allWords;
      if (availableItems.length === 0) {
        setError("No words found in the database.");
        setIsLoading(false);
        return;
      }
    }

    const shuffledItems = shuffle(availableItems);
    const selectedItems = shuffledItems.slice(
      0,
      Math.min(WORDS_PER_SESSION, availableItems.length)
    );

    const itemsWithSelectedSentences = selectedItems.map((item) => {
      if (!item.sentences || item.sentences.length === 0) {
        return {
          ...item,
          selectedSentence: {
            sentence_hindi: "Sentence missing.",
            sentence_english: "Sentence missing.",
          },
        } as QuizItem;
      }

      const randomSentenceIndex = Math.floor(
        Math.random() * item.sentences.length
      );
      return {
        ...item,
        selectedSentence: item.sentences[randomSentenceIndex],
      } as QuizItem;
    });

    const newUsedIds = new Set([...usedWordIds.current]);
    selectedItems.forEach((item) => newUsedIds.add(item.id));
    usedWordIds.current = newUsedIds;

    setQuizItems(itemsWithSelectedSentences);
    setCurrentItemIndex(0);
    setCurrentPhase("translation");
    setUserTranslation("");
    setSelectedWord("");
    setWordConfirmed(false);
    setCollectedTranslations([]);
    setShowSummary(false);
    setProgress(0);
    setIsLoading(false);
    setError(null);
  }, [allWords]);

  useEffect(() => {
    if (allWords.length > 0 && isAuthenticated) {
      generateQuizItems();
    }
  }, [allWords, generateQuizItems, isAuthenticated]);

  const handleTranslationSubmit = () => {
    if (!userTranslation.trim()) {
      alert("Please enter your translation");
      return;
    }
    setCurrentPhase("wordIdentification");
  };

  const handleWordSelection = (word: string) => {
    setSelectedWord(word);
    setWordConfirmed(false);
  };

  const confirmWordSelection = (confirmed: boolean) => {
    if (confirmed) {
      const currentItem = quizItems[currentItemIndex];
      const entry: CollectedTranslation = {
        wordId: currentItem.id,
        wordHindi: currentItem.word_hindi,
        wordEnglish: currentItem.word_english,
        hindiSentence: currentItem.selectedSentence.sentence_hindi,
        userTranslation: userTranslation,
        userSelectedWord: selectedWord,
        userLanguage: userLanguage,
        userDialect: userDialect || "N/A",
        timestamp: new Date().toISOString(),
      };
      setCollectedTranslations((prev) => [...prev, entry]);
      setWordConfirmed(true);
      setShowCorrectFeedback(true);

      // Automatically move to next after a delay
      setTimeout(() => {
        setShowCorrectFeedback(false);
        moveToNextQuestion();
      }, 1500);
    } else {
      setSelectedWord("");
      setWordConfirmed(false);
    }
  };

  // Update user stats after completing the quiz
  const updateUserStats = async () => {
    if (!userData || !auth.currentUser) return;
    
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      
      // Update the user document with incremented values
      await updateDoc(userDocRef, {
        xp: increment(10),
        coins: increment(2),
        sub_level: increment(1)
      });
      
      console.log("User stats updated successfully");
    } catch (err) {
      console.error("Error updating user stats:", err);
      setError("Failed to update your progress. Your data was saved but rewards weren't added.");
    }
  };

  const saveSessionResults = async () => {
    if (collectedTranslations.length === 0 || !auth.currentUser || !userData) return;

    setIsSaving(true);
    setError(null);

    const lessonTimestamp = Date.now();
    const dialectIdentifier = userDialect
      ? userDialect.replace(/\s+/g, "_")
      : "no_dialect";
    const docId = `${auth.currentUser.uid}-${lessonTimestamp}-${dialectIdentifier}`;

    // Include user data from the users collection
    const sessionData = {
      userId: auth.currentUser.uid,
      userName: userData.name,
      userEmail: userData.email,
      userNickname: userData.nickname,
      userLanguage: userData.language,
      userDialect: userData.district || "N/A",
      userState: userData.state,
      userLevel: userData.level,
      userSubLevel: userData.sub_level,
      userXp: userData.xp,
      userCoins: userData.coins,
      sessionTimestamp: new Date().toISOString(),
      responses: collectedTranslations,
    };

    try {
      const docRef = doc(db, "UserResponses", docId);
      await setDoc(docRef, sessionData);
      
      // Update user stats after session completion
      await updateUserStats();
    } catch (err) {
      console.error("Error saving session data:", err);
      setError(
        "There was an issue saving your contributions. Please try again later."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const moveToNextQuestion = () => {
    if (currentItemIndex < quizItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setCurrentPhase("translation");
      setUserTranslation("");
      setSelectedWord("");
      setWordConfirmed(false);
    } else {
      saveSessionResults().then(() => {
        setShowSummary(true);
      });
    }
  };

  const handleNavigateToQuizMap = () => {
    navigate("/quizmap");
  };

  if (!authChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This should not be visible as we redirect to login in the useEffect
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center"
        >
          <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
          <p className="text-base mb-4">Please log in to access this feature.</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading Words...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md text-center"
        >
          <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
          <p className="text-base mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
          >
            Reload
          </button>
        </motion.div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            Contribution Summary
          </h1>
          <div className="mb-4 text-center">
            <p className="text-lg font-medium">
              Thank you for your contributions!
            </p>
            {isSaving && (
              <p className="text-sm text-yellow-500 mt-2">Saving data...</p>
            )}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
          
          {/* Rewards section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-3 bg-gray-700 rounded-lg text-center"
          >
            <h2 className="text-lg font-semibold mb-2 text-green-400">Rewards Earned</h2>
            <div className="flex justify-center space-x-6">
              <div className="flex flex-col items-center">
                <span className="text-yellow-400 text-2xl">+10</span>
                <span className="text-sm text-gray-300">XP</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-yellow-400 text-2xl">+2</span>
                <span className="text-sm text-gray-300">Coins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-yellow-400 text-2xl">+1</span>
                <span className="text-sm text-gray-300">Level Progress</span>
              </div>
            </div>
          </motion.div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-2">
              Words Contributed in this Session:
            </h2>
            <div className="space-y-3">
              {collectedTranslations.map((entry, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded bg-gray-700"
                >
                  <p>
                    <strong>Hindi:</strong> {entry.wordHindi} (
                    {entry.wordEnglish})
                  </p>
                  <p>
                    <strong>Your Word (English):</strong>{" "}
                    {entry.userSelectedWord}
                  </p>
                  <p>
                    <strong>Your Sentence:</strong> {entry.userTranslation}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateQuizItems}
            className="w-full mt-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors font-bold"
          >
            Start New Session
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNavigateToQuizMap}
            className="w-full mt-3 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors font-bold"
          >
            Back to Quiz Map
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (
    !quizItems ||
    quizItems.length === 0 ||
    currentItemIndex >= quizItems.length
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="p-4 text-center">
          <p className="text-lg">No quiz items available. Please reload.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  const currentItem = quizItems[currentItemIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      {/* Header with progress only (hearts removed) */}
      <div className="fixed top-0 left-0 right-0 p-4 bg-gray-900 z-10">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button
            title="back"
            type="button"
            className="text-gray-400 hover:text-white p-2"
            onClick={handleNavigateToQuizMap}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="w-full mx-4">
            <div className="bg-gray-700 rounded-full h-2 w-full">
              <motion.div
                initial={{ width: `${progress - 100 / quizItems.length}%` }}
                animate={{ width: `${progress}%` }}
                className="bg-green-500 h-2 rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* User stats display */}
          <div className="flex items-center">
            <div className="bg-yellow-600 rounded-full px-2 py-1 text-xs font-bold flex items-center">
              <span>{userData?.coins || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-md mt-16">
        {currentPhase === "translation" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="w-24 h-24 mb-6"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <img
                src="stick1.png"
                alt="Character"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <h2 className="text-xl font-bold mb-4 text-center">
              How would you say this in {userLanguage}?
            </h2>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full bg-gray-800 p-4 rounded-lg mb-6 text-center"
            >
              <p className="text-lg font-medium">
                {currentItem.selectedSentence.sentence_hindi}
              </p>
              <p className="text-xs text-gray-400 mt-2 italic">
                (English reference:{" "}
                {currentItem.selectedSentence.sentence_english})
              </p>
            </motion.div>

            <div className="w-full mb-6">
              <textarea
                value={userTranslation}
                onChange={(e) => setUserTranslation(e.target.value)}
                className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white min-h-24 focus:border-blue-500 focus:outline-none"
                placeholder={`Type your full sentence translation in ${userLanguage}...`}
                rows={4}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTranslationSubmit}
              className="w-full bg-green-600 text-white p-3 rounded-full font-bold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:hover:bg-green-600 disabled:cursor-not-allowed"
              disabled={!userTranslation.trim()}
            >
              Continue
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Select the correct meaning
            </h2>

            <div className="w-full mb-4 bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Your translation:</p>
              <p className="text-white">{userTranslation}</p>
            </div>

            <div className="w-full text-center mb-4">
              <div className="inline-block bg-gray-800 px-4 py-2 rounded-full mb-4">
                <span className="text-lg font-medium">
                  {currentItem.word_hindi}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                Which word in your translation corresponds to this Hindi word?
              </p>
            </div>

            {!wordConfirmed ? (
              <>
                <div className="w-full grid grid-cols-1 gap-3 mb-4">
                  {userTranslation
                    .split(/\s+/)
                    .map((word) => word.replace(/[.,?!;:'"()]/g, ""))
                    .filter((cleanWord) => cleanWord)
                    .map((cleanWord, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleWordSelection(cleanWord)}
                        className={`p-3 border rounded-lg text-center ${
                          selectedWord === cleanWord
                            ? "bg-blue-600 border-blue-700 text-white"
                            : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                        }`}
                      >
                        {cleanWord}
                      </motion.button>
                    ))}
                </div>

                {selectedWord && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 mt-2"
                  >
                    <p className="font-medium text-center mb-2">
                      Are You Sure?
                    </p>
                    <p className="mb-4 text-center">
                      Does "<strong>{selectedWord}</strong>" mean the same as "
                      <strong>{currentItem.word_hindi}</strong>" in this
                      context?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => confirmWordSelection(false)}
                        className="p-2 rounded-full border border-gray-600 bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        No, Pick Again
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => confirmWordSelection(true)}
                        className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        Yes, Confirm
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full p-4 rounded-lg bg-green-700 border border-green-600 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl mb-2"
                >
                  🎉
                </motion.div>
                <p className="font-bold text-lg mb-2">Correct!</p>
                <p className="mb-4">
                  Hindi: <strong>{currentItem.word_hindi}</strong> ={" "}
                  {userLanguage}: <strong>{selectedWord}</strong>
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* Skip button (removed hearts requirement) */}
      {currentPhase === "translation" && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={moveToNextQuestion}
            className="bg-gray-700 text-gray-300 py-2 px-8 rounded-full hover:bg-gray-600 transition-colors"
          >
            Skip
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default DialectCollectionApp;