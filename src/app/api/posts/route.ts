
import { NextResponse, type NextRequest } from 'next/server';
import { posts, accounts } from '@/lib/data';

// GET posts, optionally filtered by adAccountId
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const adAccountId = searchParams.get('adAccountId');

  if (!adAccountId) {
    // For the admin dashboard, if no specific account is requested, return all posts
    const allPosts = posts.map(post => {
        const account = accounts.find(acc => acc.id === post.accountId);
        return {
            ...post,
            companyName: account?.companyName || 'Unknown',
            clientName: account?.clientName || 'Unknown'
        }
    })
    return NextResponse.json(allPosts);
  }

  const account = accounts.find(acc => acc.id === adAccountId);

  if (!account) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }
  
  const accountPosts = posts
    .filter(p => p.accountId === adAccountId)
    .map(post => ({
        ...post,
        companyName: account.companyName,
        clientName: account.clientName,
    }));


  return NextResponse.json(accountPosts);
}
