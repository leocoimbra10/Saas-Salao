import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

// ===== BUTTON COMPONENT =====
interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'neu' | 'glass' | 'glow' | 'ghost' | 'gradient' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    as?: React.ElementType;
    to?: string;
    href?: string;
}

export const NeoButton = React.forwardRef<HTMLElement, NeoButtonProps>(
    ({
        className,
        variant = 'neu',
        size = 'md',
        fullWidth = false,
        loading = false,
        icon,
        iconPosition = 'left',
        disabled,
        children,
        as: Component = 'button',
        ...props
    }, ref) => {
        const baseClasses = "rounded-neo font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2";

        const variantClasses = {
            neu: "bg-neo-bg shadow-neo-out hover:shadow-neo-pressed active:shadow-neo-in text-neo-text",
            glass: "bg-white/30 backdrop-blur-xl shadow-glass border border-white/20 text-neo-text hover:bg-white/40",
            glow: "bg-brand-gradient text-white shadow-glow-brand hover:shadow-glow-intense",
            ghost: "bg-transparent hover:bg-brand-primary/10 text-brand-primary",
            gradient: "bg-brand-gradient text-white shadow-neo-out hover:shadow-neo-in",
            outline: "border-2 border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary hover:text-white"
        };

        const sizeClasses = {
            sm: "px-4 py-2 text-sm",
            md: "px-6 py-3 text-base",
            lg: "px-8 py-4 text-lg",
            icon: "h-10 w-10 p-0 flex items-center justify-center"
        };

        return (
            <Component
                ref={ref as any}
                disabled={Component === 'button' ? (disabled || loading) : undefined}
                className={cn(
                    baseClasses,
                    variantClasses[variant],
                    sizeClasses[size],
                    fullWidth && 'w-full',
                    (disabled || loading) && 'opacity-50 cursor-not-allowed',
                    className
                )}
                {...props}
            >
                {loading && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {!loading && icon && iconPosition === 'left' && icon}
                {children}
                {!loading && icon && iconPosition === 'right' && icon}
            </Component>
        );
    }
);
NeoButton.displayName = 'NeoButton';

// ===== ICON BUTTON COMPONENT =====
interface NeoIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean;
    activeColor?: string;
    indicatorColor?: string;
    tooltip?: string;
}

export const NeoIconButton = React.forwardRef<HTMLButtonElement, NeoIconButtonProps>(
    ({ className, isActive, activeColor = 'hsl(var(--color-brand-purple))', indicatorColor = 'hsl(var(--color-brand-gold))', children, tooltip, ...props }, ref) => {
        const [isPressed, setIsPressed] = React.useState(false);

        return (
            <button
                ref={ref}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                className={cn(
                    'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150',
                    (isPressed || isActive)
                        ? 'shadow-neo-pressed bg-neo-bg'
                        : 'shadow-neo-out bg-neo-bg hover:shadow-neo-out-lg',
                    className
                )}
                style={{ color: isActive ? activeColor : undefined }}
                title={tooltip}
                {...props}
            >
                {children}

                {/* Active indicator dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: indicatorColor }}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                )}
            </button>
        );
    }
);
NeoIconButton.displayName = 'NeoIconButton';
