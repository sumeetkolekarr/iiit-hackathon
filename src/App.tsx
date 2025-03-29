import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/RegisterPage/Register";
import Login from "./pages/LoginPage/Login";
import Home from "./pages/HomePage/Home";
import Leaderboard from "./pages/LeaderBoard/LeaderBoard";
import Onboard from "./pages/OnBoarding/OnBoard";

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboard />} />
          <Route path="/leader" element={<Leaderboard />} />
        </Routes>
    </Router>
  );
}

export default App;
