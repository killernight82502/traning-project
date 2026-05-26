export interface Reward {
  id: string;
  name: string;
  description: string;
  type: "giftcard" | "cash";
  provider: string;
  amount: number; // Dollar value
  xpCost: number;
  image: string;
  popular?: boolean;
  minLevel?: number;
}

// Exchange rate: 5,000 XP = $1
const XP_PER_DOLLAR = 5000;

export const REWARDS_CATALOG: Reward[] = [
  // Amazon Gift Cards
  {
    id: "amazon-5",
    name: "Amazon Gift Card",
    description: "$5 Amazon.com eGift Card delivered via email",
    type: "giftcard",
    provider: "Amazon",
    amount: 5,
    xpCost: 5 * XP_PER_DOLLAR,
    image: "/rewards/amazon.png",
    popular: true,
  },
  {
    id: "amazon-10",
    name: "Amazon Gift Card",
    description: "$10 Amazon.com eGift Card delivered via email",
    type: "giftcard",
    provider: "Amazon",
    amount: 10,
    xpCost: 10 * XP_PER_DOLLAR,
    image: "/rewards/amazon.png",
    popular: true,
  },
  {
    id: "amazon-25",
    name: "Amazon Gift Card",
    description: "$25 Amazon.com eGift Card delivered via email",
    type: "giftcard",
    provider: "Amazon",
    amount: 25,
    xpCost: 25 * XP_PER_DOLLAR,
    image: "/rewards/amazon.png",
    minLevel: 10,
  },
  {
    id: "amazon-50",
    name: "Amazon Gift Card",
    description: "$50 Amazon.com eGift Card delivered via email",
    type: "giftcard",
    provider: "Amazon",
    amount: 50,
    xpCost: 50 * XP_PER_DOLLAR,
    image: "/rewards/amazon.png",
    minLevel: 20,
  },

  // Steam Gift Cards
  {
    id: "steam-5",
    name: "Steam Gift Card",
    description: "$5 Steam Wallet Code for games and DLC",
    type: "giftcard",
    provider: "Steam",
    amount: 5,
    xpCost: 5 * XP_PER_DOLLAR,
    image: "/rewards/steam.png",
    popular: true,
  },
  {
    id: "steam-10",
    name: "Steam Gift Card",
    description: "$10 Steam Wallet Code for games and DLC",
    type: "giftcard",
    provider: "Steam",
    amount: 10,
    xpCost: 10 * XP_PER_DOLLAR,
    image: "/rewards/steam.png",
  },
  {
    id: "steam-25",
    name: "Steam Gift Card",
    description: "$25 Steam Wallet Code for games and DLC",
    type: "giftcard",
    provider: "Steam",
    amount: 25,
    xpCost: 25 * XP_PER_DOLLAR,
    image: "/rewards/steam.png",
    minLevel: 10,
  },
  {
    id: "steam-50",
    name: "Steam Gift Card",
    description: "$50 Steam Wallet Code for games and DLC",
    type: "giftcard",
    provider: "Steam",
    amount: 50,
    xpCost: 50 * XP_PER_DOLLAR,
    image: "/rewards/steam.png",
    minLevel: 20,
  },

  // Google Play Gift Cards
  {
    id: "googleplay-5",
    name: "Google Play Gift Card",
    description: "$5 Google Play Store credit for apps, games, movies",
    type: "giftcard",
    provider: "Google Play",
    amount: 5,
    xpCost: 5 * XP_PER_DOLLAR,
    image: "/rewards/googleplay.png",
  },
  {
    id: "googleplay-10",
    name: "Google Play Gift Card",
    description: "$10 Google Play Store credit for apps, games, movies",
    type: "giftcard",
    provider: "Google Play",
    amount: 10,
    xpCost: 10 * XP_PER_DOLLAR,
    image: "/rewards/googleplay.png",
    popular: true,
  },
  {
    id: "googleplay-25",
    name: "Google Play Gift Card",
    description: "$25 Google Play Store credit for apps, games, movies",
    type: "giftcard",
    provider: "Google Play",
    amount: 25,
    xpCost: 25 * XP_PER_DOLLAR,
    image: "/rewards/googleplay.png",
    minLevel: 10,
  },

  // Apple Gift Cards
  {
    id: "apple-5",
    name: "Apple Gift Card",
    description: "$5 App Store & iTunes credit",
    type: "giftcard",
    provider: "Apple",
    amount: 5,
    xpCost: 5 * XP_PER_DOLLAR,
    image: "/rewards/apple.png",
  },
  {
    id: "apple-10",
    name: "Apple Gift Card",
    description: "$10 App Store & iTunes credit",
    type: "giftcard",
    provider: "Apple",
    amount: 10,
    xpCost: 10 * XP_PER_DOLLAR,
    image: "/rewards/apple.png",
  },
  {
    id: "apple-25",
    name: "Apple Gift Card",
    description: "$25 App Store & iTunes credit",
    type: "giftcard",
    provider: "Apple",
    amount: 25,
    xpCost: 25 * XP_PER_DOLLAR,
    image: "/rewards/apple.png",
    minLevel: 10,
  },

  // eBay Gift Cards
  {
    id: "ebay-10",
    name: "eBay Gift Card",
    description: "$10 eBay shopping credit",
    type: "giftcard",
    provider: "eBay",
    amount: 10,
    xpCost: 10 * XP_PER_DOLLAR,
    image: "/rewards/ebay.png",
  },
  {
    id: "ebay-25",
    name: "eBay Gift Card",
    description: "$25 eBay shopping credit",
    type: "giftcard",
    provider: "eBay",
    amount: 25,
    xpCost: 25 * XP_PER_DOLLAR,
    image: "/rewards/ebay.png",
    minLevel: 10,
  },

  // Demo/Placeholder Cards
  {
    id: "demo-1",
    name: "Demo Coffee Card",
    description: "Demo reward - $1 virtual coffee",
    type: "giftcard",
    provider: "Time Bot Demo",
    amount: 1,
    xpCost: 1 * XP_PER_DOLLAR,
    image: "/rewards/demo-coffee.png",
  },
  {
    id: "demo-5",
    name: "Demo Snack Card",
    description: "Demo reward - $5 virtual snack",
    type: "giftcard",
    provider: "Time Bot Demo",
    amount: 5,
    xpCost: 5 * XP_PER_DOLLAR,
    image: "/rewards/demo-snack.png",
  },
];

export const PROVIDER_LOGOS: Record<string, string> = {
  Amazon: "🛒",
  Steam: "🎮",
  "Google Play": "📱",
  Apple: "🍎",
  eBay: "🏷️",
  "Time Bot Demo": "🎁",
};

export function formatXpToDollars(xp: number): string {
  const dollars = xp / XP_PER_DOLLAR;
  return `$${dollars.toFixed(2)}`;
}

export function getPopularRewards(): Reward[] {
  return REWARDS_CATALOG.filter(r => r.popular);
}

export function getRewardsByProvider(provider: string): Reward[] {
  return REWARDS_CATALOG.filter(r => r.provider === provider);
}

export function getAffordableRewards(userXp: number, userLevel: number): Reward[] {
  return REWARDS_CATALOG.filter(r => 
    r.xpCost <= userXp && 
    (!r.minLevel || userLevel >= r.minLevel)
  );
}
