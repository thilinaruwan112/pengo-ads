import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function RecentCampaigns() {
  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Three campaigns were launched this month.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="person" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Olivia Martin</p>
            <p className="text-sm text-muted-foreground">
              Summer Sale Campaign
            </p>
          </div>
          <div className="ml-auto font-medium">+$1,999.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="person" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Jackson Lee</p>
            <p className="text-sm text-muted-foreground">
              New Product Launch
            </p>
          </div>
          <div className="ml-auto font-medium">+$39.00</div>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="https://placehold.co/40x40.png" alt="Avatar" data-ai-hint="person" />
            <AvatarFallback>IN</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
            <p className="text-sm text-muted-foreground">
              Brand Awareness Q3
            </p>
          </div>
          <div className="ml-auto font-medium">+$299.00</div>
        </div>
      </CardContent>
    </Card>
  )
}
