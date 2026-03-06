"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserProfile, Profile } from "@/types";
import {
    Globe,
    ExternalLink,
    Copy,
    Check,
    Layout,
    Eye,
    Palette,
    Share2,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PublicPageDashboard() {
    const supabase = createClient();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: userData } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                setUser(userData);

                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                setProfile(profileData);
            }
            setLoading(false);
        }
        getData();
    }, [supabase]);

    const publicUrl = user ? `${window.location.origin}/u/${user.username}` : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(publicUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="p-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Public Page</h1>
                </div>
                <p className="text-muted-foreground ml-11">
                    Manage how your "Wall of Love" looks to the world.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-border/50 shadow-xl rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-primary text-primary-foreground p-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <CardTitle className="text-3xl font-black italic tracking-tight">Your Share Link</CardTitle>
                                    <CardDescription className="text-primary-foreground/80 text-base font-medium">Use this link to showcase your social proof anywhere.</CardDescription>
                                </div>
                                <Share2 className="h-8 w-8 opacity-20" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-border/50">
                                <Input
                                    value={publicUrl}
                                    readOnly
                                    className="border-none bg-transparent font-bold text-sm focus-visible:ring-0"
                                />
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-11 px-6 rounded-xl font-black italic uppercase tracking-widest gap-2 shadow-sm"
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        {copied ? "Copied" : "Copy"}
                                    </Button>
                                    <Link href={publicUrl} target="_blank">
                                        <Button
                                            size="sm"
                                            className="h-11 px-6 rounded-xl font-black italic uppercase tracking-widest gap-2 shadow-lg"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            Visit
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
                                <div className="h-10 w-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                    <Eye className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Live & Indexed</p>
                                    <p className="text-xs text-muted-foreground">Your page is visible to search engines and public visitors.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card className="border-border/50 shadow-xl rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                    <Layout className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold italic">Layout Settings</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                    <span className="text-sm font-bold">Grid View</span>
                                    <Badge className="bg-primary/10 text-primary border-none">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-border/20 opacity-50">
                                    <span className="text-sm font-bold">Masonry Flow</span>
                                    <Badge variant="outline" className="text-[10px] font-black uppercase">Coming Soon</Badge>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-border/50 shadow-xl rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500">
                                    <Palette className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold italic">Theme</h3>
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-zinc-900'].map((color, i) => (
                                    <button
                                        key={i}
                                        className={`h-10 rounded-full ${color} ${i === 2 ? 'ring-2 ring-offset-2 ring-primary' : ''} shadow-sm cursor-not-allowed`}
                                        title="Themes coming soon"
                                        aria-label={['Blue theme', 'Purple theme', 'Indigo theme', 'Dark theme'][i]}
                                        disabled
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-widest">Custom themes for Pro users</p>
                        </Card>
                    </div>
                </div>

                <div className="space-y-8">
                    <Card className="border-border/50 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                        <div className="bg-muted aspect-[3/4] relative overflow-hidden flex flex-col">
                            {/* Mini Preview */}
                            <div className="p-4 border-b bg-background flex flex-col items-center gap-2">
                                <div className="h-10 w-10 rounded-full bg-muted border shadow-sm" />
                                <div className="h-2 w-16 bg-muted rounded" />
                                <div className="h-1.5 w-24 bg-muted/50 rounded" />
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3 flex-1 overflow-hidden opacity-40">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-24 bg-background border rounded-lg p-2 space-y-1">
                                        <div className="h-1 w-8 bg-muted rounded" />
                                        <div className="h-1.5 w-full bg-muted/50 rounded" />
                                        <div className="h-1.5 w-2/3 bg-muted/50 rounded" />
                                    </div>
                                ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent flex items-end justify-center pb-12 px-6 text-center">
                                <div className="space-y-4">
                                    <h4 className="text-lg font-black italic leading-tight">Wall Preview</h4>
                                    <p className="text-xs text-muted-foreground font-medium">This is a rough preview of your current public presence.</p>
                                    <Link href={publicUrl} target="_blank">
                                        <Button size="sm" variant="outline" className="rounded-full gap-2 text-[10px] font-black uppercase">
                                            Open Mini Wall <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/20 space-y-4">
                        <div className="flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h3 className="font-bold">Social Tip</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            "Add your public link to your Twitter bio and LinkedIn profile to instantly build credibility with visiting prospects."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
