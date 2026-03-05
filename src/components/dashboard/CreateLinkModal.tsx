"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    PlusCircle,
    Copy,
    Check,
    Lock,
    Sparkles,
    Link as LinkIcon,
    MessageSquare,
    Video,
    Mic,
    ArrowRight,
    ShieldCheck,
    Zap
} from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface CreateLinkModalProps {
    plan?: string
}

export function CreateLinkModal({ plan = 'free' }: CreateLinkModalProps) {
    const supabase = createClient()
    const [slug, setSlug] = useState("")
    const [type, setType] = useState("text")
    const [loading, setLoading] = useState(false)
    const [generatedLink, setGeneratedLink] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleCreate = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return

        const finalSlug = slug || Math.random().toString(36).substring(7);

        const { error } = await supabase
            .from("testimonial_requests")
            .insert([
                {
                    user_id: user.id,
                    slug: finalSlug,
                }
            ])

        if (!error) {
            const link = `${window.location.origin}/submit/testimonial/${finalSlug}`
            setGeneratedLink(link)
        } else {
            alert(error.message);
        }
        setLoading(false)
    }

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <Dialog onOpenChange={(open) => { if (!open) { setGeneratedLink(null); setSlug(""); } }}>
            <DialogTrigger asChild>
                <Button className="rounded-2xl h-12 shadow-xl shadow-primary/20 gap-2 font-black italic uppercase tracking-widest px-8">
                    <PlusCircle className="h-5 w-5" />
                    Create Request Link
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
                    <Zap className="absolute -top-6 -right-6 h-32 w-32 opacity-10" />
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black italic tracking-tight">Generate Link</DialogTitle>
                        <DialogDescription className="text-primary-foreground/80 text-base font-medium">
                            Create a friction-less testimonial collection link for your clients.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-8 space-y-8">
                    {!generatedLink ? (
                        <>
                            <div className="space-y-4">
                                <Label htmlFor="slug" className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <LinkIcon className="h-4 w-4" /> Custom Slug (Optional)
                                </Label>
                                <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-2xl border border-border/50">
                                    <span className="text-muted-foreground text-sm font-bold pl-3">/submit/testimonial/</span>
                                    <Input
                                        id="slug"
                                        placeholder="project-alpha"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        className="border-none bg-background rounded-xl h-10 focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" /> Allowed Formats
                                </Label>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-2xl transition-all hover:bg-muted/50">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                                <MessageSquare className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Text Testimonial</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Included in all plans</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black italic">ACTIVE</Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-muted/10 border border-border/20 rounded-2xl opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center">
                                                <Mic className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold flex items-center gap-2">Audio Review {plan !== 'pro' && <Lock className="h-3 w-3" />}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-primary">Pro Feature</p>
                                            </div>
                                        </div>
                                        {plan === 'pro' ? (
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black italic">AUTO</Badge>
                                        ) : (
                                            <Button size="sm" variant="outline" className="text-[10px] h-7 rounded-lg font-black italic uppercase tracking-widest">Unlock</Button>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-muted/10 border border-border/20 rounded-2xl opacity-60">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-muted rounded-xl flex items-center justify-center">
                                                <Video className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold flex items-center gap-2">Video Review {plan !== 'pro' && <Lock className="h-3 w-3" />}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-primary">Pro Feature</p>
                                            </div>
                                        </div>
                                        {plan === 'pro' ? (
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-black italic">AUTO</Badge>
                                        ) : (
                                            <Button size="sm" variant="outline" className="text-[10px] h-7 rounded-lg font-black italic uppercase tracking-widest">Unlock</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="h-24 w-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <Check className="h-10 w-10" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black italic">Link Ready!</h3>
                                <p className="text-muted-foreground font-medium">Send this link to your clients to start collecting testimonials.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-border/50">
                                <Input
                                    id="link"
                                    defaultValue={generatedLink}
                                    readOnly
                                    className="border-none bg-transparent font-bold text-sm focus-visible:ring-0"
                                />
                                <Button
                                    size="sm"
                                    className="h-11 px-6 rounded-xl font-black italic uppercase tracking-widest gap-2 shadow-lg"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-8 pt-0">
                    {!generatedLink ? (
                        <Button
                            type="submit"
                            onClick={handleCreate}
                            disabled={loading}
                            className="w-full h-14 rounded-2xl text-base font-black italic uppercase tracking-widest shadow-xl shadow-primary/20 gap-2 transition-all hover:shadow-primary/30 hover:-translate-y-1"
                        >
                            {loading ? "Generating Magic..." : "Generate Magic Link"}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </Button>
                    ) : (
                        <Button variant="secondary" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs" onClick={() => setGeneratedLink(null)}>Create Another</Button>
                    )}
                </DialogFooter>

                <div className="p-4 bg-muted/30 border-t flex justify-center items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <ShieldCheck className="h-3 w-3" /> Secure & Frictionless
                </div>
            </DialogContent>
        </Dialog>
    )
}
