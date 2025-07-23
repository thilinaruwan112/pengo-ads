
"use client";

import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <Loader className={cn("h-8 w-8 animate-spin text-primary", className)} />
  );
};

export const FullPageSpinner = () => {
    return (
        <div className="flex h-full min-h-[calc(100vh-200px)] w-full items-center justify-center">
            <Spinner />
        </div>
    )
}
