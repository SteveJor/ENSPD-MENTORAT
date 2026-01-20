import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, TextArea } from '../components/ui/Input';
import { apiService } from '../services/api.service';
import { ERROR_MESSAGES } from '../config/constants';

type MediaType = 'TEXTE' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'LIEN';

interface MediaTypeOption {
    value: MediaType;
    label: string;
    icon: React.ReactNode;
    description: string;
    placeholder: string;
}

const mediaTypes: MediaTypeOption[] = [
    {
        value: 'TEXTE',
        label: 'Message texte',
        icon: <FileText className="w-6 h-6" />,
        description: 'Un message personnalisé pour encourager votre mentoré',
        placeholder: 'Écrivez votre message ici...',
    },
    {
        value: 'IMAGE',
        label: 'Image',
        icon: <ImageIcon className="w-6 h-6" />,
        description: 'Partagez une image inspirante ou motivante',
        placeholder: 'URL de l\'image (https://...)',
    },
    {
        value: 'VIDEO',
        label: 'Vidéo',
        icon: <Video className="w-6 h-6" />,
        description: 'Une vidéo motivante ou éducative',
        placeholder: 'URL de la vidéo (https://...)',
    },
    {
        value: 'AUDIO',
        label: 'Audio',
        icon: <Music className="w-6 h-6" />,
        description: 'Un message vocal ou une musique',
        placeholder: 'URL de l\'audio (https://...)',
    },
    {
        value: 'LIEN',
        label: 'Lien',
        icon: <LinkIcon className="w-6 h-6" />,
        description: 'Un lien vers une ressource utile',
        placeholder: 'https://...',
    },
];

export const CreateSurprisePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        titre: '',
        type_media: 'TEXTE' as MediaType,
        contenu: '',
    });

    const selectedMediaType = mediaTypes.find((mt) => mt.value === formData.type_media);

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
        if (['IMAGE', 'VIDEO', 'AUDIO', 'LIEN'].includes(formData.type_media)) {
            try {
                new URL(formData.contenu);
            } catch {
                setError('Veuillez entrer une URL valide (commençant par https://)');
                return;
            }
        }

        setLoading(true);

        try {
            const response = await apiService.createSurprise({
                titre: formData.titre,
                type_media: formData.type_media,
                contenu: formData.contenu,
                mentor_id: '', // Sera automatiquement rempli côté backend
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
                            Surprise créée avec succès ! 🎉
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
        <div className="max-w-4xl mx-auto space-y-6">
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
                <p className="text-neutral-600 text-center">
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
                            Choisissez le type de surprise que vous souhaitez créer
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {mediaTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() =>
                                        setFormData({ ...formData, type_media: type.value, contenu: '' })
                                    }
                                    className={`
                                        p-4 rounded-xl border-2 text-left
                                        transition-all duration-200
                                        ${
                                        formData.type_media === type.value
                                            ? 'border-secondary-dark bg-secondary/5'
                                            : 'border-neutral-200 hover:border-secondary/50 hover:bg-neutral-50'
                                    }
                                    `}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`
                                            p-2 rounded-lg
                                            ${formData.type_media === type.value ? 'bg-secondary/20' : 'bg-neutral-100'}
                                        `}>
                                            {type.icon}
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-primary mb-1">{type.label}</h3>
                                    <p className="text-xs text-neutral-600">{type.description}</p>
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
                            <TextArea
                                placeholder={selectedMediaType?.placeholder}
                                value={formData.contenu}
                                onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                rows={8}
                                required
                                maxLength={2000}
                            />
                        ) : (
                            <Input
                                type="url"
                                placeholder={selectedMediaType?.placeholder}
                                value={formData.contenu}
                                onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                                required
                            />
                        )}

                        {formData.type_media === 'TEXTE' && (
                            <p className="text-xs text-neutral-500 mt-2">
                                {formData.contenu.length}/2000 caractères
                            </p>
                        )}

                        {/* Prévisualisation */}
                        {formData.contenu && (
                            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
                                <p className="text-xs font-medium text-neutral-600 mb-2">
                                    Prévisualisation :
                                </p>
                                {formData.type_media === 'TEXTE' ? (
                                    <p className="text-sm text-neutral-700 whitespace-pre-wrap">
                                        {formData.contenu}
                                    </p>
                                ) : formData.type_media === 'IMAGE' &&
                                formData.contenu.startsWith('http') ? (
                                    <img
                                        src={formData.contenu}
                                        alt="Prévisualisation"
                                        className="max-w-full h-auto rounded-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : formData.type_media === 'LIEN' ? (
                                    <a
                                        href={formData.contenu}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline flex items-center gap-2"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        {formData.contenu}
                                    </a>
                                ) : (
                                    <p className="text-sm text-neutral-600">
                                        URL : {formData.contenu}
                                    </p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        loading={loading}
                        icon={<Gift className="w-5 h-5" />}
                    >
                        Créer la surprise
                    </Button>
                </div>
            </form>
        </div>
    );
};