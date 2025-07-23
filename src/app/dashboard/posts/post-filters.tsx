
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

    const [accountId, setAccountId] = useState(searchParams.get('accountId') || '');
    const [campaignId, setCampaignId] = useState(searchParams.get('campaignId') || '');
    const [filteredCampaigns, setFilteredCampaigns] = useState<(Campaign & { companyName: string })[]>([]);

    useEffect(() => {
        if (accountId) {
            setFilteredCampaigns(allCampaigns.filter(c => c.client === accounts.find(a => a.id === accountId)?.clientName));
        } else {
            setFilteredCampaigns(allCampaigns);
        }
    }, [accountId, allCampaigns, accounts]);

    const handleFilterChange = () => {
        const params = new URLSearchParams();
        if (accountId) {
            params.set('accountId', accountId);
        }
        if (campaignId) {
            params.set('campaignId', campaignId);
        }
        router.push(`/dashboard/posts?${params.toString()}`);
    };

    const handleAccountChange = (value: string) => {
        setAccountId(value);
        setCampaignId(''); // Reset campaign when account changes
         const params = new URLSearchParams();
        if (value) {
            params.set('accountId', value);
        }
        router.push(`/dashboard/posts?${params.toString()}`);
    }

    const handleCampaignChange = (value: string) => {
        setCampaignId(value);
        const params = new URLSearchParams();
        if (accountId) {
            params.set('accountId', accountId);
        }
        if (value) {
            params.set('campaignId', value);
        }
        router.push(`/dashboard/posts?${params.toString()}`);
    }

    return (
        <div className="flex gap-2">
            <Select value={accountId} onValueChange={handleAccountChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by client..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Clients</SelectItem>
                    {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                            {account.companyName} ({account.clientName})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={campaignId} onValueChange={handleCampaignChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by campaign..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Campaigns</SelectItem>
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
