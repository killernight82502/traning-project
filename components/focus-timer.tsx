"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSound } from "@/hooks/use-sound";

interface FocusTimerProps {
  taskId: string;
  taskTitle: string;
  durationMinutes: number;
  onComplete: (taskId: string, bonusXp: number) => void;
  onClose: () => void;
  onSessionComplete?: () => void;
}

type TimerState = "idle" | "running" | "paused" | "completed";

export function FocusTimer({ taskId, taskTitle, durationMinutes, onComplete, onClose, onSessionComplete }: FocusTimerProps) {
  const [state, setState] = useState<TimerState>("idle");
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  const [showCelebration, setShowCelebration] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { play } = useSound();

  const totalTime = durationMinutes * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const bonusXp = Math.floor(durationMinutes * 0.5); // 50% bonus XP for focused completion

  const handleComplete = useCallback(() => {
    setState("completed");
    setShowCelebration(true);
    play("levelUp");
    toast.success("Focus Session Complete!", {
      description: `You earned ${bonusXp} bonus XP for staying focused!`,
      icon: "🎯",
      duration: 5000,
    });
    onSessionComplete?.();

    setTimeout(() => {
      onComplete(taskId, bonusXp);
    }, 2000);
  }, [bonusXp, onComplete, taskId, play, onSessionComplete]);

  useEffect(() => {
    if (state === "running" && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            handleComplete();
            return 0;
          }

          // Play countdown sound for last 5 seconds
          if (prev <= 6 && prev > 1) {
            play("countdown");
          }

          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state, timeRemaining, handleComplete, play]);

  const startTimer = () => {
    setState("running");
    play("click");
  };

  const pauseTimer = () => {
    setState("paused");
    play("click");
  };

  const resumeTimer = () => {
    setState("running");
    play("click");
  };

  const cancelTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onClose();
  };

  // Circle radius calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg">
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-amber-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: "1s",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative max-w-md w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white transition-colors"
        >
          ✕ Close
        </button>

        {/* Timer circle */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="transform -rotate-90" width="280" height="280">
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Timer display */}
          <div className="absolute flex flex-col items-center">
            <div className="text-6xl font-mono font-bold text-white">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            {state === "idle" && (
              <div className="text-gray-400 mt-2">Ready to focus?</div>
            )}
            {state === "completed" && (
              <div className="text-amber-400 font-bold mt-2 animate-pulse">
                +{bonusXp} Bonus XP!
              </div>
            )}
          </div>
        </div>

        {/* Task info */}
        <div className="text-center mb-6">
          <div className="text-gray-400 text-sm">Focusing on:</div>
          <div className="text-white font-semibold text-lg">{taskTitle}</div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {state === "idle" && (
            <>
              <Button
                onClick={startTimer}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-6 text-lg font-bold rounded-full shadow-lg shadow-green-500/30"
              >
                Start Focus
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </>
          )}

          {state === "running" && (
            <>
              <Button
                onClick={pauseTimer}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-6 text-lg font-bold rounded-full"
              >
                Pause
              </Button>
              <Button
                onClick={cancelTimer}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                End Session
              </Button>
            </>
          )}

          {state === "paused" && (
            <>
              <Button
                onClick={resumeTimer}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-6 text-lg font-bold rounded-full"
              >
                Resume
              </Button>
              <Button
                onClick={cancelTimer}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                End Session
              </Button>
            </>
          )}

          {state === "completed" && (
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold mb-4">
                Great work! Your focus paid off!
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        {state === "running" && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Stay focused! You&apos;re earning bonus XP.</p>
            <p className="mt-1">Avoid switching tabs for maximum benefit.</p>
          </div>
        )}
      </div>
    </div>
  );
}
