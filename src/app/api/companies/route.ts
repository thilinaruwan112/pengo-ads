
import { NextResponse, type NextRequest } from 'next/server';
import { accounts } from '@/lib/data';
import type { Account } from '@/types';

// GET all accounts (companies)
export async function GET(request: NextRequest) {
  // In a real app, you would fetch this from a database
  return NextResponse.json(accounts);
}

// CREATE a new account (company)
export async function POST(request: NextRequest) {
    const newAccountData: Omit<Account, 'id' | 'campaigns'> = await request.json();

    if (!newAccountData.companyName || !newAccountData.clientName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAccount: Account = {
        id: `act_${Math.random().toString(36).substr(2, 9)}`,
        campaigns: [],
        ...newAccountData,
    };

    // In a real app, you would save this to a database.
    accounts.push(newAccount);
    
    console.log('Created new account:', newAccount);

    return NextResponse.json(newAccount, { status: 201 });
}
