
import { PostCard } from "@/components/post-card"
import type { Post, Account, Campaign } from "@/types"
import { CreatePostDialog } from "@/components/create-post-dialog";
import { accounts, posts as allPosts } from "@/lib/data";
import { PostFilters } from "./post-filters";

async function getPosts(): Promise<Post[]> {
  // Using mock data directly
  const postsWithClientInfo = allPosts.map(post => {
        const account = accounts.find(acc => acc.id === post.accountId);
        return {
            ...post,
            companyName: account?.companyName || 'Unknown',
            clientName: account?.clientName || 'Unknown'
        }
    })
  return postsWithClientInfo;
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
  const posts = await getPosts();
  const accountsData = await getAccounts();
  
  const campaigns: (Campaign & { companyName: string })[] = accountsData.flatMap(acc => 
    acc.campaigns.map(c => ({...c, companyName: acc.companyName, clientName: acc.clientName}))
  );

  const selectedAccountId = searchParams?.accountId as string | undefined;
  const selectedCampaignId = searchParams?.campaignId as string | undefined;

  const filteredPosts = posts.filter(post => {
    const accountMatch = !selectedAccountId || post.accountId === selectedAccountId;
    const campaignMatch = !selectedCampaignId || post.campaignId === selectedCampaignId;
    return accountMatch && campaignMatch;
  });

  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Review and manage all scheduled posts.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
            <PostFilters accounts={accountsData} allCampaigns={campaigns} />
            <div className="w-full md:w-auto">
                <CreatePostDialog accounts={accountsData} campaigns={campaigns} />
            </div>
        </div>
      </div>
       <div className="flex flex-col gap-4">
        {filteredPosts.length > 0 ? (
            filteredPosts.map((post: Post) => (
                <PostCard key={post.id} post={post} accounts={accountsData} campaigns={campaigns} />
            ))
        ) : (
             <p className="text-muted-foreground col-span-full">No posts found for the selected filters.</p>
        )}
      </div>
    </div>
  )
}
