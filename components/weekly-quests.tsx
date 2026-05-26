"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";

export interface WeeklyQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  icon: string;
  type: "tasks" | "streak" | "difficulty" | "time" | "xp" | "focus";
  target: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  expiresAt: number;
}

const WEEKLY_QUEST_TEMPLATES = [
  { title: "Weekly Warrior", description: "Complete 30 tasks this week", xpReward: 500, icon: "⚔️", type: "tasks" as const, target: 30 },
  { title: "Elite Challenger", description: "Complete 10 A-rank or higher tasks", xpReward: 600, icon: "💪", type: "difficulty" as const, target: 10 },
  { title: "Focus Master", description: "Complete 15 focus sessions", xpReward: 450, icon: "🧘", type: "focus" as const, target: 15 },
  { title: "XP Collector", description: "Earn 2000 XP this week", xpReward: 400, icon: "💰", type: "xp" as const, target: 2000 },
  { title: "Time Investment", description: "Work on tasks for 10 hours total", xpReward: 550, icon: "⏰", type: "time" as const, target: 600 },
  { title: "Streak Champion", description: "Maintain a 7-day streak", xpReward: 500, icon: "🔥", type: "streak" as const, target: 7 },
  { title: "Legendary Hunter", description: "Complete 3 S-rank tasks", xpReward: 800, icon: "👑", type: "difficulty" as const, target: 3 },
  { title: "Task Destroyer", description: "Complete 50 tasks this week", xpReward: 750, icon: "💥", type: "tasks" as const, target: 50 },
];

const STORAGE_KEY = "timebot_weekly_quests";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getWeekSeed(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 7);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

function generateWeeklyQuests(): WeeklyQuest[] {
  const seed = getWeekSeed();
  const random = seededRandom(seed);
  const shuffled = [...WEEKLY_QUEST_TEMPLATES].sort(() => random() - 0.5);
  const selected = shuffled.slice(0, 3);
  const weekEnd = Date.now() + WEEK_MS;

  return selected.map((template, index) => ({
    id: `weekly_${seed}_${index}`,
    title: template.title,
    description: template.description,
    xpReward: template.xpReward,
    icon: template.icon,
    type: template.type,
    target: template.target,
    progress: 0,
    completed: false,
    claimed: false,
    expiresAt: weekEnd,
  }));
}

interface WeeklyQuestsProps {
  totalTasks: number;
  totalXp: number;
  currentStreak: number;
  focusSessions: number;
  classTaskCounts?: { shadow: number; knight: number; berserker: number };
}

export function WeeklyQuests({ totalTasks, totalXp, currentStreak, focusSessions }: WeeklyQuestsProps) {
  const [quests, setQuests] = useState<WeeklyQuest[]>([]);
  const [expanded, setExpanded] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          setQuests(parsed.quests);
        } else {
          const newQuests = generateWeeklyQuests();
          setQuests(newQuests);
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            quests: newQuests,
            expiresAt: newQuests[0]?.expiresAt || Date.now() + WEEK_MS
          }));
        }
      } catch {
        const newQuests = generateWeeklyQuests();
        setQuests(newQuests);
      }
    } else {
      const newQuests = generateWeeklyQuests();
      setQuests(newQuests);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        quests: newQuests,
        expiresAt: newQuests[0]?.expiresAt || Date.now() + WEEK_MS
      }));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    setQuests(prev => prev.map(quest => {
      if (quest.completed) return quest;
      
      let progress = 0;
      switch (quest.type) {
        case "tasks":
          progress = totalTasks;
          break;
        case "streak":
          progress = currentStreak;
          break;
        case "focus":
          progress = focusSessions;
          break;
        case "xp":
          progress = totalXp;
          break;
      }
      
      const completed = progress >= quest.target;
      return { ...quest, progress, completed };
    }));
  }, [totalTasks, totalXp, currentStreak, focusSessions, isLoaded]);

  useEffect(() => {
    if (isLoaded && quests.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        quests,
        expiresAt: quests[0]?.expiresAt || Date.now() + WEEK_MS
      }));
    }
  }, [quests, isLoaded]);

  const claimReward = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId && q.completed && !q.claimed) {
        toast.success("Quest Complete!", {
          description: `You earned ${q.xpReward} XP for "${q.title}"`,
          icon: "🏆",
        });
        return { ...q, claimed: true };
      }
      return q;
    }));
  };

  const getTimeRemaining = () => {
    if (quests.length === 0) return "";
    const remaining = quests[0].expiresAt - Date.now();
    if (remaining <= 0) return "Expired";
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const claimableCount = quests.filter(q => q.completed && !q.claimed).length;

  return (
    <div className="glass rounded-xl border border-yellow-500/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              Weekly Quests
              {claimableCount > 0 && (
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {claimableCount} claimable
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-400">{getTimeRemaining()}</p>
          </div>
        </div>
        <span className="text-gray-400">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {expanded && (
        <div className="p-4 pt-0 space-y-3">
          {quests.map((quest) => {
            const progressPercent = Math.min((quest.progress / quest.target) * 100, 100);
            const isCompleted = quest.completed;
            const isClaimed = quest.claimed;

            return (
              <div
                key={quest.id}
                className={`relative rounded-lg p-4 transition-all duration-300 ${
                  isClaimed
                    ? "bg-gray-800/30 opacity-60"
                    : isCompleted
                    ? "bg-gradient-to-r from-yellow-900/20 to-amber-900/20 border border-yellow-500/30"
                    : "bg-gray-800/20 border border-gray-700/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl transition-transform duration-300 ${
                    isCompleted && !isClaimed ? "animate-bounce" : ""
                  }`}>
                    {quest.icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`font-semibold ${
                        isCompleted ? "text-yellow-400" : "text-white"
                      }`}>
                        {quest.title}
                      </h4>
                      <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                        <span>{quest.xpReward} XP</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-0.5">{quest.description}</p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{Math.min(quest.progress, quest.target)} / {quest.target}</span>
                      </div>
                      <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted
                              ? "bg-gradient-to-r from-yellow-500 to-amber-500"
                              : "bg-gradient-to-r from-purple-500 to-pink-500"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {isCompleted && !isClaimed && (
                      <Button
                        onClick={() => claimReward(quest.id)}
                        className="mt-3 w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-bold"
                      >
                        Claim {quest.xpReward} XP
                      </Button>
                    )}

                    {isClaimed && (
                      <div className="mt-3 text-center text-green-400 text-sm font-medium">
                        ✓ Claimed
                      </div>
                    )}
                  </div>
                </div>

                {isCompleted && !isClaimed && (
                  <div className="absolute inset-0 rounded-lg bg-yellow-500/5 animate-pulse pointer-events-none" />
                )}
              </div>
            );
          })}

          <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-700/30">
            <span className="animate-pulse inline-block mr-1">⏰</span>
            New quests available every Monday
          </div>
        </div>
      )}
    </div>
  );
}
