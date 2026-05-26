"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/animated-background";

// Moving Login Button Component
function MovingLoginButton({ 
  onClick, 
  isLoading, 
  isNewUser,
  isValid
}: { 
  onClick: () => void; 
  isLoading: boolean;
  isNewUser: boolean;
  isValid: boolean;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveButton = useCallback(() => {
    if (isValid || isLoading) return;
    
    setIsMoving(true);
    const moves = [
      { x: -80, y: -40, r: -15 },
      { x: 80, y: -50, r: 15 },
      { x: -60, y: 40, r: -10 },
      { x: 70, y: 30, r: 20 },
      { x: -90, y: 0, r: -25 },
      { x: 90, y: -20, r: 25 },
    ];
    
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    setPosition({ x: randomMove.x, y: randomMove.y });
    setRotation(randomMove.r);
    
    // Return to center after animation
    setTimeout(() => {
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setIsMoving(false);
    }, 600);
  }, [isValid, isLoading]);

  const handleMouseEnter = () => {
    if (!isValid && !isLoading) {
      moveButton();
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isValid) {
      e.preventDefault();
      moveButton();
      return;
    }
    onClick();
  };

  return (
    <div ref={containerRef} className="relative w-full flex justify-center items-center py-2">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        disabled={isLoading}
        className={`w-full max-w-sm
          ${isMoving ? 'transition-all duration-300 ease-out' : 'transition-all duration-500 ease-out'}
          ${isValid 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 shadow-lg shadow-green-500/30 cursor-pointer' 
            : 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/30 cursor-not-allowed'}
          text-black font-bold py-4 px-4 rounded-xl text-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
        `}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Connecting...
            </>
          ) : isNewUser ? (
            <>
              <span className="transition-transform duration-300 group-hover:rotate-12">⚔️</span>
              Begin Journey
            </>
          ) : (
            <>
              <span className="transition-transform duration-300 group-hover:translate-y-[-2px]">🚀</span>
              Ascend
            </>
          )}
        </span>
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
      
      {/* Error message when button moves */}
      {isMoving && !isValid && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <span className="text-red-400 text-sm font-semibold animate-pulse flex items-center justify-center gap-1">
            <span>😜</span> Nice try! Fill in the form first!
            <span>😜</span>
          </span>
        </div>
      )}
    </div>
  );
}

