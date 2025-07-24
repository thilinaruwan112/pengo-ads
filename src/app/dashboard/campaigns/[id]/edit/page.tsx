
import { EditCampaignForm } from "./edit-form";
import type { Campaign } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { accounts } from "@/lib/data";

async function getCampaign(id: string): Promise<Campaign | undefined> {
  const allCampaigns = accounts.flatMap(acc => acc.campaigns);
  return allCampaigns.find(c => c.id === id);
}

export default async function EditCampaignPage({ params }: { params: { id: string } }) {
  const campaign = await getCampaign(params.id);

  if (!campaign) {
    return (
        <div className="container mx-auto py-2">
            <h1 className="text-2xl font-bold">Campaign not found</h1>
            <p>The campaign you are looking for does not exist.</p>
             <Button asChild variant="outline" className="mt-4">
                <Link href="/dashboard/campaigns">
                    <ArrowLeft />
                    Back to Campaigns
                </Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto py-2">
      <div className="flex items-center mb-4 gap-4">
         <Button asChild variant="outline" size="icon">
            <Link href="/dashboard/campaigns">
                <ArrowLeft />
                <span className="sr-only">Back to Campaigns</span>
            </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Campaign</h1>
          <p className="text-muted-foreground">
            Update the details for "{campaign.name}".
          </p>
        </div>
      </div>
      <EditCampaignForm campaign={campaign} />
    </div>
  );
}
