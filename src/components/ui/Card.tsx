import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className = '',
                                              hover = false,
                                              padding = 'md',
                                          }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-4',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        ${hover ? 'hover:shadow-soft transition-shadow duration-200' : ''}
        ${paddingClasses[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                            children,
                                                                                            className = '',
                                                                                        }) => {
    return <div className={`mb-4 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                           children,
                                                                                           className = '',
                                                                                       }) => {
    return (
        <h3 className={`text-xl font-heading font-bold text-primary ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                                 children,
                                                                                                 className = '',
                                                                                             }) => {
    return <p className={`text-sm text-neutral-600 mt-1 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                             children,
                                                                                             className = '',
                                                                                         }) => {
    return <div className={className}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
                                                                                            children,
                                                                                            className = '',
                                                                                        }) => {
    return <div className={`mt-6 pt-4 border-t border-neutral-200 ${className}`}>{children}</div>;
};