// Types pour les étudiants
export interface Student {
    id: string;
    matricule: string;
    nom_complet: string;
    niveau: string; // ✅ Peut être "3" ou "4" (string)
    filiere: string;
    telephone?: string;
    competences?: string[];
    centres_interet?: string[];
    reseaux_sociaux?: SocialMedia;
    photo_profil?: string | null;
    token?: string;
    created_at: string;
    updated_at?: string;
    profile_completed?: boolean;
}

export interface SocialMedia {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
}

// Types pour les surprises
export interface Surprise {
    id: string | number;
    mentor_id: string | number;
    titre: string;
    type_media: 'text' | 'image' | 'video' | 'audio' | 'link';
    contenu: string;
    date_creation: string;
}

// Types pour l'authentification
export interface LoginCredentials {
    matricule: string;
    token: string; // Correspond au "password" côté backend
}

export interface AuthResponse {
    token?: string;
    student?: Student;
    access_token?: string; // Flask retourne "access_token"
    refresh_token?: string;
}

// Types pour la mise à jour du profil
export interface ProfileUpdateData {
    competences?: string[];
    centres_interet?: string[];
    reseaux_sociaux?: SocialMedia;
    photo_profil?: string;
    telephone?: string;
}

// Types pour le dashboard
export interface MentorDashboard {
    mentor: Student;
    mentees: Student[];
    surprises_sent: Surprise[];
}

export interface MenteeDashboard {
    mentee: Student;
    mentor: Student | null;
    surprises_received: Surprise[];
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    msg?: string; // Flask utilise "msg"
}