"use client";

import { useEffect, useState } from "react";
import { CelebrationEffect } from "./celebration-effect";

interface LevelUpOverlayProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpOverlay({ isOpen, level, onClose }: LevelUpOverlayProps) {
  const [showContent, setShowContent] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowParticles(true);
      setTimeout(() => setShowContent(true), 300);
      setTimeout(() => {
        setShowContent(false);
        setTimeout(() => {
          setShowParticles(false);
          onClose();
        }, 500);
      }, 3500);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !showParticles) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Celebration particles */}
      <CelebrationEffect isActive={showParticles} type="levelup" />

      {/* Dark overlay */}
      <div 
        className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div 
        className={`relative z-10 text-center transition-all duration-700 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {/* Glow ring */}
        <div className="absolute inset-0 -m-20">
          <div className="w-80 h-80 mx-auto rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-500/20 animate-spin-slow blur-xl" />
        </div>

        {/* Level up text */}
        <div className="relative">
          {/* Title */}
          <div className="text-amber-400/80 text-lg font-semibold tracking-widest mb-2 uppercase animate-pulse">
            Level Up
          </div>

          {/* Level number */}
          <div className="relative">
            <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 drop-shadow-2xl animate-gradient-x">
              {level}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>
              ⚔️
            </div>
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>
              🛡️
            </div>
          </div>

          {/* Subtitle */}
          <div className="text-xl text-gray-300 mt-4 font-medium">
            Your power has grown stronger
          </div>

          {/* Motivational message */}
          <div className="text-gray-500 mt-2 text-sm">
            "Arise, Hunter. The path ahead awaits."
          </div>

          {/* Stats boost */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-amber-400 text-2xl font-bold">+{level * 5}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Max XP Bonus</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-2xl font-bold">{level}</div>
              <div className="text-gray-500 text-xs uppercase tracking-wider">Hunter Rank</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
