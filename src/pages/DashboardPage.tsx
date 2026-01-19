import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
    User,
    GraduationCap,
    Gift,
    // ArrowRight,
    MessageCircle,
    // Mail,
    Phone,
    Loader2, Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiService } from '../services/api.service';
import type { Student, Surprise } from '../types';
import { mockStudents, mockSurprises } from '../services/mock.data';

export const DashboardPage: React.FC = () => {
    let { user } = useAuth();
    // let user= mockStudents[2];
    useNavigate();
    const [loading, setLoading] = useState(true);
    const [mentor, setMentor] = useState<Student | null>(null);
    const [mentees, setMentees] = useState<Student[]>([]);
    const [surprises, setSurprises] = useState<Surprise[]>([]);

    const isMentor = user?.niveau && parseInt(user.niveau) > 1;

    useEffect(() => {
        setMentor(mockStudents[0]);
        setSurprises(mockSurprises)
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            if (isMentor) {
                const response = await apiService.getMentorDashboard();
                if (response.success && response.data) {
                    setMentees(response.data.mentees || []);
                    setSurprises(response.data.surprises_sent || []);
                }
            } else {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-neutral-600">Chargement de votre tableau de bord...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="  ">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-heading text-dark font-bold mb-2">
                            Bienvenue, {user?.nom_complet} !
                        </h1>
                        <p className="text-primary-light/80 text-lg">
                            {isMentor
                                ? 'Vous accompagnez des étudiants dans leur parcours académique'
                                : 'Votre parrain est là pour vous guider'}
                        </p>
                    </div>
                    {user?.photo_profil && (
                        <img
                            src={user.photo_profil}
                            alt="Photo de profil"
                            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                        />
                    )}
                </div>
            </div>

            {/* Content based on role */}
            {isMentor ? (
                <MentorContent mentees={mentees} />
            ) : (
                <MenteeContent mentor={mentor} surprises={surprises} />
            )}
        </div>
    );
};

// Composant pour les mentors
const MentorContent: React.FC<{ mentees: Student[] }> = ({ mentees }) => {
    const navigate = useNavigate();

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
const MenteeContent: React.FC<{ mentor: Student | null; surprises: Surprise[] }> = ({
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
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="w-5 h-5" />
                            Surprises
                        </CardTitle>
                        <CardDescription>Messages de votre parrain</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {surprises.length === 0 ? (
                            <p className="text-neutral-500 text-center py-6">Aucune surprise pour le moment</p>
                        ) : (
                            <div className="space-y-3">
                                {surprises.slice(0, 5).map((surprise) => (
                                    <div
                                        key={surprise.id}
                                        className="p-3 "
                                    >
                                        <p className="font-bold text-primary text-md mb-1">{surprise.titre}</p>
                                        <p className="text-sm text-neutral-600 line-clamp-10">{surprise.contenu}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};