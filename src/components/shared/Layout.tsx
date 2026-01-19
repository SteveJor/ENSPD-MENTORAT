import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    Home,
    User,
    Gift,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { ASSETS } from '../../config/constants';
import { Button } from '../../components/ui/Button';

export const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Tableau de bord', href: '/dashboard', icon: Home },
        { name: 'Mon profil', href: '/profile', icon: User },
        // ...(user?.niveau && parseInt(user.niveau) > 1
        //     ? [
                { name: 'Mes mentorés', href: '/mentees', icon: Users },
                { name: 'Surprises', href: '/surprises', icon: Gift },
            // ]
            // : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <img src={ASSETS.logo} alt="ENSPD" className="h-12 rounded-lg" />
                            <div className=" sm:block">
                                <h1 className="text-lg font-heading font-bold text-primary">
                                    ENSPD Mentorat
                                </h1>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg
                      text-sm font-medium transition-colors
                      ${
                                            isActive(item.href)
                                                ? 'bg-primary text-white'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                        }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* User Menu */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-primary">{user?.nom_complet}</p>
                                <p className="text-xs text-neutral-500">{user?.matricule}</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={logout}
                                icon={<LogOut className="w-4 h-4" />}
                                className="hidden sm:flex"
                            >
                                Déconnexion
                            </Button>

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
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-neutral-200">
                        <nav className="px-4 py-3 space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      text-sm font-medium transition-colors
                      ${
                                            isActive(item.href)
                                                ? 'bg-primary text-white'
                                                : 'text-neutral-600 hover:bg-neutral-100'
                                        }
                    `}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                            <button
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    logout();
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
            <main className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-8 py-4">
                <Outlet />
            </main>

        </div>
    );
};