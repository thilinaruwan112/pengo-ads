
import { NextResponse, type NextRequest } from 'next/server';
import { accounts } from '@/lib/data';
import type { Account } from '@/types';

// GET a single account by ID
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const accountId = params.id;
    const account = accounts.find(a => a.id === accountId);

    if (!account) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(account);
}

// UPDATE an account by ID
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const accountId = params.id;
    const updatedData: Partial<Account> = await request.json();

    const accountIndex = accounts.findIndex(a => a.id === accountId);

    if (accountIndex === -1) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Merge new data with existing data
    accounts[accountIndex] = { ...accounts[accountIndex], ...updatedData };
    
    console.log(`Updated account ${accountId}:`, accounts[accountIndex]);

    return NextResponse.json(accounts[accountIndex]);
}
