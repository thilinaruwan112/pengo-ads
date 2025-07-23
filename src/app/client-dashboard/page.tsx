
import { CampaignCard } from "@/app/dashboard/campaigns/campaign-card"
import type { Campaign, User, Account, DailyPerformance } from "@/types"
import { KpiCard } from "@/components/kpi-card"
import { Activity, Eye, Users } from "lucide-react"
import { users, accounts } from "@/lib/data"
import { redirect } from "next/navigation"
import { CreateCampaignDialog } from "@/app/dashboard/campaigns/create-campaign-dialog"

async function getClientCampaigns(adAccountId: string): Promise<Campaign[]> {
  // In a real app, you would fetch this from your API
  const account = accounts.find(acc => acc.id === adAccountId);
  return account?.campaigns || [];
}

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

function getLatestPerformance(campaigns: Campaign[]): { totalReach: number, totalImpressions: number, totalResults: number } {
    let totalReach = 0;
    let totalImpressions = 0;
    let totalResults = 0;

    campaigns.forEach(campaign => {
        if (campaign.dailyPerformance && campaign.dailyPerformance.length > 0) {
            const latest = campaign.dailyPerformance.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            totalReach += latest.reach;
            totalImpressions += latest.impressions;
            totalResults += latest.results;
        }
    });

    return { totalReach, totalImpressions, totalResults };
}

export default async function ClientDashboardPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const viewAsUserId = searchParams?.viewAs as string | undefined;
    const adAccountIdFromUrl = searchParams?.adAccountId as string | undefined;

    // In a real app, you would get the current user from session/auth
    // For this demo, we check if we are impersonating, otherwise we default to Alice.
    const clientUser = await getClientUser(viewAsUserId, viewAsUserId ? undefined : "alice@example.com");

    if (!clientUser) {
        // If we are trying to impersonate an invalid user, redirect to the admin dashboard
        if (viewAsUserId) {
            redirect("/dashboard/clients");
        }
        return (
             <div className="container mx-auto py-2">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-muted-foreground">Could not load client data.</p>
            </div>
        )
    }

    // Determine which ad account to display
    // Priority: 1. URL param, 2. First account in user's list
    const adAccountId = adAccountIdFromUrl || clientUser.adAccountIds?.[0];
    const currentAccount = accounts.find(acc => acc.id === adAccountId);
    const clientAccounts = accounts.filter(acc => clientUser.adAccountIds?.includes(acc.id));

    if (!adAccountId || !currentAccount) {
        return (
            <div className="container mx-auto py-2">
                 <div className="mb-6">
                    <h1 className="text-3xl font-bold">Welcome, {clientUser.name}!</h1>
                    <p className="text-muted-foreground">This client does not have an ad account linked yet or the account is invalid.</p>
                </div>
            </div>
        )
    }

    const clientCampaigns = await getClientCampaigns(adAccountId);
    const { totalReach, totalImpressions, totalResults } = getLatestPerformance(clientCampaigns);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-3xl font-bold">Welcome, {clientUser.name}!</h1>
            <p className="text-muted-foreground">
                Showing data for <span className="font-semibold text-primary">{currentAccount.companyName}</span>.
            </p>
        </div>
        <CreateCampaignDialog isClient={true} clientAccountId={adAccountId} clientAccounts={clientAccounts} />
      </div>

       <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Total Reach"
          value={new Intl.NumberFormat().format(totalReach)}
          description="Latest daily total"
          Icon={Users}
        />
        <KpiCard
          title="Impressions"
          value={new Intl.NumberFormat().format(totalImpressions)}
          description="Latest daily total"
          Icon={Eye}
        />
        <KpiCard
          title="Results"
          value={new Intl.NumberFormat().format(totalResults)}
          description="Latest daily total"
          Icon={Activity}
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Campaigns</h2>
        {clientCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientCampaigns.map((campaign: Campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No campaigns found for this company.</p>
        )}
      </div>
    </div>
  )
}
