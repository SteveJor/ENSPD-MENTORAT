// Configuration de l'application
export const APP_CONFIG = {
    name: 'ENSPD Mentorat',
    version: '1.0.0',
    description: 'Plateforme de parrainage académique ENSPD',
};

export const API_CONFIG = {
    baseURL: 'https://parrainsgit.onrender.com',
    timeout: 10000,
};

// ✅ Endpoints - VÉRIFIEZ QUE VOTRE BACKEND CORRESPOND
export const API_ENDPOINTS = {
    auth: {
        login: '/api/auth/login',
        refresh: '/api/auth/refresh',
    },
    students: {
        me: '/api/student/me',
        list: '/api/student/',
        update: (id: number) => `/api/student/${id}`,
        delete: (id: number) => `/api/student/${id}`,
    },
    mentors: {
        // ⚠️ VÉRIFIEZ CES ROUTES SUR VOTRE BACKEND
        relation: '/api/mentor/relation',  // ← 404 ici
        surprises: (studentId: number) => `/api/mentor/${studentId}`,

        // 🔧 SI VOTRE BACKEND UTILISE UN AUTRE CHEMIN, CHANGEZ-LE ICI
        // Exemple alternatif si votre backend a /api/mentor au lieu de /mentor :
        // relation: '/api/mentor/relation',
        // surprises: (studentId: number) => `/api/mentor/${studentId}`,
    },
    surprises: {
        create: '/api/surprises/',
        list: '/api/surprises/',
        update: (id: number) => `/api/surprises/${id}`,
        delete: (id: number) => `/api/surprises/${id}`,
    },
};

// Assets
export const ASSETS = {
    logo: '/logo/logo_1.png',
    defaultAvatar: '/images/default-avatar.png',
};

// Messages d'erreur
export const ERROR_MESSAGES = {
    network: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    unauthorized: 'Matricule ou mot de passe incorrect.',
    notFound: 'Ressource introuvable.',
    serverError: 'Erreur serveur. Veuillez réessayer plus tard.',
    invalidCredentials: 'Identifiants invalides',
    forbidden: 'Accès refusé. Seuls les étudiants de niveau 4 peuvent effectuer cette action.',
    cors: 'Erreur CORS - Le backend ne répond pas correctement',
    endpoint404: 'Endpoint introuvable - Vérifiez la configuration backend',
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
        minLength: 4,
        maxLength: 15,
        pattern: /^[A-Z0-9]+$/,
    },
    password: {
        minLength: 3,
    },
};

// ✅ Types de médias UPPERCASE (comme backend)
export const MEDIA_TYPES = [
    { value: 'TEXTE', label: 'Message texte', icon: 'FileText', description: 'Un message personnalisé', placeholder: 'Écrivez votre message...' },
    { value: 'IMAGE', label: 'Image', icon: 'Image', description: 'Image inspirante', placeholder: 'URL de l\'image (https://...)' },
    { value: 'VIDEO', label: 'Vidéo', icon: 'Video', description: 'Vidéo motivante', placeholder: 'URL de la vidéo (https://...)' },
    { value: 'AUDIO', label: 'Audio', icon: 'Music', description: 'Message vocal', placeholder: 'URL de l\'audio (https://...)' },
    { value: 'LIEN', label: 'Lien', icon: 'Link', description: 'Ressource utile', placeholder: 'https://...' },
    { value: 'GIF', label: 'GIF', icon: 'Image', description: 'GIF animé', placeholder: 'URL du GIF (https://...)' },
];

// Routes
export const ROUTES = {
    home: '/',
    login: '/login',
    dashboard: '/dashboard',
    profile: '/profile',
    surprises: '/surprises',
    createSurprise: '/surprises/create',
    mentees: '/mentees',
};