// Interactive particle that follows mouse
function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Array<{x: number, y: number, vx: number, vy: number, size: number, alpha: number, color: string}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add particles on mouse move
      if (Math.random() > 0.6) {
        const colors = ['#f97316', '#fbbf24', '#ef4444', '#a855f7'];
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          size: Math.random() * 4 + 2,
          alpha: 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines to nearby particles
      particlesRef.current.forEach((p, i) => {
        const dist = Math.hypot(p.x - mouseRef.current.x, p.y - mouseRef.current.y);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.2 * (1 - dist / 150)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        p.size *= 0.98;

        if (p.alpha > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
          ctx.fill();
          
          // Glow effect
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
          gradient.addColorStop(0, p.color + '40');
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        return p.alpha > 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-20" />;
}

// Hunter Class Types
type FreeClass = 'shadow' | 'knight' | 'berserker';
type PremiumClass = 'monarch' | 'celestial' | 'voidwalker';
type HunterClass = FreeClass | PremiumClass;

// Class definitions with stats and descriptions
const HUNTER_CLASSES: Record<HunterClass, {
  name: string;
  icon: string;
  colors: string;
  description: string;
  stats: { power: number; speed: number; defense: number; magic: number };
  abilities: string[];
  isPremium: boolean;
}> = {
  // Free Classes
  shadow: {
    name: 'Shadow Hunter',
    icon: '🗡️',
    colors: 'from-purple-500 to-violet-600',
    description: 'Masters of stealth and assassination',
    stats: { power: 85, speed: 95, defense: 40, magic: 60 },
    abilities: ['Shadow Step', 'Backstab', 'Smoke Bomb'],
    isPremium: false,
  },
  knight: {
    name: 'Holy Knight',
    icon: '⚔️',
    colors: 'from-blue-500 to-cyan-600',
    description: 'Defenders of justice with divine power',
    stats: { power: 70, speed: 60, defense: 90, magic: 50 },
    abilities: ['Holy Shield', 'Divine Strike', 'Heal'],
    isPremium: false,
  },
  berserker: {
    name: 'Berserker',
    icon: '🪓',
    colors: 'from-red-500 to-orange-600',
    description: 'Unstoppable warriors of rage',
    stats: { power: 95, speed: 75, defense: 30, magic: 20 },
    abilities: ['Rage Mode', 'Whirlwind', 'Battle Cry'],
    isPremium: false,
  },
  // Premium Classes
  monarch: {
    name: 'Shadow Monarch',
    icon: '👑',
    colors: 'from-yellow-400 via-amber-500 to-orange-500',
    description: 'The supreme ruler of shadows. Can summon shadow soldiers.',
    stats: { power: 100, speed: 90, defense: 85, magic: 100 },
    abilities: ['Arise', 'Shadow Army', 'Monarch\'s Domain', 'Absolute Command'],
    isPremium: true,
  },
  celestial: {
    name: 'Celestial Being',
    icon: '✨',
    colors: 'from-cyan-300 via-blue-400 to-purple-500',
    description: 'Ascended beings with cosmic power',
    stats: { power: 85, speed: 95, defense: 75, magic: 100 },
    abilities: ['Starfall', 'Cosmic Shield', 'Time Warp', 'Nebula Blast'],
    isPremium: true,
  },
  voidwalker: {
    name: 'Void Walker',
    icon: '🌑',
    colors: 'from-gray-800 via-purple-900 to-black',
    description: 'Masters of void magic and dimensional travel',
    stats: { power: 90, speed: 85, defense: 70, magic: 100 },
    abilities: ['Void Portal', 'Dark Matter', 'Reality Tear', 'Abyssal Gaze'],
    isPremium: true,
  },
};

// Animated class icon component
function ClassIcon({ 
  type, 
  isSelected, 
  onClick, 
  isLocked 
}: { 
  type: HunterClass; 
  isSelected: boolean; 
  onClick: () => void;
  isLocked?: boolean;
}) {
  const classData = HUNTER_CLASSES[type];
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      className={`relative group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-500 ${
        isLocked 
          ? 'opacity-40 cursor-not-allowed grayscale'
          : isSelected 
            ? 'scale-110' 
            : 'hover:scale-105 opacity-70 hover:opacity-100'
      }`}
    >
      {/* Premium glow effect */}
      {classData.isPremium && !isLocked && (
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${classData.colors} opacity-30 blur-xl animate-pulse`} />
      )}
      
      {/* Glow ring */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${classData.colors} opacity-0 ${isSelected ? 'opacity-50' : 'group-hover:opacity-30'} blur-xl transition-all duration-500`} />
      
      {/* Icon container */}
      <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${
        isSelected 
          ? `bg-gradient-to-br ${classData.colors} shadow-lg ${classData.isPremium ? 'shadow-yellow-500/50' : ''}` 
          : 'glass border border-gray-700/50 group-hover:border-gray-600/50'
      }`}>
        <span className={`transition-transform duration-500 ${isSelected ? 'animate-bounce' : 'group-hover:scale-110'}`}>
          {classData.icon}
        </span>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-xs">✓</span>
          </div>
        )}
        
        {/* Premium badge */}
        {classData.isPremium && !isLocked && (
          <div className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-[10px]">⭐</span>
          </div>
        )}
        
        {/* Lock icon */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
            <span className="text-xl">🔒</span>
          </div>
        )}
      </div>
      
      <span className={`text-xs font-bold transition-colors duration-300 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
        {classData.name}
      </span>
      
      {classData.isPremium && !isLocked && (
        <span className="text-[10px] text-yellow-400 font-semibold">PREMIUM</span>
      )}
    </button>
  );
}

// Animated stat bar
function StatBar({ label, value, color, delay, isPremium }: { label: string, value: number, color: string, delay: number, isPremium?: boolean }) {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs w-10 ${isPremium ? 'text-yellow-400' : 'text-gray-400'}`}>{label}</span>
      <div className="flex-1 h-2 bg-gray-800/50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out ${isPremium ? 'shadow-lg shadow-yellow-500/30' : ''}`}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className={`text-xs font-mono w-6 ${isPremium ? 'text-yellow-400' : 'text-white'}`}>{width}</span>
    </div>
  );
}

// Floating icons background
function FloatingIcons() {
  const icons = ['⚔️', '🗡️', '🛡️', '👑', '💎', '🔥', '⚡', '💀'];
  
  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {icons.map((icon, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-10 animate-float"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${20 + (i * 8)}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + i}s`
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [jobClass, setJobClass] = useState<HunterClass>("shadow");
  const [isPremium, setIsPremium] = useState(false);
  const [isNewUser, setIsNewUser] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPremiumPreview, setShowPremiumPreview] = useState(false);
  
  const { login, validateLogin } = useAuth();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // Typing animation
  useEffect(() => {
    const text = "Arise, Hunter!";
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setTypedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setShowContent(true);
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (password.length >= 4) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    setPasswordStrength(strength);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate before submitting
    if (!username.trim() || !password.trim()) {
      setError("Please enter both hunter name and power level");
      return;
    }
    
    setIsLoading(true);

    try {

      if (isNewUser) {
        if (login(username, password, gender, isPremium, jobClass)) {
          setTimeout(() => {
            router.push("/");
          }, 100);
        } else {
          setError("Failed to create account");
          setIsLoading(false);
        }
      } else {
        if (validateLogin(username, password)) {
          const loginSuccess = login(username, password, gender, isPremium, jobClass);
          if (loginSuccess) {
            setTimeout(() => {
              router.push("/");
            }, 100);
          } else {
            setError("Failed to login");
            setIsLoading(false);
          }
        } else {
          setError("Invalid hunter name or power level");
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.log("[v0] Login error:", err);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <InteractiveParticles />
      <FloatingIcons />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div 
          className={`w-full max-w-md transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            transform: `perspective(1000px) rotateY(${mousePosition.x * 0.2}deg) rotateX(${-mousePosition.y * 0.2}deg)`
          }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              {/* Animated glow behind logo */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-500/40 to-amber-500/40 animate-pulse-slow scale-150" />
              
              {/* Animated ring */}
              <div className="absolute -inset-8 border-2 border-orange-500/20 rounded-full animate-spin-slow" />
              <div className="absolute -inset-12 border border-orange-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }} />
              
              <div className="relative">
                <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 drop-shadow-2xl mb-1">
                  TIME
                </h1>
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 drop-shadow-2xl">
                  BOT
                </p>
              </div>
            </div>

            {/* Typing animation */}
            <div className="h-8 mt-4">
              <p className="text-orange-400 font-bold text-lg">
                {typedText}<span className="animate-pulse">|</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 my-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500 animate-pulse" />
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" 
                    style={{ animationDelay: `${i * 0.1}s` }} 
                  />
                ))}
              </div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500 animate-pulse" />
            </div>
          </div>

          {/* Login Form */}
          <div className="relative group">
            {/* Animated border glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 opacity-30 blur-lg group-hover:opacity-60 transition-all duration-700 animate-gradient-x" />
            
            <div className="relative glass rounded-2xl p-6 border border-orange-500/20 backdrop-blur-xl">
              {/* Inner gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" />
              
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-orange-500/30 rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-orange-500/30 rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-orange-500/30 rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-orange-500/30 rounded-br-2xl" />
              
              <form ref={formRef} onSubmit={handleSubmit} className="relative space-y-5">
                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                  <button
                    type="button"
                    onClick={() => { setIsNewUser(true); setError(""); }}
                    className={`flex-1 py-3 px-3 rounded-xl font-semibold transition-all duration-500 relative overflow-hidden ${
                      isNewUser
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/30 scale-105"
                        : "glass text-gray-400 hover:text-white border border-gray-700/50 hover:border-orange-500/30 hover:scale-102"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className={`transition-transform duration-300 ${isNewUser ? 'animate-bounce' : ''}`}>⚔️</span>
                      Create Account
                    </span>
                    {isNewUser && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsNewUser(false); setError(""); }}
                    className={`flex-1 py-3 px-3 rounded-xl font-semibold transition-all duration-500 relative overflow-hidden ${
                      !isNewUser
                        ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/30 scale-105"
                        : "glass text-gray-400 hover:text-white border border-gray-700/50 hover:border-orange-500/30 hover:scale-102"
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className={`transition-transform duration-300 ${!isNewUser ? 'animate-bounce' : ''}`}>🚀</span>
                      Login
                    </span>
                    {!isNewUser && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    )}
                  </button>
                </div>

                {/* Username Input */}
                <div className="group/input">
                  <label className="block text-orange-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="transition-transform duration-300 group-hover/input:scale-125">👤</span> 
                    Hunter Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your hunter name"
                      className="w-full glass border border-orange-500/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {username && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 animate-fade-in">✓</div>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="group/input">
                  <label className="block text-orange-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    <span className="transition-transform duration-300 group-hover/input:scale-125">⚡</span> 
                    Power Level
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Set your power level"
                      className="w-full glass border border-orange-500/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  
                  {/* Password strength indicator */}
                  {isNewUser && password && (
                    <div className="mt-2 space-y-1 animate-fade-in-up">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength / 20 
                                ? passwordStrength < 40 
                                  ? 'bg-red-500' 
                                  : passwordStrength < 80 
                                    ? 'bg-yellow-500' 
                                    : 'bg-green-500'
                                : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        {passwordStrength < 40 ? '⚠️ Weak' : passwordStrength < 80 ? '💪 Medium' : '🛡️ Strong'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Gender Selection - Only show on Create Account */}
                {isNewUser && (
                  <div className="space-y-4 animate-fade-in-up">
                    {/* Gender Selection */}
                    <div>
                      <label className="block text-orange-400 text-sm font-semibold mb-3 flex items-center gap-2">
                        <span>🎭</span> Choose Your Form
                      </label>
                      <div className="flex gap-3">
                        {['male', 'female'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g as "male" | "female")}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-500 relative overflow-hidden group ${
                              gender === g
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-lg shadow-orange-500/30 scale-105"
                                : "glass text-gray-400 border border-orange-500/20 hover:border-orange-500/40 hover:scale-102"
                            }`}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <span className={`text-2xl transition-transform duration-300 ${gender === g ? 'animate-bounce' : 'group-hover:scale-125'}`}>
                                {g === 'male' ? '🧔' : '👩'}
                              </span>
                              {g === 'male' ? 'Male' : 'Female'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Class Selection */}
                    <div>
                      <label className="block text-orange-400 text-sm font-semibold mb-3 flex items-center gap-2">
                        <span>⚔️</span> Choose Your Class
                      </label>
                      
                      {/* Free Classes */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2">Free Classes</p>
                        <div className="flex justify-center gap-3">
                          <ClassIcon type="shadow" isSelected={jobClass === 'shadow'} onClick={() => setJobClass('shadow')} />
                          <ClassIcon type="knight" isSelected={jobClass === 'knight'} onClick={() => setJobClass('knight')} />
                          <ClassIcon type="berserker" isSelected={jobClass === 'berserker'} onClick={() => setJobClass('berserker')} />
                        </div>
                      </div>
                      
                      {/* Premium Classes */}
                      <div className="relative">
                        <p className="text-xs text-yellow-500 mb-2 flex items-center gap-1">
                          <span>⭐</span> Premium Classes {isPremium ? '(Unlocked)' : '(Locked)'}
                        </p>
                        <div className="flex justify-center gap-3">
                          <ClassIcon 
                            type="monarch" 
                            isSelected={jobClass === 'monarch'} 
                            onClick={() => isPremium && setJobClass('monarch')} 
                            isLocked={!isPremium}
                          />
                          <ClassIcon 
                            type="celestial" 
                            isSelected={jobClass === 'celestial'} 
                            onClick={() => isPremium && setJobClass('celestial')} 
                            isLocked={!isPremium}
                          />
                          <ClassIcon 
                            type="voidwalker" 
                            isSelected={jobClass === 'voidwalker'} 
                            onClick={() => isPremium && setJobClass('voidwalker')} 
                            isLocked={!isPremium}
                          />
                        </div>
                        
                        {/* Premium preview button */}
                        {!isPremium && (
                          <button
                            type="button"
                            onClick={() => setShowPremiumPreview(!showPremiumPreview)}
                            className="mt-2 text-xs text-yellow-400 hover:text-yellow-300 underline"
                          >
                            {showPremiumPreview ? 'Hide Preview' : 'Preview Premium Classes'}
                          </button>
                        )}
                      </div>
                      
                      {/* Class Stats */}
                      <div className="mt-4 p-3 glass rounded-xl border border-gray-700/30 space-y-2 animate-fade-in-up">
                        {(() => {
                          const stats = HUNTER_CLASSES[jobClass].stats;
                          const isPremiumClass = HUNTER_CLASSES[jobClass].isPremium;
                          return (
                            <>
                              <StatBar label="PWR" value={stats.power} color={isPremiumClass ? "from-yellow-400 to-amber-500" : "from-red-500 to-orange-500"} delay={100} isPremium={isPremiumClass} />
                              <StatBar label="SPD" value={stats.speed} color={isPremiumClass ? "from-cyan-400 to-blue-500" : "from-blue-500 to-cyan-500"} delay={200} isPremium={isPremiumClass} />
                              <StatBar label="DEF" value={stats.defense} color={isPremiumClass ? "from-purple-400 to-pink-500" : "from-green-500 to-emerald-500"} delay={300} isPremium={isPremiumClass} />
                              <StatBar label="MAG" value={stats.magic} color={isPremiumClass ? "from-amber-300 to-yellow-400" : "from-purple-500 to-violet-500"} delay={400} isPremium={isPremiumClass} />
                            </>
                          );
                        })()}
                      </div>
                      
                      {/* Class Description */}
                      <div className="mt-3 p-3 glass rounded-xl border border-gray-700/30">
                        <p className="text-sm text-gray-300">
                          {HUNTER_CLASSES[jobClass].description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {HUNTER_CLASSES[jobClass].abilities.map((ability, i) => (
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${HUNTER_CLASSES[jobClass].isPremium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-orange-500/20 text-orange-400'}`}>
                              {ability}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Premium Option */}
                    <div className="relative group/premium">
                      <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-500/30 to-orange-500/30 opacity-0 group-hover/premium:opacity-100 blur transition-all duration-500" />
                      <div 
                        className={`relative glass border rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                          isPremium ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-yellow-500/20 hover:border-yellow-500/40'
                        }`}
                        onClick={() => setIsPremium(!isPremium)}
                      >
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isPremium ? 'bg-gradient-to-r from-yellow-500 to-amber-500' : 'glass border border-gray-600'
                          }`}>
                            {isPremium && <span className="text-black text-sm">✓</span>}
                          </div>
                          <div className="flex-1">
                            <span className="text-yellow-400 font-semibold flex items-center gap-2">
                              <span className={`text-xl transition-transform duration-300 ${isPremium ? 'animate-bounce' : ''}`}>⭐</span>
                              Premium Member
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              Unlock exclusive cosmetics and avatar frames
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="relative group/error animate-fade-in-up">
                    <div className="absolute -inset-1 rounded-xl bg-red-500/30 blur-sm animate-pulse" />
                    <div className="relative glass border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                      <span className="animate-bounce">⚠️</span> {error}
                    </div>
                  </div>
                )}

                {/* Moving Login Button */}
                <MovingLoginButton
                  onClick={() => formRef.current?.requestSubmit()}
                  isLoading={isLoading}
                  isNewUser={isNewUser}
                  isValid={username.trim().length > 0 && password.trim().length > 0}
                />

                {/* Info Text */}
                <p className="text-center text-gray-500 text-xs flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                  {isNewUser
                    ? "✨ Create a new hunter to begin your journey"
                    : "🔓 Login with your existing account to continue"}
                  <span className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" />
                </p>
              </form>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-8 text-gray-500 text-sm">
            <p className="flex items-center justify-center gap-3">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="text-gray-400">Defeat procrastination. Conquer laziness. Become unstoppable.</span>
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .hover\:scale-102:hover { transform: scale(1.02); }
      `}</style>
    </div>
  );
}
