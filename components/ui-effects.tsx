"use client";

import { ReactNode, useState } from "react";

// Glass Card with 3D hover effect
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover3D?: boolean;
}

export function GlassCard({ children, className = "", glowColor = "rgba(139, 92, 246, 0.5)", hover3D = true }: GlassCardProps) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: "transform 0.1s ease-out",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute -inset-0.5 rounded-lg opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"
        style={{ background: `linear-gradient(135deg, ${glowColor}, transparent, ${glowColor})` }}
      />
      
      {/* Glass background */}
      <div className="relative bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </div>
  );
}

// Glowing Button
interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "success";
  disabled?: boolean;
  type?: "button" | "submit";
}

export function GlowButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  const variants = {
    primary: {
      gradient: "from-purple-600 via-purple-500 to-blue-600",
      glow: "shadow-purple-500/50",
      border: "border-purple-400/30",
    },
    secondary: {
      gradient: "from-gray-700 via-gray-600 to-gray-700",
      glow: "shadow-gray-500/30",
      border: "border-gray-400/20",
    },
    danger: {
      gradient: "from-red-600 via-red-500 to-orange-600",
      glow: "shadow-red-500/50",
      border: "border-red-400/30",
    },
    success: {
      gradient: "from-green-600 via-emerald-500 to-teal-600",
      glow: "shadow-green-500/50",
      border: "border-green-400/30",
    },
  };

  const v = variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group overflow-hidden px-6 py-3 rounded-lg font-semibold
        bg-gradient-to-r ${v.gradient} bg-size-200 bg-pos-0
        hover:bg-pos-100 transition-all duration-500
        border ${v.border}
        shadow-lg ${v.glow} shadow-lg
        hover:shadow-xl hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${className}
      `}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
}

// Animated Counter
interface AnimatedCounterProps {
  value: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, className = "", prefix = "", suffix = "" }: AnimatedCounterProps) {
  return (
    <span className={`tabular-nums ${className}`}>
      {prefix}
      <span className="inline-block animate-count-in">{value.toLocaleString()}</span>
      {suffix}
    </span>
  );
}

// Glowing Text
interface GlowingTextProps {
  children: ReactNode;
  className?: string;
  color?: "purple" | "orange" | "cyan" | "gold";
}

export function GlowingText({ children, className = "", color = "purple" }: GlowingTextProps) {
  const colors = {
    purple: "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]",
    orange: "text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]",
    cyan: "text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]",
    gold: "text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]",
  };

  return <span className={`${colors[color]} ${className}`}>{children}</span>;
}

// Floating Element
interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
}

export function FloatingElement({ children, className = "", duration = 3, distance = 10 }: FloatingElementProps) {
  return (
    <div
      className={`animate-float ${className}`}
      style={{
        animationDuration: `${duration}s`,
        "--float-distance": `${distance}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// Pulsing Dot
export function PulsingDot({ color = "bg-green-500", className = "" }: { color?: string; className?: string }) {
  return (
    <span className={`relative flex h-3 w-3 ${className}`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-3 w-3 ${color}`} />
    </span>
  );
}

// Energy Bar
interface EnergyBarProps {
  value: number;
  max: number;
  color?: "purple" | "orange" | "green" | "cyan";
  showLabel?: boolean;
  className?: string;
}

export function EnergyBar({ value, max, color = "purple", showLabel = false, className = "" }: EnergyBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colors = {
    purple: {
      gradient: "from-purple-600 via-purple-500 to-violet-500",
      glow: "shadow-purple-500/50",
      bg: "bg-purple-900/30",
    },
    orange: {
      gradient: "from-orange-600 via-orange-500 to-amber-500",
      glow: "shadow-orange-500/50",
      bg: "bg-orange-900/30",
    },
    green: {
      gradient: "from-green-600 via-emerald-500 to-teal-500",
      glow: "shadow-green-500/50",
      bg: "bg-green-900/30",
    },
    cyan: {
      gradient: "from-cyan-600 via-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/50",
      bg: "bg-cyan-900/30",
    },
  };

  const c = colors[color];

  return (
    <div className={`relative ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{value.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      )}
      <div className={`h-2 rounded-full overflow-hidden ${c.bg} backdrop-blur-sm`}>
        <div
          className={`h-full rounded-full bg-gradient-to-r ${c.gradient} shadow-lg ${c.glow} transition-all duration-500 relative overflow-hidden`}
          style={{ width: `${percentage}%` }}
        >
          {/* Animated shine */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// Neon Border
interface NeonBorderProps {
  children: ReactNode;
  color?: string;
  className?: string;
}

export function NeonBorder({ children, color = "#a855f7", className = "" }: NeonBorderProps) {
  return (
    <div className={`relative p-[1px] rounded-lg ${className}`}>
      <div
        className="absolute inset-0 rounded-lg animate-spin-slow"
        style={{
          background: `conic-gradient(from 0deg, transparent, ${color}, transparent, ${color}, transparent)`,
        }}
      />
      <div className="relative bg-gray-900 rounded-lg">{children}</div>
    </div>
  );
}
