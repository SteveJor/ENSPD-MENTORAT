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
import {
    mockStudents,
    mockSurprises,
    getMenteesByMentorId,
    getMentorByMenteeId,
    getSurprisesByMentorId,
    getSurprisesForMentee,
} from './mock.data';

// Simuler un délai réseau
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiService {
    private currentUser: Student | null = null;
    private token: string | null = null;

    constructor() {
        this.loadSession();
    }

    private loadSession() {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('current_user');

        if (savedToken && savedUser) {
            this.token = savedToken;
            this.currentUser = JSON.parse(savedUser);
        }
    }

    private saveSession(user: Student, token: string) {
        this.currentUser = user;
        this.token = token;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    clearToken() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    }

    // ========== AUTHENTIFICATION ==========

    async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
        await delay();

        // Chercher l'étudiant par matricule
        const student = mockStudents.find(
            (s) => s.matricule.toUpperCase() === credentials.matricule.toUpperCase()
        );

        if (!student) {
            return {
                success: false,
                error: 'Matricule non trouvé',
            };
        }

        // Vérifier le token (dans un vrai système, ce serait un mot de passe)
        if (student.token !== credentials.token) {
            return {
                success: false,
                error: 'Token invalide',
            };
        }

        // Générer un token de session
        const sessionToken = `mock-token-${Date.now()}`;
        this.saveSession(student, sessionToken);

        return {
            success: true,
            data: {
                success: true,
                token: sessionToken,
                student,
            },
        };
    }

    async verifyToken(matricule: string, token: string): Promise<ApiResponse<AuthResponse>> {
        return this.login({ matricule, token });
    }

    // ========== PROFIL ÉTUDIANT ==========

    async getProfile(): Promise<ApiResponse<Student>> {
        await delay(300);

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        return {
            success: true,
            data: this.currentUser,
        };
    }

    async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<Student>> {
        await delay();

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        // Mettre à jour le profil
        const updatedUser = {
            ...this.currentUser,
            ...data,
            profile_completed: true,
        };

        // Mettre à jour dans mockStudents
        const index = mockStudents.findIndex((s) => s.id === this.currentUser?.id);
        if (index !== -1) {
            mockStudents[index] = updatedUser;
        }

        this.saveSession(updatedUser, this.token!);

        return {
            success: true,
            data: updatedUser,
        };
    }

    async uploadProfilePhoto(file: File): Promise<ApiResponse<{ url: string }>> {
        await delay(1000);

        // Simuler l'upload en créant une URL
        const url = URL.createObjectURL(file);

        return {
            success: true,
            data: { url },
        };
    }

    // ========== MENTOR ==========

    async getMentorDashboard(): Promise<ApiResponse<MentorDashboard>> {
        await delay();

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        const mentees = getMenteesByMentorId(this.currentUser.id);
        const surprises_sent = getSurprisesByMentorId(this.currentUser.id);

        return {
            success: true,
            data: {
                mentor: this.currentUser,
                mentees,
                surprises_sent,
            },
        };
    }

    async getMentees(): Promise<ApiResponse<Student[]>> {
        await delay();

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        const mentees = getMenteesByMentorId(this.currentUser.id);

        return {
            success: true,
            data: mentees,
        };
    }

    // ========== MENTORÉ ==========

    async getMenteeDashboard(): Promise<ApiResponse<MenteeDashboard>> {
        await delay();

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        const mentor = getMentorByMenteeId(this.currentUser.id);
        const surprises_received = getSurprisesForMentee(this.currentUser.id);

        return {
            success: true,
            data: {
                mentee: this.currentUser,
                mentor: mentor!,
                surprises_received,
            },
        };
    }

    // ========== SURPRISES ==========

    async createSurprise(surpriseData: Omit<Surprise, 'id' | 'date_creation'>): Promise<ApiResponse<Surprise>> {
        await delay(800);

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        const newSurprise: Surprise = {
            id: `s${Date.now()}`,
            mentor_id: this.currentUser.id,
            titre: surpriseData.titre,
            type_media: surpriseData.type_media,
            contenu: surpriseData.contenu,
            date_creation: new Date().toISOString(),
        };

        // Ajouter à la liste des surprises mockées
        mockSurprises.push(newSurprise);

        return {
            success: true,
            data: newSurprise,
        };
    }

    async getSurprises(): Promise<ApiResponse<Surprise[]>> {
        await delay();

        if (!this.currentUser) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        // Si mentor, retourner ses surprises
        if (parseInt(this.currentUser.niveau) > 1) {
            const surprises = getSurprisesByMentorId(this.currentUser.id);
            return {
                success: true,
                data: surprises,
            };
        }

        // Si mentoré, retourner les surprises de son mentor
        const surprises = getSurprisesForMentee(this.currentUser.id);
        return {
            success: true,
            data: surprises,
        };
    }

    async getSurprisesByMentor(mentorId: string): Promise<ApiResponse<Surprise[]>> {
        await delay();

        const surprises = getSurprisesByMentorId(mentorId);

        return {
            success: true,
            data: surprises,
        };
    }
}

// Export singleton
export const mockApiService = new MockApiService();