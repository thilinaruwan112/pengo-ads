
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, BarChart, Settings, Newspaper, Upload, Building } from "lucide-react";

interface BottomNavProps {
  client?: boolean;
}

export function BottomNav({ client = false }: BottomNavProps) {
  const pathname = usePathname();

  const getClientRoutes = () => {
    // Extract base path for accurate matching even with query params
    const basePath = pathname.split('?')[0];
    return [
      { href: "/client-dashboard", label: "Dashboard", icon: Home, active: basePath === '/client-dashboard' },
      { href: "/client-dashboard/posts", label: "Posts", icon: Newspaper, active: basePath.startsWith('/client-dashboard/posts') },
      { href: "/client-dashboard/settings", label: "Settings", icon: Settings, active: basePath.startsWith('/client-dashboard/settings') },
    ];
  };

  const getAdminRoutes = () => {
    const basePath = pathname.split('?')[0];
    return [
      { href: "/dashboard", label: "Dashboard", icon: Home, active: basePath === '/dashboard' },
      { href: "/dashboard/campaigns", label: "Campaigns", icon: BarChart, active: basePath.startsWith('/dashboard/campaigns') },
      { href: "/dashboard/companies", label: "Companies", icon: Building, active: basePath.startsWith('/dashboard/companies') },
      { href: "/dashboard/clients", label: "Clients", icon: Users, active: basePath.startsWith('/dashboard/clients') },
      { href: "/dashboard/posts", label: "Posts", icon: Newspaper, active: basePath.startsWith('/dashboard/posts') },
      { href: "/dashboard/settings", label: "Settings", icon: Settings, active: basePath.startsWith('/dashboard/settings') },
    ];
  };

  const routes = client ? getClientRoutes() : getAdminRoutes();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-20 bg-background/80 backdrop-blur-lg border-t md:hidden">
      <div className="grid h-full max-w-lg mx-auto" style={{ gridTemplateColumns: `repeat(${routes.length}, 1fr)` }}>
        {routes.map((route) => {
          const isActive = route.active;
          return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "inline-flex flex-col items-center justify-center font-medium pt-2",
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <div className={cn(
                "flex items-center justify-center rounded-full h-12 w-16 transition-all duration-300 relative",
                 isActive && 'bg-primary/10 -translate-y-2 shadow-lg'
            )}>
                 <route.icon className="w-6 h-6" />
            </div>
            <span className={cn(
                "text-xs transition-opacity duration-300",
            )}>{route.label}</span>
            <div className={cn(
                "h-1 w-6 rounded-full bg-primary transition-all duration-300 mt-auto",
                isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            )} />

          </Link>
        )})}
      </div>
    </div>
  );
}
