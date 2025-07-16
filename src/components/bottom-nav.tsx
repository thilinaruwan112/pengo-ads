"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, BarChart, Lightbulb, Settings } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/campaigns", label: "Campaigns", icon: BarChart },
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/ai-insights", label: "AI Insights", icon: Lightbulb },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto">
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
