import axios from 'axios';
import { API_CONFIG } from '../config/constants';

const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* =====================
   REQUEST INTERCEPTOR
===================== */
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/* =====================
   RESPONSE INTERCEPTOR
   ✅ Gère les réponses Flask de manière cohérente
===================== */
api.interceptors.response.use(
    (response) => {
        // La réponse est déjà au bon format, on la retourne telle quelle
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const errorData = error.response?.data;

        // Gestion de la déconnexion automatique
        if (status === 401) {
            localStorage.removeItem('auth_token');
            // Éviter la boucle infinie si on est déjà sur /login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Retourner une erreur structurée
        return Promise.reject({
            response: {
                status,
                data: errorData,
            },
            message: errorData?.msg || errorData?.message || 'Erreur réseau',
        });
    }
);

export default api;