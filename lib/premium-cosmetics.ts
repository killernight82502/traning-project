export interface Cosmetic {
  id: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  glowColor: string;
  isPremium: boolean;
  frameStyle: "default" | "gold" | "diamond" | "celestial" | "shadow" | "infernal";
}

export const COSMETICS: Record<string, Cosmetic> = {
  default: {
    id: "default",
    name: "Default",
    description: "Standard avatar frame",
    color: "#6366f1",
    borderColor: "#818cf8",
    glowColor: "rgba(99, 102, 241, 0.3)",
    isPremium: false,
    frameStyle: "default",
  },
  gold: {
    id: "gold",
    name: "Golden Elite",
    description: "Exclusive golden frame with premium shine",
    color: "#fbbf24",
    borderColor: "#fcd34d",
    glowColor: "rgba(251, 191, 36, 0.5)",
    isPremium: true,
    frameStyle: "gold",
  },
  diamond: {
    id: "diamond",
    name: "Diamond Crown",
    description: "Crystalline diamond-studded frame",
    color: "#06b6d4",
    borderColor: "#67e8f9",
    glowColor: "rgba(6, 182, 212, 0.6)",
    isPremium: true,
    frameStyle: "diamond",
  },
  celestial: {
    id: "celestial",
    name: "Celestial Aura",
    description: "Cosmic purple and blue ethereal frame",
    color: "#a855f7",
    borderColor: "#e879f9",
    glowColor: "rgba(168, 85, 247, 0.7)",
    isPremium: true,
    frameStyle: "celestial",
  },
  shadow: {
    id: "shadow",
    name: "Shadow Veil",
    description: "Dark enigmatic frame with crimson accents",
    color: "#1f2937",
    borderColor: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.5)",
    isPremium: true,
    frameStyle: "shadow",
  },
  infernal: {
    id: "infernal",
    name: "Infernal Flame",
    description: "Burning red and orange demonic frame",
    color: "#dc2626",
    borderColor: "#f97316",
    glowColor: "rgba(249, 115, 22, 0.7)",
    isPremium: true,
    frameStyle: "infernal",
  },
};

export const PREMIUM_COSMETICS = Object.values(COSMETICS).filter(c => c.isPremium);
export const FREE_COSMETICS = Object.values(COSMETICS).filter(c => !c.isPremium);
