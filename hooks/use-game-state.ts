"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  DIFFICULTY_RANKS,
  DifficultyRank,
  getXpForLevel,
  getCumulativeXp,
  getLevelFromXp,
  calculateTaskXp,
  ACHIEVEMENTS,
  ACHIEVEMENT_KEYS,
} from "@/lib/game-constants";

export interface Task {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: DifficultyRank;
  completed: boolean;
  completedAt?: number;
  xpReward: number;
  createdAt: number;
  recurring?: boolean;
  recurringInterval?: "daily" | "weekly";
}

export interface PlayerStats {
  totalXp: number;
  level: number;
  completedTasks: number;
  currentStreak: number;
  lastTaskDate?: number;
  unlockedAchievements: string[];
  focusSessionsCount: number;
  lateNightTasks: number;
  earlyBirdTasks: number;
  classTaskCounts: {
    shadow: number;
    knight: number;
    berserker: number;
  };
}

export interface GameState {
  tasks: Task[];
  stats: PlayerStats;
  addTask: (task: Omit<Task, "id" | "completed" | "xpReward" | "createdAt">) => void;
  completeTask: (taskId: string, awardedXp?: number) => void;
  deleteTask: (taskId: string) => void;
  editTask: (taskId: string, updates: Partial<Omit<Task, "id" | "createdAt" | "xpReward">>) => void;
  getTotalXp: () => number;
  getCurrentLevel: () => number;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getNewAchievements: () => typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS][];
  addBonusXp: (xp: number) => void;
  incrementFocusSessions: () => void;
  exportData: () => string;
  importData: (jsonString: string) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = "solo_leveling_game";

