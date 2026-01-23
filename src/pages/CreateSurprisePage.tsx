import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
    Gift,
    FileText,
    Image as ImageIcon,
    Video,
    Music,
    Link as LinkIcon,
    ArrowLeft,
    Check,
    AlertCircle,
    ExternalLink,
    Eye,
    Calendar,
    Sparkles,
    Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { apiService } from '../services/api.service';
import { ERROR_MESSAGES, MEDIA_TYPES } from '../config/constants';
import type { MediaType } from '../types';

interface MediaTypeOption {
    value: MediaType;
    label: string;
    icon: React.ReactElement<any>;
    description: string;
    placeholder: string;
}

// @ts-ignore
const mediaTypes: MediaTypeOption[] = MEDIA_TYPES.map(type => ({
    value: type.value as MediaType,
    label: type.label,
    icon: getIcon(type.icon),
    description: type.description,
    placeholder: type.placeholder,
}));

function getIcon(iconName: string) {
    const icons: Record<string, React.ReactNode> = {
        FileText: <FileText className="w-6 h-6" />,
        Image: <ImageIcon className="w-6 h-6" />,
        Video: <Video className="w-6 h-6" />,
        Music: <Music className="w-6 h-6" />,
        Link: <LinkIcon className="w-6 h-6" />,
    };
    return icons[iconName] || <Gift className="w-6 h-6" />;
}

