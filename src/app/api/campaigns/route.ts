
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
  return NextResponse.json(account.campaigns);
}


export async function POST(request: NextRequest) {
    const newCampaignData = await request.json();
    const { accountId, ...campaignDetails } = newCampaignData;

    if (!accountId) {
        return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // In a real app, you would save this to a database.
    // Here, we're just adding it to the in-memory array.
    const newCampaign: Campaign = {
        id: `CAM${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`, // Generate a random ID
        ...campaignDetails,
        linked: true, // Assuming new campaigns are linked by default
    };

    account.campaigns.push(newCampaign);
    console.log(`Added new campaign to account ${accountId}:`, newCampaign);

    return NextResponse.json(newCampaign, { status: 201 });
}
