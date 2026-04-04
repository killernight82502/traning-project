"use client";

import { PREMIUM_PRODUCTS, PremiumProduct } from "@/lib/premium-products";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar3D } from "@/components/avatar-3d";
import { AnimatedBackground } from "@/components/animated-background";
import { useState } from "react";

export default function PricingPage() {
  const { user, updatePremiumStatus } = useAuth();
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleUpgrade = (product: PremiumProduct) => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Update premium status with the correct tier - this also sets the avatar
    updatePremiumStatus(true, product.tier);
    toast.success("⭐ Upgrade Successful!", {
      description: `You are now a ${product.tier} Premium Hunter! Your exclusive avatar has been equipped.`,
      duration: 5000,
    });
    
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-gray-700/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
            {process.env.NEXT_PUBLIC_SITE_NAME?.toUpperCase() || 'TIME BOT'}
          </Link>
          <Link 
            href="/" 
            className="text-sm font-medium text-gray-400 hover:text-white transition-all duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50"
          >
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="relative z-10 pt-28 pb-12 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-orange-400 text-sm font-semibold">Premium Membership</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Full Potential</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Choose your path to power. Get exclusive cosmetics, premium frames, and enhanced progression.
          </p>
        </div>
      </div>

      {/* Pricing Cards Section */}
      <div className="relative z-10 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PREMIUM_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className={`relative group transition-all duration-500 ${
                product.popular ? "md:-mt-4 md:mb-4" : ""
              }`}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Glow border */}
              <div 
                className={`absolute -inset-0.5 rounded-2xl transition-all duration-500 ${
                  product.popular 
                    ? "bg-gradient-to-r from-orange-500/40 to-yellow-500/40 opacity-100" 
                    : hoveredId === product.id
                      ? "bg-gradient-to-r from-purple-500/30 to-blue-500/30 opacity-100"
                      : "opacity-0"
                } blur-lg`}
              />
              
              <div 
                className={`relative h-full rounded-2xl border flex flex-col transition-all duration-300 ${
                  product.popular
                    ? "glass border-orange-500/30"
                    : "glass border-gray-700/30 hover:border-gray-600/50"
                } p-8`}
              >
                {product.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-500/30">
                      ⭐ Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                </div>

                {/* 3D Avatar Preview */}
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden border border-gray-700/30 bg-gray-900/30 flex items-center justify-center group/avatar">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                  <Avatar3D 
                    url={product.avatarUrl} 
                    level={product.tier === "starter" ? 5 : product.tier === "elite" ? 15 : 30}
                    jobClass={user?.jobClass || "shadow"}
                    isPremium={true}
                    gender={user?.gender || "male"}
                  />
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${
                    product.popular 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400" 
                      : "text-orange-400"
                  }`}>
                    {product.priceDisplay}
                  </span>
                  <span className="text-gray-500 text-sm font-medium">/month</span>
                </div>

                <button
                  onClick={() => handleUpgrade(product)}
                  disabled={user?.isPremium}
                  className={`relative w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 mb-8 overflow-hidden ${
                    product.popular
                      ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-black shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] disabled:hover:scale-100"
                      : "glass border border-gray-600/50 text-white hover:border-gray-500/50 disabled:hover:border-gray-600/50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="relative z-10">
                    {user?.isPremium ? "✓ Current Plan" : "Upgrade Now"}
                  </span>
                  {!user?.isPremium && product.popular && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  )}
                </button>

                <div className="space-y-4 mt-auto">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 group/feature">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        product.popular ? "bg-orange-500/20" : "bg-gray-700/50"
                      }`}>
                        <Check className={`w-3 h-3 ${product.popular ? "text-orange-400" : "text-gray-400"} transition-colors group-hover/feature:text-white`} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-gray-400 group-hover/feature:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
