import React from "react";
import Leaderboard from "./Leader";

// Sample data
const mockLeaderboardData = [
  { id: "user1", name: "CodeWizard", score: 1580 },
  { id: "user2", name: "PixelPioneer", score: 1450 },
  { id: "user3", name: "SyntaxSavvy", score: 1620 },
  { id: "user4", name: "DataDynamo", score: 1300 },
  { id: "user5", name: "ReactRanger", score: 1700 },
  { id: "user6", name: "CSSChampion", score: 1100 },
  { id: "current_user", name: "You", score: 1180 },
  { id: "user8", name: "TypeScripter", score: 1550 },
  { id: "user9", name: "AlgoAce", score: 1250 },
  { id: "user10", name: "BugBasher", score: 1050 },
  { id: "user11", name: "GitGuru", score: 1680 },
  { id: "user12", name: "NodeNinja", score: 950 },
  { id: "user13", name: "FrontendFriend", score: 1380 },
  { id: "user14", name: "BackendBuddy", score: 1410 },
  { id: "user15", name: "MobileMaestro", score: 1150 },
];

// Leaderboard configuration
const leaderboardConfig = {
  leagueName: "Diamond League",
  timeRemaining: "Ends in 3 days",
  promotionZoneSize: 5,
  demotionZoneSize: 3
};

const LeaderboardPage: React.FC = () => {
  return (
    <div>
      <Leaderboard
        initialData={mockLeaderboardData}
        config={leaderboardConfig}
        currentUserId="current_user"
        simulateUpdates={true}
      />
    </div>
  );
};

export default LeaderboardPage;