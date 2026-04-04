"use client";

import { getLevelFromXp } from "@/lib/game-constants";
import { Avatar3D } from "./avatar-3d";
import { useAuth } from "@/hooks/use-auth";
import { COSMETICS } from "@/lib/premium-cosmetics";
import Link from "next/link";
import { useState } from "react";

interface PlayerHeaderProps {
  totalXp: number;
  completedTasks: number;
  currentStreak: number;
}

export function PlayerHeader({
  totalXp,
  completedTasks,
  currentStreak,
}: PlayerHeaderProps) {
  const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);
  const progressPercent = (currentXp / nextLevelXp) * 100;
  const { user } = useAuth();
  const cosmetic = user?.selectedCosmetic ? COSMETICS[user.selectedCosmetic] : COSMETICS.default;
  const [isHovered, setIsHovered] = useState(false);

  // Get level-based styling
  const getLevelStyle = () => {
    if (level >= 30) return { color: "from-red-600 via-orange-500 to-yellow-500", glow: "shadow-red-500/50", border: "border-red-500/50" };
    if (level >= 20) return { color: "from-cyan-600 via-blue-500 to-purple-500", glow: "shadow-cyan-500/50", border: "border-cyan-500/50" };
    if (level >= 10) return { color: "from-blue-600 via-indigo-500 to-purple-500", glow: "shadow-blue-500/50", border: "border-blue-500/50" };
    return { color: "from-purple-600 via-violet-500 to-indigo-500", glow: "shadow-purple-500/50", border: "border-purple-500/50" };
  };

  const levelStyle = getLevelStyle();

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated border glow */}
      <div 
        className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${levelStyle.color} opacity-30 blur-sm transition-all duration-500 ${isHovered ? 'opacity-60 blur-md' : ''}`}
        style={{ animation: 'gradient-shift 4s ease infinite', backgroundSize: '200% 200%' }}
      />
      
      <div 
        className="relative glass rounded-xl p-6 transition-all duration-300"
        style={{
          borderColor: cosmetic.borderColor,
        }}
      >
        {/* Inner glow overlay */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Premium Badge / Upgrade Button */}
        {user?.isPremium ? (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <span className="text-glow-gold text-yellow-400 text-lg">⭐</span>
            <span className="text-yellow-400 text-sm font-semibold">Premium</span>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="absolute top-4 right-4 relative group/btn overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/30"
          >
            <span className="relative z-10">Upgrade ⭐</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          </Link>
        )}

        <div className="flex gap-8 items-start mb-6 relative z-10">
          {/* Avatar Section */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="relative">
              {/* Avatar glow ring */}
              <div 
                className={`absolute -inset-2 rounded-xl bg-gradient-to-r ${levelStyle.color} opacity-50 blur-md animate-pulse-slow`}
              />
              <Avatar3D 
                url={user?.avatarUrl || "https://models.readyplayer.me/64b584a51e5acc6fdf5c3b1a.glb"} 
                level={level} 
                jobClass={user?.jobClass || "shadow"}
                isPremium={user?.isPremium || false}
                gender={user?.gender || "male"}
              />
            </div>
            <Link 
              href="/avatar-creator"
              className="relative group/link text-xs glass px-4 py-2 rounded-full text-gray-300 font-medium transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50 overflow-hidden"
            >
              <span className="relative z-10">🎨 Edit 3D Avatar</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-500" />
            </Link>
          </div>

          {/* Stats Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                  Current Level
                </div>
                <div className={`text-6xl font-black bg-gradient-to-r ${levelStyle.color} bg-clip-text text-transparent animate-gradient`}>
                  {level}
                </div>
              </div>

              <div className="text-right space-y-2">
                <div className="text-sm text-gray-400 flex items-center justify-end gap-2">
                  Total XP
                  <span className="text-amber-400">⚡</span>
                </div>
                <div className="text-3xl font-bold text-glow-gold text-amber-400">{totalXp.toLocaleString()}</div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  Progress to Level {level + 1}
                </span>
                <span className="text-gray-300 font-medium">
                  {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
                </span>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="relative h-3 bg-gray-900/50 rounded-full overflow-hidden border border-gray-700/30">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.02)_50%,transparent_100%)] bg-[length:20px_100%]" />
                
                {/* Progress fill */}
                <div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${levelStyle.color} transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
                
                {/* Glow effect on progress */}
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${levelStyle.glow} blur-sm transition-all duration-500`}
                  style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))` }}
                />
              </div>
            </div>

            <div className="flex gap-6 text-sm">
              <div className="flex-1 glass rounded-lg p-3 border border-gray-700/30">
                <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                  <span>✅</span> Tasks Completed
                </div>
                <div className="text-2xl font-bold text-glow-green text-green-400">{completedTasks}</div>
              </div>
              <div className="flex-1 glass rounded-lg p-3 border border-gray-700/30">
                <div className="text-gray-400 mb-1 flex items-center gap-1.5">
                  <span>🔥</span> Current Streak
                </div>
                <div className="text-2xl font-bold text-glow-orange text-orange-400 flex items-center gap-2">
                  {currentStreak}
                  {currentStreak > 0 && (
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full animate-pulse">
                      ACTIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
