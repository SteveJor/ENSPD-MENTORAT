import api from './axios';
import { API_ENDPOINTS } from '../config/constants';
import type {
    ApiResponse,
    LoginCredentials,
    Student,
    ProfileUpdateData,
    Surprise,
    MentorDashboard,
    MenteeDashboard,
} from '../types';

class ApiService {
    setToken(token: string) {
        localStorage.setItem('auth_token', token);
    }

    clearToken() {
        localStorage.removeItem('auth_token');
    }

    /* ========= AUTH ========= */

    async login(credentials: LoginCredentials): Promise<{
        data: { token: undefined; student: Student | null; error: null };
        success: boolean;
        error: string
    }> {
        try {
            // ✅ Backend Flask attend { matricule, password }
            const { data } = await api.post(API_ENDPOINTS.auth.login, {
                matricule: credentials.matricule,
                password: credentials.token, // Le "token" du frontend = "password" du backend
            });

            // ✅ Transformer la réponse Flask
            return {
                error: "",
                success: true,
                data: {
                    token: data.access_token, // Flask retourne "access_token"
                    student: await this.getCurrentStudent(),
                    error: null
                }
            };
        } catch (error: any) {
            return {
                data: {
                    token: undefined,
                    student: null,
                    error: null
                },
                success: false,
                error: error.error || 'Erreur de connexion'
            };
        }
    }

    /* ========= PROFIL ========= */

    async getCurrentStudent(): Promise<Student | null> {
        try {
            const { data } = await api.get(API_ENDPOINTS.students.me);
            return data.data.student || data.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null;
        }
    }

    async getProfile(): Promise<ApiResponse<Student>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.students.me);
            return {
                success: true,
                data: data.data.student || data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    async updateProfile(payload: ProfileUpdateData): Promise<ApiResponse<Student>> {
        try {
            const user = await this.getCurrentStudent();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data } = await api.put(
                API_ENDPOINTS.students.update(parseInt(user.id)),
                payload
            );

            return {
                success: true,
                data: data.data.student || data.data,
                message: data.message || 'Profil mis à jour',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    /* ========= MENTOR ========= */

    async getMentorDashboard(): Promise<ApiResponse<MentorDashboard>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.mentors.dashboard);
            return {
                success: true,
                data: data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    async getMentees(): Promise<ApiResponse<Student[]>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.mentors.mentees);
            return {
                success: true,
                data: data.data || [],
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    /* ========= MENTORÉ ========= */

    async getMenteeDashboard(): Promise<ApiResponse<MenteeDashboard>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.students.me);
            return {
                success: true,
                data: {
                    mentee: data.data.student,
                    mentor: data.data.mentor || null,
                    surprises_received: data.data.surprises || [],
                },
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    /* ========= SURPRISE ========= */

    async createSurprise(
        payload: {
            titre: string;
            type_media: "TEXTE" | "IMAGE" | "VIDEO" | "AUDIO" | "LIEN";
            contenu: string;
            mentor_id: string
        }
    ): Promise<ApiResponse<Surprise>> {
        try {
            const { data } = await api.post(API_ENDPOINTS.surprises.create, {
                titre: payload.titre,
                type_media: payload.type_media.toUpperCase(), // ✅ Backend attend UPPERCASE
                contenu: payload.contenu,
            });

            return {
                success: true,
                data: data.data.surprise || data.data,
                message: data.message,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    async getSurprises(): Promise<ApiResponse<Surprise[]>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.surprises.list);

            // ✅ Le backend retourne directement un tableau
            return {
                success: true,
                data: Array.isArray(data.data) ? data.data : data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    async updateSurprise(
        id: number,
        payload: Partial<Surprise>
    ): Promise<ApiResponse<Surprise>> {
        try {
            const { data } = await api.put(
                API_ENDPOINTS.surprises.update(id),
                payload
            );

            return {
                success: true,
                data: data.data.surprise || data.data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }

    async deleteSurprise(id: number): Promise<ApiResponse<void>> {
        try {
            await api.delete(API_ENDPOINTS.surprises.delete(id));
            return {
                success: true,
                message: 'Surprise supprimée',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.error,
            };
        }
    }
}

export const apiService = new ApiService();
export default apiService;