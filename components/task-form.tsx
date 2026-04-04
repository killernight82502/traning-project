"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DIFFICULTY_RANKS, DifficultyRank } from "@/lib/game-constants";
import { toast } from "sonner";

interface TaskFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    durationMinutes: number;
    difficulty: DifficultyRank;
  }) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyRank>("D");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !duration) {
      toast.error("Required Fields Missing", {
        description: "Please enter a task title and estimated duration.",
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      durationMinutes: parseInt(duration),
      difficulty,
    });

    toast.success("⚔️ New Quest Added!", {
      description: `"${title}" has been added to your active quests.`,
    });

    setTitle("");
    setDescription("");
    setDuration("");
    setDifficulty("D");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full relative group overflow-hidden"
      >
        {/* Glow border */}
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 opacity-75 group-hover:opacity-100 blur transition-all duration-500" />
        
        <div className="relative glass rounded-xl py-6 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
          {/* Inner gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 rounded-xl" />
          
          <span className="relative z-10 flex items-center justify-center gap-3 text-xl font-bold">
            <span className="text-2xl">⚔️</span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Add New Quest
            </span>
            <span className="text-2xl animate-pulse">✨</span>
          </span>
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-xl" />
        </div>
      </button>
    );
  }

  return (
    <div className="relative group mb-6 animate-fade-in-up">
      {/* Glow border */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-purple-500/30 opacity-75 blur transition-all duration-500" />
      
      <form onSubmit={handleSubmit} className="relative glass rounded-xl p-6 border border-purple-500/20">
        {/* Inner gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 rounded-xl pointer-events-none" />
        
        <div className="relative space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">⚔️</span>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Create New Quest
            </h3>
          </div>

          <div className="group/input">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <span>📝</span> Quest Title *
            </label>
            <Input
              type="text"
              placeholder="e.g., Write blog post, Study React hooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-900/50 border-gray-700/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
              autoFocus
            />
          </div>

          <div className="group/input">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
              <span>📖</span> Description
            </label>
            <textarea
              placeholder="Additional details about this quest..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="group/input">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>⏱️</span> Duration (min) *
              </label>
              <Input
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="1"
                max="1440"
                className="bg-gray-900/50 border-gray-700/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300"
              />
            </div>

            <div className="group/input">
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <span>⚡</span> Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyRank)}
                className="w-full bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
              >
                {Object.entries(DIFFICULTY_RANKS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label} Rank
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty Preview */}
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <span className="text-sm text-amber-400 flex items-center gap-2">
              <span>⭐</span> XP Multiplier
            </span>
            <span className="text-lg font-bold text-amber-400">
              {DIFFICULTY_RANKS[difficulty].multiplier}x
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>⚔️</span> Create Quest
              </span>
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 glass border border-gray-600/50 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500/50 transition-all duration-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
