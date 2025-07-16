import { NextResponse } from 'next/server';
import { users } from '@/lib/data';

export async function GET() {
  // In a real app, you would fetch this from a database
  return NextResponse.json(users);
}
