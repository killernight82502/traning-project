"use client";

import { COSMETICS, FREE_COSMETICS } from "@/lib/premium-cosmetics";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export function CosmeticsShop() {
  const { user, updateCosmetic } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"all" | "owned">("all");

  if (!user) return null;

  const ownedCosmetics = user.isPremium 
    ? Object.values(COSMETICS) 
    : FREE_COSMETICS;

  const displayedCosmetics = selectedTab === "owned" ? ownedCosmetics : Object.values(COSMETICS);

  return (
    <div className="relative group mb-6">
      {/* Animated border glow */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500/20 via-yellow-500/20 to-orange-500/20 opacity-75 group-hover:opacity-100 blur transition-all duration-500" />
      
      <div className="relative glass rounded-xl p-6 border border-orange-500/20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-yellow-500/5 pointer-events-none" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                Avatar Cosmetics
              </span>
            </h2>
            {user.isPremium && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 px-3 py-1.5 rounded-full">
                <span className="text-yellow-400 text-lg">⭐</span>
                <span className="text-yellow-400 text-sm font-semibold">Premium Member</span>
              </div>
            )}
          </div>

          {/* Tab Selection */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSelectedTab("all")}
              className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                selectedTab === "all"
                  ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg shadow-orange-500/30"
                  : "glass border border-gray-700/50 text-gray-400 hover:text-white hover:border-orange-500/30"
              }`}
            >
              <span className="relative z-10">🎨 All Cosmetics</span>
            </button>
            {user.isPremium && (
              <button
                onClick={() => setSelectedTab("owned")}
                className={`relative px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                  selectedTab === "owned"
                    ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg shadow-orange-500/30"
                    : "glass border border-gray-700/50 text-gray-400 hover:text-white hover:border-orange-500/30"
                }`}
              >
                <span className="relative z-10">💎 My Collection</span>
              </button>
            )}
          </div>

          {/* Cosmetics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayedCosmetics.map((cosmetic) => {
              const isOwned = user.isPremium || !cosmetic.isPremium;
              const isSelected = user.selectedCosmetic === cosmetic.id;

              return (
                <button
                  key={cosmetic.id}
                  onClick={() => {
                    if (isOwned) {
                      updateCosmetic(cosmetic.id);
                    }
                  }}
                  disabled={!isOwned}
                  className={`relative group/card p-4 rounded-xl transition-all duration-300 overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-offset-2 ring-offset-gray-900"
                      : ""
                  } ${
                    isOwned
                      ? "cursor-pointer glass hover:border-gray-600"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: cosmetic.borderColor,
                          boxShadow: `0 0 25px ${cosmetic.glowColor}, inset 0 0 20px ${cosmetic.glowColor}20`,
                        }
                      : {}
                  }
                >
                  {/* Glow effect for selected */}
                  {isSelected && (
                    <div 
                      className="absolute inset-0 opacity-20 animate-pulse-slow"
                      style={{ background: `radial-gradient(circle, ${cosmetic.glowColor}40, transparent)` }}
                    />
                  )}
                  
                  {/* Premium Badge */}
                  {cosmetic.isPremium && !isOwned && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                      ⭐ PREMIUM
                    </div>
                  )}

                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg">
                      ✓ ACTIVE
                    </div>
                  )}

                  {/* Avatar Preview */}
                  <div
                    className="w-full h-20 rounded-xl mb-3 flex items-center justify-center border-2 transition-all duration-300 group-hover/card:scale-105"
                    style={{
                      borderColor: cosmetic.color,
                      background: `linear-gradient(135deg, ${cosmetic.glowColor}30, ${cosmetic.glowColor}10)`,
                      boxShadow: `0 0 15px ${cosmetic.glowColor}30`
                    }}
                  >
                    <div
                      className="text-3xl transition-transform duration-300 group-hover/card:scale-110"
                      style={{ color: cosmetic.color }}
                    >
                      ⚔️
                    </div>
                  </div>

                  {/* Cosmetic Name */}
                  <p 
                    className="font-bold text-sm mb-1 transition-colors duration-300"
                    style={{ color: cosmetic.color }}
                  >
                    {cosmetic.name}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {cosmetic.description}
                  </p>

                  {/* Owned Status */}
                  {!isOwned && (
                    <p className="text-xs text-orange-400 mt-2 font-semibold flex items-center gap-1">
                      <span>🔒</span> Unlock with Premium
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {displayedCosmetics.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎭</div>
              <p className="text-gray-400 text-lg">No cosmetics available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
