import { PostCard } from "@/components/post-card"
import type { Post, Account, Campaign } from "@/types"
import { CreatePostDialog } from "@/components/create-post-dialog";
import { accounts } from "@/lib/data";

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

export default async function PostsPage() {
  const posts = await getPosts();
  const accounts = await getAccounts();
  
  const campaigns: (Campaign & { companyName: string })[] = accounts.flatMap(acc => 
    acc.campaigns.map(c => ({...c, companyName: acc.companyName, clientName: acc.clientName}))
  );


  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            Review and manage all scheduled posts.
          </p>
        </div>
        <CreatePostDialog accounts={accounts} campaigns={campaigns} />
      </div>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} accounts={accounts} campaigns={campaigns} />
        ))}
      </div>
    </div>
  )
}
