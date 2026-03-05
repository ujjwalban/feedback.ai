"use client"

import { Testimonial } from "@/types";
import { TestimonialCard } from "./TestimonialCard";
import { MessageSquareQuote, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

interface TestimonialListProps {
    testimonials: Testimonial[];
    onDelete: (id: string) => void;
    onImprove: (id: string) => void;
}

export function TestimonialList({ testimonials, onDelete, onImprove }: TestimonialListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filteredTestimonials = testimonials.filter(t => {
        const matchesSearch = t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.message?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
            (t.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesType = typeFilter === "all" || t.type === typeFilter;
        return matchesSearch && matchesType;
    });

    if (testimonials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-3xl bg-card/50 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
                    <MessageSquareQuote className="h-10 w-10 text-primary" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">No testimonials yet</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                        Share your collection link to start building your Wall of Love.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border/50 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, message, or company..."
                        className="pl-9 rounded-xl bg-muted/30 border-none h-11"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[150px] rounded-xl bg-muted/30 border-none h-11">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="text">Text Only</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredTestimonials.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No testimonials match your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTestimonials.map((testimonial) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            onDelete={onDelete}
                            onImprove={onImprove}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
