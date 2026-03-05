"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    MessageSquare,
    Globe,
    BarChart3,
    Code2,
    Settings,
    CreditCard,
    MessageSquareQuote
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
    { name: "Public Page", href: "/dashboard/public-page", icon: Globe },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Embed", href: "/dashboard/embed", icon: Code2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];

interface SidebarProps {
    onItemClick?: () => void;
}

export function Sidebar({ onItemClick }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col border-r bg-background">
            <div className="flex h-16 items-center border-b px-6">
                <Link href="/" onClick={onItemClick} className="flex items-center gap-2 font-bold text-xl">
                    <MessageSquareQuote className="h-6 w-6 text-primary" />
                    <span>Feedback.ai</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4 px-6">
                <div className="rounded-xl bg-primary/5 p-4">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Current Plan</p>
                    <p className="mt-1 text-sm font-bold capitalize">Free Plan</p>
                    <Link href="/dashboard/billing" onClick={onItemClick}>
                        <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity">
                            Upgrade to Pro
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
