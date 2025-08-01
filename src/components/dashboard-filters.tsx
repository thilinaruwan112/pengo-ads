
"use client"

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Account, Campaign } from '@/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import type { DateRange } from 'react-day-picker';

interface DashboardFiltersProps {
    accounts: Account[];
    allCampaigns: (Campaign & { companyName?: string, clientName?: string })[];
}

export function DashboardFilters({ accounts, allCampaigns }: DashboardFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [accountId, setAccountId] = useState(searchParams.get('accountId') || 'all-clients');
    const [campaignId, setCampaignId] = useState(searchParams.get('campaignId') || 'all-campaigns');
    const [filteredCampaigns, setFilteredCampaigns] = useState<(Campaign & { companyName?: string })[]>([]);
    
    const fromDate = searchParams.get('from');
    const toDate = searchParams.get('to');
    const [date, setDate] = useState<DateRange | undefined>({
        from: fromDate ? new Date(fromDate) : undefined,
        to: toDate ? new Date(toDate) : undefined,
    });

    useEffect(() => {
        if (accountId && accountId !== 'all-clients') {
            const selectedAccount = accounts.find(a => a.id === accountId);
            if (selectedAccount) {
                 setFilteredCampaigns(allCampaigns.filter(c => 
                    selectedAccount.campaigns.some(ac => ac.id === c.id)
                ));
            }
        } else {
            setFilteredCampaigns(allCampaigns);
        }
        // Do not reset campaignId when accountId changes if a campaignId is already in the URL
        if (!searchParams.has('campaignId')) {
           setCampaignId('all-campaigns');
        }
    }, [accountId, allCampaigns, accounts, searchParams]);
    
    const updateUrlParams = (newParams: { [key: string]: string | null }) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const key in newParams) {
            const value = newParams[key];
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        }
        router.push(`${pathname}?${params.toString()}`);
    }

    const handleAccountChange = (value: string) => {
        const newAccountId = value === 'all-clients' ? null : value;
        setAccountId(value);
        setCampaignId('all-campaigns');
        updateUrlParams({ 'accountId': newAccountId, 'campaignId': null });
    }

    const handleCampaignChange = (value: string) => {
        const newCampaignId = value === 'all-campaigns' ? null : value;
        setCampaignId(value);
        updateUrlParams({ 'campaignId': newCampaignId });
    }
    
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (date?.from) {
           params.set('from', format(date.from, 'yyyy-MM-dd'));
        } else {
            params.delete('from');
        }
        if (date?.to) {
            params.set('to', format(date.to, 'yyyy-MM-dd'));
        } else {
            params.delete('to');
        }
        router.push(`${pathname}?${params.toString()}`);

    }, [date, router, pathname, searchParams]);

    const handleResetFilters = () => {
        setAccountId('all-clients');
        setCampaignId('all-campaigns');
        setDate(undefined);
        router.push(pathname);
    }

    const areFiltersActive = accountId !== 'all-clients' || campaignId !== 'all-campaigns' || date?.from;

    return (
        <div className="flex gap-2 flex-col sm:flex-row sm:flex-wrap sm:justify-end">
            <Select value={accountId} onValueChange={handleAccountChange}>
                <SelectTrigger className="w-full sm:w-auto min-w-[200px]">
                    <SelectValue placeholder="Filter by client..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-clients">All Clients</SelectItem>
                    {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                            {account.companyName}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={campaignId} onValueChange={handleCampaignChange}>
                <SelectTrigger className="w-full sm:w-auto min-w-[200px]">
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
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                        "w-full sm:w-auto min-w-[260px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                />
                </PopoverContent>
            </Popover>
            {areFiltersActive && (
                 <Button variant="ghost" onClick={handleResetFilters}>Reset</Button>
            )}
        </div>
    );
}
