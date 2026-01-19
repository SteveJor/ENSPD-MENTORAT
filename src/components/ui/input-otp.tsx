import React, { useRef, type KeyboardEvent, type ClipboardEvent } from 'react';

interface InputOTPProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    onComplete?: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
}

export const InputOTP: React.FC<InputOTPProps> = ({
                                                      length = 6,
                                                      value,
                                                      onChange,
                                                      onComplete,
                                                      disabled = false,
                                                      error = false,
                                                  }) => {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, inputValue: string) => {
        if (disabled) return;

        // Convertir en majuscules et garder seulement 1 caractère
        const char = inputValue.slice(-1).toUpperCase();

        if (!char) return;

        const newValue = value.split('');
        newValue[index] = char;
        const finalValue = newValue.join('');

        onChange(finalValue);

        // Auto-focus sur le prochain input
        if (char && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
        }

        // Appeler onComplete si tous les champs sont remplis
        if (finalValue.length === length && onComplete) {
            onComplete(finalValue);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        // Backspace: supprimer et revenir au champ précédent
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newValue = value.split('');

            if (newValue[index]) {
                newValue[index] = '';
                onChange(newValue.join(''));
            } else if (index > 0) {
                newValue[index - 1] = '';
                onChange(newValue.join(''));
                inputsRef.current[index - 1]?.focus();
            }
        }

        // Flèche gauche
        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            inputsRef.current[index - 1]?.focus();
        }

        // Flèche droite
        if (e.key === 'ArrowRight' && index < length - 1) {
            e.preventDefault();
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        // Convertir en majuscules
        const pastedData = e.clipboardData.getData('text').toUpperCase();
        const newValue = pastedData.slice(0, length);
        onChange(newValue);

        // Focus sur le dernier input rempli ou le suivant
        const focusIndex = Math.min(newValue.length, length - 1);
        inputsRef.current[focusIndex]?.focus();

        // Appeler onComplete si la valeur est complète
        if (newValue.length === length && onComplete) {
            onComplete(newValue);
        }
    };

    const handleFocus = (index: number) => {
        inputsRef.current[index]?.select();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="text"
                    autoCapitalize="characters"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className={`
            w-12 h-14 text-center text-2xl font-semibold uppercase
            border-2 rounded-xl
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                            : 'border-neutral-300 focus:border-primary focus:ring-primary/20'
                    }
            ${
                        disabled
                            ? 'bg-neutral-100 cursor-not-allowed opacity-50'
                            : 'bg-white hover:border-primary/50'
                    }
            ${value[index] ? 'border-primary' : ''}
          `}
                />
            ))}
        </div>
    );
};

interface InputOTPGroupProps {
    children: React.ReactNode;
}

export const InputOTPGroup: React.FC<InputOTPGroupProps> = ({ children }) => {
    return <div className="flex gap-2">{children}</div>;
};

interface InputOTPSlotProps {
    index: number;
}

export const InputOTPSlot: React.FC<InputOTPSlotProps> = () => {
    return null; // Utilisé uniquement pour la compatibilité avec l'exemple
};