"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Zap, Star, Sparkles } from "lucide-react";

export function PremiumUpgradeBanner() {
  const { user } = useAuth();

  if (user?.isPremium) {
    return null; // Don't show banner to premium users
  }

  return (
    <div className="relative group mb-6 overflow-hidden">
      {/* Animated border glow */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500/30 via-yellow-500/30 to-orange-500/30 opacity-75 blur transition-all duration-500 group-hover:opacity-100 animate-gradient" style={{ backgroundSize: '200% 200%' }} />
      
      <div className="relative glass rounded-xl p-6 border border-orange-500/30 overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10 pointer-events-none" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-10 w-2 h-2 bg-yellow-500/30 rounded-full animate-float" style={{ animationDuration: '3s' }} />
          <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-orange-500/30 rounded-full animate-float" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-amber-500/30 rounded-full animate-float" style={{ animationDuration: '5s', animationDelay: '2s' }} />
        </div>
        
        <div className="relative flex items-start gap-5">
          <div className="flex-shrink-0 relative">
            <div className="absolute inset-0 bg-yellow-500/50 blur-xl rounded-full animate-pulse" />
            <div className="relative p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
              <Star className="w-8 h-8 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                Become a Premium Hunter
              </h3>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
            </div>
            
            <p className="text-gray-300 mb-5 leading-relaxed">
              Unlock exclusive avatar cosmetics, premium frames, and enhanced progression. 
              Get access to rare limited-edition designs and special features.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="relative group/btn overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Upgrade Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              </Link>
              
              <button className="relative overflow-hidden px-6 py-3 rounded-xl font-semibold transition-all duration-300 glass border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500/50">
                <span className="relative z-10">Learn More</span>
              </button>
            </div>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
                Exclusive Cosmetics
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                Premium Frames
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                Special Effects
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
