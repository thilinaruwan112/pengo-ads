
"use client";

import { cn } from "@/lib/utils";

const PenguinIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="-5.5 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M16.474,19.58 L15.055,19.58 C15.055,19.58 14.782,20.432 14.236,20.977 C13.69,21.523 12.5,21.832 12.5,21.832 C12.5,21.832 11.31,21.523 10.764,20.977 C10.218,20.432 9.945,19.58 9.945,19.58 L8.526,19.58 C8.526,19.58 8.671,22.438 10.091,23.858 C11.51,25.277 12.5,25.277 12.5,25.277 C12.5,25.277 13.49,25.277 14.909,23.858 C16.329,22.438 16.474,19.58 16.474,19.58" fill="#FFC107"></path>
            <path d="M11,4 C5.477,4 1,8.477 1,4 C1,3.448 1.448,3 2,3 C2.552,3 3,3.448 3,4 C3,7.313 5.687,10 9,10 L13,10 C16.313,10 19,7.313 19,4 C19,3.448 19.448,3 20,3 C20.552,3 21,3.448 21,4 C21,8.477 16.523,4 11,4 L11,4 Z" fill="#151515"></path>
            <path d="M19,11 C19,11 13.686,11 11,11 C5.477,11 1,15.477 1,21 C1,26.523 5.477,31 11,31 C16.523,31 21,26.523 21,21 C21,15.477 19,11 19,11 L19,11 Z M11,29 C6.582,29 3,25.418 3,21 C3,16.582 6.582,13 11,13 C13.209,13 18,13 18,13 C18,13 18.899,15.433 19,21 C18.84,25.583 15.418,29 11,29 L11,29 Z" fill="#151515"></path>
            <path d="M19,11 C19,11 25,15 25,21 C25,27 19,31 19,31 L19,11 Z" fill="#151515"></path>
            <path d="M3,11 C3,11 -3,15 -3,21 C-3,27 3,31 3,31 L3,11 Z" fill="#151515"></path>
            <ellipse fill="#FFFFFF" cx="11" cy="21" rx="8" ry="10"></ellipse>
            <circle fill="#151515" cx="8" cy="17" r="1"></circle>
            <circle fill="#151515" cx="14" cy="17" r="1"></circle>
        </g>
    </svg>
);


export const Spinner = ({ className }: { className?: string }) => {
  return (
    <PenguinIcon className={cn("h-12 w-12 animate-bounce", className)} />
  );
};

export const FullPageSpinner = () => {
    return (
        <div className="flex h-full min-h-[calc(100vh-200px)] w-full items-center justify-center">
            <Spinner />
        </div>
    )
}
