"use client";

import { useState, useEffect } from "react";
import { RewardsShop } from "@/components/rewards-shop";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Reward, formatXpToDollars } from "@/lib/rewards-catalog";
import { getLevelFromXp } from "@/lib/game-constants";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Consistent number formatting to avoid hydration mismatch
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

interface Redemption {
  id: string;
  rewardId: string;
  rewardName: string;
  amount: number;
  xpSpent: number;
  provider: string;
  code: string;
  status: "pending" | "completed" | "cancelled";
  redeemedAt: Date;
}

export default function RewardsPage() {
  const [totalXp, setTotalXp] = useState(0);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const { toast } = useToast();

  const { level } = getLevelFromXp(totalXp);

  // Load data from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("solo_leveling_game");
    if (savedState) {
      const state = JSON.parse(savedState);
      setTotalXp(state.totalXp || 0);
    }

    const savedRedemptions = localStorage.getItem("timebot-redemptions");
    if (savedRedemptions) {
      setRedemptions(JSON.parse(savedRedemptions));
    }
  }, []);

  // Save redemptions to localStorage
  useEffect(() => {
    localStorage.setItem("timebot-redemptions", JSON.stringify(redemptions));
  }, [redemptions]);

  const handleRedeem = (reward: Reward) => {
    // Generate a mock gift card code
    const code = generateGiftCardCode(reward.provider);
    
    const newRedemption: Redemption = {
      id: `redemption-${Date.now()}`,
      rewardId: reward.id,
      rewardName: reward.name,
      amount: reward.amount,
      xpSpent: reward.xpCost,
      provider: reward.provider,
      code,
      status: "completed",
      redeemedAt: new Date(),
    };

    setRedemptions(prev => [newRedemption, ...prev]);

    // Deduct XP from game state
    const savedState = localStorage.getItem("solo_leveling_game");
    if (savedState) {
      const state = JSON.parse(savedState);
      state.totalXp = Math.max(0, (state.totalXp || 0) - reward.xpCost);
      localStorage.setItem("solo_leveling_game", JSON.stringify(state));
      setTotalXp(state.totalXp);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("xp-updated", { detail: { totalXp: state.totalXp } }));
    }
  };

  const generateGiftCardCode = (provider: string): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = 4;
    const segmentLength = 4;
    
    const codeSegments = [];
    for (let i = 0; i < segments; i++) {
      let segment = "";
      for (let j = 0; j < segmentLength; j++) {
        segment += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      codeSegments.push(segment);
    }
    
    return codeSegments.join("-");
  };

  const totalRedeemed = redemptions.reduce((sum, r) => sum + r.amount, 0);
  const totalXpSpent = redemptions.reduce((sum, r) => sum + r.xpSpent, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-yellow-950/20">
      {/* Header */}
      <header className="border-b border-yellow-500/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Time Bot
              </Link>
              <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                Rewards
              </Badge>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
            <div className="text-sm text-muted-foreground">Available XP</div>
            <div className="text-2xl font-bold text-yellow-400">{formatNumber(totalXp)}</div>
            <div className="text-xs text-muted-foreground">≈ {formatXpToDollars(totalXp)} value</div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/30">
            <div className="text-sm text-muted-foreground">Current Level</div>
            <div className="text-2xl font-bold text-purple-400">{level}</div>
            <div className="text-xs text-muted-foreground">Keep grinding!</div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
            <div className="text-sm text-muted-foreground">Total Redeemed</div>
            <div className="text-2xl font-bold text-green-400">${totalRedeemed}</div>
            <div className="text-xs text-muted-foreground">{redemptions.length} redemptions</div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="text-sm text-muted-foreground">XP Spent</div>
            <div className="text-2xl font-bold text-blue-400">{formatNumber(totalXpSpent)}</div>
            <div className="text-xs text-muted-foreground">On rewards</div>
          </Card>
        </div>

        {/* Main content with tabs */}
        <Tabs defaultValue="shop" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="shop">🎁 Rewards Shop</TabsTrigger>
            <TabsTrigger value="history">📋 Redemption History</TabsTrigger>
            <TabsTrigger value="how-it-works">❓ How It Works</TabsTrigger>
          </TabsList>

          <TabsContent value="shop">
            <RewardsShop 
              totalXp={totalXp} 
              onRedeem={handleRedeem}
              redemptions={redemptions}
            />
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Redemption History</h3>
              {redemptions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-2">📭</div>
                  <p>No redemptions yet</p>
                  <p className="text-sm">Complete tasks to earn XP and redeem for rewards!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {redemptions.map(redemption => (
                    <Card key={redemption.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">🎁</div>
                        <div>
                          <div className="font-semibold">{redemption.rewardName}</div>
                          <div className="text-sm text-muted-foreground">
                            Redeemed on {new Date(redemption.redeemedAt).toLocaleDateString()} at {new Date(redemption.redeemedAt).toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mt-1 bg-secondary px-2 py-1 rounded">
                            Code: {redemption.code}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-bold text-green-400 text-lg">${redemption.amount}</div>
                          <div className="text-xs text-muted-foreground">{formatNumber(redemption.xpSpent)} XP</div>
                        </div>
                        <Badge 
                          variant={redemption.status === "completed" ? "default" : "secondary"}
                          className={redemption.status === "completed" ? "bg-green-500/20 text-green-400" : ""}
                        >
                          {redemption.status}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="how-it-works">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">How XP Redemption Works</h3>
              
              <div className="grid gap-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-xl font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Complete Tasks</h4>
                    <p className="text-muted-foreground">
                      Finish your daily tasks and challenges to earn XP. The harder the task, the more XP you get!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Level Up</h4>
                    <p className="text-muted-foreground">
                      As you earn XP, you'll level up and unlock higher-value rewards. Some rewards require a minimum level.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Browse Rewards</h4>
                    <p className="text-muted-foreground">
                      Check out our rewards shop for gift cards from Amazon, Steam, Google Play, Apple, and more!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 text-xl font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Redeem & Enjoy!</h4>
                    <p className="text-muted-foreground">
                      Exchange your XP for gift cards. Your code will be delivered to your email within 24-48 hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold mb-2">💰 Exchange Rate</h4>
                <p className="text-2xl font-bold text-yellow-400">5,000 XP = $1</p>
                <p className="text-sm text-muted-foreground mt-1">
                  For example: A $10 Amazon gift card costs 50,000 XP
                </p>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="font-semibold mb-2">⚠️ Important Notes</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>XP is deducted immediately upon redemption</li>
                  <li>Gift card codes are sent to your registered email</li>
                  <li>Redemptions are final and cannot be reversed</li>
                  <li>Some rewards may have level requirements</li>
                  <li>Demo cards are for testing purposes only</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
