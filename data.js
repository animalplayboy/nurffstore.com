/**
 * Default Inventory Data for Free Fire, CapCut Pro, TikTok & YouTube Channels
 */
const DATASET_VERSION = "2026.08.27.03";

const DEFAULT_ACCOUNTS = [
  // ==================== FREE FIRE ACCOUNTS ====================
  {
    id: "FF-001",
    category: "freefire",
    title: "FF Level 78 • 7 EVO Guns MAX • Old Sakura & HipHop",
    code: "FF-001",
    status: "available", // available | sale | sold
    isGrandPrize: true,
    isFeatured: true,
    priceLKR: 48500,
    origPriceLKR: 58000,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      level: 78,
      rank: "Grandmaster",
      likes: "24,500+",
      evoGuns: 7,
      evoMax: 5,
      bundles: 520,
      gunSkins: 640,
      primeLevel: "Prime Level 8",
      loginType: "Google (Direct Gmail)",
      region: "Sri Lanka / SG Server",
      uid: "1984729103"
    },
    evoList: [
      { name: "AK47 Blue Flame Draco", level: "Lv 7 (MAX)", isMax: true },
      { name: "MP40 Predatory Cobra", level: "Lv 7 (MAX)", isMax: true },
      { name: "M1014 Green Flame Draco", level: "Lv 7 (MAX)", isMax: true },
      { name: "SCAR Megalodon Alpha", level: "Lv 7 (MAX)", isMax: true },
      { name: "XM8 Destiny Guardian", level: "Lv 7 (MAX)", isMax: true },
      { name: "UMP Booyah Day", level: "Lv 5", isMax: false },
      { name: "M1887 Sterling Conqueror", level: "Lv 4", isMax: false }
    ],
    highlights: [
      "Season 1 & Season 2 Elite Pass (Sakura & HipHop)",
      "5 EVO Guns Maxed Out with Emotes",
      "Over 520+ Rare Bundles & Incubator Sets",
      "100% Safe Clean Gmail Login, Full Recovery Handover"
    ],
    description: "Extremely rare collector account! Full access direct Gmail. Never banned, clean record, top tier collection with Season 1 Sakura and HipHop bundles plus 7 Evo weapons."
  },
  {
    id: "FF-002",
    category: "freefire",
    title: "FF Level 72 • 4 EVO Guns • Master Rank • Criminal Bundle",
    code: "FF-002",
    status: "sale",
    isGrandPrize: false,
    isFeatured: true,
    priceLKR: 24500,
    origPriceLKR: 32000,
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      level: 72,
      rank: "Master",
      likes: "18,200+",
      evoGuns: 4,
      evoMax: 2,
      bundles: 380,
      gunSkins: 410,
      primeLevel: "Prime Level 6",
      loginType: "Facebook (Clean FB)",
      region: "Sri Lanka / SG Server",
      uid: "2481048291"
    },
    evoList: [
      { name: "MP40 Predatory Cobra", level: "Lv 7 (MAX)", isMax: true },
      { name: "M1014 Green Flame", level: "Lv 7 (MAX)", isMax: true },
      { name: "AK47 Blue Flame Draco", level: "Lv 4", isMax: false },
      { name: "FAMAS Demonic Grin", level: "Lv 3", isMax: false }
    ],
    highlights: [
      "Red Criminal & Yellow Criminal Bundles",
      "2 EVO Guns MAX with exclusive emotes",
      "Master Rank active with badge",
      "Instant login handover via clean FB account"
    ],
    description: "High tier competitive Free Fire account. Ready for tournament play, active Master rank, high headshot rate and famous Red Criminal bundle."
  },
  {
    id: "FF-003",
    category: "freefire",
    title: "FF Level 66 • MP40 Cobra Lv 5 • 220 Bundles • Budget Pick",
    code: "FF-003",
    status: "available",
    isGrandPrize: false,
    isFeatured: false,
    priceLKR: 9800,
    origPriceLKR: 13500,
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      level: 66,
      rank: "Heroic",
      likes: "8,900+",
      evoGuns: 2,
      evoMax: 0,
      bundles: 220,
      gunSkins: 270,
      primeLevel: "Prime Level 4",
      loginType: "Google Mail",
      region: "Sri Lanka Server",
      uid: "3109482710"
    },
    evoList: [
      { name: "MP40 Predatory Cobra", level: "Lv 5", isMax: false },
      { name: "SCAR Megalodon", level: "Lv 3", isMax: false }
    ],
    highlights: [
      "Best Budget Account with MP40 Cobra",
      "Heroic Rank Active",
      "220+ Outfit Bundles",
      "Clean Google Login with OTP handover"
    ],
    description: "Perfect budget account for beginners or ranked pushers wanting Cobra MP40 and great outfit bundles without spending huge money."
  },
  {
    id: "FF-004",
    category: "freefire",
    title: "FF Level 82 • ULTRA GRAND PRIZE • 12 EVO Guns • All Pass",
    code: "FF-004",
    status: "available",
    isGrandPrize: true,
    isFeatured: true,
    priceLKR: 89000,
    origPriceLKR: 110000,
    images: [
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      level: 82,
      rank: "Grandmaster Top 100",
      likes: "45,000+",
      evoGuns: 12,
      evoMax: 9,
      bundles: 890,
      gunSkins: 950,
      primeLevel: "Prime Level 8",
      loginType: "Google Master Account",
      region: "Sri Lanka / Global",
      uid: "1002938472"
    },
    evoList: [
      { name: "AK47 Blue Flame Draco", level: "Lv 7 (MAX)", isMax: true },
      { name: "MP40 Predatory Cobra", level: "Lv 7 (MAX)", isMax: true },
      { name: "M1014 Green Flame Draco", level: "Lv 7 (MAX)", isMax: true },
      { name: "SCAR Megalodon Alpha", level: "Lv 7 (MAX)", isMax: true },
      { name: "XM8 Destiny Guardian", level: "Lv 7 (MAX)", isMax: true },
      { name: "UMP Booyah Day", level: "Lv 7 (MAX)", isMax: true },
      { name: "M1887 Sterling Conqueror", level: "Lv 7 (MAX)", isMax: true },
      { name: "FAMAS Demonic Grin", level: "Lv 7 (MAX)", isMax: true },
      { name: "AN94 Evil Howler", level: "Lv 7 (MAX)", isMax: true }
    ],
    highlights: [
      "9 EVO Weapons completely Maxed Out",
      "Grandmaster Top 100 Leaderboard Badge",
      "Every single Elite Pass unlocked from Season 1 to Current",
      "Full ownership transfer with national ID verification proof"
    ],
    description: "The ultimate flagship Free Fire account. Suitable for famous YouTubers, esports athletes, or serious collectors."
  },

  // ==================== CAPCUT PRO ACCOUNTS ====================
  {
    id: "CC-001",
    category: "capcut",
    title: "CapCut Pro 1-Year Private Account • Multi-Device (PC/Mobile)",
    code: "CC-001",
    status: "available",
    isGrandPrize: false,
    isFeatured: true,
    priceLKR: 3900,
    origPriceLKR: 6500,
    images: [
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      planDuration: "12 Months (1 Year)",
      devices: "PC, Mac, iPhone, Android (Up to 3 Devices)",
      cloudStorage: "100 GB Cloud Storage",
      accountType: "Private Dedicated Account",
      features: "4K 60FPS, Auto-Caption, Pro Transitions, AI Effects",
      warranty: "1-Year Replacement Warranty",
      delivery: "Instant (Within 5 Minutes)"
    },
    highlights: [
      "100% Private Account (Own Email/Password Setup)",
      "Unlocks all Pro AI tools, Auto-Captions, & 4K Export",
      "Works smoothly on Windows, Mac, iOS, Android",
      "Full 12-Month Replacement Guarantee"
    ],
    description: "Get full CapCut Pro subscription with your own dedicated login. Export watermark-free 4K videos with cutting-edge AI features, auto-captions, voice changers, and unlimited Pro templates."
  },
  {
    id: "CC-002",
    category: "capcut",
    title: "CapCut Pro Lifetime VIP License • 1TB Cloud • 5 Devices",
    code: "CC-002",
    status: "sale",
    isGrandPrize: true,
    isFeatured: true,
    priceLKR: 6900,
    origPriceLKR: 11500,
    images: [
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      planDuration: "Lifetime VIP Access",
      devices: "Up to 5 Devices Simultaneously",
      cloudStorage: "1000 GB (1 TB) Cloud Storage",
      accountType: "VIP Team / Pro Member",
      features: "Ultra 4K, AI Video Upscaling, Full Pro Asset Library",
      warranty: "Lifetime Support & Auto Renew",
      delivery: "Instant Handover"
    },
    highlights: [
      "1TB Massive Cloud Backup for large video projects",
      "Use simultaneously across 5 phones and PCs",
      "Lifetime unrestricted access with auto-updates",
      "Priority WhatsApp technical support"
    ],
    description: "The premier package for video editors, content creators, and agencies. Unlimited cloud sync, AI video enhancement, and full multi-device versatility."
  },
  {
    id: "CC-003",
    category: "capcut",
    title: "CapCut Pro 1-Month Quick Pass • Fast Activation",
    code: "CC-003",
    status: "available",
    isGrandPrize: false,
    isFeatured: false,
    priceLKR: 950,
    origPriceLKR: 1500,
    images: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      planDuration: "30 Days (1 Month)",
      devices: "2 Devices",
      cloudStorage: "50 GB Cloud Storage",
      accountType: "Personal Account",
      features: "All Pro Effects & 4K Export",
      warranty: "30 Days Guaranteed",
      delivery: "Instant Handover"
    },
    highlights: [
      "Best for single-project or monthly creators",
      "All Pro effects, transitions & fonts unlocked",
      "Zero watermark on export",
      "Instant WhatsApp credentials delivery"
    ],
    description: "Affordable 1-month CapCut Pro subscription. Ideal for editing an upcoming viral clip or commercial project."
  },

  // ==================== TIKTOK ACCOUNTS ====================
  {
    id: "TT-001",
    category: "tiktok",
    title: "TikTok 125K Followers • USA Monetized (Creator Rewards) • Gaming Niche",
    code: "TT-001",
    status: "available",
    isGrandPrize: true,
    isFeatured: true,
    priceLKR: 58000,
    origPriceLKR: 72000,
    images: [
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      followers: "125,400",
      likes: "2.8 Million Likes",
      monetization: "Creator Rewards Program Active (USD Verified)",
      region: "United States (US Region)",
      niche: "Gaming & Highlights",
      liveStudio: "Unlocked (PC Live Streaming Ready)",
      strikes: "0 Strikes (100% Clean Health)",
      audience: "72% USA, 15% UK, 13% Global",
      loginType: "Direct Email Handover (Clean OGE)"
    },
    highlights: [
      "Earn real USD revenue through Creator Rewards Program",
      "Live Studio Unlocked — stream directly from OBS/PC",
      "100% Organic Viral Gaming Audience",
      "Original Creation Email (OGE) included"
    ],
    description: "Fully monetized US-based TikTok account with high RPM/CPV audience. Ready for instant income generation via gaming video uploads, live streaming, or brand sponsorships."
  },
  {
    id: "TT-002",
    category: "tiktok",
    title: "TikTok 54K Followers • UK Region • TikTok Shop & Live Studio Active",
    code: "TT-002",
    status: "sale",
    isGrandPrize: false,
    isFeatured: true,
    priceLKR: 28500,
    origPriceLKR: 36000,
    images: [
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      followers: "54,200",
      likes: "1.1 Million Likes",
      monetization: "TikTok Shop Affiliate & Creator Rewards Ready",
      region: "United Kingdom (UK Region)",
      niche: "Tech, Gadgets & Lifestyle",
      liveStudio: "Unlocked with Live Gifts enabled",
      strikes: "0 Strikes (Clean Record)",
      audience: "65% UK, 20% Europe, 15% US",
      loginType: "Clean Gmail Transfer"
    },
    highlights: [
      "TikTok Shop Affiliate Approved — Sell products for commission",
      "Live Gifts & Live Studio access enabled",
      "Viral Tech & Lifestyle niche videos",
      "Clean UK IP registration, safe for Sri Lankan creators"
    ],
    description: "High engagement UK TikTok account. Ready to start earning affiliate commissions with TikTok Shop and live streaming gifts."
  },
  {
    id: "TT-003",
    category: "tiktok",
    title: "TikTok 22K Followers • Sri Lanka / Global • Clean Organic Anime/Gaming",
    code: "TT-003",
    status: "available",
    isGrandPrize: false,
    isFeatured: false,
    priceLKR: 11500,
    origPriceLKR: 15000,
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      followers: "22,800",
      likes: "450,000 Likes",
      monetization: "Live Gifts & Creator Next Enabled",
      region: "Global / Asia",
      niche: "Anime & Gaming Edits",
      liveStudio: "Live Stream Ready",
      strikes: "0 Strikes (Clean)",
      audience: "Active Teen & Youth Gamers",
      loginType: "Email & Phone Changeable"
    },
    highlights: [
      "High daily view average on edits",
      "Live Streaming unlocked",
      "Easily rebrandable to any niche or personal store",
      "Instant handover with email link"
    ],
    description: "Affordable starter TikTok account with 22K+ real organic followers. Great for promoting your personal Free Fire channel, gaming brand, or business."
  },

  // ==================== YOUTUBE CHANNELS ====================
  {
    id: "YT-001",
    category: "youtube",
    title: "YouTube 125K Subscribers • Fully Monetized • Active AdSense • Silver Button Eligible",
    code: "YT-001",
    status: "available",
    isGrandPrize: true,
    isFeatured: true,
    priceLKR: 88500,
    origPriceLKR: 110000,
    images: [
      "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      subscribers: "125,400",
      monetization: "Partner Program Active (AdSense Linked)",
      watchHours: "85,000+ Hours",
      niche: "Gaming & Entertainment",
      strikes: "0 Strikes (100% Clean)",
      region: "Global / USA Traffic",
      delivery: "Primary Owner Transfer (7-Day Handover Safe)",
      loginType: "Direct Google Account"
    },
    highlights: [
      "YouTube Partner Program (YPP) Approved & Active",
      "Over 125K real organic subscribers with viral video catalog",
      "Zero Community Guidelines or Copyright Strikes",
      "Clean Google AdSense integration ready to change to your bank"
    ],
    description: "High-value, fully monetized YouTube channel with 125K+ organic subscribers. Ready for instant revenue via Google AdSense, sponsorships, and digital merchandise."
  },
  {
    id: "YT-002",
    category: "youtube",
    title: "YouTube 38K Subscribers • Monetized Gaming Channel • 4K Watch Hours Active",
    code: "YT-002",
    status: "sale",
    isGrandPrize: false,
    isFeatured: true,
    priceLKR: 42000,
    origPriceLKR: 55000,
    images: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      subscribers: "38,200",
      monetization: "YPP Active • Green Dollar Icon",
      watchHours: "18,400 Hours",
      niche: "Free Fire & Mobile Gaming",
      strikes: "0 Strikes (Clean)",
      region: "Asia & Global",
      delivery: "Brand Account / Owner Transfer",
      loginType: "Google Account"
    },
    highlights: [
      "Active Free Fire & Mobile Gaming Audience",
      "Live Streaming & Super Chats Enabled",
      "4,000+ Watch Hours milestone maintained",
      "Full ownership transfer via Google Brand Account"
    ],
    description: "Perfect channel for Free Fire YouTubers and streamers. Monetization active with established gaming audience, active live stream features, and clean history."
  },
  {
    id: "YT-003",
    category: "youtube",
    title: "YouTube 14K Subscribers • Shorts & Viral Edits • YPP Ready Clean Channel",
    code: "YT-003",
    status: "available",
    isGrandPrize: false,
    isFeatured: false,
    priceLKR: 18500,
    origPriceLKR: 24000,
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80"
    ],
    stats: {
      subscribers: "14,800",
      monetization: "Shorts Feed Ads & Fan Funding Ready",
      watchHours: "6,200 Hours",
      niche: "Tech, AI & Shorts",
      strikes: "0 Strikes (Clean)",
      region: "Global",
      delivery: "Instant Handover",
      loginType: "Direct Gmail"
    },
    highlights: [
      "14K+ Active organic subscribers",
      "Over 2.5 Million Shorts Views",
      "Eligible for YouTube Partner Program",
      "Safe and clean transfer guaranteed"
    ],
    description: "High growth viral Shorts channel. Ideal for starting automated AI videos, gaming shorts, or brand promotions with an existing base of 14,000+ subscribers."
  }
];

