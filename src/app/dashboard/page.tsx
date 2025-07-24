

import {
  Activity,
  DollarSign,
  Eye,
  Users,
} from "lucide-react"
import { KpiCard } from "@/components/kpi-card"
import { OverviewChart } from "@/components/overview-chart"
import { PlatformPerformanceChart } from "@/components/platform-performance-chart"
import { CostAnalysisChart } from "@/components/cost-analysis-chart"
import { accounts } from "@/lib/data"
import type { Campaign, DailyPerformance, Account } from "@/types"
import { parseISO, isWithinInterval } from "date-fns"
import { DashboardFilters } from "@/components/dashboard-filters"
import { ClientReport, ClientReportData } from "@/components/client-report"
import { CampaignReport, CampaignReportData } from "@/components/campaign-report"


function getFilteredCampaigns(
    allCampaigns: (Campaign & { companyName?: string, clientName?: string})[], 
    filters: { accountId?: string; campaignId?: string; from?: string; to?: string; }
): (Campaign & { companyName?: string, clientName?: string})[] {
    
    const { accountId, campaignId, from, to } = filters;

    let filtered = allCampaigns;

    if (accountId) {
        const selectedAccount = accounts.find(a => a.id === accountId);
        if (selectedAccount) {
            filtered = allCampaigns.filter(c => 
                selectedAccount.campaigns.some(ac => ac.id === c.id)
            );
        }
    }

    if (campaignId) {
        filtered = filtered.filter(c => c.id === campaignId);
    }

    if (from && to) {
        const fromDate = parseISO(from);
        const toDate = parseISO(to);
        // Filter daily performance records within the date range
        return filtered.map(campaign => ({
            ...campaign,
            dailyPerformance: campaign.dailyPerformance.filter(record => 
                isWithinInterval(parseISO(record.date), { start: fromDate, end: toDate })
            )
        })).filter(campaign => campaign.dailyPerformance.length > 0); // Only keep campaigns with data in range
    }
    
    return filtered;
}

function getAggregatePerformance(campaigns: Campaign[]): { totalReach: number, totalImpressions: number, totalResults: number, totalSpent: number, costPerResult: number } {
    let totalReach = 0;
    let totalImpressions = 0;
    let totalResults = 0;
    let totalSpent = 0;

    campaigns.forEach(campaign => {
        campaign.dailyPerformance?.forEach(record => {
            totalReach += record.reach;
            totalImpressions += record.impressions;
            totalResults += record.results;
            totalSpent += record.amountSpent || 0;
        });
    });

    const costPerResult = totalResults > 0 ? totalSpent / totalResults : 0;

    return { totalReach, totalImpressions, totalResults, totalSpent, costPerResult };
}

function prepareOverviewData(campaigns: Campaign[]): { name: string; reach: number; impressions: number }[] {
    const monthlyData: { [key: string]: { reach: number; impressions: number } } = {};
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const dateMap = new Map<string, { reach: number; impressions: number }>();

    campaigns.forEach(campaign => {
        campaign.dailyPerformance.forEach(record => {
            const date = parseISO(record.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!dateMap.has(key)) {
                dateMap.set(key, { reach: 0, impressions: 0 });
            }
            const current = dateMap.get(key)!;
            current.reach += record.reach;
            current.impressions += record.impressions;
        });
    });
    
    return Array.from(dateMap.entries()).sort().map(([key, value]) => ({
        name: key, // e.g. 2024-07
        ...value
    }));
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
    const dateMap = new Map<string, { cost: number; conversions: number }>();

     campaigns.forEach(campaign => {
        campaign.dailyPerformance.forEach(record => {
            const date = parseISO(record.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!dateMap.has(key)) {
                dateMap.set(key, { cost: 0, conversions: 0 });
            }
            const current = dateMap.get(key)!;
            current.cost += record.amountSpent || 0;
            current.conversions += record.results;
        });
    });
    
    return Array.from(dateMap.entries()).sort().map(([key, value]) => ({
        date: key, // e.g. 2024-07
        ...value
    }));
}

