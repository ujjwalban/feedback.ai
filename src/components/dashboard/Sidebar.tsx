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
    MessageSquareQuote,
    X,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function Sidebar({ onItemClick, isCollapsed, onToggleCollapse }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className={cn(
            "flex h-full w-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
            isCollapsed && "items-center"
        )}>
            <div className={cn(
                "flex h-16 items-center border-b px-4 transition-all duration-300",
                isCollapsed ? "justify-center" : "justify-between px-6"
            )}>
                {!isCollapsed && (
                    <Link href="/" onClick={onItemClick} className="flex items-center gap-2 font-bold text-xl overflow-hidden transition-all duration-300">
                        <MessageSquareQuote className="h-6 w-6 text-primary flex-shrink-0" />
                        <span className="truncate">Feedback.ai</span>
                    </Link>
                )}

                {isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className="h-9 w-9 text-muted-foreground hover:text-primary transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                {!isCollapsed && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleCollapse}
                            className="hidden md:flex h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Menu className="h-4 w-4" />
                        </Button>

                        {onItemClick && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full md:hidden bg-muted/50 hover:bg-muted"
                                onClick={onItemClick}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-y-auto py-4 w-full">
                <nav className={cn("space-y-1 px-3", isCollapsed && "px-2")}>
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={onItemClick}
                            className={cn(
                                "group flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-200",
                                isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "px-3",
                                pathname === item.href
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 flex-shrink-0 transition-colors",
                                    !isCollapsed && "mr-3",
                                    pathname === item.href
                                        ? "text-primary"
                                        : "text-muted-foreground group-hover:text-foreground"
                                )}
                            />
                            {!isCollapsed && <span className="truncate">{item.name}</span>}
                            {isCollapsed && (
                                <div className="absolute left-16 z-50 hidden group-hover:block rounded-md bg-foreground px-2 py-1 text-xs text-background whitespace-nowrap">
                                    {item.name}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>
            {!isCollapsed && (
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
            )}
        </div>
    );
}
