"use client"

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Navbar } from "@/components/dashboard/Navbar";
import { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Auto-close sidebar on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        async function getProfile() {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile(data);
            setLoading(false);
        }

        getProfile();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    <p className="text-sm font-medium animate-pulse text-muted-foreground">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 md:hidden",
                    isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Sidebar Content */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 transform bg-background shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar onItemClick={() => setIsMobileMenuOpen(false)} />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden w-full">
                <Navbar profile={profile} onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto bg-muted/20 p-4 sm:p-6 md:p-8">
                    <div className="mx-auto max-w-7xl w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
