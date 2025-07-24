
import { CampaignCard } from "@/app/dashboard/campaigns/campaign-card"
import type { Campaign, User, Account, DailyPerformance } from "@/types"
import { KpiCard } from "@/components/kpi-card"
import { Activity, Eye, Users } from "lucide-react"
import { users, accounts } from "@/lib/data"
import { redirect } from "next/navigation"
import { CreateCampaignDialog } from "@/components/create-campaign-dialog"
import { OverviewChart } from "@/components/overview-chart"
import { PlatformPerformanceChart } from "@/components/platform-performance-chart"
import { CostAnalysisChart } from "@/components/cost-analysis-chart"
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from 'date-fns';

async function getClientCampaigns(adAccountId: string): Promise<Campaign[]> {
  // In a real app, you would fetch this from your API
  const account = accounts.find(acc => acc.id === adAccountId);
  if (!account) return [];
  
  // This is returning all campaigns for the account, not just one.
  const campaigns = account.campaigns.map(c => ({
    ...c,
    client: account.clientName,
    companyName: account.companyName,
  }));
  
  return campaigns || [];
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

function getAggregatePerformance(campaigns: Campaign[]): { totalReach: number, totalImpressions: number, totalResults: number } {
    let totalReach = 0;
    let totalImpressions = 0;
    let totalResults = 0;

    campaigns.forEach(campaign => {
        // Sum up all daily records for each campaign
        campaign.dailyPerformance?.forEach(record => {
            totalReach += record.reach;
            totalImpressions += record.impressions;
            totalResults += record.results;
        });
    });

    return { totalReach, totalImpressions, totalResults };
}

function prepareOverviewData(campaigns: Campaign[]): { name: string; reach: number; impressions: number }[] {
    const monthlyData: { [key: string]: { reach: number; impressions: number } } = {};

    campaigns.forEach(campaign => {
        campaign.dailyPerformance.forEach(record => {
            const month = format(parseISO(record.date), 'MMM');
            if (!monthlyData[month]) {
                monthlyData[month] = { reach: 0, impressions: 0 };
            }
            monthlyData[month].reach += record.reach;
            monthlyData[month].impressions += record.impressions;
        });
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthOrder.map(monthName => ({
        name: monthName,
        reach: monthlyData[monthName]?.reach || 0,
        impressions: monthlyData[monthName]?.impressions || 0
    })).filter(d => d.reach > 0 || d.impressions > 0);
}


function preparePlatformData(campaigns: Campaign[]): { name: string; value: number; color: string }[] {
    const platformData: { [key: string]: number } = {};

    campaigns.forEach(campaign => {
        const totalResults = campaign.dailyPerformance.reduce((sum, record) => sum + record.results, 0);
        if (!platformData[campaign.platform]) {
            platformData[campaign.platform] = 0;
        }
        platformData[campaign.platform] += totalResults;
    });
    
    const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    return Object.entries(platformData).map(([name, value], index) => ({
        name,
        value,
        color: chartColors[index % chartColors.length]
    }));
}

function prepareCostData(campaigns: Campaign[]): { date: string; cost: number; conversions: number }[] {
    const monthlyData: { [key: string]: { cost: number; conversions: number } } = {};

    campaigns.forEach(campaign => {
        campaign.dailyPerformance.forEach(record => {
            const month = format(parseISO(record.date), 'MMM');
            if (!monthlyData[month]) {
                monthlyData[month] = { cost: 0, conversions: 0 };
            }
            monthlyData[month].cost += record.amountSpent || 0;
            monthlyData[month].conversions += record.results;
        });
    });

    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return monthOrder.map(monthName => ({
        date: monthName,
        cost: monthlyData[monthName]?.cost || 0,
        conversions: monthlyData[monthName]?.conversions || 0,
    })).filter(d => d.cost > 0 || d.conversions > 0);
}


export default async function ClientDashboardPage({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined };
}) {
    const viewAsUserId = searchParams?.viewAs as string | undefined;
    const adAccountIdFromUrl = searchParams?.adAccountId as string | undefined;

    const clientUser = await getClientUser(viewAsUserId, viewAsUserId ? undefined : "alice@example.com");

    if (!clientUser) {
        if (viewAsUserId) redirect("/dashboard/clients");
        return (
             <div className="container mx-auto py-2">
                <h1 className="text-2xl font-bold">Error</h1>
                <p className="text-muted-foreground">Could not load client data.</p>
            </div>
        )
    }

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
    const { totalReach, totalImpressions, totalResults } = getAggregatePerformance(clientCampaigns);

    const overviewData = prepareOverviewData(clientCampaigns);
    const platformData = preparePlatformData(clientCampaigns);
    const costData = prepareCostData(clientCampaigns);

  return (
    <div className="container mx-auto py-2">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h1 className="text-3xl font-bold">Welcome, {clientUser.name}!</h1>
            <p className="text-muted-foreground">
                Showing data for <span className="font-semibold text-primary">{currentAccount.companyName}</span>.
            </p>
        </div>
      </div>

       <div className="grid gap-4 mb-6 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard
          title="Total Reach"
          value={totalReach.toLocaleString()}
          description="All-time total reach"
          Icon={Users}
        />
        <KpiCard
          title="Impressions"
          value={totalImpressions.toLocaleString()}
          description="All-time total impressions"
          Icon={Eye}
        />
        <KpiCard
          title="Results"
          value={totalResults.toLocaleString()}
          description="All-time total results"
          Icon={Activity}
        />
      </div>
      
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3 mb-6">
        <OverviewChart 
            className="xl:col-span-2" 
            data={overviewData} 
            title="Monthly Performance"
            description="Aggregated reach and impressions across all campaigns."
        />
        <PlatformPerformanceChart data={platformData} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 mb-6">
         <CostAnalysisChart className="xl:col-span-3" data={costData} />
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
