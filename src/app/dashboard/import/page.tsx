
"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, ChevronsRight } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formatDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

const APP_FIELDS = [
    { key: "campaignName", label: "Campaign Name", required: true },
    { key: "reportingDate", label: "Reporting Date", required: true },
    { key: "reach", label: "Reach", required: false },
    { key: "impressions", label: "Impressions", required: false },
    { key: "results", label: "Results", required: false },
    { key: "linkClicks", label: "Link Clicks", required: false },
    { key: "amountSpent", label: "Amount Spent", required: false },
    { key: "ctr", label: "CTR (%)", required: false },
    { key: "cpc", label: "CPC", required: false },
    { key: "cpm", label: "CPM", required: false },
    { key: "frequency", label: "Frequency", required: false },
    { key: "costPerResult", label: "Cost Per Result", required: false },
    { key: "age", label: "Age", required: false },
    { key: "gender", label: "Gender", required: false },
    { key: "pageName", label: "Page Name", required: false },
    { key: "attributionSetting", label: "Attribution Setting", required: false },
    { key: "resultType", label: "Result Type", required: false },
];


export default function ImportPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([])
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // Auto-map columns when headers are extracted
    if (headers.length > 0) {
      const newMap: Record<string, string> = {};
      APP_FIELDS.forEach(field => {
        // Find a header that fuzzy matches the field label
        const match = headers.find(h => h.toLowerCase().replace(/ \(.+\)/, '').trim() === field.label.toLowerCase().replace(/ \(.+\)/, '').trim());
        if (match) {
          newMap[field.key] = match;
        } else {
            // Special case for Amount Spent
            if (field.key === 'amountSpent') {
                const currencyMatch = headers.find(h => h.toLowerCase().startsWith('amount spent'));
                if (currencyMatch) newMap[field.key] = currencyMatch;
            }
        }
      });
      setColumnMap(newMap);
    }
  }, [headers]);


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
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" })
        
        const formattedData = jsonData.map((row: any) => {
            const newRow = {...row};
            // Find and format any date columns
            for (const key in newRow) {
                if (newRow[key] instanceof Date) {
                    newRow[key] = formatDate(newRow[key]);
                }
            }
            return newRow;
        })

        if (formattedData.length > 0) {
            setHeaders(Object.keys(formattedData[0]));
        }
        setData(formattedData)
        toast({
          title: "File Processed",
          description: "Please map columns and review data.",
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

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const updatedData = [...data];
    updatedData[rowIndex][header] = value;
    setData(updatedData);
  }

  const handleMapChange = (appField: string, excelHeader: string) => {
    setColumnMap(prev => ({...prev, [appField]: excelHeader}));
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
            const campaignName = row[columnMap['campaignName']];
            const reportingDate = row[columnMap['reportingDate']];

            if (!campaignName || !reportingDate) continue;
            
            const getVal = (key: string) => row[columnMap[key]] || 0;
            const getStr = (key: string) => row[columnMap[key]] || "";

            const performanceRecord: DailyPerformance = {
                date: reportingDate,
                reach: parseFloat(getVal('reach')) || 0,
                impressions: parseFloat(getVal('impressions')) || 0,
                results: parseFloat(getVal('results')) || 0,
                ctr: parseFloat(getVal('ctr')) || 0,
                cpc: parseFloat(getVal('cpc')) || 0,
                cpm: parseFloat(getVal('cpm')) || 0,
                frequency: parseFloat(getVal('frequency')) || 0,
                amountSpent: parseFloat(getVal('amountSpent')) || 0,
                costPerResult: parseFloat(getVal('costPerResult')) || 0,
                linkClicks: parseFloat(getVal('linkClicks')) || 0,
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
                    description: `Imported on ${new Date().toLocaleDateString()}`,
                    status: 'active',
                    platform: getStr('platform') || 'Facebook',
                    age: getStr('age'),
                    gender: getStr('gender'),
                    pageName: getStr('pageName'),
                    attributionSetting: getStr('attributionSetting'),
                    resultType: getStr('resultType'),
                    currency: (columnMap['amountSpent'] || '').includes('LKR') ? 'LKR' : 'USD',
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

  const isImportDisabled = isProcessing || !columnMap['campaignName'] || !columnMap['reportingDate'];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        
        {data.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle>2. Map Columns</CardTitle>
                    <CardDescription>Match your spreadsheet columns to the app fields.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-64">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                        {APP_FIELDS.map(field => (
                            <div key={field.key} className="flex items-center gap-2">
                                <div className="w-1/2 text-sm">
                                    {field.label} {field.required && <span className="text-destructive">*</span>}
                                </div>
                                <Select 
                                    value={columnMap[field.key]} 
                                    onValueChange={(value) => handleMapChange(field.key, value)}
                                >
                                    <SelectTrigger className="w-1/2 h-8">
                                        <SelectValue placeholder="Select column..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        )}
      </div>

        {data.length > 0 && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>3. Review and Edit Data</CardTitle>
                <CardDescription>
                 Found {data.length} rows in "{fileName}". You can edit the data below before importing.
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
                          <TableCell key={header} className="whitespace-nowrap p-1">
                            <Input
                                type="text"
                                value={row[header] ?? ''}
                                onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                                className="w-full h-8 border-transparent hover:border-input focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleImport} disabled={isImportDisabled}>
                    {isProcessing ? "Importing..." : "Confirm and Import Data"}
                    <ChevronsRight/>
                </Button>
              </div>
            </CardContent>
        </Card>
        )}
    </div>
  );
}

    