import React, { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  xp: number;
  avatar: string;
}

const initialUsers: User[] = [
  { id: 1, name: "Alice", xp: 1200, avatar: "😎" },
  { id: 2, name: "Bob", xp: 1100, avatar: "🔥" },
  { id: 3, name: "Charlie", xp: 950, avatar: "🦊" },
  { id: 4, name: "David", xp: 850, avatar: "🐉" },
  { id: 5, name: "Eve", xp: 700, avatar: "👑" },
  { id: 6, name: "You", xp: 500, avatar: "🙂" }, // User's position
];

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers
          .map((user) => ({
            ...user,
            xp: user.xp + Math.floor(Math.random() * 50), // Random XP increase
          }))
          .sort((a, b) => b.xp - a.xp)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-darkBg text-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4 text-primary">
        🏆 Obsidian League
      </h2>
      <ul>
        {users.map((user, index) => (
          <li
            key={user.id}
            className={`flex items-center p-2 border-b border-gray-700 ${
              user.name === "You" ? "bg-primary text-black rounded-lg p-3" : ""
            }`}
          >
            <span className="text-lg">{user.avatar}</span>
            <span className="flex-1 ml-3">{user.name}</span>
            <div className="flex-1 bg-gray-700 h-2 rounded-full overflow-hidden mx-3">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(user.xp / 1500) * 100}%` }}
              ></div>
            </div>
            <span className="font-semibold">{user.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;