// Supported Bank / Payment Details for Checkout
const PAYMENT_METHODS = [
  {
    bankName: "Nations Trust Bank (NTB)",
    accountNumber: "200120234765",
    accountName: "W G K G H RATHNAYAKA",
    branch: "Kurunegala Branch",
    logo: "https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/ntb_logo.png",
    icon: "landmark"
  },
  {
    bankName: "People's Bank",
    accountNumber: "082200110131937",
    accountName: "W G K G H RATHNAYAKA",
    branch: "Narammala Branch",
    logo: "https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/peoples_bank_logo.png",
    icon: "landmark"
  },
  {
    bankName: "EzCash / Mobile Pay",
    accountNumber: "Coming Soon",
    accountName: "NUR STORE",
    branch: "Under Upgrade",
    logo: "https://nlhsufifscyilvoackxf.supabase.co/storage/v1/object/public/store-assets/ezcash_logo.png",
    isComingSoon: true,
    icon: "smartphone"
  }
];

// Store Contact details
const STORE_CONFIG = {
  storeName: "NUR STORE",
  subTitle: "Sri Lanka's #1 Marketplace for Free Fire, CapCut Pro, TikTok & YouTube Channels",
  whatsappNumber: "94778806366", // Official Sri Lankan WhatsApp Number
  whatsappChannelUrl: "https://whatsapp.com/channel/0029Vb98CZlGehELY8cMRu2f",
  whatsappGroupUrl: "https://chat.whatsapp.com/Ip3CpUR71Jd4LrZqqcB3Gx?s=cl&p=i&mlu=4",
  youtubeUrl: "https://youtube.com",
  tiktokUrl: "https://www.tiktok.com/@nurffstore?_r=1&_t=ZS-99DJNZKGeFc",
  facebookUrl: "https://facebook.com",
  usdRate: 310, // 1 USD = 310 LKR
  googleDriveWebhook: "https://script.google.com/macros/s/AKfycbyEGeIWyMHwopUN8Ggf6UrfqD-8ThUHk7cGz9I_70kJ2xSz9anZud1NyrOV7_OpXAluyg/exec"
};

// Supabase Realtime Cloud Database Configuration
const SUPABASE_CONFIG = {
  url: "https://nlhsufifscyilvoackxf.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5saHN1Zmlmc2N5aWx2b2Fja3hmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4MTA2NDksImV4cCI6MjEwMzM4NjY0OX0.TbC_G1aYzwBwqx4AyeOWoRyRab8Zui3OZ60nr33QjPY"
};
