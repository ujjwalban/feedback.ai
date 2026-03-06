import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Testimonial } from '@/types';
import { toast } from 'sonner';

interface UseTestimonialsOptions {
    userId?: string;
    limit?: number;
    offset?: number;
}

export function useTestimonials(options: UseTestimonialsOptions = {}) {
    const supabase = createClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = useCallback(async () => {
        if (!options.userId) return;

        setLoading(true);
        setError(null);

        try {
            let query = supabase
                .from('testimonials')
                .select('*')
                .eq('user_id', options.userId);

            if (options.limit) {
                const from = options.offset || 0;
                const to = from + options.limit - 1;
                query = query.range(from, to);
            }

            const { data, error: err } = await query.order('created_at', { ascending: false });

            if (err) throw err;

            setTestimonials(data || []);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch testimonials';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [options.userId, options.limit, options.offset, supabase]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const deleteTestimonial = useCallback(async (id: string) => {
        try {
            const { error: err } = await supabase
                .from('testimonials')
                .delete()
                .eq('id', id);

            if (err) throw err;

            setTestimonials((prev) => prev.filter((t) => t.id !== id));
            toast.success('Testimonial deleted');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete';
            toast.error(message);
        }
    }, [supabase]);

    const updateTestimonial = useCallback(async (id: string, updates: Partial<Testimonial>) => {
        try {
            const { data, error: err } = await supabase
                .from('testimonials')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (err) throw err;

            setTestimonials((prev) =>
                prev.map((t) => (t.id === id ? data : t))
            );
            toast.success('Testimonial updated');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update';
            toast.error(message);
        }
    }, [supabase]);

    return {
        testimonials,
        loading,
        error,
        deleteTestimonial,
        updateTestimonial,
        refetch: fetchTestimonials,
    };
}
