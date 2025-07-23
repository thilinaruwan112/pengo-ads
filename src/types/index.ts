export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  avatar: string;
  status: "active" | "archived";
  adAccountIds?: string[]; // Link to one or more ad accounts
};

export type DailyPerformance = {
  date: string; // YYYY-MM-DD
  reach: number;
  impressions: number;
  results: number; // Renamed from conversions
  ctr: number;
  cpc: number;
  cpm: number;
  frequency?: number;
  amountSpent?: number;
  costPerResult?: number;
  linkClicks?: number;
};

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  platform: "Facebook" | "Instagram";
  linked: boolean;
  client?: string; // Client's name
  description: string;
  dailyPerformance: DailyPerformance[];
  // New detailed fields
  age?: string;
  gender?: "All" | "Male" | "Female";
  pageName?: string;
  attributionSetting?: string;
  resultType?: string;
  currency?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
};

export type Account = {
  id: string; // This is the ad_account_id
  name: string;
  accessToken: string;
  clientName: string;
  companyName: string; // Added company name
  campaigns: Campaign[];
};

export type Post = {
    id: string;
    campaignId: string;
    accountId: string;
    content: string;
    mediaUrl: string;
    mediaType: 'image' | 'video';
    status: 'needs-approval' | 'approved' | 'rejected' | 'scheduled' | 'posted';
    scheduledDate: string; // ISO 8601 format
    rejectionReason?: string;
};
