import { CampaignCard } from "@/app/dashboard/campaigns/campaign-card"
import type { Campaign, User } from "@/types"
import { KpiCard } from "@/components/kpi-card"
import { Activity, Eye, Users } from "lucide-react"
import { users } from "@/lib/data"

async function getClientCampaigns(adAccountId: string): Promise<Campaign[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/campaigns?adAccountId=${adAccountId}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch campaigns');
  }
  return res.json();
}

// In a real app, you'd get the current user from session/auth
async function getCurrentClient(email: string): Promise<User | undefined> {
    return users.find(u => u.email === email && u.role === 'client');
}

export default async function ClientDashboardPage() {
    const clientUser = await getCurrentClient("alice@example.com");

    if (!clientUser || !clientUser.adAccountId) {
        return (
            <div className="container mx-auto py-2">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-muted-foreground">Could not load client data. No ad account is linked.</p>
            </div>
        )
    }

    const clientCampaigns = await getClientCampaigns(clientUser.adAccountId);

    const totalReach = clientCampaigns.reduce((sum, camp) => sum + camp.reach, 0);
    const totalImpressions = clientCampaigns.reduce((sum, camp) => sum + camp.impressions, 0);
    const totalConversions = clientCampaigns.reduce((sum, camp) => sum + camp.conversions, 0);

  return (
    <div className="container mx-auto py-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {clientUser.name}!</h1>
        <p className="text-muted-foreground">
            Here&apos;s a summary of your active campaigns.
        </p>
      </div>

       <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Total Reach"
          value={new Intl.NumberFormat().format(totalReach)}
          description="Across all your campaigns"
          Icon={Users}
        />
        <KpiCard
          title="Impressions"
          value={new Intl.NumberFormat().format(totalImpressions)}
          description="Total views on your ads"
          Icon={Eye}
        />
        <KpiCard
          title="Conversions"
          value={new Intl.NumberFormat().format(totalConversions)}
          description="Total successful actions"
          Icon={Activity}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientCampaigns.map((campaign: Campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
        </div>
      </div>
    </div>
  )
}
