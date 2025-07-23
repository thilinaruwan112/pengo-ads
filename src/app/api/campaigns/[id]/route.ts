
import { NextResponse, type NextRequest } from 'next/server';
import { campaigns } from '@/lib/data';
import type { Campaign } from '@/types';

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

    const campaignIndex = campaigns.findIndex(c => c.id === campaignId);

    if (campaignIndex === -1) {
        return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // In a real app, you would save this to a database.
    // Here, we're just updating the in-memory array.
    campaigns[campaignIndex] = { ...campaigns[campaignIndex], ...updatedData };
    
    console.log(`Updated campaign ${campaignId}:`, campaigns[campaignIndex]);

    return NextResponse.json(campaigns[campaignIndex]);
}
