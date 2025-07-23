
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

export function ExcelImporter() {
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
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        setData(jsonData)
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

  const handleImport = () => {
    // This is where you would send the data to your API to be saved
    console.log("Importing data:", data)
    toast({
      title: "Import Queued",
      description: "This is a demo. Data has been logged to the console.",
    })
    setOpen(false)
    setData([])
    setFileName("")
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
          <Button onClick={handleImport} disabled={data.length === 0}>
            Confirm Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
