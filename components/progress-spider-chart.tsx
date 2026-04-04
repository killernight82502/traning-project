"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from "recharts";
import { getLevelFromXp } from "@/lib/game-constants";

interface ProgressSpiderChartProps {
  totalXp: number;
  completedTasks: number;
  currentStreak: number;
  level: number;
  totalTasks: number;
}

export function ProgressSpiderChart({
  totalXp,
  completedTasks,
  currentStreak,
  level,
  totalTasks,
}: ProgressSpiderChartProps) {
  // Calculate normalized values (0-100 scale)
  const levelScore = Math.min((level / 50) * 100, 100);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const streakScore = Math.min((currentStreak / 30) * 100, 100);
  const xpScore = Math.min((totalXp / 10000) * 100, 100);
  const avgDifficulty = completedTasks > 0 ? Math.min((completedTasks / 100) * 100, 100) : 0;

  const data = [
    {
      name: "Level",
      score: levelScore,
      fullMark: 100,
    },
    {
      name: "Completion",
      score: completionRate,
      fullMark: 100,
    },
    {
      name: "Streak",
      score: streakScore,
      fullMark: 100,
    },
    {
      name: "XP Earned",
      score: xpScore,
      fullMark: 100,
    },
    {
      name: "Mastery",
      score: avgDifficulty,
      fullMark: 100,
    },
  ];

  return (
    <div className="relative group">
      {/* Animated border glow */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 opacity-75 group-hover:opacity-100 blur transition-all duration-500" />
      
      <div className="relative glass rounded-xl p-6 border border-purple-500/20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-glow-purple text-purple-400">📊</span>
            Progress Overview
          </h2>
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">Live Stats</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Spider Chart */}
          <div className="flex-1 min-h-[400px] relative">
            {/* Glow effect behind chart */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-purple-500/5 rounded-xl blur-3xl" />
            
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <PolarGrid stroke="rgba(139, 92, 246, 0.15)" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "rgba(209, 213, 219, 0.7)", fontSize: 11, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: "rgba(107, 114, 128, 0.5)", fontSize: 9 }}
                />
                <Radar
                  name="Progress"
                  dataKey="score"
                  stroke="rgba(249, 115, 22, 0.9)"
                  fill="rgba(249, 115, 22, 0.25)"
                  strokeWidth={2}
                  dot={{ fill: "rgba(249, 115, 22, 1)", r: 5, strokeWidth: 0 }}
                  activeDot={{ r: 7, fill: "rgba(249, 115, 22, 1)", stroke: "rgba(255,255,255,0.5)", strokeWidth: 2 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 15, 25, 0.95)",
                    border: "1px solid rgba(249, 115, 22, 0.4)",
                    borderRadius: "12px",
                    color: "rgba(249, 115, 22, 1)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
                  }}
                  formatter={(value) => [`${Math.round(value as number)}%`, 'Progress']}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Details */}
          <div className="flex-1 space-y-4">
            {/* Level Progress */}
            <div className="group/card relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover/card:opacity-100 blur transition-all duration-500" />
              <div className="relative glass rounded-xl p-4 border border-gray-700/30 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                    Level Progress
                  </span>
                  <span className="text-purple-400 font-bold">{Math.round(levelScore)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${levelScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Level {level} / 50</p>
              </div>
            </div>

            {/* Task Completion */}
            <div className="group/card relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover/card:opacity-100 blur transition-all duration-500" />
              <div className="relative glass rounded-xl p-4 border border-gray-700/30 hover:border-green-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Task Completion
                  </span>
                  <span className="text-green-400 font-bold">{Math.round(completionRate)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{completedTasks} / {totalTasks} tasks</p>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="group/card relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover/card:opacity-100 blur transition-all duration-500" />
              <div className="relative glass rounded-xl p-4 border border-gray-700/30 hover:border-orange-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                    Daily Streak
                  </span>
                  <span className="text-orange-400 font-bold">{Math.round(streakScore)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                    style={{ width: `${streakScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{currentStreak} day streak</p>
              </div>
            </div>

            {/* XP Mastery */}
            <div className="group/card relative">
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 opacity-0 group-hover/card:opacity-100 blur transition-all duration-500" />
              <div className="relative glass rounded-xl p-4 border border-gray-700/30 hover:border-amber-500/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                    XP Mastery
                  </span>
                  <span className="text-amber-400 font-bold">{Math.round(xpScore)}%</span>
                </div>
                <div className="relative h-2.5 bg-gray-800/50 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                    style={{ width: `${xpScore}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{totalXp.toLocaleString()} XP earned</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
