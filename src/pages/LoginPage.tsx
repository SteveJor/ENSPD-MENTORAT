import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Key, AlertCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

import { apiService } from '../services/api.service';
import { ASSETS, VALIDATION, ERROR_MESSAGES } from '../config/constants';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const [matricule, setMatricule] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateForm = (): boolean => {
        if (matricule.length < VALIDATION.matricule.minLength) {
            setError(
                `Le matricule doit contenir au moins ${VALIDATION.matricule.minLength} caractères`
            );
            return false;
        }

        if (!VALIDATION.matricule.pattern.test(matricule)) {
            setError('Le matricule ne doit contenir que des lettres majuscules et des chiffres');
            return false;
        }

        if (!token.trim()) {
            setError('Veuillez entrer votre token');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await apiService.login({
                matricule: matricule.toUpperCase(),
                token: token.trim(),
            });

            if (response.success && response.data?.token) {
                apiService.setToken(response.data.token);
                navigate('/dashboard');
                return;
            }

            setError(response.error || ERROR_MESSAGES.invalidCredentials);
        } catch (err: any) {
            // ⬇️ ici on récupère l'erreur rejetée par Axios
            setError(err?.error || ERROR_MESSAGES.network);
        } finally {
            // ✅ SERA TOUJOURS APPELÉ
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mt-8">
                    <img
                        src={ASSETS.logo}
                        alt="ENSPD Mentorat"
                        className="h-28 mx-auto mb-4"
                    />
                    <h1 className="text-3xl font-heading font-bold text-dark">
                        ENSPD Mentorat
                    </h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Connexion</CardTitle>
                        <CardDescription className="text-center">
                            Entrez vos identifiants pour vous connecter
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    label="Matricule"
                                    placeholder="Ex: 20FI1234"
                                    value={matricule}
                                    onChange={(e) =>
                                        setMatricule(e.target.value.toUpperCase())
                                    }
                                    icon={<User className="w-5 h-5" />}
                                    disabled={loading}
                                    autoFocus
                                    required
                                />

                                <Input
                                    label="Code"
                                    type="password"
                                    placeholder="Votre code de connexion"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    icon={<Key className="w-5 h-5" />}
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                size="lg"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                            >
                                Se connecter
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
