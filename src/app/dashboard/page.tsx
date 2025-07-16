import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Eye,
  Menu,
  MousePointerClick,
  Package2,
  Search,
  Users,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { KpiCard } from "@/components/kpi-card"
import { OverviewChart } from "@/components/overview-chart"
import { RecentCampaigns } from "@/components/recent-campaigns"

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <KpiCard
          title="Total Reach"
          value="45,231"
          description="+20.1% from last month"
          Icon={Users}
        />
        <KpiCard
          title="Conversions"
          value="+2350"
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
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-7">
        <OverviewChart />
        <RecentCampaigns />
      </div>
    </>
  )
}
