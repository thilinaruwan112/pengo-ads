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
    return NextResponse.json(account.campaigns); // Fallback to mock data
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v20.0/${adAccountId}/campaigns?fields=${fields}&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to fetch from Meta API for account ${adAccountId}:`, errorData);
      return NextResponse.json(account.campaigns); // Fallback
    }

    const data = await response.json();
    const formattedCampaigns: Campaign[] = data.data.map((apiCampaign: any) => ({
      // ... transformation logic ...
    }));

    return NextResponse.json(formattedCampaigns);

  } catch (error) {
    console.error(`Error fetching from Meta API for account ${adAccountId}:`, error);
    return NextResponse.json(account.campaigns); // Fallback
  }
  */

  // Using mock data for now
  return NextResponse.json(account.campaigns);
}
