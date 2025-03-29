import { useState } from "react";
import { auth, db } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
// import { Mail, Lock, User, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check if user already exists
  const checkUserExists = async (email: unknown) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const handleRegister = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // if (!age) {
    //   toast.error("Please enter your age");
    //   return;
    // }

    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      toast.error("Password is too short");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user already exists
      const userExists = await checkUserExists(email);

      if (userExists) {
        toast.error("An account with this email already exists!");
        setIsSubmitting(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (name) {
        await updateProfile(user, { displayName: name });
      }

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name || "",
        email,
        method: "email",
        createdAt: new Date(),
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);

        // Show user-friendly error messages
        if (error.message.includes("email-already-in-use")) {
          toast.error("An account with this email already exists!");
        } else if (error.message.includes("weak-password")) {
          toast.error(
            "Password is too weak. Please use at least 6 characters."
          );
        } else if (error.message.includes("invalid-email")) {
          toast.error("Invalid email address.");
        } else {
          toast.error("An error occurred. Please try again.");
        }
      } else {
        console.error("Unknown error:", error);
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleGoogleSignIn = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     // Get the user from Google sign-in
  //     const result = await signInWithPopup(auth, googleProvider);
  //     const user = result.user;

  //     // Check if user document already exists
  //     const userDoc = await getDoc(doc(db, "users", user.uid));

  //     if (userDoc.exists()) {
  //       navigate("/");
  //       return;
  //     }

  //     // Save new user to Firestore
  //     await setDoc(doc(db, "users", user.uid), {
  //       uid: user.uid,
  //       name: user.displayName || "",
  //       email: user.email,
  //       method: "google",
  //       createdAt: new Date(),
  //     });

  //     toast.success("Google Sign-Up Successful!");
  //     navigate("/");
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error:", error.message);
  //       toast.error("Google sign-in failed. Please try again.");
  //     } else {
  //       console.error("Unknown error:", error);
  //       toast.error("An unknown error occurred");
  //     }
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Toaster position="top-center" reverseOrder={false} />

        {/* Close button */}
        <div className="flex justify-start">
          <button
            title="svg"
            type="button"
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Create your profile</h2>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          {/* Age field */}
          {/* <div className="relative">
            <input
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-red-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Age"
            />
            {!age && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                Please enter your real age
              </div>
            )}
          </div> */}

          {/* Name field*/}
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
            />
            {/* {!name && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                Please enter your Name
              </div>
            )} */}
          </div>

          {/* Email field */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
            />
            {/* {!email && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                Invalid email address
              </div>
            )} */}
          </div>

          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
            />
            <button
              title="show"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400"
            >
              <Eye size={20} />
            </button>
            {/* {password.length < 6 && (
              <div className="text-red-500 text-xs flex items-center mt-1">
                <span className="mr-1">⚠️</span>
                Password too short
              </div>
            )} */}
          </div>

          {/* Create Account button */}
          <div className="space-y-4 flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-30-blue"
            >
              {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </div>
        </form>

        {/* <div className="flex items-center justify-center">
          <div className="border-t border-gray-700 flex-grow"></div>
          <div className="px-4 text-gray-500 text-sm">OR</div>
          <div className="border-t border-gray-700 flex-grow"></div>
        </div> */}

        {/* Google sign-in button */}
        {/* <div className="space-y-4 flex items-center justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="button-30-default"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            GOOGLE
          </button>
        </div> */}

        {/* Terms and Privacy */}
        <div className="text-center text-xs text-gray-500">
          <p>
            By signing in to IndoTrivia, you agree to our
            <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">
              Terms
            </a>
            and
            <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">
              Privacy Policy
            </a>
          </p>
          <p className="mt-2">
            This site is protected by reCAPTCHA Enterprise and the Google{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">
              Privacy Policy
            </a>
            and{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 mx-1">
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
