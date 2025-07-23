
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, BarChart, Settings, Newspaper, Upload } from "lucide-react";

interface BottomNavProps {
  client?: boolean;
}

export function BottomNav({ client = false }: BottomNavProps) {
  const pathname = usePathname();

  const adminRoutes = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: BarChart },
    { href: "/dashboard/posts", label: "Posts", icon: Newspaper },
    { href: "/dashboard/import", label: "Import", icon: Upload },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  const clientRoutes = [
    { href: "/client-dashboard", label: "Dashboard", icon: Home },
    { href: "/client-dashboard/posts", label: "Posts", icon: Newspaper },
    { href: "/client-dashboard/settings", label: "Settings", icon: Settings },
  ];

  const routes = client ? clientRoutes : adminRoutes;
  const gridColsClass = client ? "grid-cols-3" : "grid-cols-5";

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t md:hidden">
      <div className={cn("grid h-full max-w-lg mx-auto", gridColsClass)}>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted text-muted-foreground group",
              pathname === route.href && "text-primary"
            )}
          >
            <route.icon className="w-5 h-5 mb-1" />
            <span className="text-xs ">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
