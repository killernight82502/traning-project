"use client";

import { DailyChallenge } from "@/hooks/use-daily-challenges";
import { useState } from "react";
import { toast } from "sonner";

interface DailyChallengesProps {
  challenges: DailyChallenge[];
  onClaim: (challengeId: string) => number;
  unclaimedCount: number;
}

export function DailyChallenges({ challenges, onClaim, unclaimedCount }: DailyChallengesProps) {
  const [expanded, setExpanded] = useState(true);

  const handleClaim = (challenge: DailyChallenge) => {
    const xp = onClaim(challenge.id);
    if (xp > 0) {
      toast.success("Challenge Complete!", {
        description: `You earned ${xp} XP for "${challenge.title}"`,
        icon: challenge.icon,
      });
    }
  };

  return (
    <div className="glass rounded-xl border border-purple-500/20 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📜</span>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white">Daily Challenges</h3>
            <p className="text-xs text-gray-400">Complete challenges for bonus XP</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unclaimedCount > 0 && (
            <span className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
              {unclaimedCount} claimable
            </span>
          )}
          <span className="text-gray-400">
            {expanded ? "▼" : "▶"}
          </span>
        </div>
      </button>

      {/* Challenges list */}
      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          {challenges.map((challenge) => {
            const progressPercent = Math.min((challenge.progress / challenge.target) * 100, 100);
            const isCompleted = challenge.completed;
            const isClaimed = challenge.claimed;

            return (
              <div
                key={challenge.id}
                className={`relative group rounded-lg p-3 transition-all duration-300 ${
                  isClaimed
                    ? "bg-gray-800/30 opacity-60"
                    : isCompleted
                    ? "bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/30"
                    : "bg-gray-800/20 border border-gray-700/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`text-2xl transition-transform duration-300 ${
                    isCompleted && !isClaimed ? "animate-bounce" : "group-hover:scale-110"
                  }`}>
                    {challenge.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-medium truncate ${
                        isCompleted ? "text-amber-400" : "text-white"
                      }`}>
                        {challenge.title}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                        <span>⭐</span>
                        <span>{challenge.xpReward} XP</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-0.5">{challenge.description}</p>

                    {/* Progress bar */}
                    {!isCompleted && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {challenge.progress} / {challenge.target}
                        </div>
                      </div>
                    )}

                    {/* Claim button */}
                    {isCompleted && !isClaimed && (
                      <button
                        onClick={() => handleClaim(challenge)}
                        className="mt-2 w-full py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-sm font-bold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                      >
                        Claim {challenge.xpReward} XP
                      </button>
                    )}

                    {/* Claimed indicator */}
                    {isClaimed && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-400 text-sm">
                        <span>✓</span>
                        <span>Claimed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Glow effect for completed */}
                {isCompleted && !isClaimed && (
                  <div className="absolute inset-0 rounded-lg bg-amber-500/5 animate-pulse pointer-events-none" />
                )}
              </div>
            );
          })}

          {/* Time until reset */}
          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-700/30">
            <span className="animate-pulse inline-block mr-1">⏰</span>
            Challenges reset at midnight
          </div>
        </div>
      )}
    </div>
  );
}
