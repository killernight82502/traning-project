"use client";

import { useEffect, useState, useRef } from "react";
import { getXpForLevel } from "@/lib/game-constants";

interface XpBarProps {
  currentXp: number;
  level: number;
  showAnimation?: boolean;
}

export function XpBar({ currentXp, level, showAnimation = true }: XpBarProps) {
  const [displayXp, setDisplayXp] = useState(currentXp);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; life: number }>>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const previousXpRef = useRef(currentXp);

  const xpForCurrentLevel = getXpForLevel(level);
  const progress = Math.min((displayXp / xpForCurrentLevel) * 100, 100);

  // Animate XP changes
  useEffect(() => {
    if (!showAnimation) {
      setDisplayXp(currentXp);
      return;
    }

    const previousXp = previousXpRef.current;
    if (currentXp > previousXp) {
      setIsAnimating(true);
      
      // Create particles for XP gain
      if (barRef.current) {
        const rect = barRef.current.getBoundingClientRect();
        const newParticles: typeof particles = [];
        for (let i = 0; i < 8; i++) {
          newParticles.push({
            id: Date.now() + i,
            x: rect.left + (progress / 100) * rect.width,
            y: rect.top,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3 - 2,
            life: 1,
          });
        }
        setParticles(prev => [...prev, ...newParticles]);
      }

      // Animate the number
      const duration = 1000;
      const startTime = Date.now();
      const xpDiff = currentXp - previousXp;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        setDisplayXp(Math.floor(previousXp + xpDiff * eased));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setDisplayXp(currentXp);
    }
    
    previousXpRef.current = currentXp;
  }, [currentXp, showAnimation, progress]);

  // Animate particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [particles.length]);

  return (
    <div className="relative">
      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: p.x,
            top: p.y,
            opacity: p.life,
            transform: `scale(${p.life})`,
          }}
        >
          <span className="text-amber-400 text-sm font-bold">+XP</span>
        </div>
      ))}

      {/* XP Bar Container */}
      <div className="relative">
        {/* Background glow */}
        <div 
          className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${
            isAnimating ? 'opacity-50' : 'opacity-20'
          }`}
          style={{
            background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b)',
          }}
        />

        {/* Bar background */}
        <div 
          ref={barRef}
          className="relative h-3 bg-gray-800/80 rounded-full overflow-hidden border border-amber-500/20"
        >
          {/* Progress fill */}
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #d97706, #f59e0b, #fbbf24, #f59e0b)',
              backgroundSize: '200% 100%',
              animation: isAnimating ? 'shimmer 1s linear infinite' : 'none',
            }}
          />

          {/* Shine effect */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transform: `translateX(${isAnimating ? '0' : '-100%'})`,
              transition: 'transform 1s ease-out',
            }}
          />

          {/* Sparkles when animating */}
          {isAnimating && (
            <>
              <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-ping" />
              <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
              <div className="absolute top-0 left-3/4 w-1 h-1 bg-yellow-100 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
            </>
          )}
        </div>

        {/* XP text */}
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-amber-400/80 font-medium">
            {displayXp.toLocaleString()} / {xpForCurrentLevel.toLocaleString()} XP
          </span>
          <span className="text-xs text-gray-400">
            {progress.toFixed(1)}%
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
