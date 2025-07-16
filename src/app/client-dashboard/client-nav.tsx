
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BarChart, Settings } from "lucide-react";

export default function ClientNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const routes = [
    {
      href: "/client-dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/client-dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav
      className={cn("flex flex-col items-start gap-2 text-sm font-medium", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full",
            pathname.startsWith(route.href) && "bg-muted text-primary"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
