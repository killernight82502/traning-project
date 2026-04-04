"use client";

import { useGameState } from "@/hooks/use-game-state";
import { useAuth } from "@/hooks/use-auth";
import { PlayerHeader } from "@/components/player-header";
import { TaskForm } from "@/components/task-form";
import { TaskCard } from "@/components/task-card";
import { StatsPanel } from "@/components/stats-panel";
import { ProgressSpiderChart } from "@/components/progress-spider-chart";
import { CosmeticsShop } from "@/components/cosmetics-shop";
import { PremiumUpgradeBanner } from "@/components/premium-upgrade-banner";
import { AnimatedBackground } from "@/components/animated-background";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const gameState = useGameState();
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  const handleAiSuggest = async () => {
    setIsGenerating(true);
    try {
      const progress = {
        level: gameState.getCurrentLevel(),
        completed: gameState.stats.completedTasks,
        active: gameState.getActiveTasks().map(t => t.title)
      };
      
      const res = await fetch("/api/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress })
      });
      
      const data = await res.json();
      if (data.suggestion) {
        toast.success("System Message", {
          description: data.suggestion,
          duration: 8000
        });
      } else {
        toast.error("System Error", { description: data.error || "Failed to get suggestion" });
      }
    } catch (err) {
      toast.error("System Error", { description: "Failed to connect to the System." });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!isLoaded || authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="loading-orb" />
          <div className="text-purple-400 text-xl font-semibold animate-pulse">
            Loading your journey...
          </div>
        </div>
      </div>
    );
  }

  const activeTasks = gameState.getActiveTasks();
  const completedTasks = gameState.getCompletedTasks();
  const level = gameState.getCurrentLevel();

  const handleLogout = () => {
    logout();
    toast.info("Logged Out", {
      description: "Your session has ended. Come back soon, hunter.",
    });
    router.push("/login");
  };

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className={`mb-8 flex items-start justify-between transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2 animate-gradient">
              {process.env.NEXT_PUBLIC_SITE_NAME || 'Time Bot'}
            </h1>
            <p className="text-gray-400">
              Welcome, <span className="text-glow-orange text-orange-400 font-semibold">{user.username}</span>. Grow stronger by completing tasks.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="relative group bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/50 text-orange-400 px-4 py-2 rounded-lg font-semibold transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Logout</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Player Header */}
        <div className={`transition-all duration-700 delay-100 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <PlayerHeader
            totalXp={gameState.stats.totalXp}
            completedTasks={gameState.stats.completedTasks}
            currentStreak={gameState.stats.currentStreak}
          />
        </div>

        {/* Premium Upgrade Banner */}
        <div className={`transition-all duration-700 delay-150 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <PremiumUpgradeBanner />
        </div>

        {/* Spider Chart */}
        <div className={`transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ProgressSpiderChart
            totalXp={gameState.stats.totalXp}
            completedTasks={gameState.stats.completedTasks}
            currentStreak={gameState.stats.currentStreak}
            level={gameState.stats.level}
            totalTasks={gameState.tasks.length}
          />
        </div>

        {/* Cosmetics Shop */}
        <div className={`transition-all duration-700 delay-250 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CosmeticsShop />
        </div>

        {/* Task Form */}
        <div className={`transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <TaskForm
            onSubmit={(data) => {
              gameState.addTask({
                title: data.title,
                description: data.description,
                durationMinutes: data.durationMinutes,
                difficulty: data.difficulty,
              });
            }}
          />
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-350 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-glow-purple text-purple-400">⚔️</span>
                  Active Quests ({activeTasks.length})
                </h2>
                <button
                  onClick={handleAiSuggest}
                  disabled={isGenerating}
                  className="relative group bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 text-purple-300 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:opacity-50 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isGenerating ? "Consulting System..." : "✨ Ask System (AI)"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </div>

              {activeTasks.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center border border-gray-700/50">
                  <div className="text-6xl mb-4">🎭</div>
                  <div className="text-gray-400 mb-2 text-lg">No active quests</div>
                  <div className="text-sm text-gray-500">
                    Add a new task to begin your training and gain experience points.
                  </div>
                </div>
              ) : (
                <div className="space-y-3 stagger-children">
                  {activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={gameState.completeTask}
                      onDelete={gameState.deleteTask}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-glow-green text-green-400">✓</span>
                  Conquered Quests ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={gameState.completeTask}
                      onDelete={gameState.deleteTask}
                    />
                  ))}
                  {completedTasks.length > 5 && (
                    <div className="text-center text-gray-400 py-4 glass rounded-lg">
                      +{completedTasks.length - 5} more completed quests
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats & Achievements */}
          <div className="lg:col-span-1">
            <StatsPanel
              completedTasks={gameState.stats.completedTasks}
              totalXp={gameState.stats.totalXp}
              currentStreak={gameState.stats.currentStreak}
              unlockedAchievements={gameState.stats.unlockedAchievements}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-12 border-t border-gray-800/50 pt-8 text-center text-gray-500 text-sm transition-all duration-700 delay-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            Your stats are saved automatically. Keep pushing forward, hunter.
            <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          </p>
        </div>
      </div>
    </main>
  );
}
