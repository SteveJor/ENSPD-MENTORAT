// Types pour les étudiants
export interface Student {
    id: string;
    matricule: string;
    nom_complet: string;
    niveau: number; // ✅ Backend retourne un number (3 ou 4)
    filiere: string;
    telephone?: string;
    competences?: string[];
    centres_interet?: string[];
    reseaux_sociaux?: SocialMedia;
    photo_profil?: string | null;
    token?: string;
    created_at: string;
    updated_at?: string;
}

export interface SocialMedia {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
}

// ✅ Types de média UPPERCASE (comme backend Flask)
export type MediaType = 'TEXTE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LIEN' | 'GIF' | 'DEFI';

// Types pour les surprises
export interface Surprise {
    id: number;
    mentor_id: number;
    titre: string;
    type_media: MediaType; // ✅ UPPERCASE
    contenu: string;
    date_creation: string;
}

// Types pour l'authentification
export interface LoginCredentials {
    matricule: string;
    password: string; // ✅ Backend attend "password" pas "token"
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    student_name: string;
}

// Types pour la mise à jour du profil
export interface ProfileUpdateData {
    telephone?: string;
    photo_profil?: string;
    competences?: string[];
    centres_interet?: string[];
    reseaux_sociaux?: SocialMedia;
}

// ✅ Types pour les relations mentor/mentee
export interface MentorRelation {
    role: 'mentor';
    mentorees: Student[];
}

export interface MenteeRelation {
    role: 'mentee';
    mentor: Student;
}

export type RelationData = MentorRelation | MenteeRelation;

// Types pour le dashboard
export interface MentorDashboard {
    mentees: Student[];
    surprises_sent: Surprise[];
}

export interface MenteeDashboard {
    mentor: Student | null;
    surprises_received: Surprise[];
}

// Types pour les réponses API standardisées
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}