"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/utils/supabase/client";
import { Profile, UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Camera, Github, Twitter, Linkedin, Globe, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username is too long").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
    full_name: z.string().min(2, "Name is required"),
    headline: z.string().min(2, "Headline is required"),
    bio: z.string().max(500, "Bio is too long"),
    website: z.string().url().optional().or(z.literal("")),
    twitter: z.string().optional(),
    linkedin: z.string().optional(),
    skills: z.string().optional(),
});

interface ProfileFormProps {
    user: UserProfile;
}

export function ProfileForm({ user }: ProfileFormProps) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
    });

    useEffect(() => {
        async function fetchProfile() {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (data) {
                setProfile(data);
                setAvatarUrl(data.avatar_url);
                form.reset({
                    username: user.username || "",
                    full_name: data.full_name || "",
                    headline: data.headline || "",
                    bio: data.bio || "",
                    website: data.website || "",
                    twitter: data.social_links?.twitter || "",
                    linkedin: data.social_links?.linkedin || "",
                    skills: data.skills?.join(", ") || "",
                });
            }
            setLoading(false);
        }

        fetchProfile();
    }, [user.id, supabase, form]);

    const onSubmit = async (values: z.infer<typeof profileSchema>) => {
        setSaving(true);

        // Update username in users table
        const { error: userError } = await supabase
            .from("users")
            .update({ username: values.username })
            .eq("id", user.id);

        if (userError) {
            if (userError.code === '23505') {
                toast("FeedBack.ai", { description: "This username is already taken. Please choose another one." });
            } else {
                toast("FeedBack.ai", { description: "Error updating username: " + userError.message });
            }
            setSaving(false);
            return;
        }

        const skillsArray = values.skills ? values.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                full_name: values.full_name,
                headline: values.headline,
                bio: values.bio,
                website: values.website,
                avatar_url: avatarUrl,
                skills: skillsArray,
                social_links: {
                    twitter: values.twitter,
                    linkedin: values.linkedin,
                },
                updated_at: new Date().toISOString(),
            });

        if (error) {
            toast("FeedBack.ai", { description: "Error saving profile: " + error.message });
        } else {
            toast("FeedBack.ai", { description: "Profile updated successfully!" });
        }
        setSaving(false);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSaving(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, file);

        if (uploadError) {
            toast("FeedBack.ai", { description: "Error uploading avatar: " + uploadError.message });
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            setAvatarUrl(publicUrl);
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <Card className="border-border/50 shadow-xl overflow-hidden rounded-[2rem]">
                <CardHeader className="bg-primary/5 border-b pb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                                <AvatarImage src={avatarUrl || ""} />
                                <AvatarFallback className="text-3xl font-bold">{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <label className="absolute bottom-2 right-2 p-3 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform active:scale-95">
                                <Camera className="h-5 w-5" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                            </label>
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <CardTitle className="text-3xl font-black italic">Public Profile</CardTitle>
                            <CardDescription className="text-base">
                                This information will be displayed on your public testimonial page at{" "}
                                <Link href={`/u/${user.username}`} target="_blank" className="font-bold text-primary underline">
                                    /u/{user.username}
                                </Link>
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-8 md:p-12">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="username" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Username</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3.5 text-muted-foreground text-xs font-bold">@</span>
                                    <Input id="username" {...form.register("username")} className="rounded-xl h-12 pl-8" placeholder="username" />
                                </div>
                                {form.formState.errors.username && <p className="text-xs text-destructive font-medium">{form.formState.errors.username.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="full_name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
                                <Input id="full_name" {...form.register("full_name")} className="rounded-xl h-12" placeholder="Ujjwal Bansal" />
                                {form.formState.errors.full_name && <p className="text-xs text-destructive font-medium">{form.formState.errors.full_name.message}</p>}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="headline" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Headline</Label>
                                <Input id="headline" {...form.register("headline")} className="rounded-xl h-12" placeholder="Full Stack Developer" />
                                {form.formState.errors.headline && <p className="text-xs text-destructive font-medium">{form.formState.errors.headline.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="bio" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Bio</Label>
                            <Textarea id="bio" {...form.register("bio")} className="rounded-2xl min-h-[120px] p-4 resize-none" placeholder="I help startups build scalable web applications..." />
                            <p className="text-[10px] text-right text-muted-foreground font-medium uppercase tracking-widest">Max 500 characters</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border/50">
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Links
                                </h3>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="website" {...form.register("website")} className="pl-10 rounded-xl h-12" placeholder="https://yourwebsite.com" />
                                    </div>
                                    <div className="relative">
                                        <Twitter className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="twitter" {...form.register("twitter")} className="pl-10 rounded-xl h-12" placeholder="https://twitter.com/username" />
                                    </div>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                        <Input id="linkedin" {...form.register("linkedin")} className="pl-10 rounded-xl h-12" placeholder="https://linkedin.com/in/username" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Save className="h-4 w-4" /> Expertise
                                </h3>
                                <div className="space-y-3">
                                    <Label htmlFor="skills" className="text-xs font-bold text-muted-foreground italic">Skills (comma separated)</Label>
                                    <Input id="skills" {...form.register("skills")} className="rounded-xl h-12" placeholder="React, Next.js, Node.js" />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {form.watch("skills")?.split(",").map((s, i) => s.trim() && (
                                            <Badge key={i} variant="secondary" className="px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-tighter">
                                                {s.trim()}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end">
                            <Button type="submit" size="lg" className="rounded-2xl h-14 px-10 font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-3 h-5 w-5" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
