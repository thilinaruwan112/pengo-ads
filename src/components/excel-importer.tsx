
"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { ScrollArea } from "./ui/scroll-area"
import type { Campaign, DailyPerformance } from "@/types"
import { useRouter } from "next/navigation"

// Helper to convert Excel serial date to JS Date
const excelDateToJSDate = (serial: number) => {
  const utc_days  = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;                                        
  const date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
};

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


export function ExcelImporter() {
  const router = useRouter();
  const [open, setOpen] = useState(false)
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
            // Convert date fields if they are in Excel's format
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

    // In a real app, this would be an API call to a backend endpoint
    // that fetches, updates, and saves the data.
    // For this demo, we'll simulate it by calling our local API routes.

    try {
        // 1. Fetch all existing campaigns to update them
        const campaignsRes = await fetch('/api/campaigns', { cache: 'no-store' });
        if (!campaignsRes.ok) throw new Error("Could not fetch existing campaigns.");
        const existingCampaigns: Campaign[] = await campaignsRes.json();

        for (const row of data) {
            const campaignName = row['Campaign name'];
            const reportingDate = row['Reporting ends']; // Assuming each row is a daily record

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
                // Campaign exists, add a new performance record
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
                 // Campaign does not exist, create a new one
                 // Note: We need to find which account this campaign belongs to.
                 // This part is complex without more info from the Excel file or UI.
                 // For now, let's assume it belongs to the first account as a fallback.
                 const accountsRes = await fetch('/api/users'); // A bit of a hack to get accounts
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

        router.refresh();
        setOpen(false)
        setData([])
        setFileName("")

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import from Excel</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Import Campaign Data</DialogTitle>
          <DialogDescription>
            Upload an Excel file (.xlsx) to import campaign data. The data will
            be displayed for review before finalizing the import.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="excel-file">Upload File</Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {isProcessing && <p>Processing file...</p>}

          {data.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Review Data</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Found {data.length} rows in "{fileName}".
              </p>
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
                            {String(row[header])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleImport} disabled={data.length === 0 || isProcessing}>
            {isProcessing ? "Importing..." : "Confirm Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
