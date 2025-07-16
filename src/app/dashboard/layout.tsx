import Link from "next/link";
import { Package2 } from "lucide-react";

import { MainNav } from "@/components/main-nav";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">AdVision</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <MainNav />
            </nav>
          </div>
          <div className="mt-auto p-4">
              <Card>
                  <CardContent className="p-2 pt-4 text-center">
                    <div className="text-sm font-semibold">Need help?</div>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">Contact our support team</p>
                    <Button size="sm" className="w-full">Contact Support</Button>
                  </CardContent>
              </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
