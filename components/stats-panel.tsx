"use client";

import { ACHIEVEMENTS } from "@/lib/game-constants";
import { useState } from "react";

interface StatsPanelProps {
  completedTasks: number;
  totalXp: number;
  currentStreak: number;
  unlockedAchievements: string[];
}

export function StatsPanel({
  completedTasks,
  totalXp,
  currentStreak,
  unlockedAchievements,
}: StatsPanelProps) {
  const achievementList = Object.values(ACHIEVEMENTS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Stats Cards with 3D effects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* XP Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
          <div className="relative glass rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="text-sm text-gray-400">Total XP Earned</span>
            </div>
            <div className="text-3xl font-bold text-glow-gold text-amber-400">
              {totalXp.toLocaleString()}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/50 to-orange-500/50 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Tasks Card */}
        <div className="group relative">
          <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
          <div className="relative glass rounded-xl p-4 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">✅</span>
              <span className="text-sm text-gray-400">Tasks Completed</span>
            </div>
            <div className="text-3xl font-bold text-glow-green text-green-400">
              {completedTasks}
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500/50 to-emerald-500/50 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
        <div className="relative glass rounded-xl p-4 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔥</span>
                <span className="text-sm text-gray-400">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-glow-orange text-orange-400">
                {currentStreak} days
              </div>
            </div>
            {currentStreak > 0 && (
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center animate-pulse">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-ping opacity-20" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/50 to-red-500/50 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="glass rounded-xl p-4 border border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="text-glow-purple text-purple-400">🏆</span>
            Achievements
          </h3>
          <span className="text-sm text-gray-400 bg-gray-800/50 px-2 py-1 rounded-full">
            {unlockedAchievements.length} / {achievementList.length}
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievementList.map((achievement) => {
            const isUnlocked = unlockedAchievements.includes(achievement.id);
            const isHovered = hoveredId === achievement.id;

            return (
              <div
                key={achievement.id}
                className={`relative group rounded-xl p-3 text-center transition-all duration-300 cursor-pointer ${
                  isUnlocked
                    ? "bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/50"
                    : "glass border border-gray-700/30 opacity-50 hover:opacity-75"
                }`}
                onMouseEnter={() => setHoveredId(achievement.id)}
                onMouseLeave={() => setHoveredId(null)}
                title={achievement.description}
              >
                {/* Glow effect for unlocked */}
                {isUnlocked && (
                  <div className="absolute inset-0 rounded-xl bg-amber-500/10 animate-pulse-slow" />
                )}
                
                {/* Icon */}
                <div className={`text-2xl mb-1.5 transition-transform duration-300 ${isHovered ? 'scale-125' : ''}`}>
                  {achievement.icon}
                </div>
                
                {/* Name */}
                <div className={`text-xs font-medium transition-colors duration-300 ${
                  isUnlocked ? 'text-amber-300' : 'text-gray-400'
                }`}>
                  {achievement.name}
                </div>
                
                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900/95 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 whitespace-nowrap z-20 backdrop-blur-sm shadow-xl">
                    {achievement.description}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
