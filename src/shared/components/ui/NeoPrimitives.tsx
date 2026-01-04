import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';
import { Typography } from './Typography';

// ===== BADGE COMPONENT =====
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'neutral',
    children,
    ...props
}) => {
    const variants = {
        success: 'bg-neo-success/10 text-neo-success',
        warning: 'bg-neo-warning/10 text-neo-warning',
        danger: 'bg-neo-danger/10 text-neo-danger',
        info: 'bg-neo-info/10 text-neo-info',
        neutral: 'bg-neo-bg shadow-neo-in text-neo-text',
        brand: 'bg-brand-primary/10 text-brand-primary'
    };

    return (
        <span
            className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
Badge.displayName = 'Badge';

// ===== CHECKBOX COMPONENT =====
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                    <input
                        ref={ref}
                        type="checkbox"
                        className="peer sr-only"
                        {...props}
                    />
                    <div className={cn(
                        "w-6 h-6 rounded-neo bg-neo-bg shadow-neo-in",
                        "peer-checked:shadow-neo-out peer-checked:bg-brand-primary",
                        "peer-focus:ring-2 peer-focus:ring-brand-primary/20",
                        "transition-all flex items-center justify-center",
                        className
                    )}>
                        <Check size={14} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                </div>
                {label && <Typography variant="body">{label}</Typography>}
            </label>
        );
    }
);
Checkbox.displayName = 'Checkbox';

// ===== PROGRESS COMPONENT =====
interface ProgressProps {
    value: number;
    max?: number;
    showLabel?: boolean;
    className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    max = 100,
    showLabel,
    className
}) => {
    const percentage = Math.round((value / max) * 100);

    return (
        <div className={cn("w-full", className)}>
            <div className="flex justify-between items-center mb-2">
                {showLabel && (
                    <Typography variant="caption">{percentage}%</Typography>
                )}
            </div>
            <div className="h-3 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
                <div
                    className="h-full bg-brand-gradient rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
Progress.displayName = 'Progress';

// ===== AVATAR COMPONENT =====
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
    className,
    src,
    alt,
    name,
    size = 'md',
    ...props
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            className={cn(
                "rounded-full bg-neo-bg shadow-neo-out flex items-center justify-center overflow-hidden font-semibold text-brand-primary",
                sizes[size],
                className
            )}
            {...props}
        >
            {src ? (
                <img src={src} alt={alt || name} className="w-full h-full object-cover" />
            ) : name ? (
                getInitials(name)
            ) : (
                <div className="w-full h-full bg-brand-primary/10" />
            )}
        </div>
    );
};
Avatar.displayName = 'Avatar';

// ===== DIVIDER COMPONENT =====
export const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => (
    <div className={cn("h-px bg-neo-text-secondary/20 my-4", className)} />
);
Divider.displayName = 'Divider';

// ===== SPINNER COMPONENT =====
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4'
    };

    return (
        <div
            className={cn(
                "border-brand-primary border-t-transparent rounded-full animate-spin",
                sizes[size],
                className
            )}
        />
    );
};
Spinner.displayName = 'Spinner';

// ===== EMPTY STATE COMPONENT =====
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && (
                <div className="mb-4 text-neo-text-secondary">
                    {icon}
                </div>
            )}
            <Typography variant="h4" className="mb-2">{title}</Typography>
            {description && (
                <Typography variant="caption" className="mb-6 max-w-md">
                    {description}
                </Typography>
            )}
            {action && <div>{action}</div>}
        </div>
    );
};
EmptyState.displayName = 'EmptyState';

// ===== SKELETON COMPONENT =====
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("animate-pulse rounded-neo bg-neo-text-secondary/10", className)}
        {...props}
    />
);
Skeleton.displayName = 'Skeleton';

// ===== TOGGLE COMPONENT =====
interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled, className, label }) => {
    return (
        <label className={cn("inline-flex items-center gap-2 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
            <div
                className={cn(
                    "w-12 h-6 rounded-full p-1 transition-all duration-300 relative",
                    checked ? "bg-neo-accent shadow-neo-in" : "bg-neo-bg shadow-neo-in"
                )}
                onClick={() => !disabled && onChange(!checked)}
            >
                <div
                    className={cn(
                        "w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                        checked ? "translate-x-6" : "translate-x-0"
                    )}
                />
            </div>
            {label && <Typography variant="caption">{label}</Typography>}
        </label>
    );
};
Toggle.displayName = 'Toggle';
