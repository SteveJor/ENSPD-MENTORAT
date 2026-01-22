import React, { type JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
    Gift,
    Plus,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Link as LinkIcon,
    Calendar,
    Loader2,
    Sparkles,
    ExternalLink,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiService } from '../services/api.service';
import type { Surprise } from '../types';

export const SurprisesPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [surprises, setSurprises] = useState<Surprise[]>([]);
    const [loading, setLoading] = useState(true);

    const isMentor = user?.niveau && user.niveau >= 4;

    useEffect(() => {
        loadSurprises();
    }, []);

    const loadSurprises = async () => {
        setLoading(true);
        try {
            const response = await apiService.getSurprises();
            if (response.success && response.data) {
                setSurprises(response.data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des surprises:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMediaIcon = (type: string) => {
        const upperType = type.toUpperCase();
        switch (upperType) {
            case 'TEXTE':
                return <FileText className="w-5 h-5" />;
            case 'IMAGE':
            case 'GIF':
                return <ImageIcon className="w-5 h-5" />;
            case 'VIDEO':
                return <Video className="w-5 h-5" />;
            case 'AUDIO':
                return <Music className="w-5 h-5" />;
            case 'LIEN':
                return <LinkIcon className="w-5 h-5" />;
            default:
                return <Gift className="w-5 h-5" />;
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
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Chargement des surprises...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2 flex items-center gap-3">
                        <Gift className="w-8 h-8" />
                        {isMentor ? 'Mes Surprises' : 'Surprises Reçues'}
                    </h1>
                    <p className="text-neutral-600">
                        {isMentor
                            ? `${surprises.length} surprise${surprises.length > 1 ? 's' : ''} créée${
                                surprises.length > 1 ? 's' : ''
                            }`
                            : `${surprises.length} surprise${surprises.length > 1 ? 's' : ''} de votre parrain`}
                    </p>
                </div>
                {isMentor && (
                    <Button
                        onClick={() => navigate('/surprises/create')}
                        icon={<Plus className="w-5 h-5" />}
                    >
                        Créer une surprise
                    </Button>
                )}
            </div>

            {/* Statistiques pour mentor */}
            {isMentor && surprises.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['TEXTE', 'IMAGE', 'VIDEO', 'LIEN'].map((type) => {
                        const count = surprises.filter((s) => s.type_media.toUpperCase() === type).length;
                        return (
                            <Card key={type}>
                                <CardContent className="pt-6">
                                    <div className="text-center">
                                        <div
                                            className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2`}
                                        >
                                            {getMediaIcon(type)}
                                        </div>
                                        <p className="text-2xl font-heading font-bold text-primary">{count}</p>
                                        <p className="text-xs text-neutral-600 capitalize">{type.toLowerCase()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Liste des surprises */}
            {surprises.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Gift className="w-10 h-10 text-secondary" />
                        </div>
                        <h3 className="text-lg font-heading font-bold text-primary mb-2">
                            {isMentor ? 'Aucune surprise créée' : 'Aucune surprise reçue'}
                        </h3>
                        <p className="text-neutral-600 mb-6">
                            {isMentor
                                ? 'Créez votre première surprise pour vos mentorés'
                                : 'Votre parrain ne vous a pas encore envoyé de surprise'}
                        </p>
                        {isMentor && (
                            <Button
                                onClick={() => navigate('/surprises/create')}
                                icon={<Plus className="w-5 h-5" />}
                            >
                                Créer ma première surprise
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {surprises.map((surprise) => (
                        <SurpriseCard
                            key={surprise.id}
                            surprise={surprise}
                            getMediaIcon={getMediaIcon}
                            getMediaColor={getMediaColor}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Composant carte surprise avec états de chargement
const SurpriseCard: React.FC<{
    surprise: Surprise;
    getMediaIcon: (type: string) => JSX.Element;
    getMediaColor: (type: string) => string;
    formatDate: (date: string) => string;
}> = ({ surprise, getMediaIcon, getMediaColor, formatDate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState(false);

    const isUrl = (str: string) => {
        try {
            return str.startsWith('http://') || str.startsWith('https://');
        } catch {
            return false;
        }
    };

    const renderMediaContent = () => {
        const type = surprise.type_media.toUpperCase();
        const content = surprise.contenu;

        // Si c'est du texte ou pas une URL valide
        if (type === 'TEXTE' || !isUrl(content)) {
            return (
                <div
                    className={`p-4 bg-neutral-50 rounded-lg ${
                        !isExpanded && content.length > 150 ? 'relative' : ''
                    }`}
                >
                    <p
                        className={`text-neutral-700 whitespace-pre-wrap ${
                            !isExpanded ? 'line-clamp-4' : ''
                        }`}
                    >
                        {content}
                    </p>
                    {!isExpanded && content.length > 150 && (
                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-50 to-transparent flex items-end justify-center pb-2">
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="text-sm text-primary font-medium hover:underline bg-neutral-50 px-3 py-1 rounded"
                            >
                                Lire plus
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // Affichage selon le type de média
        switch (type) {
            case 'IMAGE':
            case 'GIF':
                return (
                    <div className="relative bg-neutral-100 rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center mb-3">
                        {mediaLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        )}

                        {!mediaError && (
                            <img
                                src={content}
                                alt={surprise.titre}
                                className={`max-w-full max-h-96 object-contain transition-opacity duration-300 ${
                                    mediaLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoadStart={() => setMediaLoading(true)}
                                onLoad={() => setMediaLoading(false)}
                                onError={() => {
                                    setMediaLoading(false);
                                    setMediaError(true);
                                }}
                                loading="lazy"
                            />
                        )}

                        {mediaError && (
                            <div className="p-8 text-center">
                                <ImageIcon className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                                <p className="text-sm text-neutral-500 mb-3">Impossible de charger l'image</p>
                                <a
                                    href={content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Ouvrir dans un nouvel onglet
                                </a>
                            </div>
                        )}
                    </div>
                );

            case 'VIDEO':
                return (
                    <div className="relative bg-black rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center mb-3">
                        {mediaLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                            </div>
                        )}

                        {!mediaError && (
                            <video
                                src={content}
                                controls
                                preload="metadata"
                                className={`w-full max-h-96 transition-opacity duration-300 ${
                                    mediaLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                                onLoadStart={() => setMediaLoading(true)}
                                onLoadedData={() => setMediaLoading(false)}
                                onError={() => {
                                    setMediaLoading(false);
                                    setMediaError(true);
                                }}
                            >
                                Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                        )}

                        {mediaError && (
                            <div className="p-8 text-center">
                                <Video className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                                <p className="text-sm text-red-400 mb-3">Impossible de charger la vidéo</p>
                                <a
                                    href={content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-sm flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Ouvrir dans un nouvel onglet
                                </a>
                            </div>
                        )}
                    </div>
                );

            case 'AUDIO':
                return (
                    <div className="mb-3">
                        <div className="bg-neutral-50 rounded-lg p-4">
                            {mediaLoading && (
                                <div className="flex items-center gap-2 mb-2">
                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                    <p className="text-sm text-neutral-500">Chargement...</p>
                                </div>
                            )}

                            {!mediaError && (
                                <audio
                                    src={content}
                                    controls
                                    preload="metadata"
                                    className="w-full"
                                    onLoadStart={() => setMediaLoading(true)}
                                    onLoadedData={() => setMediaLoading(false)}
                                    onError={() => {
                                        setMediaLoading(false);
                                        setMediaError(true);
                                    }}
                                >
                                    Votre navigateur ne supporte pas la lecture audio.
                                </audio>
                            )}

                            {mediaError && (
                                <div className="text-center py-4">
                                    <Music className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                                    <p className="text-sm text-neutral-500 mb-3">Impossible de charger l'audio</p>
                                    <a
                                        href={content}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Ouvrir dans un nouvel onglet
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'LIEN':
                return (
                    <a
                        href={content}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-primary/5 border-2 border-primary/20 rounded-lg hover:bg-primary/10 transition-colors mb-3 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-neutral-600 mb-1">Lien externe</p>
                                <p className="text-primary font-medium truncate group-hover:underline">
                                    {content}
                                </p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 opacity-50 group-hover:opacity-100" />
                        </div>
                    </a>
                );

            default:
                return (
                    <div className="p-4 bg-neutral-50 rounded-lg">
                        <p className="text-sm text-neutral-600 break-all">{content}</p>
                    </div>
                );
        }
    };

    return (
        <Card hover className="overflow-hidden">
            <div className="relative">
                <div className="absolute top-4 right-4 z-10">
                    <div className={`${getMediaColor(surprise.type_media)} px-3 py-1 rounded-full shadow-sm`}>
                        <div className="flex items-center gap-1.5">
                            {getMediaIcon(surprise.type_media)}
                            <span className="text-xs font-medium capitalize">
                                {surprise.type_media.toLowerCase()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <CardHeader>
                <CardTitle className="flex items-start gap-3 pr-20">
                    <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <span className="line-clamp-2">{surprise.titre}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(surprise.date_creation)}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {renderMediaContent()}

                {isExpanded && surprise.contenu.length > 150 && surprise.type_media.toUpperCase() === 'TEXTE' && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-sm text-primary font-medium hover:underline mt-2"
                    >
                        Voir moins
                    </button>
                )}
            </CardContent>
        </Card>
    );
};