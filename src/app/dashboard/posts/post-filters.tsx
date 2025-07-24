
"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Account, Campaign } from '@/types';
import { Button } from '@/components/ui/button';

interface PostFiltersProps {
    accounts: Account[];
    allCampaigns: (Campaign & { companyName: string })[];
}

export function PostFilters({ accounts, allCampaigns }: PostFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [accountId, setAccountId] = useState(searchParams.get('accountId') || 'all-clients');
    const [campaignId, setCampaignId] = useState(searchParams.get('campaignId') || 'all-campaigns');
    const [filteredCampaigns, setFilteredCampaigns] = useState<(Campaign & { companyName: string })[]>([]);

    useEffect(() => {
        if (accountId && accountId !== 'all-clients') {
            setFilteredCampaigns(allCampaigns.filter(c => c.client === accounts.find(a => a.id === accountId)?.clientName));
        } else {
            setFilteredCampaigns(allCampaigns);
        }
    }, [accountId, allCampaigns, accounts]);
    
    const handleAccountChange = (value: string) => {
        const newAccountId = value;
        setAccountId(newAccountId);
        setCampaignId('all-campaigns'); // Reset campaign when account changes
        
        const params = new URLSearchParams(searchParams);
        if (newAccountId !== 'all-clients') {
            params.set('accountId', newAccountId);
        } else {
            params.delete('accountId');
        }
        params.delete('campaignId'); // Reset campaign filter
        router.push(`/dashboard/posts?${params.toString()}`);
    }

    const handleCampaignChange = (value: string) => {
        const newCampaignId = value;
        setCampaignId(newCampaignId);

        const params = new URLSearchParams(searchParams);
        if (newCampaignId !== 'all-campaigns') {
            params.set('campaignId', newCampaignId);
        } else {
            params.delete('campaignId');
        }
        router.push(`/dashboard/posts?${params.toString()}`);
    }

    return (
        <div className="flex w-full gap-2">
            <Select value={accountId} onValueChange={handleAccountChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by client..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-clients">All Clients</SelectItem>
                    {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                            {account.companyName} ({account.clientName})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={campaignId} onValueChange={handleCampaignChange}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by campaign..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-campaigns">All Campaigns</SelectItem>
                    {filteredCampaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
