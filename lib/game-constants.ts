// Solo Leveling Game Constants
export const DIFFICULTY_RANKS = {
  E: { label: "E", multiplier: 1, color: "bg-gray-500" },
  D: { label: "D", multiplier: 1.5, color: "bg-blue-500" },
  C: { label: "C", multiplier: 2.5, color: "bg-purple-500" },
  B: { label: "B", multiplier: 4, color: "bg-pink-500" },
  A: { label: "A", multiplier: 6, color: "bg-amber-500" },
  S: { label: "S", multiplier: 10, color: "bg-red-500" },
} as const;

export type DifficultyRank = keyof typeof DIFFICULTY_RANKS;

// XP System: Exponential growth
export const getXpForLevel = (level: number): number => {
  if (level === 1) return 100;
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate cumulative XP needed to reach a level
export const getCumulativeXp = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpForLevel(i);
  }
  return total;
};

// Get current level from total XP
export const getLevelFromXp = (totalXp: number): { level: number; currentXp: number; nextLevelXp: number } => {
  let level = 1;
  let cumulativeXp = 0;

  while (cumulativeXp + getXpForLevel(level) <= totalXp) {
    cumulativeXp += getXpForLevel(level);
    level++;
  }

  const currentXp = totalXp - cumulativeXp;
  const nextLevelXp = getXpForLevel(level);

  return { level, currentXp, nextLevelXp };
};

// Calculate XP earned from a task
export const calculateTaskXp = (durationMinutes: number, difficulty: DifficultyRank): number => {
  const multiplier = DIFFICULTY_RANKS[difficulty].multiplier;
  return Math.ceil(durationMinutes * multiplier);
};

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_TASK: {
    id: "first_task",
    name: "Awakening",
    description: "Complete your first task",
    icon: "🌟",
  },
  FIFTY_TASKS: {
    id: "fifty_tasks",
    name: "Rising Hunter",
    description: "Complete 50 tasks",
    icon: "⚔️",
  },
  HUNDRED_TASKS: {
    id: "hundred_tasks",
    name: "Veteran Hunter",
    description: "Complete 100 tasks",
    icon: "🛡️",
  },
  LEVEL_10: {
    id: "level_10",
    name: "Ascension",
    description: "Reach Level 10",
    icon: "🚀",
  },
  LEVEL_25: {
    id: "level_25",
    name: "Realm Breaker",
    description: "Reach Level 25",
    icon: "👑",
  },
  S_RANK_TASK: {
    id: "s_rank_task",
    name: "Legendary",
    description: "Complete an S-Rank task",
    icon: "💎",
  },
  TEN_DAY_STREAK: {
    id: "ten_day_streak",
    name: "Perseverance",
    description: "Maintain a 10-day streak",
    icon: "🔥",
  },
} as const;