export const useGameState = (): GameState => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<PlayerStats>({
    totalXp: 0,
    level: 1,
    completedTasks: 0,
    currentStreak: 0,
    unlockedAchievements: [],
    focusSessionsCount: 0,
    lateNightTasks: 0,
    earlyBirdTasks: 0,
    classTaskCounts: { shadow: 0, knight: 0, berserker: 0 },
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { tasks: savedTasks, stats: savedStats } = JSON.parse(saved);
        setTasks(savedTasks);
        setStats(savedStats);
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, stats }));
    }
  }, [tasks, stats, isLoaded]);

  // Calculate streak
  useEffect(() => {
    if (tasks.length === 0) return;

    const completedToday = tasks.some((t) => {
      if (!t.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(t.completedAt);
      return (
        completedDate.getFullYear() === today.getFullYear() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getDate() === today.getDate()
      );
    });

    setStats((prev) => {
      const lastTask = prev.lastTaskDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (completedToday) {
        if (!lastTask) {
          return { ...prev, currentStreak: 1, lastTaskDate: today.getTime() };
        }

        const lastTaskDate = new Date(lastTask);
        lastTaskDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - lastTaskDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          return { ...prev, currentStreak: prev.currentStreak + 1, lastTaskDate: today.getTime() };
        } else if (daysDiff === 0) {
          return prev;
        } else {
          return { ...prev, currentStreak: 1, lastTaskDate: today.getTime() };
        }
      }

      return prev;
    });
  }, [tasks]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "completed" | "xpReward" | "createdAt">) => {
      const xpReward = calculateTaskXp(task.durationMinutes, task.difficulty);
      const newTask: Task = {
        ...task,
        recurring: task.recurring ?? false,
        recurringInterval: task.recurringInterval,
        id: Date.now().toString(),
        completed: false,
        xpReward,
        createdAt: Date.now(),
      };

      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const completeTask = useCallback((taskId: string, awardedXp?: number, jobClass: "shadow" | "knight" | "berserker" = "shadow") => {
    const currentHour = new Date().getHours();
    const isLateNight = currentHour >= 0 && currentHour < 4;
    const isEarlyBird = currentHour >= 4 && currentHour < 8;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: Date.now() }
          : task
      )
    );

    setStats((prev) => {
      const task = tasksRef.current.find((t) => t.id === taskId);
      if (!task) return prev;

      const finalXp = awardedXp !== undefined ? awardedXp : task.xpReward;
      const newTotalXp = prev.totalXp + finalXp;
      const newCompletedTasks = prev.completedTasks + 1;
      const { level } = getLevelFromXp(newTotalXp);
      const newUnlockedAchievements = [...prev.unlockedAchievements];

      const levelUp = level > prev.level;
      if (levelUp) {
        toast.success(`Level Up! You are now Level ${level}`, {
          description: "Your power has grown. Arise!",
          icon: "⚡",
        });
      }

      const checkAndAddAchievement = (id: string, name: string) => {
        if (!newUnlockedAchievements.includes(id)) {
          newUnlockedAchievements.push(id);
          toast.success("New Achievement Unlocked!", {
            description: `${name}: Your progress has been noticed.`,
            icon: "🏆",
          });
        }
      };

      if (prev.completedTasks === 0) {
        checkAndAddAchievement("first_task", "Awakening");
      }
      if (newCompletedTasks === 50) {
        checkAndAddAchievement("fifty_tasks", "Rising Hunter");
      }
      if (newCompletedTasks === 100) {
        checkAndAddAchievement("hundred_tasks", "Veteran Hunter");
      }
      if (newCompletedTasks === 500) {
        checkAndAddAchievement("grind_master", "Grind Master");
      }
      if (level >= 10 && prev.level < 10) {
        checkAndAddAchievement("level_10", "Ascension");
      }
      if (level >= 25 && prev.level < 25) {
        checkAndAddAchievement("level_25", "Realm Breaker");
      }
      if (level >= 50 && prev.level < 50) {
        checkAndAddAchievement("level_50", "Monarch Ascendant");
      }
      if (task.difficulty === "S") {
        checkAndAddAchievement("s_rank_task", "Legendary");
        if (!newUnlockedAchievements.includes("first_s_rank")) {
          checkAndAddAchievement("first_s_rank", "S-Rank Hunter");
        }
      }
      if (prev.currentStreak === 10 || prev.currentStreak === 11) {
        checkAndAddAchievement("ten_day_streak", "Perseverance");
      }
      if (prev.currentStreak === 20 || prev.currentStreak === 21) {
        checkAndAddAchievement("twenty_day_streak", "Unstoppable Force");
      }
      if (prev.currentStreak === 30 || prev.currentStreak === 31) {
        checkAndAddAchievement("thirty_day_streak", "Iron Will");
      }

      const newClassCounts = { ...prev.classTaskCounts };
      if (jobClass === "shadow") {
        newClassCounts.shadow += 1;
        if (newClassCounts.shadow === 25) {
          checkAndAddAchievement("dark_achieve", "Shadow Walker");
        }
      } else if (jobClass === "knight") {
        newClassCounts.knight += 1;
        if (newClassCounts.knight === 25) {
          checkAndAddAchievement("knight_champion", "Knight Champion");
        }
      } else {
        newClassCounts.berserker += 1;
        if (newClassCounts.berserker === 25) {
          checkAndAddAchievement("berserker_fury", "Berserker Fury");
        }
      }

      return {
        ...prev,
        totalXp: newTotalXp,
        level,
        completedTasks: newCompletedTasks,
        unlockedAchievements: newUnlockedAchievements,
        lateNightTasks: isLateNight ? prev.lateNightTasks + 1 : prev.lateNightTasks,
        earlyBirdTasks: isEarlyBird ? prev.earlyBirdTasks + 1 : prev.earlyBirdTasks,
        classTaskCounts: newClassCounts,
      };
    });
  }, []);

  const addBonusXp = useCallback((xp: number) => {
    setStats((prev) => {
      const newTotalXp = prev.totalXp + xp;
      const { level } = getLevelFromXp(newTotalXp);
      
      if (level > prev.level) {
        toast.success(`Level Up! You are now Level ${level}`, {
          description: "Your power has grown. Arise!",
          icon: "⚡",
        });
      }
      
      return {
        ...prev,
        totalXp: newTotalXp,
        level,
      };
    });
  }, []);

  const incrementFocusSessions = useCallback(() => {
    setStats((prev) => {
      const newCount = prev.focusSessionsCount + 1;
      if (newCount === 10 && !prev.unlockedAchievements.includes("focus_champion")) {
        toast.success("New Achievement Unlocked!", {
          description: "Focus Champion: Your focus is unmatched.",
          icon: "🏆",
        });
        return {
          ...prev,
          focusSessionsCount: newCount,
          unlockedAchievements: [...prev.unlockedAchievements, "focus_champion"],
        };
      }
      return { ...prev, focusSessionsCount: newCount };
    });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const editTask = useCallback((taskId: string, updates: Partial<Omit<Task, "id" | "createdAt" | "xpReward">>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const getTotalXp = useCallback(() => stats.totalXp, [stats.totalXp]);

  const getCurrentLevel = useCallback(() => {
    const { level } = getLevelFromXp(stats.totalXp);
    return level;
  }, [stats.totalXp]);

  const getActiveTasks = useCallback(
    () => tasks.filter((t) => !t.completed),
    [tasks]
  );

  const getCompletedTasks = useCallback(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

  const getNewAchievements = useCallback(() => {
    return stats.unlockedAchievements
      .map((id) => Object.values(ACHIEVEMENTS).find((a) => a.id === id))
      .filter(Boolean) as typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS][];
  }, [stats.unlockedAchievements]);

  const exportData = useCallback(() => {
    const data = {
      tasks,
      stats,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    return JSON.stringify(data, null, 2);
  }, [tasks, stats]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.tasks && data.stats) {
        setTasks(data.tasks);
        setStats(data.stats);
        toast.success("Data imported successfully!", {
          description: "Your progress has been restored.",
          icon: "📥",
        });
        return true;
      }
      toast.error("Invalid data format");
      return false;
    } catch {
      toast.error("Failed to import data");
      return false;
    }
  }, []);

  const resetProgress = useCallback(() => {
    setTasks([]);
    setStats({
      totalXp: 0,
      level: 1,
      completedTasks: 0,
      currentStreak: 0,
      unlockedAchievements: [],
      focusSessionsCount: 0,
      lateNightTasks: 0,
      earlyBirdTasks: 0,
      classTaskCounts: { shadow: 0, knight: 0, berserker: 0 },
    });
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Progress reset", {
      description: "Your journey starts anew.",
    });
  }, []);

  return {
    tasks,
    stats,
    addTask,
    completeTask,
    deleteTask,
    editTask,
    getTotalXp,
    getCurrentLevel,
    getActiveTasks,
    getCompletedTasks,
    getNewAchievements,
    addBonusXp,
    incrementFocusSessions,
    exportData,
    importData,
    resetProgress,
  };
};
