// @ts-ignore - SWR will be installed at runtime
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';
import { UserProfile } from '@/types';

// Cache key
const USER_PROFILE_KEY = 'user-profile';

// Fetcher function
async function fetchUserProfile() {
    const supabase = createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();

    if (authErr || !user) {
        throw new Error('Not authenticated');
    }

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw error;
    return data;
}

export function useUserProfileCached() {
    const { data, error, isLoading, mutate } = useSWR<UserProfile>(
        USER_PROFILE_KEY,
        fetchUserProfile,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 300000, // 5 minutes for profile
        }
    );

    const updateProfile = async (updates: Partial<UserProfile>) => {
        if (!data) return;

        const supabase = createClient();
        const { data: updated, error: err } = await supabase
            .from('users')
            .update(updates)
            .eq('id', data.id)
            .select()
            .single();

        if (err) throw err;

        // Update cache optimistically
        mutate(updated, false);
    };

    return {
        profile: data || null,
        loading: isLoading,
        error: error?.message || null,
        updateProfile,
        refetch: mutate,
    };
}
