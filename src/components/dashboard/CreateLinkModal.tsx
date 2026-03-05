"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Copy, Check, Lock, Radio } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

        const { error } = await supabase
            .from("testimonial_requests")
            .insert([
                {
                    user_id: user.id,
                    slug: slug || Math.random().toString(36).substring(7),
                    allowed_type: type as 'text' | 'audio' | 'video'
                }
            ])

        if (!error) {
            const link = `${window.location.origin}/t/${slug}`
            setGeneratedLink(link)
        }
        setLoading(false)
    }

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <Dialog onOpenChange={() => { setGeneratedLink(null); setSlug(""); }}>
            <DialogTrigger asChild>
                <Button className="rounded-full shadow-lg">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Link
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create Testimonial Link</DialogTitle>
                    <DialogDescription>
                        Generate a unique link to send to your clients.
                    </DialogDescription>
                </DialogHeader>
                {!generatedLink ? (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Custom Slug (Optional)</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-sm">feedback.ai/t/</span>
                                <Input
                                    id="slug"
                                    placeholder="project-alpha"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Testimonial Type</Label>
                            <RadioGroup value={type} onValueChange={setType} className="grid grid-cols-1 gap-3">
                                <div className="flex items-center space-x-3 space-y-0 border p-3 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
                                    <RadioGroupItem value="text" id="text" />
                                    <Label htmlFor="text" className="flex-1 cursor-pointer font-medium">Text Testimonial</Label>
                                    <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full font-bold uppercase">Free</span>
                                </div>
                                <div className={`flex items-center space-x-3 space-y-0 border p-3 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors ${plan !== 'pro' ? 'opacity-60' : ''}`}>
                                    <RadioGroupItem value="audio" id="audio" disabled={plan !== 'pro'} />
                                    <Label htmlFor="audio" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                                        Audio Testimonial
                                        {plan !== 'pro' && <Lock className="h-3 w-3" />}
                                    </Label>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Pro</span>
                                </div>
                                <div className={`flex items-center space-x-3 space-y-0 border p-3 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors ${plan !== 'pro' ? 'opacity-60' : ''}`}>
                                    <RadioGroupItem value="video" id="video" disabled={plan !== 'pro'} />
                                    <Label htmlFor="video" className="flex-1 cursor-pointer font-medium flex items-center gap-2">
                                        Video Testimonial
                                        {plan !== 'pro' && <Lock className="h-3 w-3" />}
                                    </Label>
                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Pro</span>
                                </div>
                            </RadioGroup>
                            {plan !== 'pro' && type !== 'text' && (
                                <p className="text-xs text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                                    Upgrade to Pro to collect audio/video testimonials.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 py-4">
                        <div className="grid flex-1 gap-2">
                            <Label htmlFor="link" className="sr-only">Link</Label>
                            <Input
                                id="link"
                                defaultValue={generatedLink}
                                readOnly
                            />
                        </div>
                        <Button size="sm" className="px-3" onClick={copyToClipboard}>
                            <span className="sr-only">Copy</span>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                )}
                <DialogFooter>
                    {!generatedLink ? (
                        <Button type="submit" onClick={handleCreate} disabled={loading}>
                            {loading ? "Generating..." : "Generate Link"}
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => setGeneratedLink(null)}>Done</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
