// API Endpoint Types
export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers: Record<string, string> | null;
  expectedStatus: number;
  checkInterval: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEndpointDto {
  name: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  expectedStatus?: number;
  checkInterval?: number;
}

export interface UpdateEndpointDto {
  name?: string;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  expectedStatus?: number;
  checkInterval?: number;
  isActive?: boolean;
}

// Health Log Types
export interface HealthLog {
  id: string;
  endpointId: string;
  statusCode: number | null;
  responseTimeMs: number | null;
  success: boolean;
  errorMessage: string | null;
  checkedAt: string;
}

export interface Analytics {
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  uptimePercentage: number;
  averageResponseTime: number;
  lastCheckStatus: 'UP' | 'DOWN' | null;
  timeRange: string;
}

// Alert Types
export interface Alert {
  id: string;
  endpointId: string;
  alertType: 'DOWN' | 'SLOW' | 'ERROR';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  isAcknowledged: boolean;
  createdAt: string;
  acknowledgedAt: string | null;
}

// Extended types for UI
export interface EndpointWithStatus extends Endpoint {
  currentStatus?: 'UP' | 'DOWN' | 'CHECKING';
  lastCheckTime?: string;
  responseTime?: number;
  uptimePercentage?: number;
}
