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
                setUser(response.data);
            } else {
                apiService.clearToken();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            apiService.clearToken();
        } finally {
            setLoading(false);
        }
    };

    const login = async (matricule: string, token: string) => {
        const response = await apiService.login({ matricule, token });

        if (response.success && response.data?.token && response.data?.student) {
            apiService.setToken(response.data.token);
            setUser(response.data.student);
            navigate('/dashboard');
        } else {
            throw new Error(response.error || 'Échec de la connexion');
        }
    };

    const logout = () => {
        apiService.clearToken();
        setUser(null);
        navigate('/login');
    };

    const updateUser = (userData: Partial<Student>) => {
        if (user)
        {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};