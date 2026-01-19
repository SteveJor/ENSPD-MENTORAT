import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Users,
    MessageCircle,
    // Mail,
    Phone,
    Award,
    Heart,
    Search,
    // Filter,
    Loader2,
    // ChevronRight,
} from 'lucide-react';
import { Card, CardContent,  } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiService } from '../services/api.service';
import type { Student } from '../types';
import { mockStudents } from '../services/mock.data';

export const MenteesPage: React.FC = () => {
    const navigate = useNavigate();
    const [mentees, setMentees] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState<string>('all');

    useEffect(() => {
            // Charger les mentorés mockés directement
            setMentees(mockStudents); // simple et efficace
            setLoading(false);
        loadMentees();
    }, []);

    const loadMentees = async () => {
        setLoading(true);
        try {
            const response = await apiService.getMentees();
            if (response.success && response.data) {
                setMentees(response.data);
            }
        } catch (error) {
            console.error('Erreur lors du chargement des mentorés:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrage des mentorés
    const filteredMentees = mentees.filter((mentee) => {
        const matchesSearch = mentee.nom_complet
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesFiliere =
            selectedFiliere === 'all' || mentee.filiere === selectedFiliere;
        return matchesSearch && matchesFiliere;
    });

    // Obtenir les filières uniques
    const filieres = ['all', ...new Set(mentees.map((m) => m.filiere))];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Chargement de vos mentorés...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-primary mb-2">
                        Mes Mentorés
                    </h1>
                    <p className="text-neutral-600">
                        {mentees.length} étudiant{mentees.length > 1 ? 's' : ''} sous votre mentorat
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/surprises/create')}
                    icon={<Heart className="w-5 h-5" />}
                >
                    Créer une surprise
                </Button>
            </div>
            {/* Filtres et recherche */}
            <Card>
                <CardContent className="pt-2">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher un mentoré..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {filieres.map((filiere) => (
                                <button
                                    key={filiere}
                                    onClick={() => setSelectedFiliere(filiere)}
                                    className={`
                    px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap
                    transition-all duration-200
                    ${
                                        selectedFiliere === filiere
                                            ? 'bg-primary text-white'
                                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                    }
                  `}
                                >
                                    {filiere === 'all' ? 'Toutes' : filiere}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des mentorés */}
            {filteredMentees.length === 0 ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <p className="text-neutral-600">
                            {searchQuery || selectedFiliere !== 'all'
                                ? 'Aucun mentoré ne correspond à votre recherche'
                                : 'Aucun mentoré assigné pour le moment'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentees.map((mentee) => (
                        <MenteeCard key={mentee.id} mentee={mentee} />
                    ))}
                </div>
            )}
        </div>
    );
};

// Composant carte mentoré
const MenteeCard: React.FC<{ mentee: Student }> = ({ mentee }) => {
    return (
        <Card hover className="group">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center mb-4">
                    {mentee.photo_profil ? (
                        <img
                            src={mentee.photo_profil}
                            alt={mentee.nom_complet}
                            className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-primary/10"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4 border-4 border-primary/10">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                    )}

                    <h3 className="font-heading font-bold text-lg text-primary mb-1">
                        {mentee.nom_complet}
                    </h3>
                    <p className="text-sm text-neutral-600 mb-1">{mentee.matricule}</p>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Award className="w-4 h-4" />
                        <span>
              {mentee.filiere} - Niveau {mentee.niveau}
            </span>
                    </div>
                </div>

                {/* Informations de contact */}
                {(mentee.telephone || mentee.reseaux_sociaux?.whatsapp) && (
                    <div className="mb-4 p-3 bg-neutral-50 rounded-lg space-y-2">
                        {mentee.telephone && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>{mentee.telephone}</span>
                            </div>
                        )}
                        {mentee.reseaux_sociaux?.whatsapp && (
                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                <MessageCircle className="w-4 h-4 text-green-600" />
                                <span>WhatsApp disponible</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Compétences */}
                {mentee.competences && mentee.competences.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            Compétences
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {mentee.competences.slice(0, 3).map((comp, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                                >
                  {comp}
                </span>
                            ))}
                            {mentee.competences.length > 3 && (
                                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                  +{mentee.competences.length - 3}
                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Centres d'intérêt */}
                {mentee.centres_interet && mentee.centres_interet.length > 0 && (
                    <div className="mb-4">
                        <p className="text-xs font-medium text-neutral-500 mb-2 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            Centres d'intérêt
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {mentee.centres_interet.slice(0, 3).map((interet, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-1 bg-secondary/20 text-primary text-xs rounded-full"
                                >
                  {interet}
                </span>
                            ))}
                            {mentee.centres_interet.length > 3 && (
                                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded-full">
                  +{mentee.centres_interet.length - 3}
                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                    {mentee.reseaux_sociaux?.whatsapp && (
                        <a
                            href={`https://wa.me/${mentee.reseaux_sociaux.whatsapp}?text=Salut ${mentee.nom_complet.split(' ')[0]} ! Je suis ton parrain/ta marraine sur ENSPD Mentorat.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Button
                                variant="success"
                                fullWidth
                                icon={<MessageCircle className="w-4 h-4" />}
                            >
                                Contacter sur WhatsApp
                            </Button>
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};