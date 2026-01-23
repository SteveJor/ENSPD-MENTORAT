import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
    User,
    GraduationCap,
    Gift,
    MessageCircle,
    Phone,
    Loader2,
    Users,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Link as LinkIcon,
    Sparkles,
    ExternalLink,
    Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiService } from '../services/api.service';
import type { Student, Surprise } from '../types';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [mentor, setMentor] = useState<Student | null>(null);
    const [mentees, setMentees] = useState<Student[]>([]);
    const [surprises, setSurprises] = useState<Surprise[]>([]);
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isAssignmentTime, setIsAssignmentTime] = useState(false);
    const [dashboardLoaded, setDashboardLoaded] = useState(false);


    const isMentor = user?.niveau && user.niveau >= 4;

    // Date cible: Vendredi 24 janvier 2026 à 11:50
    // const targetDate = new Date('2026-01-23T7:55:00');
    const targetDate = new Date(
        2026, // année
        0,    // janvier (⚠️ 0-based)
        23,
        12,
        0,
        0
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                clearInterval(interval);
                setIsAssignmentTime(true);
                setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeRemaining({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isAssignmentTime && !dashboardLoaded) {
            loadDashboardData();
            setDashboardLoaded(true);
        }
    }, [isAssignmentTime]);


    const loadDashboardData = async () => {
        setLoading(true);
        try {
            console.log("jjhi")
            if (isMentor) {
                console.log("isMentor")
                const response = await apiService.getMentorDashboard();
                if (response.success && response.data) {
                    setMentees(response.data.mentees || []);
                    setSurprises(response.data.surprises_sent || []);
                }
            } else {
                console.log("Mentor")
                const response = await apiService.getMenteeDashboard();
                if (response.success && response.data) {
                    setMentor(response.data.mentor);
                    setSurprises(response.data.surprises_received || []);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isAssignmentTime && loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Chargement de votre tableau de bord...</p>
                </div>
            </div>
        );
    }

    // Affichage du compte à rebours si la date n'est pas encore atteinte
    if (!isAssignmentTime) {
        return (
            <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 sm:p-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-heading font-bold mb-2">
                                Bienvenue, {user?.nom_complet} !
                            </h1>
                            <p className="text-white/90 text-lg">
                                Connecté en tant qu'étudiant
                            </p>
                            <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4" />
                                    <span>{user?.filiere} - Niveau {user?.niveau}</span>
                                </div>
                                {user?.telephone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{user.telephone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {user?.photo_profil && (
                            <img
                                src={user.photo_profil}
                                alt="Photo de profil"
                                className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* Countdown Section */}
                <div className="max-w-2xl mx-auto">
                    <Card className="overflow-hidden">
                        <div className=" p-8 sm:p-12 text-center relative">
                            <div className="relative z-10">
                                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-dark mb-3">
                                    Préparation en cours...
                                </h2>

                                {/* Countdown Timer */}
                                <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
                                    <div className=" ">
                                        <div className="text-3xl text-center sm:text-4xl font-bold text-primary-dark mb-1">
                                            {String(timeRemaining.days).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-center sm:text-sm text-primary-dark/70 uppercase tracking-wider">
                                            Jours
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="text-3xl text-center sm:text-4xl font-bold text-primary-dark mb-1">
                                            {String(timeRemaining.hours).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs text-center sm:text-sm text-dark/70 uppercase tracking-wider">
                                            Heures
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="text-3xl sm:text-4xl text-center font-bold text-primary-dark mb-1">
                                            {String(timeRemaining.minutes).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs sm:text-sm text-centertext-primary-dark/70 uppercase tracking-wider">
                                            Minutes
                                        </div>
                                    </div>
                                    <div className="">
                                        <div className="text-3xl sm:text-4xl text-center font-bold text-primary-dark mb-1">
                                            {String(timeRemaining.seconds).padStart(2, '0')}
                                        </div>
                                        <div className="text-xs sm:text-sm text-center text-primary-dark/70 uppercase tracking-wider">
                                            Secondes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 sm:p-8">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-heading font-bold mb-2">
                            Bienvenue, {user?.nom_complet} !
                        </h1>
                        <p className="text-white/90 text-lg">
                            {isMentor
                                ? 'Vous accompagnez des étudiants dans leur parcours académique'
                                : 'Votre parrain est là pour vous guider'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                <span>{user?.filiere} - Niveau {user?.niveau}</span>
                            </div>
                            {user?.telephone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{user.telephone}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {user?.photo_profil && (
                        <img
                            src={user.photo_profil}
                            alt="Photo de profil"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                    )}
                </div>
            </div>

            {/* Content based on role */}
            {isMentor ? (
                <MentorContent mentees={mentees} navigate={navigate} />
            ) : (
                <MenteeContent mentor={mentor} surprises={surprises} navigate={navigate} />
            )}
        </div>
    );
};

// Composant pour les mentors
const MentorContent: React.FC<{ mentees: Student[]; navigate: any }> = ({ mentees, navigate }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-heading font-bold text-primary">
                    Mes mentorés ({mentees.length})
                </h2>
                <Button
                    onClick={() => navigate('/surprises/create')}
                    icon={<Gift className="w-5 h-5" />}
                >
                    Créer une surprise
                </Button>
            </div>

            {mentees.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-600">Aucun mentoré assigné pour le moment</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentees.map((mentee) => (
                        <Card key={mentee.id} hover>
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center">
                                    {mentee.photo_profil ? (
                                        <img
                                            src={mentee.photo_profil}
                                            alt={mentee.nom_complet}
                                            className="w-20 h-20 rounded-full mb-4 object-cover"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                            <User className="w-10 h-10 text-primary" />
                                        </div>
                                    )}
                                    <h3 className="font-heading font-bold text-lg text-primary mb-1">
                                        {mentee.nom_complet}
                                    </h3>
                                    <p className="text-sm text-neutral-600 mb-3">
                                        {mentee.filiere} - Niveau {mentee.niveau}
                                    </p>

                                    {mentee.centres_interet && mentee.centres_interet.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs text-neutral-500 mb-2">Centres d'intérêt</p>
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {mentee.centres_interet.slice(0, 3).map((interest, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 bg-secondary/20 text-primary text-xs rounded-full"
                                                    >
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {mentee.reseaux_sociaux?.whatsapp && (
                                        <a
                                            href={`https://wa.me/${mentee.reseaux_sociaux.whatsapp}?text=Salut ! Je suis ton parrain/ta marraine sur ENSPD Mentorat.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full"
                                        >
                                            <Button
                                                variant="secondary"
                                                fullWidth
                                                icon={<MessageCircle className="w-4 h-4" />}
                                            >
                                                Contacter
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

// Composant pour les mentorés
const MenteeContent: React.FC<{ mentor: Student | null; surprises: Surprise[]; navigate: any }> = ({
                                                                                                       mentor,
                                                                                                       surprises,
                                                                                                   }) => {
    if (!mentor) {
        return (
            <Card>
                <CardContent className="text-center py-12">
                    <GraduationCap className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-600">Votre parrain sera assigné prochainement</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Mentor Card */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Votre Parrain/Marraine</CardTitle>
                        <CardDescription>La personne qui vous accompagne</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-6">
                            {mentor.photo_profil ? (
                                <img
                                    src={mentor.photo_profil}
                                    alt={mentor.nom_complet}
                                    className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <User className="w-16 h-16 text-primary" />
                                </div>
                            )}

                            <div className="flex-1">
                                <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                                    {mentor.nom_complet}
                                </h3>
                                <div className="space-y-2 text-neutral-600 mb-4">
                                    <p className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" />
                                        {mentor.filiere} - Niveau {mentor.niveau}
                                    </p>
                                    {mentor.telephone && (
                                        <p className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {mentor.telephone}
                                        </p>
                                    )}
                                </div>

                                {mentor.competences && mentor.competences.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-neutral-700 mb-2">Compétences</p>
                                        <div className="flex flex-wrap gap-2">
                                            {mentor.competences.map((comp, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                                                >
                                                    {comp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {mentor.reseaux_sociaux?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${mentor.reseaux_sociaux.whatsapp}?text=Salut ! Je suis ton mentoré sur ENSPD Mentorat.`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button
                                            variant="success"
                                            icon={<MessageCircle className="w-4 h-4" />}
                                        >
                                            Contacter sur WhatsApp
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Surprises */}
            <div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Gift className="w-5 h-5" />
                                    Surprises
                                </CardTitle>
                                <CardDescription>Messages de votre parrain</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {surprises.length === 0 ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Gift className="w-8 h-8 text-secondary" />
                                </div>
                                <p className="text-neutral-500 text-sm">Aucune surprise pour le moment</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {surprises.slice(0, 5).map((surprise) => (
                                    <SurprisePreviewCard key={surprise.id} surprise={surprise} />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Composant de prévisualisation de surprise avec ReactPlayer
const SurprisePreviewCard: React.FC<{ surprise: Surprise }> = ({ surprise }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mediaError, setMediaError] = useState(false);

    const getMediaIcon = (type: string) => {
        const upperType = type.toUpperCase();
        switch (upperType) {
            case 'TEXTE':
                return <FileText className="w-4 h-4" />;
            case 'IMAGE':
            case 'GIF':
                return <ImageIcon className="w-4 h-4" />;
            case 'VIDEO':
                return <Video className="w-4 h-4" />;
            case 'AUDIO':
                return <Music className="w-4 h-4" />;
            case 'LIEN':
                return <LinkIcon className="w-4 h-4" />;
            default:
                return <Gift className="w-4 h-4" />;
        }
    };

    const getMediaColor = (type: string) => {
        const upperType = type.toUpperCase();
        switch (upperType) {
            case 'TEXTE':
                return 'bg-blue-100 text-blue-600';
            case 'IMAGE':
            case 'GIF':
                return 'bg-purple-100 text-purple-600';
            case 'VIDEO':
                return 'bg-red-100 text-red-600';
            case 'AUDIO':
                return 'bg-green-100 text-green-600';
            case 'LIEN':
                return 'bg-yellow-100 text-yellow-600';
            default:
                return 'bg-neutral-100 text-neutral-600';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return new Intl.DateTimeFormat('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            }).format(date);
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'short',
            }).format(date);
        }
    };

    const isUrl = (str: string) => {
        try {
            return str.startsWith('http://') || str.startsWith('https://');
        } catch {
            return false;
        }
    };

    const renderMediaPreview = () => {
        const type = surprise.type_media.toUpperCase();
        const content = surprise.contenu;

        // Si c'est du texte ou pas une URL valide
        if (type === 'TEXTE' || !isUrl(content)) {
            return (
                <div className="relative">
                    <p className={`text-sm text-neutral-600 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                        {content}
                    </p>
                    {!isExpanded && content.length > 100 && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="text-xs text-primary hover:underline mt-1"
                        >
                            Lire plus
                        </button>
                    )}
                    {isExpanded && (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-xs text-primary hover:underline mt-1"
                        >
                            Voir moins
                        </button>
                    )}
                </div>
            );
        }

        // Affichage selon le type de média
        switch (type) {
            case 'IMAGE':
            case 'GIF':
                return (
                    <div className="relative bg-neutral-100 rounded-lg overflow-hidden h-32 flex items-center justify-center">
                        {mediaError ? (
                            <div className="text-center p-4">
                                <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-1" />
                                <p className="text-xs text-neutral-500">Image non disponible</p>
                            </div>
                        ) : (
                            <img
                                src={content}
                                alt={surprise.titre}
                                className="max-w-full max-h-full object-cover"
                                onError={() => setMediaError(true)}
                                loading="lazy"
                            />
                        )}
                    </div>
                );

            case 'VIDEO':
                return (
                    <div className="relative bg-black rounded-lg overflow-hidden h-32">
                        {mediaError ? (
                            <div className="h-full flex items-center justify-center">
                                <Video className="w-8 h-8 text-white/60" />
                            </div>
                        ) : (
                            <ReactPlayer
                                src={content}
                                width="100%"
                                height="100%"
                                light
                                onError={() => setMediaError(true)}
                            />
                        )}
                    </div>
                );

            case 'AUDIO':
                return (
                    <div className="bg-neutral-50 rounded-lg p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Music className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-neutral-500">Audio</p>
                            <p className="text-sm font-medium text-neutral-700">Fichier audio</p>
                        </div>
                    </div>
                );

            case 'LIEN':
                return (
                    <a
                        href={content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-primary/5 border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-primary flex-shrink-0" />
                            <p className="text-xs text-primary truncate group-hover:underline flex-1">
                                {content}
                            </p>
                            <ExternalLink className="w-3 h-3 text-primary flex-shrink-0 opacity-50 group-hover:opacity-100" />
                        </div>
                    </a>
                );

            default:
                return <p className="text-sm text-neutral-600 truncate">{content}</p>;
        }
    };

    return (
        <div className="p-3 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-lg border border-primary/10 hover:border-primary/20 transition-all">
            <div className="flex items-start gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-primary text-sm line-clamp-1">{surprise.titre}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div
                            className={`${getMediaColor(surprise.type_media)} px-2 py-0.5 rounded-full flex items-center gap-1`}
                        >
                            {getMediaIcon(surprise.type_media)}
                            <span className="text-xs capitalize">{surprise.type_media.toLowerCase()}</span>
                        </div>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(surprise.date_creation)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-2">{renderMediaPreview()}</div>
        </div>
    );
};