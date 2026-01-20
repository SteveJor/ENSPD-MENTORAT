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

    const isMentor = user?.niveau && parseInt(user.niveau) >= 4;

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
                                            className={`w-12 h-12 ${getMediaColor(
                                                type
                                            )} rounded-xl flex items-center justify-center mx-auto mb-2`}
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

// Composant carte surprise
const SurpriseCard: React.FC<{
    surprise: Surprise;
    getMediaIcon: (type: string) => JSX.Element;
    getMediaColor: (type: string) => string;
    formatDate: (date: string) => string;
}> = ({ surprise, getMediaIcon, getMediaColor, formatDate }) => {
    const [isExpanded, setIsExpanded] = useState(false);

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
                <CardTitle className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <span className="line-clamp-2">{surprise.titre}</span>
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(surprise.date_creation)}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Contenu de la surprise */}
                <div className="mb-4">
                    {surprise.type_media.toUpperCase() === 'IMAGE' && surprise.contenu.startsWith('http') ? (
                        <img
                            src={surprise.contenu}
                            alt={surprise.titre}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    ) : surprise.type_media.toUpperCase() === 'VIDEO' && surprise.contenu.startsWith('http') ? (
                        <video
                            src={surprise.contenu}
                            controls
                            className="w-full h-48 rounded-lg mb-3"
                        />
                    ) : surprise.type_media.toUpperCase() === 'AUDIO' && surprise.contenu.startsWith('http') ? (
                        <audio src={surprise.contenu} controls className="w-full mb-3" />
                    ) : surprise.type_media.toUpperCase() === 'LIEN' ? (
                        <a
                            href={surprise.contenu}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-4 bg-primary/5 border-2 border-primary/20 rounded-lg hover:bg-primary/10 transition-colors mb-3"
                        >
                            <div className="flex items-center gap-3">
                                <LinkIcon className="w-5 h-5 text-primary" />
                                <span className="text-primary font-medium truncate">
                                    {surprise.contenu}
                                </span>
                            </div>
                        </a>
                    ) : (
                        <div
                            className={`p-4 bg-neutral-50 rounded-lg ${
                                !isExpanded && surprise.contenu.length > 150 ? 'relative' : ''
                            }`}
                        >
                            <p
                                className={`text-neutral-700 whitespace-pre-wrap ${
                                    !isExpanded ? 'line-clamp-4' : ''
                                }`}
                            >
                                {surprise.contenu}
                            </p>
                            {!isExpanded && surprise.contenu.length > 150 && (
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-50 to-transparent flex items-end justify-center pb-2">
                                    <button
                                        onClick={() => setIsExpanded(true)}
                                        className="text-sm text-primary font-medium hover:underline"
                                    >
                                        Lire plus
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {isExpanded && surprise.contenu.length > 150 && (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-sm text-primary font-medium hover:underline mt-2"
                        >
                            Voir moins
                        </button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};