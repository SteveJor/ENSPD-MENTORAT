import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Edit3,
    GraduationCap,
    Phone,
    Award,
    Heart,
    Facebook,
    Instagram,
    Linkedin,
    MessageCircle,
    Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiService } from '../services/api.service';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants';
import type { ProfileUpdateData } from '../types';
import { mockStudents } from '../services/mock.data';
export const ProfilePage: React.FC = () => {
    let { user, updateUser } = useAuth();
    useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [formData, setFormData] = useState<ProfileUpdateData>({
        competences: user?.competences || [],
        centres_interet: user?.centres_interet || [],
        reseaux_sociaux: user?.reseaux_sociaux || {},
        telephone: user?.telephone || '',
    });

    const [competenceInput, setCompetenceInput] = useState('');
    const [interetInput, setInteretInput] = useState('');

    const handleAddCompetence = () => {
        if (competenceInput.trim()) {
            setFormData({
                ...formData,
                competences: [...(formData.competences || []), competenceInput.trim()],
            });
            setCompetenceInput('');
        }
    };

    const handleRemoveCompetence = (index: number) => {
        setFormData({
            ...formData,
            competences: formData.competences?.filter((_, i) => i !== index),
        });
    };

    const handleAddInteret = () => {
        if (interetInput.trim()) {
            setFormData({
                ...formData,
                centres_interet: [...(formData.centres_interet || []), interetInput.trim()],
            });
            setInteretInput('');
        }
    };

    const handleRemoveInteret = (index: number) => {
        setFormData({
            ...formData,
            centres_interet: formData.centres_interet?.filter((_, i) => i !== index),
        });
    };

    const handleSocialMediaChange = (platform: string, value: string) => {
        setFormData({
            ...formData,
            reseaux_sociaux: {
                ...formData.reseaux_sociaux,
                [platform]: value,
            },
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const response = await apiService.updateProfile(formData);

            if (response.success && response.data) {
                updateUser(response.data);
                setMessage({ type: 'success', text: SUCCESS_MESSAGES.profileUpdated });
                setIsEditing(false);
            } else {
                setMessage({ type: 'error', text: response.error || ERROR_MESSAGES.serverError });
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setMessage({ type: 'error', text: ERROR_MESSAGES.network });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            competences: user?.competences || [],
            centres_interet: user?.centres_interet || [],
            reseaux_sociaux: user?.reseaux_sociaux || {},
            telephone: user?.telephone || '',
        });
        setIsEditing(false);
        setMessage(null);
    };
user= mockStudents[0];
    if (!user) return null;

    const profileCompleted = user.profile_completed;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">Mon Profil</h1>
                    <p className="text-neutral-600">
                        {profileCompleted
                            ? 'Gérez vos informations personnelles'
                            : 'Complétez votre profil pour participer au parrainage'}
                    </p>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        icon={<Edit3 className="w-4 h-4" />}
                    >
                        Modifier
                    </Button>
                )}
            </div>

            {/* Message de succès/erreur */}
            {message && (
                <div
                    className={`p-4 rounded-xl flex items-center gap-3 ${
                        message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                >
                    {message.type === 'success' ? (
                        <Check className="w-5 h-5" />
                    ) : (
                        <Edit3 className="w-5 h-5" />
                    )}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informations de base */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de base</CardTitle>
                        <CardDescription>Informations non modifiables</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nom complet"
                                value={user.nom_complet}
                                disabled
                                icon={<User className="w-5 h-5" />}
                            />
                            <Input
                                label="Matricule"
                                value={user.matricule}
                                disabled
                                icon={<GraduationCap className="w-5 h-5" />}
                            />
                            <Input
                                label="Filière"
                                value={user.filiere}
                                disabled
                                icon={<GraduationCap className="w-5 h-5" />}
                            />
                            <Input
                                label="Niveau"
                                value={`Niveau ${user.niveau}`}
                                disabled
                                icon={<Award className="w-5 h-5" />}
                            />
                        </div>

                        <Input
                            label="Téléphone"
                            type="tel"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            placeholder="+237 6XX XX XX XX"
                            disabled={!isEditing}
                            icon={<Phone className="w-5 h-5" />}
                        />
                    </CardContent>
                </Card>

                {/* Compétences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Compétences
                        </CardTitle>
                        <CardDescription>
                            Vos compétences techniques et académiques
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isEditing && (
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Ex: Programmation Python"
                                    value={competenceInput}
                                    onChange={(e) => setCompetenceInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCompetence())}
                                />
                                <Button type="button" onClick={handleAddCompetence}>
                                    Ajouter
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {formData.competences?.map((comp, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                                >
                  {comp}
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCompetence(index)}
                                            className="hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    )}
                </span>
                            ))}
                            {(!formData.competences || formData.competences.length === 0) && (
                                <p className="text-neutral-500 text-sm">Aucune compétence ajoutée</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Centres d'intérêt */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5" />
                            Centres d'intérêt
                        </CardTitle>
                        <CardDescription>
                            Vos passions et hobbies
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isEditing && (
                            <div className="flex gap-2 mb-4">
                                <Input
                                    placeholder="Ex: Football, Lecture"
                                    value={interetInput}
                                    onChange={(e) => setInteretInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInteret())}
                                />
                                <Button type="button" onClick={handleAddInteret}>
                                    Ajouter
                                </Button>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                            {formData.centres_interet?.map((interet, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-secondary/20 text-primary rounded-full text-sm flex items-center gap-2"
                                >
                  {interet}
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveInteret(index)}
                                            className="hover:text-red-600"
                                        >
                                            ×
                                        </button>
                                    )}
                </span>
                            ))}
                            {(!formData.centres_interet || formData.centres_interet.length === 0) && (
                                <p className="text-neutral-500 text-sm">Aucun centre d'intérêt ajouté</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Réseaux sociaux */}
                <Card>
                    <CardHeader>
                        <CardTitle>Réseaux sociaux</CardTitle>
                        <CardDescription>
                            Vos comptes pour rester en contact
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="WhatsApp"
                            type="tel"
                            placeholder="237XXXXXXXXX"
                            value={formData.reseaux_sociaux?.whatsapp || ''}
                            onChange={(e) => handleSocialMediaChange('whatsapp', e.target.value)}
                            disabled={!isEditing}
                            icon={<MessageCircle className="w-5 h-5" />}
                        />
                        <Input
                            label="Facebook"
                            placeholder="Votre profil Facebook"
                            value={formData.reseaux_sociaux?.facebook || ''}
                            onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                            disabled={!isEditing}
                            icon={<Facebook className="w-5 h-5" />}
                        />
                        <Input
                            label="Instagram"
                            placeholder="@votre_username"
                            value={formData.reseaux_sociaux?.instagram || ''}
                            onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                            disabled={!isEditing}
                            icon={<Instagram className="w-5 h-5" />}
                        />
                        <Input
                            label="LinkedIn"
                            placeholder="Votre profil LinkedIn"
                            value={formData.reseaux_sociaux?.linkedin || ''}
                            onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                            disabled={!isEditing}
                            icon={<Linkedin className="w-5 h-5" />}
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                {isEditing && (
                    <div className="flex gap-3 justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button type="submit" loading={loading}>
                            Enregistrer les modifications
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};