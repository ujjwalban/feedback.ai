// @ts-ignore - SWR will be installed at runtime
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { Testimonial } from '@/types';

interface UseTestimonialsCacheOptions {
    userId?: string;
    limit?: number;
    offset?: number;
}

// Cache key generator
function getTestimonialsKey(options: UseTestimonialsCacheOptions) {
    if (!options.userId) return null;
    return [`testimonials-${options.userId}`, options.limit, options.offset].join(':');
}

// Fetcher function
async function fetchTestimonials(key: string): Promise<Testimonial[]> {
    const [, userIdPart, limit, offset] = key.match(/testimonials-(.+):(\d+):(\d+)/) || [];

    if (!userIdPart) return [];

    const supabase = createClient();
    let query = supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', userIdPart);

    if (limit) {
        const from = parseInt(offset) || 0;
        const to = from + parseInt(limit) - 1;
        query = query.range(from, to);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export function useTestimonialsCached(options: UseTestimonialsCacheOptions = {}) {
    const key = getTestimonialsKey(options);
    const { data, error, isLoading, mutate } = useSWR<Testimonial[]>(
        key,
        fetchTestimonials,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    const deleteTestimonial = async (id: string) => {
        const supabase = createClient();
        const { error: err } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (err) throw err;

        // Update cache
        mutate((testimonials: Testimonial[] | undefined) => testimonials?.filter((t: Testimonial) => t.id !== id), false);
    };

    return {
        testimonials: data || [],
        loading: isLoading,
        error: error?.message || null,
        deleteTestimonial,
        refetch: mutate,
    };
}
