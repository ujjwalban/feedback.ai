"use client"

import { UserProfile } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
    profile: UserProfile | null;
}

export function Navbar({ profile }: NavbarProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-8 backdrop-blur">
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="search"
                        placeholder="Search testimonials..."
                        className="h-9 w-64 rounded-full bg-muted/50 pl-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href={`/u/${profile?.username || 'user'}`} target="_blank">
                    <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                        <ExternalLink className="h-4 w-4" />
                        View Public Page
                    </Button>
                </Link>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </Button>

                <div className="h-8 w-px bg-border mx-2" />

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{profile?.username || profile?.email?.split('@')[0]}</p>
                        <Badge variant="secondary" className="text-[10px] h-4 uppercase">
                            {profile?.plan || 'Free'}
                        </Badge>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.username || ""} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl mt-2">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard/billing">Billing</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
