import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'|'success';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  variant = 'primary',
                                                  size = 'md',
                                                  loading = false,
                                                  icon,
                                                  fullWidth = false,
                                                  disabled,
                                                  className = '',
                                                  ...props
                                              }) => {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-primary text-white
      hover:bg-primary-dark
      focus:ring-primary/50
      shadow-sm hover:shadow
    `,
        secondary: `
      bg-secondary text-primary
      hover:bg-secondary-dark
      focus:ring-secondary/50
      shadow-sm hover:shadow
    `,
        outline: `
      bg-transparent border-2 border-primary text-primary
      hover:bg-primary hover:text-white
      focus:ring-primary/50
    `,
        ghost: `
      bg-transparent text-primary
      hover:bg-primary/10
      focus:ring-primary/30
    `,
        danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500/50
      shadow-sm hover:shadow
    `,
        success: `
      bg-green-600 text-white
      hover:bg-green-700
      focus:ring-green-500/50
      shadow-sm hover:shadow
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    {icon && <span className="flex-shrink-0">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};