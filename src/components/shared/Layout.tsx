import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    User,
    // Users,
    Gift,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { ASSETS } from '../../config/constants';

export const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isMentor = user?.niveau && user.niveau >= 4;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Mon Profil', href: '/profile', icon: User },
        ...(isMentor ? [ { name: 'Surprises', href: '/surprises', icon: Gift },] : []),
        // { name: 'Mes Mentorés', href: '/mentees', icon: Users },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <img
                                src={ASSETS.logo}
                                alt="ENSPD Mentorat"
                                className="h-14 object-contain"
                            />
                            <div className="hidden sm:block">
                                <h1 className="text-xl font-heading font-bold text-primary">
                                    ENSPD Mentorat
                                </h1>
                                {user && (
                                    <p className="text-xs text-neutral-600">
                                        {user.nom_complet}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-white'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`
                                        }
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </NavLink>
                                );
                            })}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ml-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Déconnexion
                            </button>
                        </nav>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-200">
                        <nav className="px-4 py-4 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                                isActive
                                                    ? 'bg-primary text-white'
                                                    : 'text-neutral-600 hover:bg-neutral-100'
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </NavLink>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                Déconnexion
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};