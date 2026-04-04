"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Loader2, Sparkles, Shield, Zap, Flame, RotateCcw, Download, Check } from "lucide-react";
import Link from "next/link";
import { AnimatedBackground } from "@/components/animated-background";
import { Avatar3D } from "@/components/avatar-3d";
import { toast } from "sonner";

// Customization options
const GENDERS = [
  { id: "male", label: "Male Hunter", icon: "🧔", description: "Strong masculine build" },
  { id: "female", label: "Female Hunter", icon: "👩", description: "Elegant feminine form" },
];

const CLASSES = [
  { 
    id: "shadow", 
    name: "Shadow Hunter", 
    icon: "🗡️", 
    description: "Swift and deadly assassin",
    color: "purple",
    gradient: "from-purple-500 to-violet-600",
  },
  { 
    id: "knight", 
    name: "Holy Knight", 
    icon: "⚔️", 
    description: "Noble defender of light",
    color: "blue",
    gradient: "from-blue-500 to-cyan-600",
  },
  { 
    id: "berserker", 
    name: "Inferno Berserker", 
    icon: "🪓", 
    description: "Raging fire warrior",
    color: "red",
    gradient: "from-red-500 to-orange-600",
  },
];

const HAIR_STYLES = {
  male: [
    { id: "spiky", name: "Spiky", icon: "🔺" },
    { id: "flowing", name: "Flowing", icon: "〰️" },
    { id: "wild", name: "Wild", icon: "🔥" },
    { id: "short", name: "Short", icon: "✂️" },
  ],
  female: [
    { id: "long", name: "Long", icon: "💇‍♀️" },
    { id: "wavy", name: "Wavy", icon: "🌊" },
    { id: "wild", name: "Wild", icon: "🔥" },
    { id: "elegant", name: "Elegant", icon: "👑" },
  ],
};

const SKIN_TONES = [
  { id: "fair", color: "#fce4d4", name: "Fair" },
  { id: "light", color: "#e8d4c4", name: "Light" },
  { id: "medium", color: "#d4a574", name: "Medium" },
  { id: "tan", color: "#c9a882", name: "Tan" },
  { id: "olive", color: "#b8a078", name: "Olive" },
  { id: "dark", color: "#8b6c5c", name: "Dark" },
];

const HAIR_COLORS = [
  { id: "black", color: "#1a1a2e", name: "Midnight" },
  { id: "brown", color: "#4a2c2a", name: "Brunette" },
  { id: "blonde", color: "#d4a574", name: "Golden" },
  { id: "red", color: "#8b2500", name: "Crimson" },
  { id: "white", color: "#e8e8e8", name: "Silver" },
  { id: "purple", color: "#9333ea", name: "Mystic" },
  { id: "blue", color: "#3b82f6", name: "Ocean" },
  { id: "pink", color: "#ec4899", name: "Rose" },
];

const EYE_COLORS = [
  { id: "blue", color: "#3b82f6", name: "Sapphire" },
  { id: "green", color: "#22c55e", name: "Emerald" },
  { id: "purple", color: "#a855f7", name: "Amethyst" },
  { id: "red", color: "#ef4444", name: "Ruby" },
  { id: "gold", color: "#fbbf24", name: "Amber" },
  { id: "silver", color: "#94a3b8", name: "Steel" },
];

interface AvatarConfig {
  gender: "male" | "female";
  jobClass: "shadow" | "knight" | "berserker";
  skinTone: string;
  hairColor: string;
  eyeColor: string;
  hairStyle: string;
}

const DEFAULT_CONFIG: AvatarConfig = {
  gender: "male",
  jobClass: "shadow",
  skinTone: "#e8d4c4",
  hairColor: "#1a1a2e",
  eyeColor: "#a855f7",
  hairStyle: "spiky",
};

