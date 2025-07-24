
import { NextResponse, type NextRequest } from 'next/server';
import { users } from '@/lib/data';

// GET a single user by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userId = params.id;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}


// UPDATE a user by ID (specifically for adAccountIds)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const userId = params.id;
    const { adAccountIds } = await request.json();

    if (!Array.isArray(adAccountIds)) {
        return NextResponse.json({ error: 'adAccountIds must be an array' }, { status: 400 });
    }

    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the adAccountIds for the user
    users[userIndex].adAccountIds = adAccountIds;
    
    console.log(`Updated user ${userId}:`, users[userIndex]);

    return NextResponse.json(users[userIndex]);
}