export const CreateSurprisePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(true);

    // États de chargement média
    const [mediaLoading, setMediaLoading] = useState(false);
    const [mediaError, setMediaError] = useState(false);

    const [formData, setFormData] = useState({
        titre: '',
        type_media: 'TEXTE' as MediaType,
        contenu: '',
    });

    // Reset des états média à chaque changement de contenu
    useEffect(() => {
        setMediaLoading(false);
        setMediaError(false);
    }, [formData.contenu, formData.type_media]);

    const selectedMediaType = mediaTypes.find((mt) => mt.value === formData.type_media);

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

    const isUrl = (str: string) => {
        try {
            return str.trim().startsWith('http://') || str.trim().startsWith('https://');
        } catch {
            return false;
        }
    };

    const renderPreviewContent = () => {
        const type = formData.type_media.toUpperCase();
        const content = formData.contenu;

        if (!content) {
            return (
                <div className="text-center py-12 text-neutral-400">
                    <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">La prévisualisation apparaîtra ici</p>
                </div>
            );
        }

        // Si c'est du texte ou pas une URL valide
        if (type === 'TEXTE' || !isUrl(content)) {
            return (
                <div className="p-4 bg-neutral-50 rounded-lg">
                    <p className="text-neutral-700 whitespace-pre-wrap">
                        {content}
                    </p>
                </div>
            );
        }

        // Affichage selon le type de média
        switch (type) {
            case 'IMAGE':
                return (
                    <div className="relative bg-neutral-100 rounded-lg overflow-hidden min-h-[200px] flex items-center justify-center">
                        {mediaLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                                <div className="text-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                                    <p className="text-sm text-neutral-500">Chargement de l'image...</p>
                                </div>
                            </div>
                        )}

                        {!mediaError && (
                            <img
                                src={content.trim()}
                                alt="Prévisualisation"
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
                                <p className="text-sm text-red-500 mb-3">Impossible de charger l'image</p>
                                <a
                                    href={content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Ouvrir dans un nouvel onglet
                                </a>
                            </div>
                        )}
                    </div>
                );

            case 'VIDEO':
                return (
                    <div className="relative bg-black rounded-lg overflow-hidden">
                        <div className="w-full" style={{ aspectRatio: '16/9' }}>
                            {mediaError ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-8 text-center">
                                        <Video className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                                        <p className="text-sm text-red-400 mb-3">Impossible de charger la vidéo</p>
                                        <a
                                            href={content}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Ouvrir dans un nouvel onglet
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <ReactPlayer
                                    src={content.trim()}
                                    controls
                                    width="100%"
                                    height="100%"
                                    style={{ maxHeight: '384px' }}
                                    onReady={() => setMediaLoading(false)}
                                    onError={() => setMediaError(true)}
                                />
                            )}
                        </div>
                    </div>
                );

            case 'AUDIO':
                return (
                    <div className="bg-neutral-50 rounded-lg p-4">
                        {mediaError ? (
                            <div className="text-center py-4">
                                <Music className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                                <p className="text-sm text-red-500 mb-3">Impossible de charger l'audio</p>
                                <a
                                    href={content}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Ouvrir dans un nouvel onglet
                                </a>
                            </div>
                        ) : (
                            <ReactPlayer
                                src={content.trim()}
                                controls
                                width="100%"
                                height="50px"
                                onError={() => setMediaError(true)}
                            />
                        )}
                    </div>
                );

            case 'LIEN':
                return (
                    <a
                        href={content.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-primary/5 border-2 border-primary/20 rounded-lg hover:bg-primary/10 transition-colors group"
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!formData.titre.trim()) {
            setError('Le titre est requis');
            return;
        }

        if (!formData.contenu.trim()) {
            setError('Le contenu est requis');
            return;
        }

        // Validation URL pour les médias
        if (['IMAGE', 'VIDEO', 'AUDIO', 'LIEN', 'GIF'].includes(formData.type_media)) {
            const urlTrimmed = formData.contenu.trim();
            if (!urlTrimmed.startsWith('http://') && !urlTrimmed.startsWith('https://')) {
                setError('Veuillez entrer une URL valide (commençant par http:// ou https://)');
                return;
            }
        }

        setLoading(true);

        try {
            const response = await apiService.createSurprise({
                titre: formData.titre,
                type_media: formData.type_media,
                contenu: formData.contenu,
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/surprises');
                }, 2000);
            } else {
                setError(response.error || ERROR_MESSAGES.serverError);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError(ERROR_MESSAGES.network);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-primary mb-3">
                            Surprise créée avec succès !
                        </h2>
                        <p className="text-neutral-600 mb-6">
                            Votre surprise a été envoyée à vos mentorés
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button onClick={() => navigate('/surprises')} variant="secondary">
                                Voir mes surprises
                            </Button>
                            <Button onClick={() => window.location.reload()}>
                                Créer une autre
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    icon={<ArrowLeft className="w-5 h-5" />}
                    className="mb-4"
                >
                    Retour
                </Button>
                <h1 className="text-3xl font-heading font-bold text-primary mb-4 flex items-center gap-3">
                    <Gift className="w-8 h-8" />
                    Créer une surprise
                </h1>
                <p className="text-neutral-600">
                    Envoyez un message, une ressource ou du contenu motivant à vos mentorés
                </p>
            </div>

            {/* Message d'erreur */}
            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulaire - Colonne de gauche */}
                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Titre */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Titre de la surprise</CardTitle>
                                <CardDescription>
                                    Donnez un titre accrocheur à votre surprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    placeholder="Ex: Message de motivation, Ressource utile, etc."
                                    value={formData.titre}
                                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                                    required
                                    maxLength={100}
                                />
                                <p className="text-xs text-neutral-500 mt-2">
                                    {formData.titre.length}/100 caractères
                                </p>
                            </CardContent>
                        </Card>

                        {/* Type de média */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Type de contenu</CardTitle>
                                <CardDescription>
                                    Choisissez le type de surprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {mediaTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() =>
                                                setFormData({ ...formData, type_media: type.value, contenu: '' })
                                            }
                                            className={`
                                                p-3 rounded-xl border-2 text-left
                                                transition-all duration-200
                                                ${
                                                formData.type_media === type.value
                                                    ? 'border-secondary-dark bg-secondary/5'
                                                    : 'border-neutral-200 hover:border-secondary/50 hover:bg-neutral-50'
                                            }
                                            `}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`
                                                    p-1.5 rounded-lg
                                                    ${formData.type_media === type.value ? 'bg-secondary/20' : 'bg-neutral-100'}
                                                `}>
                                                    {React.cloneElement(type.icon, {
                                                        className: 'w-4 h-4',
                                                    })}
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-primary text-sm">{type.label}</h3>
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contenu */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenu de la surprise</CardTitle>
                                <CardDescription>{selectedMediaType?.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {formData.type_media === 'TEXTE' ? (
                                    <>
                                        <TextArea
                                            placeholder={selectedMediaType?.placeholder}
                                            value={formData.contenu}
                                            onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                            rows={8}
                                            required
                                            maxLength={2000}
                                        />
                                        <p className="text-xs text-neutral-500 mt-2">
                                            {formData.contenu.length}/2000 caractères
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <TextArea
                                            placeholder={selectedMediaType?.placeholder}
                                            value={formData.contenu}
                                            onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                            rows={4}
                                            required
                                        />
                                        <p className="text-xs text-neutral-500 mt-2">
                                            💡 Collez l'URL complète de votre média (aucune limite de taille)
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                                fullWidth
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                loading={loading}
                                icon={<Gift className="w-5 h-5" />}
                                fullWidth
                            >
                                Créer la surprise
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Prévisualisation - Colonne de droite */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <Card className="overflow-hidden">
                        <CardHeader className="">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-primary" />
                                    <CardTitle>Prévisualisation</CardTitle>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    {showPreview ? 'Masquer' : 'Afficher'}
                                </button>
                            </div>
                            <CardDescription>
                                Aperçu en temps réel de votre surprise
                            </CardDescription>
                        </CardHeader>

                        {showPreview && (
                            <CardContent className="pt-6">
                                {/* Badge type */}
                                {formData.contenu && (
                                    <div className="mb-4 flex justify-end">
                                        <div className={`${getMediaColor(formData.type_media)} px-3 py-1 rounded-full shadow-sm`}>
                                            <div className="flex items-center gap-1.5">
                                                {getMediaIcon(formData.type_media)}
                                                <span className="text-xs font-medium capitalize">
                                                    {formData.type_media.toLowerCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Titre */}
                                {formData.titre && (
                                    <div className="mb-4">
                                        <div className="flex items-start gap-3">
                                            <Sparkles className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                                            <h3 className="text-lg font-heading font-bold text-primary">
                                                {formData.titre}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                                            <Calendar className="w-4 h-4" />
                                            <span>Maintenant</span>
                                        </div>
                                    </div>
                                )}

                                {/* Contenu */}
                                <div className="mt-4">
                                    {renderPreviewContent()}
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Conseils */}
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-base">💡 Conseils</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-neutral-600 space-y-2">
                                <li>• Choisissez un titre court et motivant</li>
                                <li>• Les URLs doivent commencer par http:// ou https://</li>
                                <li>• Tous les formats vidéo/audio sont supportés</li>
                                <li>• Le chargement des médias peut prendre quelques secondes</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};