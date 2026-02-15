import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log error for debugging
        console?.error('API Error:', error?.response?.data || error?.message);

        // You can add global error handling here
        // For example, redirect to login on 401, show toast notifications, etc.

        return Promise.reject(error);
    }
);

// Request interceptor (if needed for auth tokens, etc.)
apiClient.interceptors.request.use(
    (config) => {
        // You can add auth headers here if needed
        // const token = getAuthToken();
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
