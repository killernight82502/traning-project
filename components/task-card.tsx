"use client";

import { Task } from "@/hooks/use-game-state";
import { DIFFICULTY_RANKS } from "@/lib/game-constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef } from "react";
import { VerificationModal } from "./verification-modal";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string, awardedXp?: number) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const difficulty = DIFFICULTY_RANKS[task.difficulty];
  const isCompleted = task.completed;
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStartComplete = () => {
    setIsModalOpen(true);
  };

  const handleVerifySuccess = (taskId: string, xp: number) => {
    setIsModalOpen(false);
    onComplete(taskId, xp);
    toast.success("Quest Complete!", {
      description: `You earned ${xp} XP for completing "${task.title}".`,
      icon: "✨",
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast.info("Quest Removed", {
      description: `"${task.title}" has been removed from your list.`,
    });
  };

  // 3D tilt effect handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isCompleted) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  // Get difficulty color scheme
  const getDifficultyGlow = () => {
    switch (task.difficulty) {
      case 'S': return 'from-yellow-500/20 to-orange-500/20';
      case 'A': return 'from-purple-500/20 to-pink-500/20';
      case 'B': return 'from-blue-500/20 to-cyan-500/20';
      case 'C': return 'from-green-500/20 to-emerald-500/20';
      default: return 'from-gray-500/20 to-slate-500/20';
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative group transition-all duration-300 ease-out ${isCompleted ? 'opacity-60' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Animated glow border */}
      {!isCompleted && (
        <div 
          className={`absolute -inset-0.5 rounded-xl bg-gradient-to-r ${getDifficultyGlow()} opacity-0 group-hover:opacity-100 blur transition-all duration-500`}
        />
      )}
      
      <div
        className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
          isCompleted
            ? "glass border-gray-700/50"
            : "glass border-purple-500/20 hover:border-purple-500/50"
        }`}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getDifficultyGlow()} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        
        {/* Shine effect */}
        {!isCompleted && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h3
                  className={`font-semibold text-lg ${
                    isCompleted ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  {task.title}
                </h3>
                <span 
                  className={`px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-lg ${difficulty.color} transform group-hover:scale-110 transition-transform duration-300`}
                  style={{ boxShadow: `0 0 10px ${difficulty.color.includes('yellow') ? 'rgba(234,179,8,0.5)' : difficulty.color.includes('purple') ? 'rgba(168,85,247,0.5)' : difficulty.color.includes('blue') ? 'rgba(59,130,246,0.5)' : difficulty.color.includes('green') ? 'rgba(34,197,94,0.5)' : 'rgba(107,114,128,0.5)' }` }}
                >
                  {difficulty.label}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-gray-400 leading-relaxed">{task.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-full">
                <span>⏱️</span>
                <span className="text-gray-300 font-medium">{task.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                <span>⭐</span>
                <span className="font-bold">{task.xpReward} XP</span>
              </div>
            </div>
          </div>

          {task.completedAt && (
            <div className="text-xs text-green-400 mb-3 flex items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Completed {new Date(task.completedAt).toLocaleDateString()}
            </div>
          )}

          <div className="flex gap-2">
            {!isCompleted && (
              <Button
                onClick={handleStartComplete}
                className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 group/btn"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-lg">⚔️</span>
                  Complete Quest
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
              </Button>
            )}
            <Button
              onClick={handleDelete}
              variant="outline"
              className={`${isCompleted ? 'flex-1' : ''} text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all duration-300`}
            >
              {isCompleted ? "🗑️ Remove" : "Delete"}
            </Button>
          </div>
        </div>
      </div>
      
      <VerificationModal 
        task={task} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onVerifySuccess={handleVerifySuccess} 
      />
    </div>
  );
}
