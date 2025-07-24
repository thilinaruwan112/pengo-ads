
import { User, Campaign, Account, Post } from "@/types";

export const users: User[] = [
  { id: "USR001", name: "Alice Johnson", email: "alice@example.com", role: "client", avatar: "/avatars/01.png", status: "active", adAccountIds: ["act_1111", "act_5555"] },
  { id: "USR002", name: "Bob Williams", email: "bob@example.com", role: "client", avatar: "/avatars/02.png", status: "active", adAccountIds: ["act_2222"] },
  { id: "USR003", name: "Charlie Brown", email: "charlie@example.com", role: "client", avatar: "/avatars/03.png", status: "archived", adAccountIds: ["act_3333"] },
  { id: "USR004", name: "Diana Prince", email: "diana@example.com", role: "client", avatar: "/avatars/04.png", status: "active", adAccountIds: ["act_4444"] },
];

export let accounts: Account[] = [
  {
    id: "act_1111",
    name: "Alice Johnson's Account",
    accessToken: "ALICE_FAKE_TOKEN",
    clientName: "Alice Johnson",
    companyName: "Alice's Awesome Widgets",
    logoUrl: "https://placehold.co/100x100.png",
    address: "123 Widget Lane, Tech City, 12345",
    employeeRange: "11-50",
    socialLinks: {
        facebook: "https://facebook.com/alicewidgets",
        instagram: "https://instagram.com/alicewidgets",
        linkedin: "https://linkedin.com/company/alicewidgets",
    },
    campaigns: [
      {
        id: "CAM001",
        name: "Summer Sale 2024",
        status: "active",
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "A campaign to promote our summer collection with discounts up to 50%.",
        age: "18-65+",
        gender: "All",
        pageName: "Alice's Awesome Page",
        attributionSetting: "7-day click or 1-day view",
        resultType: "Website purchases",
        currency: "USD",
        startDate: "2024-07-01",
        endDate: "2024-08-31",
        dailyPerformance: [
          { date: "2024-07-28", reach: 120540, impressions: 550345, results: 2450, ctr: 2.5, cpc: 0.75, cpm: 3.50, frequency: 4.57, amountSpent: 4127.59, costPerResult: 1.68, linkClicks: 13758 },
          { date: "2024-07-27", reach: 119500, impressions: 540100, results: 2400, ctr: 2.4, cpc: 0.76, cpm: 3.55, frequency: 4.52, amountSpent: 4104.76, costPerResult: 1.71, linkClicks: 12962 },
        ]
      },
      {
        id: "CAM005",
        name: "Low Performer Example",
        status: "active",
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "This is a sample low-performing campaign.",
        age: "25-45",
        gender: "All",
        pageName: "Alice's Awesome Page",
        attributionSetting: "7-day click or 1-day view",
        resultType: "Leads",
        currency: "USD",
        startDate: "2024-07-15",
        endDate: "2024-08-15",
        dailyPerformance: [
           { date: "2024-07-28", reach: 1500, impressions: 5000, results: 10, ctr: 0.5, cpc: 3.00, cpm: 8.00, frequency: 3.33, amountSpent: 40.00, costPerResult: 4.00, linkClicks: 25 },
        ]
      },
       {
        id: "CAM007",
        name: "SR_WEDDING_Reach",
        status: "active",
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "Wedding services promotion campaign.",
        age: "24-35",
        gender: "Female",
        pageName: "Serene Weddings",
        attributionSetting: "1-day view",
        resultType: "Reach",
        currency: "LKR",
        startDate: "2024-06-01",
        dailyPerformance: [
          { date: "2024-07-28", reach: 718870, impressions: 171561, results: 191, ctr: 0.53, cpc: 10.51, cpm: 8.75, amountSpent: 1501.16, costPerResult: 7.86, linkClicks: 909 },
        ]
      },
      {
        id: "CAM008",
        name: "SR_WEDDING_Leads",
        status: "active",
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "Wedding services promotion campaign.",
        age: "24-35",
        gender: "Female",
        pageName: "Serene Weddings",
        attributionSetting: "7-day click",
        resultType: "Leads",
        currency: "LKR",
        startDate: "2024-06-01",
        dailyPerformance: [
          { date: "2024-07-28", reach: 9136, impressions: 10291, results: 60, ctr: 1.66, cpc: 32.93, cpm: 34.31, amountSpent: 1975.80, costPerResult: 32.93, linkClicks: 171 }
        ]
      },
      {
        id: "CAM009",
        name: "SR_WEDDING_Conversions",
        status: "active",
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "Wedding services promotion campaign.",
        age: "24-35",
        gender: "Female",
        pageName: "Serene Weddings",
        attributionSetting: "7-day click or 1-day view",
        resultType: "Conversions",
        currency: "LKR",
        startDate: "2024-06-01",
        dailyPerformance: [
            { date: "2024-07-28", reach: 179781, impressions: 395925, results: 331, ctr: 0.14, cpc: 10.45, cpm: 3.65, amountSpent: 3459.45, costPerResult: 10.45, linkClicks: 554 }
        ]
      }
    ]
  },
  {
    id: "act_5555",
    name: "Alice Johnson's Second Account",
    accessToken: "ALICE_FAKE_TOKEN_2",
    clientName: "Alice Johnson",
    companyName: "Alice's Garden Supplies",
    logoUrl: "https://placehold.co/100x100.png",
    address: "456 Bloom Ave, Flora Town, 54321",
    employeeRange: "1-10",
    campaigns: [
       {
        id: "CAM006",
        name: "Spring Planting Sale",
        status: "active",
        platform: "Instagram",
        linked: true,
        client: "Alice Johnson",
        description: "Sale on all spring gardening essentials.",
        age: "30-55",
        gender: "All",
        pageName: "Alice's Garden",
        attributionSetting: "1-day click",
        resultType: "Post engagement",
        currency: "USD",
        startDate: "2024-03-01",
        endDate: "2024-04-30",
        dailyPerformance: [
            { date: "2024-07-28", reach: 85000, impressions: 320000, results: 1500, ctr: 3.1, cpc: 0.90, cpm: 4.10, frequency: 3.76, amountSpent: 1312.00, costPerResult: 0.87, linkClicks: 9920 }
        ]
      },
    ]
  },
  {
    id: "act_2222",
    name: "Bob Williams' Account",
    accessToken: "BOB_FAKE_TOKEN",
    clientName: "Bob Williams",
    companyName: "Bob's Burger Bar",
    logoUrl: "https://placehold.co/100x100.png",
    campaigns: [
       {
        id: "CAM002",
        name: "New Product Launch",
        status: "paused",
        platform: "Instagram",
        linked: true,
        client: "Bob Williams",
        description: "Launching the new X-series gadget.",
        age: "18-35",
        gender: "All",
        pageName: "Bob's Tech",
        attributionSetting: "7-day click",
        resultType: "Link clicks",
        currency: "USD",
        startDate: "2024-07-10",
        dailyPerformance: [
            { date: "2024-07-28", reach: 56780, impressions: 210890, results: 890, ctr: 1.8, cpc: 1.20, cpm: 5.20, frequency: 3.71, amountSpent: 1096.63, costPerResult: 1.23, linkClicks: 3796 }
        ]
      },
    ]
  },
  {
    id: "act_3333",
    name: "Charlie Brown's Account",
    accessToken: "CHARLIE_FAKE_TOKEN",
    clientName: "Charlie Brown",
    companyName: "Charlie's Cybernetics",
    logoUrl: "https://placehold.co/100x100.png",
    campaigns: [
      {
        id: "CAM003",
        name: "Brand Awareness Q3",
        status: "active",
        platform: "Facebook",
        linked: false,
        client: "Charlie Brown",
        description: "General brand awareness campaign.",
        age: "18-65+",
        gender: "All",
        pageName: "Charlie's Cyber",
        attributionSetting: "1-day view",
        resultType: "Reach",
        currency: "USD",
        startDate: "2024-07-01",
        endDate: "2024-09-30",
        dailyPerformance: [
            { date: "2024-07-28", reach: 350000, impressions: 1200000, results: 120, ctr: 0.8, cpc: 0.25, cpm: 1.50, frequency: 3.43, amountSpent: 1800, costPerResult: 15, linkClicks: 9600 }
        ]
      },
    ]
  },
  {
    id: "act_4444",
    name: "Diana Prince's Account",
    accessToken: "DIANA_FAKE_TOKEN",
    clientName: "Diana Prince",
    companyName: "Diana's Dazzlers",
    logoUrl: "https://placehold.co/100x100.png",
    campaigns: [
        {
        id: "CAM004",
        name: "Holiday Giveaway",
        status: "archived",
        platform: "Instagram",
        linked: true,
        client: "Diana Prince",
        description: "A giveaway contest to boost engagement.",
        age: "18-40",
        gender: "Female",
        pageName: "Dazzle with Diana",
        attributionSetting: "1-day click or 1-day view",
        resultType: "Post engagement",
        currency: "USD",
        startDate: "2023-11-15",
        endDate: "2023-12-25",
        dailyPerformance: [
            { date: "2024-07-28", reach: 95000, impressions: 450000, results: 5600, ctr: 4.2, cpc: 0.50, cpm: 2.80, frequency: 4.74, amountSpent: 1260, costPerResult: 0.23, linkClicks: 18900 }
        ]
      },
    ]
  }
];

