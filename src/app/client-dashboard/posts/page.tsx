
import { PostCard } from "@/components/post-card"
import { users, accounts, posts as allPosts } from "@/lib/data"
import type { Post, User, Account, Campaign } from "@/types"
import { redirect } from "next/navigation"

async function getClientUser(
  clientUserId?: string,
  clientUserEmail?: string
): Promise<User | undefined> {
  if (clientUserId) {
    return users.find(u => u.id === clientUserId && u.role === 'client');
  }
  if (clientUserEmail) {
    return users.find(u => u.email === clientUserEmail && u.role === 'client');
  }
  return undefined;
}

async function getClientPosts(adAccountId: string): Promise<Post[]> {
  const account = accounts.find(acc => acc.id === adAccountId);
  if (!account) return [];

  const accountPosts = allPosts
    .filter(p => p.accountId === adAccountId)
    .map(post => ({
        ...post,
        companyName: account.companyName,
        clientName: account.clientName,
    }));
  return accountPosts;
}

async function getAccounts(): Promise<Account[]> {
    // In a real app, this would be an API call
    return accounts;
}


export default async function ClientPostsPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const viewAsUserId = searchParams?.viewAs as string | undefined;
    const adAccountIdFromUrl = searchParams?.adAccountId as string | undefined;
    
    const clientUser = await getClientUser(viewAsUserId, viewAsUserId ? undefined : "alice@example.com");

    if (!clientUser) {
        if (viewAsUserId) redirect('/dashboard/clients');
        return <div>Error: Client not found.</div>
    }

    const adAccountId = adAccountIdFromUrl || clientUser.adAccountIds?.[0];
    const currentAccount = accounts.find(acc => acc.id === adAccountId);

    if (!adAccountId || !currentAccount) {
         return (
            <div className="container mx-auto py-2">
                 <div className="mb-6">
                    <h1 className="text-3xl font-bold">Posts for {clientUser.name}</h1>
                    <p className="text-muted-foreground">This client does not have an ad account linked yet or the account is invalid.</p>
                </div>
            </div>
        )
    }

    const posts = await getClientPosts(adAccountId);
    const allAccounts = await getAccounts();
    const campaigns: (Campaign & { companyName: string })[] = allAccounts.flatMap(acc => 
        acc.campaigns.map(c => ({...c, companyName: acc.companyName, clientName: acc.clientName}))
    );


    return (
        <div className="container mx-auto py-2">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Posts for Approval</h1>
                    <p className="text-muted-foreground">
                        Showing posts for <span className="font-semibold text-primary">{currentAccount.companyName}</span>.
                    </p>
                </div>
            </div>
             <div className="flex flex-col gap-4">
                {posts.length > 0 ? posts.map((post: Post) => (
                    <PostCard key={post.id} post={post} isClientView={true} accounts={allAccounts} campaigns={campaigns} />
                )) : (
                    <p className="text-muted-foreground col-span-full">No posts found for this company.</p>
                )}
            </div>
        </div>
    )
}
