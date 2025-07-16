export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  avatar: string;
  status: "active" | "archived";
};

export type Campaign = {
  id: string;
  name: string;
  status: "active" | "paused" | "archived";
  reach: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpm: number;
  platform: "Facebook" | "Instagram";
  linked: boolean;
  client?: string; // Client's name
  description: string;
};
