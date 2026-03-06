// @ts-ignore - SWR will be installed at runtime
import useSWR from 'swr';
import { createClient } from '@/utils/supabase/client';

interface AnalyticsData {
    date: string;
    fullDate: string;
    submissions: number;
    views: number;
}

interface AnalyticsResult {
    data: AnalyticsData[];
    totalViews: number;
    totalSubmissions: number;
    conversionRate: number;
}

// Cache key generator
function getAnalyticsKey(userId?: string) {
    return userId ? `analytics-${userId}` : null;
}

// Fetcher function
async function fetchAnalytics(key: string): Promise<AnalyticsResult> {
    const userId = key.replace('analytics-', '');
    const supabase = createClient();

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

    // Calculate totals
    const views = chartData.reduce((sum, item) => sum + item.views, 0);
    const submissions = chartData.reduce((sum, item) => sum + item.submissions, 0);

    return {
        data: chartData,
        totalViews: views,
        totalSubmissions: submissions,
        conversionRate: views > 0 ? Math.round((submissions / views) * 100) : 0,
    };
}

export function useAnalyticsCached(userId?: string) {
    const key = getAnalyticsKey(userId);
    const { data, error, isLoading, mutate } = useSWR<AnalyticsResult>(
        key,
        key ? fetchAnalytics : null,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 120000, // 2 minutes for analytics
        }
    );

    return {
        data: data?.data || [],
        totalViews: data?.totalViews || 0,
        totalSubmissions: data?.totalSubmissions || 0,
        conversionRate: data?.conversionRate || 0,
        loading: isLoading,
        error: error?.message || null,
        refetch: mutate,
    };
}
