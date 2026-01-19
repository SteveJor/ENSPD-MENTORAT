// Configuration de l'application
export const APP_CONFIG = {
    name: 'ENSPD Mentorat',
    version: '1.0.0',
    description: 'Plateforme de parrainage académique ENSPD',
    useMockApi: true, // 🎯 ACTIVER/DÉSACTIVER LE MODE MOCK
};

// URLs de l'API
// const getApiBaseUrl = () => {
//     // En production (Vercel), utiliser la variable d'environnement
//     if (import.meta.env.PROD) {
//         return import.meta.env.VITE_API_BASE_URL || '/api';
//     }
//
//     // En développement
//     // Si vous testez depuis mobile, utilisez l'IP de votre PC
//     // Exemple: http://192.168.1.100:8000/api
//     return ;
// };

export const API_CONFIG = {
    baseURL: 'https://parrainsgit.onrender.com/api',
    timeout: 10000,
};

// Endpoints API
export const API_ENDPOINTS = {
    auth: {
        login: '/auth/login',
        verify: '/auth/verify',
    },
    students: {
        profile: '/students/profile',
        updateProfile: '/students/update',
    },
    mentors: {
        assignments: '/mentors/assignments',
        mentees: '/mentors/mentees',
    },
    surprises: {
        create: '/surprises/create',
        list: '/surprises/list',
        byMentor: '/surprises/mentor',
    },
};

// Assets
export const ASSETS = {
    logo: '/logo/enspd_mentorat_logo.jpg',
    defaultAvatar: '/images/default-avatar.png',
    placeholders: {
        profile: '/images/placeholder-profile.svg',
    },
};

// Messages d'erreur
export const ERROR_MESSAGES = {
    network: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    unauthorized: 'Matricule ou code incorrect. Veuillez réessayer.',
    notFound: 'Ressource introuvable.',
    serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
    invalidCredentials: 'Matricule ou token invalide.',
    invalidOTP: 'Code OTP invalide.',
};

// Messages de succès
export const SUCCESS_MESSAGES = {
    profileUpdated: 'Profil mis à jour avec succès !',
    surpriseCreated: 'Surprise créée avec succès !',
    loginSuccess: 'Connexion réussie !',
};

// Validation
export const VALIDATION = {
    matricule: {
        minLength: 5,
        maxLength: 20,
        pattern: /^[A-Z0-9]+$/,
    },
    token: {
        length: 6,
        pattern: /^[0-9]{6}$/,
    },
    otp: {
        length: 6,
    },
    phone: {
        pattern: /^(\+237)?[6][0-9]{8}$/,
    },
};

// Niveaux académiques
export const ACADEMIC_LEVELS = [
    { value: '1', label: 'Niveau 1' },
    { value: '2', label: 'Niveau 2' },
    { value: '3', label: 'Niveau 3' },
    { value: '4', label: 'Niveau 4' },
    { value: '5', label: 'Niveau 5' },
];

// Filières
export const FILIERES = [
    { value: 'INFO', label: 'Informatique' },
    { value: 'TELECOM', label: 'Télécommunications' },
    { value: 'ENERGIE', label: 'Énergie' },
    { value: 'GENIE_CIVIL', label: 'Génie Civil' },
    { value: 'ELECTRO', label: 'Électrotechnique' },
];

// Types de médias pour les surprises
export const MEDIA_TYPES = [
    { value: 'text', label: 'Texte', icon: 'FileText' },
    { value: 'image', label: 'Image', icon: 'Image' },
    { value: 'video', label: 'Vidéo', icon: 'Video' },
    { value: 'audio', label: 'Audio', icon: 'Music' },
    { value: 'link', label: 'Lien', icon: 'Link' },
];

// Phases du système
export const SYSTEM_PHASES = {
    PRE_PARRAINAGE: 'pre_parrainage',
    COMPLETION_PROFIL: 'completion_profil',
    ATTRIBUTION: 'attribution',
    POST_ATTRIBUTION: 'post_attribution',
};

// Routes
export const ROUTES = {
    home: '/',
    login: '/login',
    verifyOtp: '/verify-otp',
    dashboard: '/dashboard',
    profile: '/profile',
    editProfile: '/profile/edit',
    surprises: '/surprises',
    createSurprise: '/surprises/create',
    mentees: '/mentees',
};