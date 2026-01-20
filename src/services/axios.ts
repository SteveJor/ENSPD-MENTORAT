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
   ✅ Transforme les réponses Flask en format standardisé
===================== */
api.interceptors.response.use(
    (response) => {
        // ✅ Transformer la réponse Flask en format attendu par le frontend
        const data = response.data;

        // Si la réponse contient déjà "success", on la retourne telle quelle
        if ('success' in data) {
            return response;
        }

        // ✅ Transformer les réponses Flask standard
        return {
            ...response,
            data: {
                success: true,
                data: data.student || data.surprise || data.mentor || data,
                message: data.msg || data.message,
            },
        };
    },
    (error) => {
        const status = error.response?.status;
        const errorMessage = error.response?.data?.msg || error.response?.data?.message;

        if (status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }

        return Promise.reject({
            success: false,
            status,
            error: errorMessage || mapHttpError(status),
        });
    }
);

export default api;