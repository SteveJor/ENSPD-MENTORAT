import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.service';
import type { Student } from '../types';

interface AuthContextType {
    user: Student | null;
    loading: boolean;
    login: (matricule: string, token: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<Student>) => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.getProfile();
            if (response.success && response.data) {
                // ✅ Normaliser les données utilisateur
                setUser({
                    ...response.data,
                    niveau: String(response.data.niveau), // Convertir en string
                    profile_completed: true,
                });
            } else {
                apiService.clearToken();
            }
        } catch (error) {
            console.error('Erreur checkAuth:', error);
            apiService.clearToken();
        } finally {
            setLoading(false);
        }
    };

    const login = async (matricule: string, token: string) => {
        try {
            const response = await apiService.login({ matricule, token });

            if (response.success && response.data?.token && response.data?.student) {
                apiService.setToken(response.data.token);

                // ✅ Normaliser les données utilisateur
                const normalizedUser = {
                    ...response.data.student,
                    niveau: String(response.data.student.niveau),
                    profile_completed: true,
                };

                setUser(normalizedUser);
                navigate('/dashboard');
            } else {
                throw new Error(response.error || 'Échec de la connexion');
            }
        } catch (error: any) {
            console.error('Erreur login:', error);
            throw new Error(error?.error || error?.message || 'Erreur de connexion');
        }
    };

    const logout = () => {
        apiService.clearToken();
        setUser(null);
        navigate('/login');
    };

    const updateUser = (userData: Partial<Student>) => {
        if (user) {
            setUser({ ...user, ...userData });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};