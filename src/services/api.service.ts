import api from './axios';
import { API_ENDPOINTS } from '../config/constants';
import type {
    ApiResponse,
    LoginCredentials,
    AuthResponse,
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

    async login(
        credentials: LoginCredentials
    ): Promise<ApiResponse<AuthResponse>> {
        const { data } = await api.post(API_ENDPOINTS.auth.login, credentials);
        return data;
    }

    async verifyToken(
        matricule: string,
        token: string
    ): Promise<ApiResponse<AuthResponse>> {
        const { data } = await api.post(API_ENDPOINTS.auth.verify, {
            matricule,
            token,
        });
        return data;
    }

    /* ========= PROFIL ========= */

    async getProfile(): Promise<ApiResponse<Student>> {
        const { data } = await api.get(API_ENDPOINTS.students.profile);
        return data;
    }

    async updateProfile(
        payload: ProfileUpdateData
    ): Promise<ApiResponse<Student>> {
        const { data } = await api.put(
            API_ENDPOINTS.students.updateProfile,
            payload
        );
        return data;
    }

    /* ========= MENTOR ========= */

    async getMentorDashboard(): Promise<ApiResponse<MentorDashboard>> {
        const { data } = await api.get(API_ENDPOINTS.mentors.assignments);
        return data;
    }

    async getMentees(): Promise<ApiResponse<Student[]>> {
        const { data } = await api.get(API_ENDPOINTS.mentors.mentees);
        return data;
    }

    /* ========= MENTORÉ ========= */

    async getMenteeDashboard(): Promise<ApiResponse<MenteeDashboard>> {
        const { data } = await api.get(API_ENDPOINTS.students.profile);
        return data;
    }

    /* ========= SURPRISE ========= */

    async createSurprise(
        payload: Omit<Surprise, 'id' | 'date_creation'>
    ): Promise<ApiResponse<Surprise>> {
        const { data } = await api.post(
            API_ENDPOINTS.surprises.create,
            payload
        );
        return data;
    }

    async getSurprises(): Promise<ApiResponse<Surprise[]>> {
        const { data } = await api.get(API_ENDPOINTS.surprises.list);
        return data;
    }

    async getSurprisesByMentor(
        mentorId: string
    ): Promise<ApiResponse<Surprise[]>> {
        const { data } = await api.get(
            `${API_ENDPOINTS.surprises.byMentor}/${mentorId}`
        );
        return data;
    }
}

export const apiService = new ApiService();
export default apiService;
