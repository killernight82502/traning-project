"use client";

import { useGameState } from "@/hooks/use-game-state";
import { useAuth } from "@/hooks/use-auth";
import { useDailyChallenges } from "@/hooks/use-daily-challenges";
import { useSound } from "@/hooks/use-sound";
import { PlayerHeader } from "@/components/player-header";
import { TaskForm } from "@/components/task-form";
import { TaskCard } from "@/components/task-card";
import { StatsPanel } from "@/components/stats-panel";
import { ProgressSpiderChart } from "@/components/progress-spider-chart";
import { CosmeticsShop } from "@/components/cosmetics-shop";
import { PremiumUpgradeBanner } from "@/components/premium-upgrade-banner";
import { AnimatedBackground } from "@/components/animated-background";
import { DailyChallenges } from "@/components/daily-challenges";
import { LevelUpOverlay } from "@/components/level-up-overlay";
import { LoginRewardModal } from "@/components/login-reward-modal";
import { FocusTimer } from "@/components/focus-timer";
import { DataManager } from "@/components/data-manager";
import { WeeklyQuests } from "@/components/weekly-quests";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Task } from "@/hooks/use-game-state";
import { ThemeToggle } from "@/components/theme-toggle";

// Consistent number formatting to avoid hydration mismatch
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);
  const [showLoginReward, setShowLoginReward] = useState(false);
  const [focusTimerTask, setFocusTimerTask] = useState<Task | null>(null);
  const [previousLevel, setPreviousLevel] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [editTask, setEditTask] = useState<Task | null>(null);
  
  const gameState = useGameState();
  const { user, isLoading: authLoading, logout } = useAuth();
  const dailyChallenges = useDailyChallenges();
  const { play } = useSound();
  const router = useRouter();

  const handleAiSuggest = async () => {
    setIsGenerating(true);
    play("click");
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
        play("success");
        toast.success("System Message", {
          description: data.suggestion,
          duration: 8000
        });
      } else {
        play("error");
        toast.error("System Error", { description: data.error || "Failed to get suggestion" });
      }
    } catch (err) {
      play("error");
      toast.error("System Error", { description: "Failed to connect to the System." });
    } finally {
      setIsGenerating(false);
    }
  };

  // Track level changes for level up overlay
  useEffect(() => {
    const currentLevel = gameState.getCurrentLevel();
    if (currentLevel > previousLevel && previousLevel > 0) {
      setNewLevel(currentLevel);
      setShowLevelUp(true);
      play("levelUp");
    }
    setPreviousLevel(currentLevel);
  }, [gameState.stats.level, previousLevel, play]);

  // Show login reward on first load
  useEffect(() => {
    if (user && isLoaded && !authLoading) {
      const lastLoginDate = localStorage.getItem("timebot_last_login_date");
      const today = new Date().toDateString();
      
      if (lastLoginDate !== today) {
        localStorage.setItem("timebot_last_login_date", today);
        setTimeout(() => setShowLoginReward(true), 1000);
      }
    }
  }, [user, isLoaded, authLoading]);

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => setShowContent(true), 300);
    
    // Play "ready for battle" sound when page loads
    const soundTimer = setTimeout(() => {
      play("ready");
    }, 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(soundTimer);
    };
  }, [play]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
    // Redirect new users to avatar creator if they haven't set up their avatar
    if (!authLoading && user && !user.hasCreatedAvatar) {
      router.push("/avatar-creator");
    }
  }, [user, authLoading, router]);

  // Handle task completion with sound and daily challenge update
  const handleCompleteTask = useCallback((taskId: string, awardedXp?: number) => {
    const task = gameState.tasks.find(t => t.id === taskId);
    gameState.completeTask(taskId, awardedXp);
    play("taskComplete");
    
    // Update daily challenges
    dailyChallenges.updateProgress("tasks", 0);
    if (task) {
      dailyChallenges.updateProgress("xp", gameState.stats.totalXp + (awardedXp || task.xpReward));
      if (task.difficulty === "A" || task.difficulty === "S") {
        dailyChallenges.updateProgress("difficulty", 0, task.difficulty);
      }
    }
    dailyChallenges.updateProgress("streak", gameState.stats.currentStreak);
  }, [gameState, play, dailyChallenges]);

  // Handle focus timer complete
  const handleFocusComplete = useCallback((taskId: string, bonusXp: number) => {
    handleCompleteTask(taskId, bonusXp);
    setFocusTimerTask(null);
  }, [handleCompleteTask]);

  // Handle login reward claim
  const handleLoginRewardClaim = useCallback((xp: number, day: number) => {
    gameState.addBonusXp(xp);
    toast.success("Daily Reward Claimed!", {
      description: `You received ${xp} XP for day ${day}!`,
      icon: "🎁",
    });
    play("achievement");
  }, [gameState, play]);

  // Handle challenge reward claim
  const handleChallengeClaim = useCallback((challengeId: string) => {
    const xp = dailyChallenges.claimReward(challengeId);
    if (xp > 0) {
      play("achievement");
    }
    return xp;
  }, [dailyChallenges, play]);

  const handleLogout = () => {
    play("click");
    logout();
    toast.info("Logged Out", {
      description: "Your session has ended. Come back soon, hunter.",
    });
    router.push("/login");
  };

  const activeTasks = gameState.getActiveTasks();
  const completedTasks = gameState.getCompletedTasks();
  const level = gameState.getCurrentLevel();
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return activeTasks;
    const q = searchQuery.toLowerCase();
    return activeTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.difficulty.toLowerCase().includes(q)
    );
  }, [activeTasks, searchQuery]);

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (
    <main className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Level Up Overlay */}
      <LevelUpOverlay
        isOpen={showLevelUp}
        level={newLevel}
        onClose={() => setShowLevelUp(false)}
      />

      {/* Login Reward Modal */}
      <LoginRewardModal
        isOpen={showLoginReward}
        onClose={() => setShowLoginReward(false)}
        currentStreak={gameState.stats.currentStreak}
        onClaim={handleLoginRewardClaim}
      />

      {/* Focus Timer */}
      {focusTimerTask && (
        <FocusTimer
          taskId={focusTimerTask.id}
          taskTitle={focusTimerTask.title}
          durationMinutes={focusTimerTask.durationMinutes}
          onComplete={handleFocusComplete}
          onClose={() => setFocusTimerTask(null)}
          onSessionComplete={gameState.incrementFocusSessions}
        />
      )}
      
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
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="relative group bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/50 text-orange-400 px-4 py-2 rounded-lg font-semibold transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Logout</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </div>
        </div>

        {/* Player Header */}
        <div className={`transition-all duration-700 delay-100 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <PlayerHeader
            totalXp={gameState.stats.totalXp}
            completedTasks={gameState.stats.completedTasks}
            currentStreak={gameState.stats.currentStreak}
          />
        </div>

        {/* Rewards Shop Link */}
        <div className={`transition-all duration-700 delay-125 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-6`}>
          <a 
            href="/rewards" 
            className="block relative group overflow-hidden rounded-xl bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border border-yellow-500/30 p-4 hover:border-yellow-400/50 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/10 to-yellow-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎁</div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Rewards Shop
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Exchange your XP for real gift cards!
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">
                  {formatNumber(gameState.stats.totalXp)} XP
                </div>
                <div className="text-xs text-muted-foreground">
                  Available to spend
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Daily Challenges */}
        <div className={`transition-all duration-700 delay-150 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-6`}>
          <DailyChallenges
            challenges={dailyChallenges.challenges}
            onClaim={handleChallengeClaim}
            unclaimedCount={dailyChallenges.getUnclaimedCount()}
          />
        </div>

        {/* Weekly Quests */}
        <div className={`transition-all duration-700 delay-175 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} mb-6`}>
          <WeeklyQuests
            totalTasks={gameState.stats.completedTasks}
            totalXp={gameState.stats.totalXp}
            currentStreak={gameState.stats.currentStreak}
            focusSessions={gameState.stats.focusSessionsCount}
          />
        </div>

        {/* Premium Upgrade Banner */}
        <div className={`transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <PremiumUpgradeBanner />
        </div>

        {/* Spider Chart */}
        <div className={`transition-all duration-700 delay-250 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <ProgressSpiderChart
            totalXp={gameState.stats.totalXp}
            completedTasks={gameState.stats.completedTasks}
            currentStreak={gameState.stats.currentStreak}
            level={gameState.stats.level}
            totalTasks={gameState.tasks.length}
          />
        </div>

        {/* Cosmetics Shop */}
        <div className={`transition-all duration-700 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CosmeticsShop />
        </div>

        {/* Data Management */}
        <div className={`transition-all duration-700 delay-350 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <DataManager
            exportData={gameState.exportData}
            importData={gameState.importData}
            resetProgress={gameState.resetProgress}
          />
        </div>

        {/* Task Form */}
        <div className={`transition-all duration-700 delay-350 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <TaskForm
            editTask={editTask}
            onCancelEdit={() => setEditTask(null)}
            onSubmit={(data) => {
              play("click");
              if (editTask) {
                gameState.editTask(editTask.id, {
                  title: data.title,
                  description: data.description,
                  durationMinutes: data.durationMinutes,
                  difficulty: data.difficulty,
                  recurring: data.recurring,
                  recurringInterval: data.recurringInterval,
                });
                setEditTask(null);
              } else {
                gameState.addTask({
                  title: data.title,
                  description: data.description,
                  durationMinutes: data.durationMinutes,
                  difficulty: data.difficulty,
                  recurring: data.recurring,
                  recurringInterval: data.recurringInterval,
                });
              }
            }}
          />
        </div>

        {/* Main Content */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700 delay-400 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-glow-purple text-purple-400">⚔️</span>
                  Active Quests ({filteredTasks.length})
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="🔍 Search quests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 w-40 lg:w-48 transition-all duration-300"
                  />
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
              </div>

              {filteredTasks.length === 0 ? (
                <div className="glass rounded-xl p-8 text-center border border-gray-700/50">
                  <div className="text-6xl mb-4">{searchQuery ? "🔍" : "🎭"}</div>
                  <div className="text-gray-400 mb-2 text-lg">
                    {searchQuery ? "No quests found" : "No active quests"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {searchQuery ? `No quests match "${searchQuery}".` : "Add a new task to begin your training and gain experience points."}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 stagger-children">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onDelete={(id) => {
                        play("taskDelete");
                        gameState.deleteTask(id);
                      }}
                      onFocusMode={() => setFocusTimerTask(task)}
                      onEdit={handleEditTask}
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
                      onComplete={handleCompleteTask}
                      onDelete={(id) => {
                        play("taskDelete");
                        gameState.deleteTask(id);
                      }}
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