// Combine all campaigns from all accounts into a single array.
// This is useful for the main admin dashboard view.
export let campaigns: Campaign[] = accounts.flatMap(acc =>
  acc.campaigns.map(c => ({
    ...c,
    // Add account-level info to each campaign if needed elsewhere
    client: acc.clientName,
    companyName: acc.companyName,
  }))
);

// Mock data for posts
export const posts: Post[] = [
  {
    id: "POST001",
    campaignId: "CAM001",
    accountId: "act_1111",
    content: "Our Summer Sale is ON! Get up to 50% off on all summer collections. Don't miss out! ☀️ #SummerSale #AwesomeWidgets",
    mediaUrl: "https://images.unsplash.com/photo-1603145733146-ae562a55031e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzb2NpYWwlMjBtZWRpYSUyMHBvc3R8ZW58MHx8fHwxNzUzMjkxNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    mediaType: 'image',
    status: 'needs-approval',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
  },
  {
    id: "POST002",
    campaignId: "CAM001",
    accountId: "act_1111",
    content: "Dive into summer with our new arrivals! Perfect for your sunny adventures. Tap to shop! #NewArrivals #SummerVibes",
    mediaUrl: "https://images.unsplash.com/photo-1603145733146-ae562a55031e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzb2NpYWwlMjBtZWRpYSUyMHBvc3R8ZW58MHx8fHwxNzUzMjkxNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    mediaType: 'image',
    status: 'approved',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
  },
  {
    id: "POST003",
    campaignId: "CAM002",
    accountId: "act_2222",
    content: "The future is here! Introducing the new X-series gadget. Pre-order yours today and experience the next level of tech. #Gadget #TechLaunch #Innovation",
    mediaUrl: "https://images.unsplash.com/photo-1519923834699-ef0b7cde4712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxzb2NpYWwlMjBtZWRpYSUyMHBvc3R8ZW58MHx8fHwxNzUzMjkxNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    mediaType: 'image',
    status: 'scheduled',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
  },
   {
    id: "POST004",
    campaignId: "CAM006",
    accountId: "act_5555",
    content: "Your garden's best friend is on sale! 🌱 Get all your spring planting essentials at Alice's Garden Supplies. #Gardening #SpringSale #PlantLove",
    mediaUrl: "https://images.unsplash.com/photo-1528588641076-3fe42e01df36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBvc3R8ZW58MHx8fHwxNzUzMjkxNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    mediaType: 'image',
    status: 'posted',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
   {
    id: "POST005",
    campaignId: "CAM001",
    accountId: "act_1111",
    content: "This post was rejected. The image is not right.",
    mediaUrl: "https://images.unsplash.com/photo-1528588641076-3fe42e01df36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBvc3R8ZW58MHx8fHwxNzUzMjkxNDM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    mediaType: 'image',
    status: 'rejected',
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 8)).toISOString(),
    rejectionReason: "The image quality is too low and not on-brand."
  },
];
