"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    BarChart3,
    TrendingUp,
    Users,
    MousePointer2,
    FileCheck,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";

export default function AnalyticsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRequests: 0,
        totalSubmissions: 0,
        conversionRate: 0,
        totalViews: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function fetchAnalytics() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch stats from requests
            const { data: requests } = await supabase
                .from("testimonial_requests")
                .select("view_count, submission_count")
                .eq("user_id", user.id);

            if (requests) {
                const totalViews = requests.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
                const totalSubmissions = requests.reduce((acc, curr) => acc + (curr.submission_count || 0), 0);
                const conversionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

                setStats({
                    totalRequests: requests.length,
                    totalSubmissions,
                    conversionRate,
                    totalViews
                });
            }

            // Fetch actual analytics events for the last 7 days
            const sevenDaysAgo = subDays(startOfDay(new Date()), 6).toISOString();

            const { data: events } = await supabase
                .from("analytics_events")
                .select("event_type, created_at")
                .eq("user_id", user.id)
                .gte("created_at", sevenDaysAgo);

            // Fetch submissions separately if they aren't fully tracked in events yet
            const { data: recentTestimonials } = await supabase
                .from("testimonials")
                .select("created_at")
                .eq("user_id", user.id)
                .gte("created_at", sevenDaysAgo);

            // Process data for the 7-day chart
            const dailyData = Array.from({ length: 7 }).map((_, i) => {
                const date = subDays(new Date(), 6 - i);
                const dateStr = format(date, "yyyy-MM-dd");
                const label = format(date, "MMM d");

                const dayViews = events?.filter(e =>
                    (e.event_type === 'link_open' || e.event_type === 'page_view') &&
                    format(new Date(e.created_at), "yyyy-MM-dd") === dateStr
                ).length || 0;

                const daySubmissions = recentTestimonials?.filter(t =>
                    format(new Date(t.created_at), "yyyy-MM-dd") === dateStr
                ).length || 0;

                return {
                    date: label,
                    fullDate: dateStr,
                    submissions: daySubmissions,
                    views: dayViews
                };
            });

            setChartData(dailyData);
            setLoading(false);
        }

        fetchAnalytics();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                </div>
                <p className="text-muted-foreground ml-11">
                    Monitor your testimonial performance and conversion metrics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Active Links", value: stats.totalRequests, icon: MousePointer2, color: "bg-blue-500" },
                    { label: "Submissions", value: stats.totalSubmissions, icon: FileCheck, color: "bg-green-500" },
                    { label: "Conv. Rate", value: `${stats.conversionRate.toFixed(1)}%`, icon: TrendingUp, color: "bg-purple-500" },
                    { label: "Page Views", value: stats.totalViews, icon: Users, color: "bg-orange-500" },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-lg rounded-3xl overflow-hidden hover:scale-[1.02] transition-transform">
                        <CardContent className="p-6 flex items-center gap-6">
                            <div className={`h-14 w-14 rounded-2xl ${stat.color}/10 flex items-center justify-center text-white`}>
                                <stat.icon className={`h-7 w-7 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-black">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-border/50 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b bg-muted/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl font-black italic">Growth Overview</CardTitle>
                                <CardDescription>Views vs Submissions over the last 7 days.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                                <ArrowUpRight className="h-3 w-3" /> 12% increase
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fontWeight: 600, fill: '#888' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#ccc', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="var(--color-primary)"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorViews)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="submissions"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fill="transparent"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b bg-muted/20">
                        <CardTitle className="text-xl font-black italic">Daily Breakdown</CardTitle>
                        <CardDescription>Exact numbers per day.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <ul className="space-y-6">
                            {[...chartData].reverse().map((day, i) => (
                                <li key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        <span className="font-bold text-sm">{day.date}</span>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="text-right">
                                            <p className="text-xs font-black">{day.views}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Views</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-green-500">{day.submissions}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-medium">Subs</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
