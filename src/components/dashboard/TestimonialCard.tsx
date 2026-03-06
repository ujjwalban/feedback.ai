"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
    Star,
    Trash2,
    Video,
    Mic,
    Quote,
    Download,
    Sparkles,
    Eye,
    MoreHorizontal,
    Building2,
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRef, useState } from "react";

interface TestimonialCardProps {
    testimonial: Testimonial;
    onDelete?: (id: string) => void;
    onImprove?: (id: string) => void;
}

export function TestimonialCard({ testimonial, onDelete, onImprove }: TestimonialCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const downloadImage = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
            const link = document.createElement('a');
            link.download = `testimonial-${testimonial.client_name.toLowerCase().replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('oops, something went wrong!', err);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 group border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Capture Area for Download */}
            <div ref={cardRef} className="bg-white p-6 pb-2">
                <CardHeader className="p-0 mb-4 flex-row justify-between items-start space-y-0">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(testimonial.created_at), "MMM d, yyyy")}
                        </div>
                    </div>
                    <Badge variant="outline" className="h-6 gap-1 px-2 font-medium">
                        {testimonial.type === 'video' && <Video className="h-3 w-3" />}
                        {testimonial.type === 'audio' && <Mic className="h-3 w-3" />}
                        {testimonial.type === 'text' && <Quote className="h-3 w-3" />}
                        <span className="capitalize">{testimonial.type}</span>
                    </Badge>
                </CardHeader>

                <CardContent className="p-0 flex-1 min-h-[100px]">
                    <p className="text-base text-foreground leading-relaxed italic">
                        "{testimonial.message || testimonial.improved_text || "No message provided."}"
                    </p>
                </CardContent>

                <div className="mt-6 pt-4 border-t flex flex-col gap-1">
                    <p className="font-bold text-sm text-foreground">{testimonial.client_name}</p>
                    {testimonial.client_company && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {testimonial.client_company}
                        </p>
                    )}
                    <div className="mt-4 text-[10px] text-muted-foreground font-medium flex justify-between">
                        <span>Collected with Feedback.ai</span>
                    </div>
                </div>
            </div>

            {/* Actions Bar (Not Captured in Download) */}
            <CardFooter className="px-6 py-4 bg-muted/30 border-t flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 rounded-full" onClick={() => { }}>
                        <Eye className="h-3.5 w-3.5" />
                        <span className="text-xs">Preview</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 rounded-full text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => onImprove?.(testimonial.id)}
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="text-xs">Improve</span>
                    </Button>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl mt-1">
                        <DropdownMenuItem onClick={downloadImage} disabled={isDownloading} className="gap-2 cursor-pointer">
                            <Download className="h-4 w-4" />
                            <span>Download Image</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setShowDeleteConfirm(true)}
                            className="gap-2 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Delete Testimonial</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the testimonial from <strong>{testimonial.client_name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={() => {
                                onDelete?.(testimonial.id);
                                setShowDeleteConfirm(false);
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
