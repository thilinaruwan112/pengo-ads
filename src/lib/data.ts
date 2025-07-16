import { User, Campaign, Account } from "@/types";

export const users: User[] = [
  { id: "USR001", name: "Alice Johnson", email: "alice@example.com", role: "client", avatar: "/avatars/01.png", status: "active", adAccountId: "act_1111" },
  { id: "USR002", name: "Bob Williams", email: "bob@example.com", role: "client", avatar: "/avatars/02.png", status: "active", adAccountId: "act_2222" },
  { id: "USR003", name: "Charlie Brown", email: "charlie@example.com", role: "client", avatar: "/avatars/03.png", status: "archived" },
  { id: "USR004", name: "Diana Prince", email: "diana@example.com", role: "client", avatar: "/avatars/04.png", status: "active", adAccountId: "act_4444" },
];

export const accounts: Account[] = [
  {
    id: "act_1111",
    name: "Alice Johnson's Account",
    accessToken: "ALICE_FAKE_TOKEN", // In a real DB, this would be encrypted
    clientName: "Alice Johnson",
    campaigns: [
      {
        id: "CAM001",
        name: "Summer Sale 2024",
        status: "active",
        reach: 120540,
        impressions: 550345,
        conversions: 2450,
        ctr: 2.5,
        cpc: 0.75,
        cpm: 3.50,
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "A campaign to promote our summer collection with discounts up to 50%.",
      },
      {
        id: "CAM005",
        name: "Low Performer Example",
        status: "active",
        reach: 1500,
        impressions: 5000,
        conversions: 10,
        ctr: 0.5,
        cpc: 3.00,
        cpm: 8.00,
        platform: "Facebook",
        linked: true,
        client: "Alice Johnson",
        description: "This is a sample low-performing campaign.",
      }
    ]
  },
  {
    id: "act_2222",
    name: "Bob Williams' Account",
    accessToken: "BOB_FAKE_TOKEN",
    clientName: "Bob Williams",
    campaigns: [
       {
        id: "CAM002",
        name: "New Product Launch",
        status: "paused",
        reach: 56780,
        impressions: 210890,
        conversions: 890,
        ctr: 1.8,
        cpc: 1.20,
        cpm: 5.20,
        platform: "Instagram",
        linked: true,
        client: "Bob Williams",
        description: "Launching the new X-series gadget.",
      },
    ]
  },
  {
    id: "act_3333",
    name: "Charlie Brown's Account",
    accessToken: "CHARLIE_FAKE_TOKEN",
    clientName: "Charlie Brown",
    campaigns: [
      {
        id: "CAM003",
        name: "Brand Awareness Q3",
        status: "active",
        reach: 350000,
        impressions: 1200000,
        conversions: 120,
        ctr: 0.8,
        cpc: 0.25,
        cpm: 1.50,
        platform: "Facebook",
        linked: false,
        client: "Charlie Brown",
        description: "General brand awareness campaign.",
      },
    ]
  },
  {
    id: "act_4444",
    name: "Diana Prince's Account",
    accessToken: "DIANA_FAKE_TOKEN",
    clientName: "Diana Prince",
    campaigns: [
        {
        id: "CAM004",
        name: "Holiday Giveaway",
        status: "archived",
        reach: 95000,
        impressions: 450000,
        conversions: 5600,
        ctr: 4.2,
        cpc: 0.50,
        cpm: 2.80,
        platform: "Instagram",
        linked: true,
        client: "Diana Prince",
        description: "A giveaway contest to boost engagement.",
      },
    ]
  }
];

// This export can be deprecated or used for the admin view to show all campaigns at once.
export const campaigns: Campaign[] = accounts.flatMap(acc => acc.campaigns);
