import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  username: string;
  gender: "male" | "female";
  isPremium: boolean;
  selectedCosmetic: string;
  avatarUrl?: string;
  jobClass: "shadow" | "knight" | "berserker";
  premiumTier?: "starter" | "elite" | "sovereign";
  createdAt: number;
}

// Premium avatar URLs based on tier
const PREMIUM_AVATARS = {
  starter: "https://models.readyplayer.me/64f126588325b36417770700.glb",
  elite: "https://models.readyplayer.me/64f126b48325b36417770732.glb",
  sovereign: "https://models.readyplayer.me/64f126f58325b3641777075a.glb",
};

// Default avatar based on gender
const DEFAULT_AVATARS = {
  male: "https://models.readyplayer.me/64b584a51e5acc6fdf5c3b1a.glb",
  female: "https://models.readyplayer.me/64b584a51e5acc6fdf5c3b1b.glb",
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("timebot_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        
        // Ensure premium users have their avatar set
        if (parsedUser.isPremium && !parsedUser.avatarUrl) {
          parsedUser.avatarUrl = parsedUser.premiumTier 
            ? PREMIUM_AVATARS[parsedUser.premiumTier]
            : PREMIUM_AVATARS.elite;
          localStorage.setItem("timebot_user", JSON.stringify(parsedUser));
        }
        
        // Ensure non-premium users have a default avatar
        if (!parsedUser.isPremium && !parsedUser.avatarUrl) {
          parsedUser.avatarUrl = DEFAULT_AVATARS[parsedUser.gender];
          localStorage.setItem("timebot_user", JSON.stringify(parsedUser));
        }
        
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("timebot_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (
    username: string, 
    password: string, 
    gender: "male" | "female" = "male", 
    isPremium: boolean = false,
    jobClass: "shadow" | "knight" | "berserker" = "shadow"
  ): boolean => {
    if (!username.trim() || !password.trim()) {
      return false;
    }

    const userData: User = {
      username: username.trim(),
      gender: gender,
      isPremium: isPremium,
      selectedCosmetic: isPremium ? "golden" : "default",
      avatarUrl: isPremium 
        ? PREMIUM_AVATARS.elite 
        : DEFAULT_AVATARS[gender],
      jobClass: jobClass,
      premiumTier: isPremium ? "elite" : undefined,
      createdAt: Date.now(),
    };

    localStorage.setItem("timebot_user", JSON.stringify(userData));
    localStorage.setItem(`timebot_password_${username}`, password);
    setUser(userData);
    return true;
  };

  const updatePremiumStatus = (isPremium: boolean, tier: "starter" | "elite" | "sovereign" = "elite") => {
    if (user) {
      const avatarUrl = isPremium ? PREMIUM_AVATARS[tier] : DEFAULT_AVATARS[user.gender];
      const updatedUser: User = { 
        ...user, 
        isPremium, 
        premiumTier: isPremium ? tier : undefined,
        avatarUrl,
        selectedCosmetic: isPremium ? "golden" : user.selectedCosmetic,
      };
      localStorage.setItem("timebot_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      if (isPremium) {
        toast.success("⭐ Premium Activated!", {
          description: `Your ${tier} premium avatar has been equipped!`,
        });
      }
    }
  };

  const updateCosmetic = (cosmetic: string) => {
    if (user) {
      const updatedUser = { ...user, selectedCosmetic: cosmetic };
      localStorage.setItem("timebot_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("Cosmetic Equipped", {
        description: `Your avatar has been updated with ${cosmetic}.`,
      });
    }
  };

  const updateAvatarUrl = (url: string) => {
    if (user) {
      const updatedUser = { ...user, avatarUrl: url };
      localStorage.setItem("timebot_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("🎭 3D Avatar Updated!");
    }
  };

  const updateJobClass = (jobClass: "shadow" | "knight" | "berserker") => {
    if (user) {
      const updatedUser = { ...user, jobClass };
      localStorage.setItem("timebot_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      toast.success("⚔️ Class Chosen!", {
        description: `Your form has been changed. Arise!`,
      });
    }
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem("timebot_user");
    }
    setUser(null);
  };

  const validateLogin = (username: string, password: string): boolean => {
    const storedPassword = localStorage.getItem(`timebot_password_${username}`);
    return storedPassword === password;
  };

  return {
    user,
    isLoading,
    login,
    logout,
    validateLogin,
    isLoggedIn: !!user,
    updatePremiumStatus,
    updateCosmetic,
    updateAvatarUrl,
    updateJobClass,
  };
}
