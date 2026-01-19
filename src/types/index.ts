// Types pour les étudiants
export interface Student {
    id: string;
    matricule: string;
    nom_complet: string;
    niveau: string;
    filiere: string;
    telephone?: string;
    competences?: string[];
    centres_interet?: string[];
    reseaux_sociaux?: SocialMedia;
    photo_profil?: string;
    token: string;
    created_at: string;
    profile_completed: boolean;
}

export interface SocialMedia {
    whatsapp?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
}

// Types pour l'attribution de mentors
export interface MentorAssignment {
    id: string;
    mentor_id: string;
    mentee_id: string;
    date_attribution: string;
    statut: 'actif' | 'inactif' | 'termine';
}

// Types pour les surprises
export interface Surprise {
    id: string;
    mentor_id: string;
    titre: string;
    type_media: 'text' | 'image' | 'video' | 'audio' | 'link';
    contenu: string;
    date_creation: string;
}

// Types pour l'authentification
export interface LoginCredentials {
    matricule: string;
    token: string;
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    student?: Student;
    message?: string;
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
    mentor: Student;
    surprises_received: Surprise[];
}

// Types pour les formulaires
export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'file' | 'tel';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    };
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

// Types pour les notifications
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}

// Types pour les filtres et la recherche
export interface FilterOptions {
    niveau?: string;
    filiere?: string;
    search?: string;
}

// Types pour les statistiques
export interface Stats {
    total_students: number;
    total_mentors: number;
    total_mentees: number;
    active_assignments: number;
    total_surprises: number;
}