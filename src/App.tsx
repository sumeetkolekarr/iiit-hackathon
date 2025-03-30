import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import Login from "./pages/LoginPage/Login";
import Home from "./pages/HomePage/Home";
import Leaderboard from "./pages/LeaderBoard/LeaderBoard";
import Onboard from "./pages/OnBoarding/OnBoard";
import DialectCollectionApp from "./pages/Quiz/DialectCollectionApp";
import Dictionary from "./pages/Dictionary/Dictionary";
import QuizMap from "./pages/QuizMap/QuizMap";
import Profile from "./pages/Profile/Profile";
import Shop from "./pages/Shop/Shop";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboard />} />
          <Route path="/leader" element={<Leaderboard />} />
          <Route path="/quiz" element={<DialectCollectionApp />} />
          <Route path="/dict" element={<Dictionary />} />
          <Route path="/quizmap" element={<QuizMap />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
    </Router>
  );
}

export default App;
