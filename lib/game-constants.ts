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
  LEVEL_50: {
    id: "level_50",
    name: "Monarch Ascendant",
    description: "Reach Level 50",
    icon: "🌙",
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
  TWENTY_DAY_STREAK: {
    id: "twenty_day_streak",
    name: "Unstoppable Force",
    description: "Maintain a 20-day streak",
    icon: "⚡",
  },
  THIRTY_DAY_STREAK: {
    id: "thirty_day_streak",
    name: "Iron Will",
    description: "Maintain a 30-day streak",
    icon: "🏆",
  },
  FIRST_S_RANK: {
    id: "first_s_rank",
    name: "S-Rank Hunter",
    description: "Complete your first S-rank task",
    icon: "🌟",
  },
  FIVE_A_RANK: {
    id: "five_a_rank",
    name: "Elite Hunter",
    description: "Complete 5 A-rank tasks",
    icon: "💪",
  },
  PERFECT_DAY: {
    id: "perfect_day",
    name: "Perfect Day",
    description: "Complete 5 tasks in one day",
    icon: "✨",
  },
  MARATHON: {
    id: "marathon",
    name: "Marathon",
    description: "Work on tasks for 4 hours total in one day",
    icon: "🏃",
  },
  DARK_ACHIEVER: {
    id: "dark_achieve",
    name: "Shadow Walker",
    description: "Complete 25 tasks as a Shadow class",
    icon: "🌑",
  },
  KNIGHT_CHAMPION: {
    id: "knight_champion",
    name: "Knight Champion",
    description: "Complete 25 tasks as a Knight class",
    icon: "⚔️",
  },
  BERSERKER_FURY: {
    id: "berserker_fury",
    name: "Berserker Fury",
    description: "Complete 25 tasks as a Berserker class",
    icon: "🗡️",
  },
  GRIND_MASTER: {
    id: "grind_master",
    name: "Grind Master",
    description: "Complete 500 tasks total",
    icon: "💎",
  },
  FOCUS_CHAMPION: {
    id: "focus_champion",
    name: "Focus Champion",
    description: "Use focus timer 10 times",
    icon: "🧘",
  },
  NIGHT_OWL: {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete 10 tasks after midnight",
    icon: "🦉",
  },
  EARLY_BIRD: {
    id: "early_bird",
    name: "Early Bird",
    description: "Complete 10 tasks before 8 AM",
    icon: "🐦",
  },
} as const;

export const ACHIEVEMENT_KEYS = Object.keys(ACHIEVEMENTS) as (keyof typeof ACHIEVEMENTS)[];

export const getTitleForLevel = (level: number): string => {
  if (level >= 50) return "Sovereign";
  if (level >= 40) return "Monarch";
  if (level >= 30) return "World Hunter";
  if (level >= 20) return "Elite Hunter";
  if (level >= 15) return "Advanced Hunter";
  if (level >= 10) return "Hunter";
  if (level >= 5) return "Initiate";
  if (level >= 3) return "Awakened";
  return "E-Rank Hunter";
};

export const getTitleColor = (level: number): string => {
  if (level >= 50) return "text-amber-400";
  if (level >= 40) return "text-purple-400";
  if (level >= 30) return "text-red-400";
  if (level >= 20) return "text-blue-400";
  if (level >= 10) return "text-green-400";
  return "text-gray-400";
};
