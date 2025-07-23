
"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Campaign, DailyPerformance } from "@/types"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

export default function ImportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([])
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const binaryStr = event.target?.result
        const workbook = XLSX.read(binaryStr, { type: "binary", cellDates: true })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false })
        
        const formattedData = jsonData.map((row: any) => {
            if (row['Reporting starts']) {
                row['Reporting starts'] = formatDate(new Date(row['Reporting starts']));
            }
            if (row['Reporting ends']) {
                 row['Reporting ends'] = formatDate(new Date(row['Reporting ends']));
            }
            return row;
        })

        setData(formattedData)
        toast({
          title: "File Processed",
          description: "Data has been extracted. Please review below.",
        })
      } catch (error) {
        console.error("Error processing Excel file:", error)
        toast({
          title: "Error",
          description: "Could not process the Excel file.",
          variant: "destructive",
        })
        setData([])
        setFileName("")
      } finally {
        setIsProcessing(false)
      }
    }
    reader.onerror = () => {
        setIsProcessing(false);
        toast({
            title: "Error",
            description: "Failed to read the file.",
            variant: "destructive",
        });
    };
    reader.readAsBinaryString(file)
  }

  const handleImport = async () => {
    setIsProcessing(true);
    let updatedCount = 0;
    let createdCount = 0;

    try {
        const campaignsRes = await fetch('/api/campaigns', { cache: 'no-store' });
        if (!campaignsRes.ok) throw new Error("Could not fetch existing campaigns.");
        const existingCampaigns: Campaign[] = await campaignsRes.json();

        for (const row of data) {
            const campaignName = row['Campaign name'];
            const reportingDate = row['Reporting ends'];

            if (!campaignName || !reportingDate) continue;

            const performanceRecord: DailyPerformance = {
                date: reportingDate,
                reach: parseFloat(row['Reach']) || 0,
                impressions: parseFloat(row['Impressions']) || 0,
                results: parseFloat(row['Results']) || 0,
                ctr: parseFloat(row['CTR']) || 0,
                cpc: parseFloat(row['CPC']) || 0,
                cpm: parseFloat(row['CPM']) || 0,
                frequency: parseFloat(row['Frequency']) || 0,
                amountSpent: parseFloat(row['Amount spent (LKR)'] || row['Amount spent (USD)']) || 0,
                costPerResult: parseFloat(row['Cost per result']) || 0,
                linkClicks: parseFloat(row['Link clicks']) || 0,
            };

            let campaign = existingCampaigns.find(c => c.name === campaignName);

            if (campaign) {
                const res = await fetch(`/api/campaigns/${campaign.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(performanceRecord)
                });
                if (!res.ok) {
                    console.warn(`Failed to add record for campaign: ${campaignName}`);
                    continue;
                }
                updatedCount++;
            } else {
                 const accountsRes = await fetch('/api/users'); 
                 const users = await accountsRes.json();
                 const firstClientAccount = users.find((u:any) => u.role === 'client')?.adAccountIds[0];

                 if (!firstClientAccount) {
                    console.warn(`No client account found to create new campaign: ${campaignName}`);
                    continue;
                 }
                
                const newCampaignData = {
                    accountId: firstClientAccount,
                    name: campaignName,
                    description: row['Description'] || `Imported on ${new Date().toLocaleDateString()}`,
                    status: 'active',
                    platform: row['Platform'] || 'Facebook',
                    age: row['Age'],
                    gender: row['Gender'],
                    pageName: row['Page name'],
                    attributionSetting: row['Attribution setting'],
                    resultType: row['Result Type'],
                    currency: row['Amount spent (LKR)'] ? 'LKR' : 'USD',
                    dailyPerformance: [performanceRecord],
                    linked: true
                };

                 const createRes = await fetch('/api/campaigns', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCampaignData),
                });
                 if (!createRes.ok) {
                    console.warn(`Failed to create campaign: ${campaignName}`);
                    continue;
                }
                createdCount++;
            }
        }
        
        toast({
            title: "Import Complete",
            description: `${updatedCount} campaign(s) updated, ${createdCount} campaign(s) created.`,
        })

        router.push("/dashboard/campaigns");
        router.refresh();

    } catch (error: any) {
        toast({
            title: "Import Failed",
            description: error.message || "An unexpected error occurred during import.",
            variant: "destructive",
        })
    } finally {
        setIsProcessing(false)
    }
  }

  const headers = data.length > 0 ? Object.keys(data[0]) : []

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
          <h1 className="text-2xl font-bold">Import Campaign Data</h1>
          <p className="text-muted-foreground">
            Upload an Excel file to update or create campaigns.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>1. Upload File</CardTitle>
            <CardDescription>Select the .xlsx or .xls file you want to import.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="excel-file">Excel File</Label>
                <Input
                id="excel-file"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={isProcessing}
                />
            </div>
        </CardContent>
      </Card>
      
        {isProcessing && <p className="mt-4">Processing file...</p>}

        {data.length > 0 && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>2. Review Data</CardTitle>
                <CardDescription>
                 Found {data.length} rows in "{fileName}". Review the data before importing.
                </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      {headers.map((header) => (
                        <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {headers.map((header) => (
                          <TableCell key={header} className="whitespace-nowrap">
                            {String(row[header] ?? '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleImport} disabled={data.length === 0 || isProcessing}>
                    {isProcessing ? "Importing..." : "Confirm and Import Data"}
                </Button>
              </div>
            </CardContent>
        </Card>
        )}
    </div>
  );
}
