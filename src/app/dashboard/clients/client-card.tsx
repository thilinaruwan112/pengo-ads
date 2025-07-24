
"use client"

import type { User } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

interface ClientCardProps {
  user: User
}

export function ClientCard({ user }: ClientCardProps) {
  const status = user.status;
  const variant = status === "active" ? "default" : "destructive";

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
            <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://placehold.co/40x40.png`} alt={user.name} data-ai-hint="person" />
                    <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <span className="sr-only">Open menu</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/client-dashboard?viewAs=${user.id}`}>View as Client</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(user.id)}
                    >
                        Copy user ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                      <Link href={`/dashboard/clients/${user.id}/edit`}>Edit user</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">Archive user</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Role</span>
          <span className="font-medium capitalize">{user.role}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant={variant} className="capitalize">{user.status}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
