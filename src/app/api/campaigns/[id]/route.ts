
import { NextResponse, type NextRequest } from 'next/server';
import { campaigns, accounts } from '@/lib/data';
import type { Campaign, DailyPerformance } from '@/types';

// GET a single campaign by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const campaignId = params.id;
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
}


// UPDATE a campaign by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const campaignId = params.id;
    const updatedData: Partial<Campaign> = await request.json();

    const account = accounts.find(acc => acc.campaigns.some(c => c.id === campaignId));
    if (!account) {
         return NextResponse.json({ error: 'Account for campaign not found' }, { status: 404 });
    }

    const campaignIndex = account.campaigns.findIndex(c => c.id === campaignId);

    if (campaignIndex === -1) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // In a real app, you would save this to a database.
    // Here, we're just updating the in-memory array.
    // Note: This simple merge won't work for nested arrays like dailyPerformance.
    // The POST to /add-record should handle that.
    account.campaigns[campaignIndex] = { ...account.campaigns[campaignIndex], ...updatedData };
    
    console.log(`Updated campaign ${campaignId}:`, account.campaigns[campaignIndex]);

    return NextResponse.json(account.campaigns[campaignIndex]);
}


// ADD a daily performance record to a campaign
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const campaignId = params.id;
    const newRecord: DailyPerformance = await request.json();

    const account = accounts.find(acc => acc.campaigns.some(c => c.id === campaignId));
    if (!account) {
         return NextResponse.json({ error: 'Account for campaign not found' }, { status: 404 });
    }

    const campaignIndex = account.campaigns.findIndex(c => c.id === campaignId);

    if (campaignIndex === -1) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // In a real app, you would save this to a database.
    const campaign = account.campaigns[campaignIndex];
    campaign.dailyPerformance.push(newRecord);
    // Sort by date descending to have the newest record first
    campaign.dailyPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    console.log(`Added new daily record to campaign ${campaignId}:`, newRecord);

    return NextResponse.json(campaign, { status: 201 });
}
