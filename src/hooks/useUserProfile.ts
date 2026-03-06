import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export function useUserProfile() {
    const supabase = createClient();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data: { user }, error: authErr } = await supabase.auth.getUser();

            if (authErr || !user) {
                throw new Error('Not authenticated');
            }

            const { data, error: err } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (err) throw err;

            setProfile(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch profile';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!profile) return;

        try {
            const { data, error: err } = await supabase
                .from('users')
                .update(updates)
                .eq('id', profile.id)
                .select()
                .single();

            if (err) throw err;

            setProfile(data);
            toast.success('Profile updated successfully');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update profile';
            toast.error(message);
            throw err;
        }
    }, [profile, supabase]);

    return {
        profile,
        loading,
        error,
        updateProfile,
        refetch: fetchProfile,
    };
}
