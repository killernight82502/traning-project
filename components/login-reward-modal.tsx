"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RewardMilestone {
  day: number;
  xp: number;
  badge?: string;
}

interface LoginRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  onClaim: (xp: number, day: number) => void;
}

const REWARD_MILESTONES = [
  { day: 1, xp: 25 },
  { day: 2, xp: 35 },
  { day: 3, xp: 50, badge: "🔥" },
  { day: 4, xp: 60 },
  { day: 5, xp: 75 },
  { day: 6, xp: 90 },
  { day: 7, xp: 100, badge: "⭐" },
  { day: 14, xp: 200, badge: "💎" },
  { day: 21, xp: 300, badge: "👑" },
  { day: 30, xp: 500, badge: "🏆" },
];

export function LoginRewardModal({ isOpen, onClose, currentStreak, onClaim }: LoginRewardModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if already claimed today
      const lastClaimDate = localStorage.getItem("timebot_last_claim_date");
      const today = new Date().toDateString();
      setClaimedToday(lastClaimDate === today);

      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  const getCurrentReward = (): RewardMilestone | undefined => {
    return REWARD_MILESTONES.find((r) => r.day === currentStreak);
  };

  const getNextReward = (): RewardMilestone | undefined => {
    return REWARD_MILESTONES.find((r) => r.day > currentStreak);
  };

  const claimReward = () => {
    if (claimedToday) return;

    const today = new Date().toDateString();
    localStorage.setItem("timebot_last_claim_date", today);
    setClaimedToday(true);

    const reward = getCurrentReward();
    if (reward) {
      onClaim(reward.xp, currentStreak);
      toast.success("Daily Reward Claimed!", {
        description: `You received ${reward.xp} XP${reward.badge ? ` and a ${reward.badge} badge!` : "!"}`,
        icon: "🎁",
      });
    } else {
      // Default reward for non-milestone days
      const defaultXp = 25 + (currentStreak % 7) * 10;
      onClaim(defaultXp, currentStreak);
      toast.success("Daily Reward Claimed!", {
        description: `You received ${defaultXp} XP!`,
        icon: "🎁",
      });
    }
  };

  if (!isOpen) return null;

  const currentReward = getCurrentReward();
  const nextReward = getNextReward();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-md glass rounded-2xl border border-amber-500/30 overflow-hidden transition-all duration-300 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 text-center">
          <div className="text-4xl mb-2">🎁</div>
          <h2 className="text-2xl font-bold text-white">Daily Login Reward</h2>
          <p className="text-gray-400 mt-1">
            {currentStreak > 0 ? `${currentStreak} day streak! Keep it up!` : "Start your streak today!"}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current streak display */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(7)].map((_, i) => {
              const day = i + 1;
              const isCompleted = day <= currentStreak;
              const isCurrent = day === currentStreak;
              const isMilestone = REWARD_MILESTONES.some((r) => r.day === day);

              return (
                <div
                  key={day}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-black"
                      : isCurrent && !claimedToday
                      ? "bg-amber-500/20 border-2 border-amber-500 text-amber-400 animate-pulse"
                      : "bg-gray-800 text-gray-500"
                  } ${isMilestone ? "ring-2 ring-amber-400/50" : ""}`}
                >
                  {isCompleted ? "✓" : day}
                </div>
              );
            })}
          </div>

          {/* Reward preview */}
          {currentReward && !claimedToday && (
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-xl p-4 mb-4 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-amber-400">Day {currentStreak} Reward</div>
                  <div className="text-2xl font-bold text-white">{currentReward.xp} XP</div>
                </div>
                {currentReward.badge && (
                  <div className="text-4xl animate-bounce">{currentReward.badge}</div>
                )}
              </div>
            </div>
          )}

          {/* Next reward teaser */}
          {nextReward && (
            <div className="text-center text-sm text-gray-400 mb-4">
              Next milestone: Day {nextReward.day} - {nextReward.xp} XP
              {nextReward.badge && ` ${nextReward.badge}`}
            </div>
          )}

          {/* Claim button */}
          {!claimedToday ? (
            <Button
              onClick={claimReward}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-6 text-lg rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              Claim Reward
            </Button>
          ) : (
            <div className="text-center py-4">
              <div className="text-green-400 font-medium">Already claimed today!</div>
              <div className="text-gray-500 text-sm mt-1">Come back tomorrow for more rewards</div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-400 hover:text-white transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
