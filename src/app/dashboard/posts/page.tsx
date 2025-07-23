import { PostCard } from "@/components/post-card"
import type { Post, Account, Campaign } from "@/types"
import { CreatePostDialog } from "@/components/create-post-dialog";
import { accounts } from "@/lib/data";
import { PostFilters } from "./post-filters";

async function getPosts(): Promise<Post[]> {
  // In a real app, replace with your actual API call
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/posts`, { cache: 'no-store' });
  if (!res.ok) {
    console.error('Failed to fetch posts');
    return [];
  }
  return res.json()
}

async function getAccounts(): Promise<Account[]> {
    // In a real app, this would be an API call
    return accounts;
}

export default async function PostsPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const allPosts = await getPosts();
  const accounts = await getAccounts();
  
  const campaigns: (Campaign & { companyName: string })[] = accounts.flatMap(acc => 
    acc.campaigns.map(c => ({...c, companyName: acc.companyName, clientName: acc.clientName}))
  );

  const selectedAccountId = searchParams?.accountId as string | undefined;
  const selectedCampaignId = searchParams?.campaignId as string | undefined;

  const filteredPosts = allPosts.filter(post => {
    const accountMatch = !selectedAccountId || post.accountId === selectedAccountId;
    const campaignMatch = !selectedCampaignId || post.campaignId === selectedCampaignId;
    return accountMatch && campaignMatch;
  });

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Review and manage all scheduled posts.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <PostFilters accounts={accounts} allCampaigns={campaigns} />
            <CreatePostDialog accounts={accounts} campaigns={campaigns} />
        </div>
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} accounts={accounts} campaigns={campaigns} />
            ))
        ) : (
             <p className="text-muted-foreground col-span-full">No posts found for the selected filters.</p>
        )}
      </div>
    </div>
  )
}
