import React from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { Typography } from './Typography';

// ===== INPUT COMPONENT =====
interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
    ({ className, label, error, helperText, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <Typography variant="label" className="mb-2">{label}</Typography>}
                {helperText && <Typography variant="caption" className="mb-2 italic">{helperText}</Typography>}

                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            "w-full rounded-neo bg-neo-bg shadow-neo-in text-neo-text placeholder:text-neo-text-secondary",
                            "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all",
                            icon ? "pl-12 pr-4 py-3" : "px-4 py-3",
                            error && "ring-2 ring-neo-danger",
                            className
                        )}
                        {...props}
                    />
                </div>

                {error && <Typography variant="caption" className="mt-1 text-neo-danger">{error}</Typography>}
            </div>
        );
    }
);
NeoInput.displayName = 'NeoInput';

// ===== TEXTAREA COMPONENT =====
export interface NeoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const NeoTextarea = React.forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <Typography variant="label" className="mb-1.5 block ml-1">
                        {label}
                    </Typography>
                )}

                <textarea
                    ref={ref}
                    className={cn(
                        "w-full px-4 py-3 rounded-neo shadow-neo-in bg-neo-bg",
                        "text-neo-text placeholder:text-neo-text-secondary/50",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary/20",
                        "transition-all duration-200 resize-none",
                        error && "shadow-neo-danger-in",
                        className
                    )}
                    {...props}
                />

                {error && <Typography variant="caption" className="mt-1 text-neo-danger">{error}</Typography>}
            </div>
        );
    }
);
NeoTextarea.displayName = 'NeoTextarea';

// ===== PASSWORD INPUT COMPONENT =====
interface NeoPasswordInputProps extends Omit<NeoInputProps, 'type'> { }

export const NeoPasswordInput = React.forwardRef<HTMLInputElement, NeoPasswordInputProps>(
    (props, ref) => {
        const [showPassword, setShowPassword] = React.useState(false);

        return (
            <div className="relative">
                <NeoInput
                    {...props}
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    className={cn(props.className, "pr-12")}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neo-text-secondary hover:text-neo-text transition-colors mt-3"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>
            </div>
        );
    }
);
NeoPasswordInput.displayName = 'NeoPasswordInput';
