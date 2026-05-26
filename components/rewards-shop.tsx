"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { REWARDS_CATALOG, PROVIDER_LOGOS, Reward, formatXpToDollars } from "@/lib/rewards-catalog";
import { getLevelFromXp } from "@/lib/game-constants";
import { toast } from "sonner";

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

interface RewardsShopProps {
  totalXp: number;
  onRedeem: (reward: Reward) => void;
  redemptions: Redemption[];
}

export function RewardsShop({ totalXp, onRedeem, redemptions }: RewardsShopProps) {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { level: userLevel } = getLevelFromXp(totalXp);

  const providers = ["all", ...new Set(REWARDS_CATALOG.map(r => r.provider))];

  const filteredRewards = filter === "all" 
    ? REWARDS_CATALOG 
    : REWARDS_CATALOG.filter(r => r.provider === filter);

  const canAfford = (reward: Reward) => {
    return totalXp >= reward.xpCost && (!reward.minLevel || userLevel >= reward.minLevel);
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowConfirm(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward || !canAfford(selectedReward)) return;

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onRedeem(selectedReward);
    setShowConfirm(false);
    setSelectedReward(null);
    setIsProcessing(false);
    
    toast.success(`Successfully redeemed ${selectedReward.name}!`, {
      description: `Your ${selectedReward.provider} gift card code will be sent to your email.`,
    });
  };

  const getXpProgress = (reward: Reward) => {
    return Math.min((totalXp / reward.xpCost) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header with XP balance */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Rewards Shop
          </h2>
          <p className="text-muted-foreground">Exchange your XP for real gift cards!</p>
        </div>
        <Card className="px-4 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30">
          <div className="text-sm text-muted-foreground">Your Balance</div>
          <div className="text-2xl font-bold text-yellow-400">
            {formatNumber(totalXp)} XP
          </div>
          <div className="text-sm text-muted-foreground">
            ≈ {formatXpToDollars(totalXp)} value
          </div>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {providers.map(provider => (
          <Button
            key={provider}
            variant={filter === provider ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(provider)}
            className={filter === provider ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black" : ""}
          >
            {provider === "all" ? "All Rewards" : `${PROVIDER_LOGOS[provider] || ""} ${provider}`}
          </Button>
        ))}
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRewards.map(reward => {
          const affordable = canAfford(reward);
          const progress = getXpProgress(reward);

          return (
            <Card
              key={reward.id}
              className={`relative overflow-hidden transition-all duration-300 ${
                affordable 
                  ? "hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/10" 
                  : "opacity-60"
              }`}
            >
              {/* Popular badge */}
              {reward.popular && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs">
                    🔥 Popular
                  </Badge>
                </div>
              )}

              {/* Level lock badge */}
              {reward.minLevel && userLevel < reward.minLevel && (
                <div className="absolute top-2 left-2 z-10">
                  <Badge variant="outline" className="border-red-500/50 text-red-400 text-xs">
                    🔒 Level {reward.minLevel}+
                  </Badge>
                </div>
              )}

              <div className="p-4 space-y-3">
                {/* Provider icon */}
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{PROVIDER_LOGOS[reward.provider] || "🎁"}</div>
                  <div>
                    <div className="font-semibold">{reward.name}</div>
                    <div className="text-xs text-muted-foreground">{reward.provider}</div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-2xl font-bold text-green-400">
                  ${reward.amount}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {reward.description}
                </p>

                {/* XP cost */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className={`font-semibold ${affordable ? "text-yellow-400" : "text-red-400"}`}>
                      {formatNumber(reward.xpCost)} XP
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        affordable 
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500" 
                          : "bg-red-500/50"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Redeem button */}
                <Button
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold hover:from-yellow-400 hover:to-orange-400 disabled:opacity-50"
                  disabled={!affordable}
                  onClick={() => handleRedeemClick(reward)}
                >
                  {affordable ? "Redeem Now" : "Not Enough XP"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>
              You are about to exchange XP for a gift card.
            </DialogDescription>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              <Card className="p-4 bg-secondary/50">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{PROVIDER_LOGOS[selectedReward.provider] || "🎁"}</div>
                  <div>
                    <div className="font-semibold text-lg">{selectedReward.name}</div>
                    <div className="text-2xl font-bold text-green-400">${selectedReward.amount}</div>
                  </div>
                </div>
              </Card>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">XP Cost:</span>
                  <span className="text-yellow-400 font-semibold">{formatNumber(selectedReward.xpCost)} XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Your Balance:</span>
                  <span>{formatNumber(totalXp)} XP</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Remaining:</span>
                  <span className="text-green-400">{formatNumber(totalXp - selectedReward.xpCost)} XP</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Your gift card code will be delivered to your registered email address within 24-48 hours.
              </p>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRedeem}
              disabled={isProcessing}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : (
                "Confirm Redemption"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Recent Redemptions */}
      {redemptions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Recent Redemptions</h3>
          <div className="space-y-2">
            {redemptions.slice(0, 5).map(redemption => (
              <Card key={redemption.id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{PROVIDER_LOGOS[redemption.provider] || "🎁"}</div>
                  <div>
                    <div className="font-medium">{redemption.rewardName}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(redemption.redeemedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">${redemption.amount}</div>
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
        </div>
      )}
    </div>
  );
}
