"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "@/types";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { Settings, User, Bell, Shield, Key } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
    const supabase = createClient();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

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
            setLoading(false);
        }
        getUser();
    }, [supabase]);

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                        <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                </div>
                <p className="text-muted-foreground ml-11">
                    Manage your account settings and public profile representation.
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-2xl border mb-8 h-12">
                    <TabsTrigger value="profile" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="focus-visible:ring-0">
                    <ProfileForm user={user} />
                </TabsContent>

                <TabsContent value="notifications">
                    <div className="bg-card border border-border/50 rounded-3xl p-10 text-center space-y-4">
                        <Bell className="h-10 w-10 text-muted-foreground mx-auto" />
                        <h3 className="text-xl font-bold">In development</h3>
                        <p className="text-muted-foreground">Notification preferences will be available soon.</p>
                    </div>
                </TabsContent>

                <TabsContent value="security">
                    <div className="bg-card border border-border/50 rounded-3xl p-10 text-center space-y-4">
                        <Key className="h-10 w-10 text-muted-foreground mx-auto" />
                        <h3 className="text-xl font-bold">Password & Auth</h3>
                        <p className="text-muted-foreground">Manage your credentials and API keys here soon.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
