import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { mapHttpError } from './error.mapper';

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* =====================
   REQUEST INTERCEPTOR
===================== */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/* =====================
   RESPONSE INTERCEPTOR
===================== */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            localStorage.removeItem('auth_token');
        }

        return Promise.reject({
            success: false,
            status,
            error: mapHttpError(status),
        });
    }
);

export default api;
