import api from './axios';
import { API_ENDPOINTS } from '../config/constants';
import type {
    ApiResponse,
    LoginCredentials,
    AuthResponse,
    Student,
    ProfileUpdateData,
    Surprise,
    RelationData,
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

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    /* ========= AUTH ========= */
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; student: Student }>> {
        try {
            const { data } = await api.post<AuthResponse>(API_ENDPOINTS.auth.login, {
                matricule: credentials.matricule,
                password: credentials.password,
            });

            if (data.access_token) {
                // ✅ Stocker le token AVANT de récupérer le profil
                this.setToken(data.access_token);

                const student = await this.getCurrentStudent();

                if (student) {
                    return {
                        success: true,
                        data: {
                            token: data.access_token,
                            student,
                        },
                    };
                }
            }

            throw new Error('Échec de la connexion');
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || error.message || 'Erreur de connexion',
            };
        }
    }

    /* ========= PROFIL ========= */
    async getCurrentStudent(): Promise<Student | null> {
        try {
            const { data } = await api.get(API_ENDPOINTS.students.me);
            return data.student;
        } catch (error) {
            console.error('Erreur getCurrentStudent:', error);
            return null;
        }
    }

    async getProfile(): Promise<ApiResponse<Student>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.students.me);
            return {
                success: true,
                data: data.student,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la récupération du profil',
            };
        }
    }

    async updateProfile(payload: ProfileUpdateData): Promise<ApiResponse<Student>> {
        try {
            const user = await this.getCurrentStudent();
            if (!user) throw new Error('Utilisateur non connecté');

            const { data } = await api.put(
                API_ENDPOINTS.students.update(Number(user.id)),
                payload
            );

            return {
                success: true,
                data: data.student,
                message: data.msg || 'Profil mis à jour',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la mise à jour',
            };
        }
    }

    /* ========= RELATIONS MENTOR/MENTEE ========= */
    async getRelation(): Promise<ApiResponse<RelationData>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.mentors.relation);
            return {
                success: true,
                data,
            };
        } catch (error: any) {
            console.error('Erreur getRelation:', error);
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la récupération de la relation',
            };
        }
    }

    /* ========= DASHBOARD MENTOR ========= */
    async getMentorDashboard(): Promise<ApiResponse<MentorDashboard>> {
        try {
            const relationResponse = await this.getRelation();

            if (!relationResponse.success || !relationResponse.data) {
                throw new Error('Impossible de récupérer les mentorés');
            }

            if (relationResponse.data.role !== 'mentor') {
                throw new Error('Vous n\'êtes pas un mentor');
            }

            const mentees = relationResponse.data.mentorees || [];
            const surprisesResponse = await this.getSurprises();

            return {
                success: true,
                data: {
                    mentees,
                    surprises_sent: surprisesResponse.data || [],
                },
            };
        } catch (error: any) {
            console.error('Erreur getMentorDashboard:', error);
            return {
                success: false,
                error: error.message || 'Erreur lors du chargement du dashboard',
            };
        }
    }

    /* ========= RÉCUPÉRER LES MENTORÉS ========= */
    async getMentees(): Promise<ApiResponse<Student[]>> {
        try {
            const relationResponse = await this.getRelation();

            if (!relationResponse.success || !relationResponse.data) {
                console.log('⚠️ Pas de relation trouvée');
                return {
                    success: true,
                    data: [],
                };
            }

            if (relationResponse.data.role === 'mentor') {
                console.log('✅ Role: mentor, mentorés:', relationResponse.data.mentorees);
                return {
                    success: true,
                    data: relationResponse.data.mentorees || [],
                };
            }

            console.log('ℹ️ Role:', relationResponse.data.role, '- Pas de mentorés');
            return {
                success: true,
                data: [],
            };
        } catch (error: any) {
            console.error('❌ Erreur getMentees:', error);
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la récupération des mentorés',
            };
        }
    }

    /* ========= DASHBOARD MENTORÉ ========= */
    async getMenteeDashboard(): Promise<ApiResponse<MenteeDashboard>> {
        try {
            // ✅ 1. Récupérer le profil de l'étudiant connecté
            const profileResponse = await this.getProfile();

            if (!profileResponse.success || !profileResponse.data) {
                throw new Error('Impossible de récupérer le profil');
            }

            const currentStudent = profileResponse.data;

            // ✅ 2. Récupérer la relation mentor/mentee
            const relationResponse = await this.getRelation();

            let mentor: Student | null = null;
            let surprises: Surprise[] = [];

            if (relationResponse.success && relationResponse.data) {
                if (relationResponse.data.role === 'mentee') {
                    mentor = relationResponse.data.mentor;

                    // ✅ 3. CORRECTION CRITIQUE : Passer l'ID de l'étudiant connecté (mentee)
                    // Selon la doc : GET /mentor/<student_id> où student_id = ID du mentee
                    try {
                        const { data } = await api.get(
                            API_ENDPOINTS.mentors.surprises(Number(currentStudent.id))
                        );

                        // ✅ L'API retourne directement un tableau
                        surprises = Array.isArray(data) ? data : [];

                        console.log('Surprises reçues:', surprises);
                    } catch (error: any) {
                        console.error('Erreur récupération surprises:', error);
                        // Si pas de mentor assigné ou erreur, on continue avec un tableau vide
                        surprises = [];
                    }
                }
            }

            return {
                success: true,
                data: {
                    mentor,
                    surprises_received: surprises,
                },
            };
        } catch (error: any) {
            console.error('Erreur getMenteeDashboard:', error);
            return {
                success: false,
                error: error.message || 'Erreur lors du chargement du dashboard',
            };
        }
    }

    /* ========= SURPRISES ========= */
    async createSurprise(payload: {
        titre: string;
        type_media: string;
        contenu: string;
    }): Promise<ApiResponse<Surprise>> {
        try {
            const { data } = await api.post(API_ENDPOINTS.surprises.create, {
                titre: payload.titre,
                type_media: payload.type_media.toUpperCase(),
                contenu: payload.contenu,
            });

            return {
                success: true,
                data: data.surprise,
                message: data.msg || 'Surprise créée avec succès',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la création de la surprise',
            };
        }
    }

    async getSurprises(): Promise<ApiResponse<Surprise[]>> {
        try {
            const { data } = await api.get(API_ENDPOINTS.surprises.list);

            return {
                success: true,
                data: Array.isArray(data) ? data : [],
            };
        } catch (error: any) {
            console.error('Erreur getSurprises:', error);
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la récupération des surprises',
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
                data: data.surprise,
                message: data.msg || 'Surprise mise à jour',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la mise à jour',
            };
        }
    }

    async deleteSurprise(id: number): Promise<ApiResponse<void>> {
        try {
            const { data } = await api.delete(API_ENDPOINTS.surprises.delete(id));
            return {
                success: true,
                message: data.msg || 'Surprise supprimée',
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.msg || 'Erreur lors de la suppression',
            };
        }
    }
}

export const apiService = new ApiService();
export default apiService;