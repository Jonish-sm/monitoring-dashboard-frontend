import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format an ISO date string to a readable format
 */
export function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy HH:mm:ss');
}

/**
 * Format a date as relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format response time in milliseconds
 */
export function formatResponseTime(ms: number | null): string {
    if (ms === null) return 'N/A';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format uptime percentage
 */
export function formatUptime(percentage: number): string {
    return `${percentage.toFixed(2)}%`;
}

/**
 * Format duration in minutes to human-readable format
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}
