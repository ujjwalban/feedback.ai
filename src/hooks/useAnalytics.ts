import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AnalyticsData {
    date: string;
    fullDate: string;
    submissions: number;
    views: number;
}

export function useAnalytics(userId?: string) {
    const supabase = createClient();
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [totalViews, setTotalViews] = useState(0);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [conversionRate, setConversionRate] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError(null);

        try {
            const { data: eventsData, error: err } = await supabase
                .from('analytics_events')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (err) throw err;

            // Process events data
            const eventMap: Record<string, { submissions: number; views: number }> = {};

            (eventsData || []).forEach((event: any) => {
                const date = new Date(event.created_at);
                const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

                if (!eventMap[dateStr]) {
                    eventMap[dateStr] = { submissions: 0, views: 0 };
                }

                if (event.event_type === 'submission') {
                    eventMap[dateStr].submissions += 1;
                } else if (event.event_type === 'view') {
                    eventMap[dateStr].views += 1;
                }
            });

            // Convert to array format
            const chartData = Object.entries(eventMap).map(([date, counts]) => ({
                date,
                fullDate: new Date(date).toISOString().split('T')[0],
                submissions: counts.submissions,
                views: counts.views,
            }));

            setData(chartData);

            // Calculate totals
            const views = chartData.reduce((sum, item) => sum + item.views, 0);
            const submissions = chartData.reduce((sum, item) => sum + item.submissions, 0);

            setTotalViews(views);
            setTotalSubmissions(submissions);
            setConversionRate(views > 0 ? Math.round((submissions / views) * 100) : 0);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [userId, supabase]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        data,
        totalViews,
        totalSubmissions,
        conversionRate,
        loading,
        error,
        refetch: fetchAnalytics,
    };
}
