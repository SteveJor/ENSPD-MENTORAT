import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { Layout } from './components/shared/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { MenteesPage } from './pages/MenteesPage';
import { SurprisesPage } from './pages/SurprisesPage';
import { CreateSurprisePage } from './pages/CreateSurprisePage';
import './index.css';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes protégées */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<DashboardPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/mentees" element={<MenteesPage />} />
                            <Route path="/surprises" element={<SurprisesPage />} />
                            <Route path="/surprises/create" element={<CreateSurprisePage />} />
                        </Route>
                    </Route>

                    {/* Redirection par défaut */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;