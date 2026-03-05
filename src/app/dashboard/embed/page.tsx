"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types";
import { Code2, Copy, Check, ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function EmbedPage() {
    const supabase = createClient();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function getUser() {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", authUser.id)
                    .single();
                setUser(data);
            }
        }
        getUser();
    }, [supabase]);

    const embedCode = user ? `<script src="${window.location.origin}/widget.js"></script>\n<div data-feedback-user="${user.username}"></div>` : "";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Code2 className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Embed Widget</h1>
                </div>
                <p className="text-muted-foreground ml-11">
                    Showcase your best testimonials on your own website with a simple script.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border/50 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-primary text-primary-foreground p-8">
                        <CardTitle className="text-2xl font-black italic">Generator</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Copy the code below and paste it into your website's HTML.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Embed Code</Label>
                            <div className="relative">
                                <textarea
                                    className="w-full h-32 p-4 bg-muted/50 rounded-2xl font-mono text-sm border-none focus:ring-1 focus:ring-primary resize-none"
                                    value={embedCode}
                                    readOnly
                                />
                                <Button
                                    size="sm"
                                    className="absolute bottom-4 right-4 rounded-xl gap-2 font-bold uppercase tracking-widest text-[10px]"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                    {copied ? "Copied" : "Copy Code"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-primary italic">Instructions</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                                <li className="flex gap-3">
                                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">1</span>
                                    <span>Copy the script tag and the div tag.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">2</span>
                                    <span>Paste the script tag anywhere in your HTML (inside <code>&lt;head&gt;</code> is recommended).</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black">3</span>
                                    <span>Place the <code>&lt;div&gt;</code> exactly where you want the widget to appear.</span>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                    <Card className="border-border/50 shadow-xl rounded-[2.5rem] overflow-hidden bg-primary/5 border-dashed border-2">
                        <CardHeader className="p-8">
                            <CardTitle className="text-xl font-black italic flex items-center gap-2">
                                <ExternalLink className="h-5 w-5" /> Live Preview
                            </CardTitle>
                            <CardDescription>This is how it will look on your site.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 flex items-center justify-center">
                            <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-lg border border-border/50 space-y-4">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                                </div>
                                <p className="text-xs font-medium italic">"Feedback.ai is the best tool I've used for my freelance business. Highly recommended!"</p>
                                <div className="flex items-center gap-2 pt-2 border-t text-[10px] font-bold">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">J</div>
                                    <span>John Doe, Tech Co.</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] space-y-4">
                        <div className="flex items-center gap-3">
                            <MessageSquareQuote className="h-6 w-6 text-primary" />
                            <h3 className="font-bold">Need help?</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Our support team is always here to help you with the implementation.</p>
                        <Button variant="outline" className="w-full rounded-2xl font-bold uppercase tracking-widest text-[10px]">Contact Support</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
