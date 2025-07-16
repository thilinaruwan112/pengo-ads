
import { campaigns } from "@/lib/data"
import { CampaignCard } from "@/app/dashboard/campaigns/campaign-card"
import type { Campaign } from "@/types"
import { KpiCard } from "@/components/kpi-card"
import { Activity, Eye, Users } from "lucide-react"

export default function ClientDashboardPage() {
    const clientName = "Alice Johnson";
    const clientCampaigns = campaigns.filter(c => c.client === clientName);

    const totalReach = clientCampaigns.reduce((sum, camp) => sum + camp.reach, 0);
    const totalImpressions = clientCampaigns.reduce((sum, camp) => sum + camp.impressions, 0);
    const totalConversions = clientCampaigns.reduce((sum, camp) => sum + camp.conversions, 0);

  return (
    <div className="container mx-auto py-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome back, {clientName}!</h1>
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