function prepareClientReportData(campaigns: (Campaign & { companyName?: string, clientName?: string})[]): ClientReportData[] {
  const clientMap = new Map<string, { companyName: string, reach: number, impressions: number, results: number, spent: number, campaigns: Set<string> }>();

  campaigns.forEach(campaign => {
    const clientKey = campaign.clientName || 'Unknown';
    if (!clientMap.has(clientKey)) {
      clientMap.set(clientKey, { companyName: campaign.companyName || 'Unknown', reach: 0, impressions: 0, results: 0, spent: 0, campaigns: new Set() });
    }
    const clientData = clientMap.get(clientKey)!;
    clientData.campaigns.add(campaign.id);
    campaign.dailyPerformance.forEach(record => {
      clientData.reach += record.reach;
      clientData.impressions += record.impressions;
      clientData.results += record.results;
      clientData.spent += record.amountSpent || 0;
    });
  });

  return Array.from(clientMap.entries()).map(([client, data]) => ({
    client,
    companyName: data.companyName,
    campaigns: data.campaigns.size,
    reach: data.reach,
    impressions: data.impressions,
    results: data.results,
    spent: data.spent,
    cpr: data.results > 0 ? data.spent / data.results : 0,
  }));
}

function prepareCampaignReportData(campaigns: (Campaign & { companyName?: string, clientName?: string})[]): CampaignReportData[] {
    return campaigns.map(campaign => {
        const performance = getAggregatePerformance([campaign]);
        return {
            name: campaign.name,
            client: campaign.clientName || 'Unknown',
            reach: performance.totalReach,
            impressions: performance.totalImpressions,
            results: performance.totalResults,
            spent: performance.totalSpent,
            cpr: performance.costPerResult,
        };
    }).filter(c => c.spent > 0);
}


export default async function Dashboard({
    searchParams,
}: {
    searchParams?: { [key:string]: string | string[] | undefined };
}) {

  const allCampaigns: (Campaign & { companyName?: string, clientName?: string})[] = accounts.flatMap(acc => 
      acc.campaigns.map(c => ({ 
        ...c, 
        clientName: acc.clientName, 
        companyName: acc.companyName,
      }))
    );

  const filters = {
    accountId: searchParams?.accountId as string | undefined,
    campaignId: searchParams?.campaignId as string | undefined,
    from: searchParams?.from as string | undefined,
    to: searchParams?.to as string | undefined,
  }

  const filteredCampaigns = getFilteredCampaigns(allCampaigns, filters);
  const { totalReach, totalImpressions, totalResults, totalSpent, costPerResult } = getAggregatePerformance(filteredCampaigns);
  const overviewData = prepareOverviewData(filteredCampaigns);
  const platformData = preparePlatformData(filteredCampaigns);
  const costData = prepareCostData(filteredCampaigns);
  
  const clientReportData = prepareClientReportData(filteredCampaigns);
  const campaignReportData = prepareCampaignReportData(filteredCampaigns);

  const allAccounts = accounts;
  const allCampaignsForFilter = allCampaigns;

  const selectedAccount = accounts.find(a => a.id === filters.accountId);
  const selectedCampaign = allCampaigns.find(c => c.id === filters.campaignId);
  const filterDescription = [
    selectedAccount ? `Client: ${selectedAccount.companyName}` : 'All Clients',
    selectedCampaign ? `Campaign: ${selectedCampaign.name}`: 'All Campaigns',
    filters.from && filters.to ? `Date: ${filters.from} to ${filters.to}`: 'All Time'
  ].join(' | ');


  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {filterDescription}
          </p>
        </div>
        <DashboardFilters accounts={allAccounts} allCampaigns={allCampaignsForFilter} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          title="Total Reach"
          value={totalReach}
          description="Total users reached"
          Icon={Users}
        />
        <KpiCard
          title="Results"
          value={totalResults}
          description="Total conversions/results"
          Icon={Activity}
        />
        <KpiCard
          title="Impressions"
          value={totalImpressions}
          description="Total ad impressions"
          Icon={Eye}
        />
        <KpiCard
          title="Total Spent"
          value={totalSpent}
          description="Total amount spent"
          Icon={DollarSign}
          prefix="$"
        />
         <KpiCard
          title="Cost Per Result"
          value={costPerResult}
          description="Average cost per result"
          Icon={DollarSign}
          prefix="$"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-5 mt-6">
        <OverviewChart className="xl:col-span-3" data={overviewData} title="Performance Overview" description="Reach and Impressions over time" />
        <PlatformPerformanceChart data={platformData} className="xl:col-span-2" />
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-1 mt-6">
        <CostAnalysisChart data={costData} />
      </div>

      <div className="mt-6">
        <ClientReport data={clientReportData} />
      </div>
        <div className="mt-6">
        <CampaignReport data={campaignReportData} />
      </div>
    </>
  )
}
