import { NextResponse, type NextRequest } from 'next/server';
import { accounts } from '@/lib/data';
import type { Campaign } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const adAccountId = searchParams.get('adAccountId');

  if (!adAccountId) {
    // For the admin dashboard, if no specific account is requested,
    // we can return all campaigns from all accounts.
    const allCampaigns = accounts.flatMap(acc => acc.campaigns);
    return NextResponse.json(allCampaigns);
  }

  const account = accounts.find(acc => acc.id === adAccountId);

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  // In a real app, you would use account.accessToken to fetch from the Meta API.
  // The example below is updated to reflect this.

  /*
  const accessToken = account.accessToken;
  const fields = 'name,status,reach,impressions,clicks,spend';

  if (!accessToken) {
    console.error(`Meta access token is not configured for account ${adAccountId}.`);
    // Fallback to mock data if token is missing
    return NextResponse.json(account.campaigns); 
  }

  try {
    // This is where you would make the actual API call to Meta
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=${fields}&access_token=${accessToken}`
    );

    if (!response.ok) {
      // If the API returns an error (e.g., 400, 500), we throw an error to be caught
      const errorData = await response.json();
      console.error(`Failed to fetch from Meta API for account ${adAccountId}:`, errorData);
      throw new Error('Failed to fetch from Meta API');
    }

    const data = await response.json();
    
    // You would then format the data from the API to match your Campaign type
    const formattedCampaigns: Campaign[] = data.data.map((apiCampaign: any) => ({
      id: apiCampaign.id,
      name: apiCampaign.name,
      status: apiCampaign.status.toLowerCase(),
      reach: parseInt(apiCampaign.reach || '0'),
      impressions: parseInt(apiCampaign.impressions || '0'),
      clicks: parseInt(apiCampaign.clicks || '0'),
      // Add other transformations as needed
      conversions: 0, // Placeholder
      ctr: 0, // Placeholder
      cpc: 0, // Placeholder
      cpm: 0, // Placeholder
      platform: "Facebook", // Placeholder
      linked: true,
      description: "", // Placeholder
    }));

    return NextResponse.json(formattedCampaigns);

  } catch (error) {
    // If the fetch itself fails (e.g., network error) or we threw an error above,
    // we catch it here and return the local mock data as a fallback.
    console.error(`Error fetching from Meta API for account ${adAccountId}, falling back to mock data:`, error);
    return NextResponse.json(account.campaigns); 
  }
  */

  // Using mock data for now
  return NextResponse.json(account.campaigns);
}
