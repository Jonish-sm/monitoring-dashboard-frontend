// HTTP Methods
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;

// Alert Types
export const ALERT_TYPES = {
    DOWN: 'DOWN',
    SLOW: 'SLOW',
    ERROR: 'ERROR',
} as const;

// Alert Severity
export const ALERT_SEVERITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
} as const;

// Status
export const STATUS = {
    UP: 'UP',
    DOWN: 'DOWN',
    CHECKING: 'CHECKING',
} as const;

// Polling Intervals (in milliseconds)
export const POLLING_INTERVALS = {
    ENDPOINTS: 10000, // 10 seconds
    ALERTS: 15000, // 15 seconds
    HEALTH_LOGS: 30000, // 30 seconds
} as const;

// Color Mappings
export const STATUS_COLORS = {
    UP: 'text-emerald-500',
    DOWN: 'text-red-500',
    CHECKING: 'text-amber-500',
} as const;

export const SEVERITY_COLORS = {
    LOW: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    MEDIUM: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    HIGH: 'text-red-500 bg-red-500/10 border-red-500/20',
} as const;

export const ALERT_TYPE_ICONS = {
    DOWN: '🔴',
    SLOW: '🟡',
    ERROR: '⚠️',
} as const;

// Time Ranges
export const TIME_RANGES = [
    { label: '1 Hour', value: 1 },
    { label: '6 Hours', value: 6 },
    { label: '24 Hours', value: 24 },
    { label: '7 Days', value: 168 },
    { label: '30 Days', value: 720 },
] as const;
