import type { Student, MentorAssignment, Surprise } from '../types';

// Étudiants mockés
export const mockStudents: Student[] = [
    // Mentors (Niveaux 2-5)
    {
        id: '1',
        matricule: '20FI2001',
        nom_complet: 'Marie Dupont',
        niveau: '5',
        filiere: 'INFO',
        telephone: '+237693090169',
        competences: ['Python', 'React', 'Machine Learning', 'Django'],
        centres_interet: ['Football', 'Lecture', 'Musique'],
        reseaux_sociaux: {
            whatsapp: '237693090169',
            facebook: 'marie.dupont',
            instagram: '@mariedupont',
            linkedin: 'marie-dupont',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=1',
        token: '123456',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '2',
        matricule: '21TE2002',
        nom_complet: 'Jean Martin',
        niveau: '4',
        filiere: 'TELECOM',
        telephone: '+237677123456',
        competences: ['Réseaux', '5G', 'IoT', 'Antennes'],
        centres_interet: ['Basketball', 'Cinéma', 'Gaming'],
        reseaux_sociaux: {
            whatsapp: '237677123456',
            instagram: '@jeanmartin',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=12',
        token: '234567',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '3',
        matricule: '22EN2003',
        nom_complet: 'Sophie Bernard',
        niveau: '3',
        filiere: 'ENERGIE',
        telephone: '+237698765432',
        competences: ['Énergies Renouvelables', 'Électricité', 'AutoCAD'],
        centres_interet: ['Volleyball', 'Cuisine', 'Voyages'],
        reseaux_sociaux: {
            whatsapp: '237698765432',
            facebook: 'sophie.bernard',
            linkedin: 'sophie-bernard',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=5',
        token: '345678',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },

    // Mentorés (Niveau 1)
    {
        id: '4',
        matricule: '25FI1001',
        nom_complet: 'Pierre Kamga',
        niveau: '1',
        filiere: 'INFO',
        telephone: '+237655111222',
        competences: ['HTML', 'CSS', 'JavaScript'],
        centres_interet: ['Football', 'Jeux vidéo', 'Programmation'],
        reseaux_sociaux: {
            whatsapp: '237655111222',
            instagram: '@pierrekamga',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=8',
        token: '456789',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '5',
        matricule: '25FI1002',
        nom_complet: 'Aminata Ndiaye',
        niveau: '1',
        filiere: 'INFO',
        telephone: '+237666222333',
        competences: ['Python', 'Java', 'SQL'],
        centres_interet: ['Lecture', 'Danse', 'Entrepreneuriat'],
        reseaux_sociaux: {
            whatsapp: '237666222333',
            facebook: 'aminata.ndiaye',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=9',
        token: '567890',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '6',
        matricule: '25TE1003',
        nom_complet: 'Thomas Mballa',
        niveau: '1',
        filiere: 'TELECOM',
        telephone: '+237677333444',
        competences: ['Électronique', 'Mathématiques'],
        centres_interet: ['Basketball', 'Musique', 'Science'],
        reseaux_sociaux: {
            whatsapp: '237677333444',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=13',
        token: '678901',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '7',
        matricule: '25EN1004',
        nom_complet: 'Fatima Diallo',
        niveau: '1',
        filiere: 'ENERGIE',
        telephone: '+237688444555',
        competences: ['Physique', 'Chimie', 'Mathématiques'],
        centres_interet: ['Volleyball', 'Cuisine', 'Photographie'],
        reseaux_sociaux: {
            whatsapp: '237688444555',
            instagram: '@fatimadiallo',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=10',
        token: '789012',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
    {
        id: '8',
        matricule: '25FI1005',
        nom_complet: 'Alexandre Nguema',
        niveau: '1',
        filiere: 'INFO',
        telephone: '+237699555666',
        competences: ['C++', 'Algorithmes'],
        centres_interet: ['Gaming', 'Échecs', 'Robotique'],
        reseaux_sociaux: {
            whatsapp: '237699555666',
        },
        photo_profil: 'https://i.pravatar.cc/150?img=14',
        token: '890123',
        created_at: '2025-01-01T00:00:00Z',
        profile_completed: true,
    },
];

// Attributions mentor-mentoré
export const mockMentorAssignments: MentorAssignment[] = [
    {
        id: 'a1',
        mentor_id: '1', // Marie Dupont
        mentee_id: '4', // Pierre Kamga
        date_attribution: '2025-01-10T00:00:00Z',
        statut: 'actif',
    },
    {
        id: 'a2',
        mentor_id: '1', // Marie Dupont
        mentee_id: '5', // Aminata Ndiaye
        date_attribution: '2025-01-10T00:00:00Z',
        statut: 'actif',
    },
    {
        id: 'a3',
        mentor_id: '1', // Marie Dupont
        mentee_id: '8', // Alexandre Nguema
        date_attribution: '2025-01-10T00:00:00Z',
        statut: 'actif',
    },
    {
        id: 'a4',
        mentor_id: '2', // Jean Martin
        mentee_id: '6', // Thomas Mballa
        date_attribution: '2025-01-10T00:00:00Z',
        statut: 'actif',
    },
    {
        id: 'a5',
        mentor_id: '3', // Sophie Bernard
        mentee_id: '7', // Fatima Diallo
        date_attribution: '2025-01-10T00:00:00Z',
        statut: 'actif',
    },
];

// Surprises mockées
export const mockSurprises: Surprise[] = [
    {
        id: 's1',
        mentor_id: '1',
        titre: 'Message de bienvenue',
        type_media: 'text',
        contenu: `Bienvenue dans cette nouvelle aventure académique ! 🎉

Je suis ravi(e) d'être ton parrain/ta marraine. N'hésite pas à me contacter si tu as des questions, des doutes ou simplement besoin d'un conseil.

Ensemble, nous allons réussir cette année !

Marie`,
        date_creation: '2025-01-10T10:00:00Z',
    },
    {
        id: 's2',
        mentor_id: '1',
        titre: 'Ressources Python',
        type_media: 'link',
        contenu: 'https://www.python.org/about/gettingstarted/',
        date_creation: '2025-01-12T14:30:00Z',
    },
    {
        id: 's3',
        mentor_id: '1',
        titre: 'Motivation du jour',
        type_media: 'text',
        contenu: `"Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez." - Albert Schweitzer

Continue à travailler dur, tu es sur la bonne voie ! 💪`,
        date_creation: '2025-01-15T09:00:00Z',
    },
    {
        id: 's4',
        mentor_id: '2',
        titre: 'Guide des réseaux',
        type_media: 'link',
        contenu: 'https://www.coursera.org/learn/computer-networking',
        date_creation: '2025-01-11T16:00:00Z',
    },
    {
        id: 's5',
        mentor_id: '3',
        titre: 'Conseils pour réussir',
        type_media: 'text',
        contenu: `Quelques conseils pour bien démarrer :

1. Assiste à tous les cours
2. Fais tes exercices régulièrement
3. N'hésite pas à poser des questions
4. Rejoins des groupes d'étude
5. Prends soin de ta santé

Tu peux compter sur moi ! 😊`,
        date_creation: '2025-01-13T11:00:00Z',
    },
    {
        id: 's6',
        mentor_id: '1',
        titre: 'Image inspirante',
        type_media: 'image',
        contenu: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        date_creation: '2025-01-16T08:00:00Z',
    },
];

// Fonction helper pour obtenir les mentorés d'un mentor
export const getMenteesByMentorId = (mentorId: string): Student[] => {
    const assignments = mockMentorAssignments.filter((a) => a.mentor_id === mentorId);
    return assignments
        .map((a) => mockStudents.find((s) => s.id === a.mentee_id))
        .filter((s): s is Student => s !== undefined);
};

// Fonction helper pour obtenir le mentor d'un mentoré
export const getMentorByMenteeId = (menteeId: string): Student | null => {
    const assignment = mockMentorAssignments.find((a) => a.mentee_id === menteeId);
    if (!assignment) return null;
    return mockStudents.find((s) => s.id === assignment.mentor_id) || null;
};

// Fonction helper pour obtenir les surprises d'un mentor
export const getSurprisesByMentorId = (mentorId: string): Surprise[] => {
    return mockSurprises.filter((s) => s.mentor_id === mentorId);
};

// Fonction helper pour obtenir les surprises reçues par un mentoré
export const getSurprisesForMentee = (menteeId: string): Surprise[] => {
    const mentor = getMentorByMenteeId(menteeId);
    if (!mentor) return [];
    return mockSurprises.filter((s) => s.mentor_id === mentor.id);
};