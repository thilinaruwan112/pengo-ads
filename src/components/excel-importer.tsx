
"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function ExcelImporter() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.push('/dashboard/import')}>
      Import from Excel
    </Button>
  )
}
