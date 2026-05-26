"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  shape: "square" | "circle" | "star";
}

interface CelebrationEffectProps {
  isActive: boolean;
  type?: "task" | "levelup" | "achievement";
  onComplete?: () => void;
}

// Global celebration state
let celebrationCallbacks: (() => void)[] = [];

export const triggerCelebration = (type: "task" | "levelup" | "achievement" = "task") => {
  celebrationCallbacks.forEach(cb => cb());
};

export function CelebrationEffect({ isActive, type = "task", onComplete }: CelebrationEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const isActiveRef = useRef(isActive);

  const colors = {
    task: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#fbbf24", "#f59e0b"],
    levelup: ["#fbbf24", "#f59e0b", "#d97706", "#ef4444", "#f97316", "#eab308", "#ffffff"],
    achievement: ["#a855f7", "#c084fc", "#e879f9", "#f0abfc", "#fbbf24", "#fcd34d"],
  };

  const createParticles = useCallback((x: number, y: number) => {
    const particleCount = type === "levelup" ? 150 : type === "achievement" ? 100 : 60;
    const particleColors = colors[type];
    const shapes: ("square" | "circle" | "star")[] = ["square", "circle", "star"];

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = type === "levelup" ? 12 + Math.random() * 8 : 6 + Math.random() * 6;

      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (type === "levelup" ? 5 : 2),
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        size: type === "levelup" ? 8 + Math.random() * 8 : 4 + Math.random() * 6,
        life: 0,
        maxLife: type === "levelup" ? 150 : 100,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
  }, [type]);

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(
        x + Math.cos(rot) * outerRadius,
        y + Math.sin(rot) * outerRadius
      );
      rot += step;
      ctx.lineTo(
        x + Math.cos(rot) * innerRadius,
        y + Math.sin(rot) * innerRadius
      );
      rot += step;
    }
    ctx.closePath();
    ctx.fill();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.life++;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // Gravity
      particle.vx *= 0.99; // Air resistance
      particle.rotation += particle.rotationSpeed;

      if (particle.life >= particle.maxLife) return false;

      const progress = particle.life / particle.maxLife;
      const opacity = 1 - progress;
      const scale = 1 - progress * 0.5;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate((particle.rotation * Math.PI) / 180);
      ctx.scale(scale, scale);
      ctx.translate(-particle.x, -particle.y);

      ctx.globalAlpha = opacity;
      ctx.fillStyle = particle.color;

      if (particle.shape === "square") {
        ctx.fillRect(
          particle.x - particle.size / 2,
          particle.y - particle.size / 2,
          particle.size,
          particle.size
        );
      } else if (particle.shape === "circle") {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        drawStar(ctx, particle.x, particle.y, particle.size / 2);
      }

      ctx.restore();

      return true;
    });

    if (particlesRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    isActiveRef.current = isActive;
    
    if (isActive && canvasRef.current) {
      // Create particles from multiple points for level up
      if (type === "levelup") {
        createParticles(window.innerWidth / 2, window.innerHeight / 2);
        setTimeout(() => createParticles(window.innerWidth * 0.3, window.innerHeight * 0.8), 100);
        setTimeout(() => createParticles(window.innerWidth * 0.7, window.innerHeight * 0.8), 200);
      } else {
        createParticles(window.innerWidth / 2, window.innerHeight / 2);
      }
      animate();
    }
  }, [isActive, type, createParticles, animate]);

  // Register callback for global celebration trigger
  useEffect(() => {
    const trigger = () => {
      if (canvasRef.current) {
        if (type === "levelup") {
          createParticles(window.innerWidth / 2, window.innerHeight / 2);
          setTimeout(() => createParticles(window.innerWidth * 0.3, window.innerHeight * 0.8), 100);
          setTimeout(() => createParticles(window.innerWidth * 0.7, window.innerHeight * 0.8), 200);
        } else {
          createParticles(window.innerWidth / 2, window.innerHeight / 2);
        }
        animate();
      }
    };

    celebrationCallbacks.push(trigger);
    return () => {
      celebrationCallbacks = celebrationCallbacks.filter(cb => cb !== trigger);
    };
  }, [type, createParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}

// Screen shake component
export function ScreenShake({ isActive, intensity = 10 }: { isActive: boolean; intensity?: number }) {
  return (
    <style jsx global>{`
      ${isActive ? `
        body {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-${intensity}px, 0, 0); }
          20%, 80% { transform: translate3d(${intensity}px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-${intensity * 1.5}px, 0, 0); }
          40%, 60% { transform: translate3d(${intensity * 1.5}px, 0, 0); }
        }
      ` : ''}
    `}</style>
  );
}

// Flash effect component
export function FlashEffect({ isActive, color = "#fbbf24" }: { isActive: boolean; color?: string }) {
  if (!isActive) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 animate-flash"
      style={{
        background: `radial-gradient(circle at center, ${color}40, transparent 70%)`,
      }}
    />
  );
}
