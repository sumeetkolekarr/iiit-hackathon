import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../config/firebase';

interface FormData {
  state: string;
  district: string;
  language: string;
  nickname: string;
}

interface Question {
  id: keyof FormData;
  question: string;
}

const Onboard: React.FC = () => {
  // Properly type the user state to accept User or null
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    state: '',
    district: '',
    language: '',
    nickname: ''
  });
  const [inputValue, setInputValue] = useState<string>('');
  const navigate = useNavigate();
  
  const questions: Question[] = [
    { id: 'state', question: 'Name of state' },
    { id: 'district', question: 'Name of District' },
    { id: 'language', question: 'Name of Language' },
    { id: 'nickname', question: 'What would you like us to call you?' }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Check if user has already completed onboarding using uid instead of email
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists() && userDoc.data().onboardingCompleted) {
          navigate('/journey');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    // Update the form data with current input
    const currentQuestionId = questions[step].id;
    const updatedFormData = {
      ...formData,
      [currentQuestionId]: inputValue
    };
    
    setFormData(updatedFormData);
    
    // If this is the last step, save all data to Firestore
    if (step === questions.length - 1) {
      try {
        if (user && user.uid) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Update existing document with new fields
            await updateDoc(userDocRef, {
              ...updatedFormData,
              onboardingCompleted: true,
              lastUpdated: new Date()
            });
          } else {
            // Create new document if it doesn't exist yet
            await setDoc(userDocRef, {
              ...updatedFormData,
              email: user.email,
              uid: user.uid,
              onboardingCompleted: true,
              createdAt: new Date()
            });
          }
          
          // Redirect to journey page
          navigate('/journey');
        } else {
          throw new Error("User ID not available");
        }
      } catch (err) {
        setError("Failed to save data: " + (err instanceof Error ? err.message : 'Unknown error'));
      }
    } else {
      // Move to next step
      setStep(step + 1);
      setInputValue('');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const calculateProgress = (): string => {
    return `${(step / (questions.length - 1)) * 100}%`;
  };

  // Loading screen
  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-white">Loading...</p>
      </div>
    );
  }

  // Login/Register screen
  if (!user) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl text-white font-bold mb-6 text-center">
            {authMode === 'login' ? 'Login' : 'Register'}
          </h2>
          
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 transition-colors"
            >
              {authMode === 'login' ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-gray-600"></div>
            <div className="px-3 text-gray-400">OR</div>
            <div className="flex-1 border-t border-gray-600"></div>
          </div>
          
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-gray-800 py-3 rounded font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
            </span>
            Continue with Google
          </button>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="text-green-500 hover:underline"
            >
              {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Onboarding Form
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-green-500 absolute left-0 top-0"
            initial={{ width: "0%" }}
            animate={{ width: calculateProgress() }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <div className="w-full max-w-md">
        {/* Mascot and question */}
        <div className="flex items-start mb-6">
          <div className="mr-4">
            <img 
              src="/api/placeholder/100/100" 
              alt="Mascot" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <p>{questions[step].question}</p>
          </div>
        </div>
        
        {/* Input field */}
        <div className="mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>
        
        {/* Continue button */}
        <motion.button
          className={`w-full py-4 rounded-lg text-center text-white font-medium ${
            inputValue.trim() ? 'bg-green-500 cursor-pointer' : 'bg-gray-700 cursor-not-allowed opacity-50'
          }`}
          disabled={!inputValue.trim()}
          onClick={handleContinue}
          whileTap={inputValue.trim() ? { scale: 0.98 } : {}}
        >
          CONTINUE
        </motion.button>
      </div>
    </div>
  );
};

export default Onboard;