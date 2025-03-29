import { useState } from "react";
import { auth, db, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName || "",
          email: user.email,
          method: "email",
          createdAt: new Date(),
        });
      }

      alert("Login Successful!");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        alert(error.message);
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        method: "google",
        createdAt: new Date(),
      });

      alert("Google Sign-In Successful!");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        alert(error.message);
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-full max-w-md mx-auto">
        {/* Close button at top right */}
        <button
          title="close"
          type="button"
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          onClick={() => {
            navigate("/");
          }}
        >
          <X size={20} />
        </button>

        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Log in</h2>
          </div>

          <form onSubmit={handleLogin}>
            <div className="space-y-5">
              <div>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email or username"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-sm text-blue-500 font-medium"
                >
                  FORGOT?
                </button>
              </div>

              <div className="space-y-4 flex items-center justify-center">
                <button type="submit" className="button-30-blue">
                  LOG IN
                </button>
              </div>
            </div>
          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t border-gray-300 flex-grow"></div>
            <div className="mx-4 text-sm text-gray-500">OR</div>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <div className="space-y-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="button-30-default"
            >
              <svg
                className="mx-2"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              GOOGLE
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-gray-600">
            <p>
              By signing in to IndoTrivia, you agree to our{" "}
              <a href="#" className="text-blue-500">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500">
                Privacy Policy
              </a>
              .
            </p>
            <p className="mt-2">
              This site is protected by reCAPTCHA Enterprise and the Google{" "}
              <a href="#" className="text-blue-500">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-500">
                Terms of Service
              </a>{" "}
              apply.
            </p>
          </div>
        </div>

        {/* <div className="mt-4 text-center">
          <button className="bg-green-500 text-white font-medium py-2 px-6 rounded-full hover:bg-green-600 transition-colors">
            SIGN UP
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Login;
