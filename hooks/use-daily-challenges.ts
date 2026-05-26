"use client";

import { useState, useEffect, useCallback } from "react";

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  type: "tasks" | "streak" | "difficulty" | "time" | "xp";
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

const CHALLENGE_TEMPLATES = [
  { title: "Quick Start", description: "Complete 3 tasks today", xpReward: 50, icon: "🎯", type: "tasks" as const, target: 3 },
  { title: "Productivity Master", description: "Complete 5 tasks today", xpReward: 100, icon: "⚡", type: "tasks" as const, target: 5 },
  { title: "Challenge Seeker", description: "Complete an A-rank task", xpReward: 100, icon: "💪", type: "difficulty" as const, target: 1 },
  { title: "Legend in Making", description: "Complete an S-rank task", xpReward: 200, icon: "👑", type: "difficulty" as const, target: 1 },
  { title: "Streak Keeper", description: "Maintain a 3-day streak", xpReward: 75, icon: "🔥", type: "streak" as const, target: 3 },
  { title: "Unstoppable", description: "Maintain a 7-day streak", xpReward: 150, icon: "💫", type: "streak" as const, target: 7 },
  { title: "Time Master", description: "Work for 2 hours total today", xpReward: 150, icon: "⏰", type: "time" as const, target: 120 },
  { title: "XP Hunter", description: "Earn 200 XP today", xpReward: 100, icon: "⭐", type: "xp" as const, target: 200 },
  { title: "Early Bird", description: "Complete 2 tasks before noon", xpReward: 75, icon: "🌅", type: "tasks" as const, target: 2 },
  { title: "Night Owl", description: "Complete 2 tasks after 8 PM", xpReward: 75, icon: "🦉", type: "tasks" as const, target: 2 },
  { title: "Marathon Runner", description: "Work for 4 hours total today", xpReward: 250, icon: "🏃", type: "time" as const, target: 240 },
  { title: "XP Overload", description: "Earn 500 XP today", xpReward: 200, icon: "💰", type: "xp" as const, target: 500 },
  { title: "Task Destroyer", description: "Complete 10 tasks today", xpReward: 200, icon: "⚔️", type: "tasks" as const, target: 10 },
  { title: "B-Rank Grinder", description: "Complete 3 B-rank tasks", xpReward: 125, icon: "🗡️", type: "difficulty" as const, target: 3 },
  { title: "Streak Champion", description: "Maintain a 14-day streak", xpReward: 300, icon: "🏆", type: "streak" as const, target: 14 },
  { title: "Double Trouble", description: "Complete 6 tasks today", xpReward: 150, icon: "🎲", type: "tasks" as const, target: 6 },
  { title: "Speed Demon", description: "Complete 4 tasks today", xpReward: 125, icon: "🚀", type: "tasks" as const, target: 4 },
  { title: "Quality Over Quantity", description: "Complete 2 A-rank tasks", xpReward: 175, icon: "✨", type: "difficulty" as const, target: 2 },
];

const STORAGE_KEY = "timebot_daily_challenges";
const DATE_KEY = "timebot_challenge_date";

function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

function generateDailyChallenges(): DailyChallenge[] {
  const seed = getDailySeed();
  const random = seededRandom(seed);
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => random() - 0.5);
  const selected = shuffled.slice(0, 4);

  return selected.map((template, index) => ({
    id: `daily_${seed}_${index}`,
    title: template.title,
    description: template.description,
    xpReward: template.xpReward,
    icon: template.icon,
    type: template.type,
    target: template.target,
    progress: 0,
    completed: false,
    claimed: false,
  }));
}

export function useDailyChallenges() {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load challenges
  useEffect(() => {
    const today = getDailySeed().toString();
    const savedDate = localStorage.getItem(DATE_KEY);
    const savedChallenges = localStorage.getItem(STORAGE_KEY);

    if (savedDate === today && savedChallenges) {
      try {
        setChallenges(JSON.parse(savedChallenges));
      } catch {
        setChallenges(generateDailyChallenges());
      }
    } else {
      // New day, generate new challenges
      const newChallenges = generateDailyChallenges();
      setChallenges(newChallenges);
      localStorage.setItem(DATE_KEY, today);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newChallenges));
    }

    setIsLoaded(true);
  }, []);

  // Save challenges
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(challenges));
    }
  }, [challenges, isLoaded]);

  const updateProgress = useCallback((type: DailyChallenge["type"], value: number, difficulty?: string) => {
    setChallenges(prev => prev.map(challenge => {
      if (challenge.completed || challenge.type !== type) return challenge;

      let newProgress = challenge.progress;

      if (type === "tasks") {
        newProgress += 1;
      } else if (type === "difficulty" && difficulty) {
        if ((challenge.title.includes("A-rank") && difficulty === "A") ||
            (challenge.title.includes("S-rank") && difficulty === "S")) {
          newProgress = challenge.target;
        }
      } else if (type === "streak") {
        newProgress = value;
      } else if (type === "time" || type === "xp") {
        newProgress = value;
      }

      const completed = newProgress >= challenge.target;

      return {
        ...challenge,
        progress: newProgress,
        completed,
      };
    }));
  }, []);

  const claimReward = useCallback((challengeId: string): number => {
    let xpReward = 0;
    setChallenges(prev => prev.map(challenge => {
      if (challenge.id === challengeId && challenge.completed && !challenge.claimed) {
        xpReward = challenge.xpReward;
        return { ...challenge, claimed: true };
      }
      return challenge;
    }));
    return xpReward;
  }, []);

  const getUnclaimedCount = useCallback(() => {
    return challenges.filter(c => c.completed && !c.claimed).length;
  }, [challenges]);

  return {
    challenges,
    isLoaded,
    updateProgress,
    claimReward,
    getUnclaimedCount,
  };
}
