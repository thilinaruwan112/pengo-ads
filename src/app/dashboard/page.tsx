import {
  Activity,
  DollarSign,
  Eye,
  Users,
} from "lucide-react"

import { KpiCard } from "@/components/kpi-card"
import { OverviewChart } from "@/components/overview-chart"
import { RecentCampaigns } from "@/components/recent-campaigns"
import { PlatformPerformanceChart } from "@/components/platform-performance-chart"
import { CostAnalysisChart } from "@/components/cost-analysis-chart"

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          title="Total Reach"
          value="45,231"
          description="+20.1% from last month"
          Icon={Users}
        />
        <KpiCard
          title="Conversions"
          value="2,350"
          description="+180.1% from last month"
          Icon={Activity}
        />
        <KpiCard
          title="Impressions"
          value="12,234"
          description="+19% from last month"
          Icon={Eye}
        />
        <KpiCard
          title="Total Spent"
          value="$5,730.00"
          description="+201 since last hour"
          Icon={DollarSign}
        />
         <KpiCard
          title="Cost Per Conversion"
          value="$2.44"
          description="-5% from last month"
          Icon={DollarSign}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <OverviewChart className="xl:col-span-2" />
        <RecentCampaigns />
      </div>
       <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <PlatformPerformanceChart />
        <CostAnalysisChart className="xl:col-span-2" />
      </div>
    </>
  )
}
