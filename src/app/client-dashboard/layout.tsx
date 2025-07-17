
import Link from "next/link";
import { Package2, ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import ClientNav from "./client-nav";
import { BottomNav } from "@/components/bottom-nav";
import { accounts, users } from "@/lib/data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User, Account } from "@/types";
import { redirect } from "next/navigation";


async function getClientUser(
  clientUserId?: string,
  clientUserEmail?: string
): Promise<User | undefined> {
  if (clientUserId) {
    return users.find(u => u.id === clientUserId && u.role === 'client');
  }
  if (clientUserEmail) {
    return users.find(u => u.email === clientUserEmail && u.role === 'client');
  }
  return undefined;
}

function CompanySwitcher({ clientAccounts, currentAccountId }: { clientAccounts: Account[], currentAccountId: string }) {
    const currentAccount = clientAccounts.find(acc => acc.id === currentAccountId);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {currentAccount?.companyName || 'Select Company'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuLabel>Switch Company</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {clientAccounts.map(account => (
                    <DropdownMenuItem key={account.id} asChild>
                        <Link href={`?adAccountId=${account.id}`}>{account.companyName}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default async function ClientDashboardLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  const viewAsUserId = searchParams?.viewAs as string | undefined;
  const adAccountId = searchParams?.adAccountId as string | undefined;
  const isImpersonating = !!viewAsUserId;
  
  const clientUser = await getClientUser(viewAsUserId, viewAsUserId ? undefined : "alice@example.com");

  if (!clientUser) {
    if (viewAsUserId) redirect('/dashboard/clients');
    return <div>Error: Client not found.</div>
  }
  
  const clientAccounts = accounts.filter(acc => clientUser.adAccountIds?.includes(acc.id));
  const hasMultipleAccounts = clientAccounts.length > 1;

  // Determine the current account ID to show
  // Priority: URL param > First in client's list > undefined
  const currentAccountId = adAccountId || clientAccounts[0]?.id;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/client-dashboard" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6 text-primary" />
              <span className="">AdVision</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <ClientNav />
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <Link href="/client-dashboard" className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Package2 className="h-6 w-6" />
                <span className="">AdVision</span>
              </Link>
              <ClientNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 flex items-center gap-4">
             {isImpersonating && (
                <Button variant="outline" asChild>
                    <Link href="/dashboard/clients">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Admin
                    </Link>
                </Button>
            )}
            {hasMultipleAccounts && currentAccountId && (
                <CompanySwitcher clientAccounts={clientAccounts} currentAccountId={currentAccountId} />
            )}
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background pb-24 md:pb-6">
          {children}
        </main>
      </div>
      <BottomNav client />
    </div>
  );
}
