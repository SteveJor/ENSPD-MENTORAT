import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-2.5 rounded-xl
              border-2 transition-all duration-200
              font-body text-base
              ${icon ? 'pl-10' : ''}
              ${
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                : 'border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                        }
              ${props.disabled ? 'bg-neutral-100 cursor-not-allowed opacity-50' : 'bg-white'}
              placeholder:text-neutral-400
              focus:outline-none
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ label, error, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 rounded-xl
            border-2 transition-all duration-200
            font-body text-base
            ${
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                    }
            ${props.disabled ? 'bg-neutral-100 cursor-not-allowed opacity-50' : 'bg-white'}
            placeholder:text-neutral-400
            focus:outline-none
            resize-vertical
            ${className}
          `}
                    {...props}
                />
                {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
                {helperText && !error && (
                    <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
                )}
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';