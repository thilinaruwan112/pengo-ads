
"use client";

import { cn } from "@/lib/utils";

const PenguinIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 10a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2Z"/>
        <path d="M11 14V9a1 1 0 0 1 1-1h.5a1 1 0 0 1 1 1v2"/>
        <path d="M16.5 15.5a2.5 2.5 0 1 1-3.16-3.16"/>
        <path d="M18 11.05V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
);


export const Spinner = ({ className }: { className?: string }) => {
  return (
    <PenguinIcon className={cn("h-8 w-8 animate-bounce text-primary", className)} />
  );
};

export const FullPageSpinner = () => {
    return (
        <div className="flex h-full min-h-[calc(100vh-200px)] w-full items-center justify-center">
            <Spinner />
        </div>
    )
}