export default function AvatarCreatorPage() {
  const { updateAvatarUrl, updateJobClass, isLoggedIn, isLoading: isAuthLoading, user } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<"gender" | "class" | "appearance">("gender");
  const [isSaving, setIsSaving] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [previewLevel, setPreviewLevel] = useState(15);

  useEffect(() => {
    setShowContent(true);
    // Load existing user preferences if available
    if (user) {
      setConfig(prev => ({
        ...prev,
        gender: user.gender || prev.gender,
        jobClass: user.jobClass || prev.jobClass,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isAuthLoading, isLoggedIn, router]);

  const updateConfig = <K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const randomizeConfig = useCallback(() => {
    const randomGender = GENDERS[Math.floor(Math.random() * GENDERS.length)].id as "male" | "female";
    const randomClass = CLASSES[Math.floor(Math.random() * CLASSES.length)].id as "shadow" | "knight" | "berserker";
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)].color;
    const randomHair = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].color;
    const randomEye = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].color;
    const styles = HAIR_STYLES[randomGender];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)].id;
    
    setConfig({
      gender: randomGender,
      jobClass: randomClass,
      skinTone: randomSkin,
      hairColor: randomHair,
      eyeColor: randomEye,
      hairStyle: randomStyle,
    });
    
    toast.success("🎲 Randomized!", { description: "New avatar configuration generated" });
  }, []);

  const saveAvatar = async () => {
    setIsSaving(true);
    
    try {
      // Store avatar configuration in localStorage
      localStorage.setItem("skillforge_avatar_config", JSON.stringify(config));
      
      // Update job class
      updateJobClass(config.jobClass);
      
      // Generate a custom avatar URL or use fallback
      // In a real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("⚔️ Avatar Saved!", { 
        description: "Your custom hunter has been created successfully!",
        duration: 3000,
      });
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (error) {
      toast.error("Failed to save avatar");
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/50 blur-xl rounded-full animate-pulse" />
              <Loader2 className="relative w-12 h-12 text-purple-400 animate-spin" />
            </div>
            <p className="text-purple-400 font-medium animate-pulse">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-20 glass border-b border-gray-700/30 px-6 py-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5" />
              <div className="absolute inset-0 bg-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-sm" />
            </Link>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Avatar Creator
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={randomizeConfig}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass border border-gray-700/50 hover:border-purple-500/50 text-gray-300 hover:text-white transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Randomize</span>
            </button>
            <button 
              onClick={saveAvatar}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{isSaving ? "Saving..." : "Save Avatar"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-73px)]">
        {/* 3D Preview Panel */}
        <div className="lg:w-1/2 p-6 lg:p-12 flex flex-col items-center justify-center">
          <div className={`transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Main Avatar Preview */}
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-2xl animate-pulse-slow" />
              
              <div className="relative glass rounded-2xl p-8 border border-gray-700/30">
                <div className="w-64 h-72 mx-auto flex items-center justify-center">
                  <Avatar3D 
                    url="" 
                    level={previewLevel} 
                    jobClass={config.jobClass}
                    gender={config.gender}
                    isPremium={false}
                  />
                </div>
                
                {/* Level Slider */}
                <div className="mt-6 flex items-center gap-4">
                  <span className="text-sm text-gray-400">Preview Level:</span>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    value={previewLevel}
                    onChange={(e) => setPreviewLevel(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <span className="text-white font-bold w-8">{previewLevel}</span>
                </div>
              </div>
            </div>

            {/* Config Summary */}
            <div className="mt-6 glass rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Current Configuration</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{config.gender === "male" ? "🧔" : "👩"}</span>
                  <span className="text-white capitalize">{config.gender}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CLASSES.find(c => c.id === config.jobClass)?.icon}</span>
                  <span className="text-white">{CLASSES.find(c => c.id === config.jobClass)?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: config.skinTone }} />
                  <span className="text-white">Skin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: config.hairColor }} />
                  <span className="text-white">Hair</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="lg:w-1/2 p-6 lg:p-12 overflow-y-auto">
          <div className={`max-w-xl mx-auto transition-all duration-700 delay-200 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-8">
              {[
                { id: "gender", label: "Gender", icon: "👤" },
                { id: "class", label: "Class", icon: "⚔️" },
                { id: "appearance", label: "Appearance", icon: "🎨" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "glass border border-gray-700/50 text-gray-400 hover:text-white hover:border-purple-500/30"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Gender Selection */}
            {activeTab === "gender" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Choose Your Form</h3>
                  <p className="text-gray-400 text-sm mb-6">Select your hunter's gender to determine body type and proportions.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {GENDERS.map((gender) => (
                    <button
                      key={gender.id}
                      onClick={() => updateConfig("gender", gender.id as "male" | "female")}
                      className={`relative group p-6 rounded-2xl transition-all duration-300 ${
                        config.gender === gender.id
                          ? "bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-2 border-purple-500/50 scale-105"
                          : "glass border border-gray-700/50 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{gender.icon}</span>
                        <span className={`font-bold ${config.gender === gender.id ? "text-white" : "text-gray-300"}`}>
                          {gender.label}
                        </span>
                        <span className="text-xs text-gray-500">{gender.description}</span>
                      </div>
                      
                      {config.gender === gender.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Class Selection */}
            {activeTab === "class" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Select Your Class</h3>
                  <p className="text-gray-400 text-sm mb-6">Each class has unique abilities, weapons, and visual styles.</p>
                </div>
                
                <div className="space-y-4">
                  {CLASSES.map((cls) => (
                    <button
                      key={cls.id}
                      onClick={() => updateConfig("jobClass", cls.id as "shadow" | "knight" | "berserker")}
                      className={`relative w-full group p-6 rounded-2xl transition-all duration-300 text-left ${
                        config.jobClass === cls.id
                          ? `bg-gradient-to-r ${cls.gradient} bg-opacity-30 border-2 border-${cls.color}-500/50`
                          : "glass border border-gray-700/50 hover:border-gray-600/50"
                      }`}
                      style={{
                        background: config.jobClass === cls.id ? `linear-gradient(135deg, ${cls.color === 'purple' ? 'rgba(147, 51, 234, 0.2)' : cls.color === 'blue' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)'}, transparent)` : undefined
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                          config.jobClass === cls.id ? "bg-white/10" : "bg-gray-800/50"
                        }`}>
                          {cls.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-lg ${config.jobClass === cls.id ? "text-white" : "text-gray-200"}`}>
                            {cls.name}
                          </h4>
                          <p className="text-sm text-gray-400">{cls.description}</p>
                        </div>
                        {config.jobClass === cls.id && (
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Appearance Selection */}
            {activeTab === "appearance" && (
              <div className="space-y-8 animate-fade-in-up">
                {/* Skin Tone */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Skin Tone</h3>
                  <p className="text-gray-400 text-sm mb-4">Choose your hunter's complexion.</p>
                  <div className="flex gap-3">
                    {SKIN_TONES.map((skin) => (
                      <button
                        key={skin.id}
                        onClick={() => updateConfig("skinTone", skin.color)}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 relative group ${
                          config.skinTone === skin.color 
                            ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" 
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: skin.color }}
                        title={skin.name}
                      >
                        {config.skinTone === skin.color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Hair Color</h3>
                  <p className="text-gray-400 text-sm mb-4">Select your hair shade.</p>
                  <div className="flex gap-3">
                    {HAIR_COLORS.map((hair) => (
                      <button
                        key={hair.id}
                        onClick={() => updateConfig("hairColor", hair.color)}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 relative group ${
                          config.hairColor === hair.color 
                            ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" 
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: hair.color }}
                        title={hair.name}
                      >
                        {config.hairColor === hair.color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Eye Color */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Eye Color</h3>
                  <p className="text-gray-400 text-sm mb-4">Choose your eye glow color.</p>
                  <div className="flex gap-3">
                    {EYE_COLORS.map((eye) => (
                      <button
                        key={eye.id}
                        onClick={() => updateConfig("eyeColor", eye.color)}
                        className={`w-12 h-12 rounded-xl transition-all duration-300 relative group ${
                          config.eyeColor === eye.color 
                            ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110" 
                            : "hover:scale-105"
                        }`}
                        style={{ 
                          backgroundColor: eye.color,
                          boxShadow: `0 0 20px ${eye.color}80`
                        }}
                        title={eye.name}
                      >
                        {config.eyeColor === eye.color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow-lg" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Style */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Hair Style</h3>
                  <p className="text-gray-400 text-sm mb-4">Pick your hairstyle.</p>
                  <div className="grid grid-cols-4 gap-3">
                    {HAIR_STYLES[config.gender].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => updateConfig("hairStyle", style.id)}
                        className={`py-3 px-4 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 ${
                          config.hairStyle === style.id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                            : "glass border border-gray-700/50 text-gray-300 hover:border-purple-500/30"
                        }`}
                      >
                        <span className="text-xl">{style.icon}</span>
                        <span className="text-xs font-medium">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-700/30">
              <button
                onClick={() => {
                  const tabs: Array<typeof activeTab> = ["gender", "class", "appearance"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1]);
                }}
                disabled={activeTab === "gender"}
                className="px-6 py-3 rounded-xl glass border border-gray-700/50 text-gray-300 hover:text-white hover:border-purple-500/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <button
                onClick={() => {
                  const tabs: Array<typeof activeTab> = ["gender", "class", "appearance"];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1]);
                }}
                disabled={activeTab === "appearance"}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
      `}</style>
    </div>
  );
}
