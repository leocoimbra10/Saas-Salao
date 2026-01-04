import React from 'react';
import { cn } from '../../lib/utils';

// ===== CARD COMPONENT =====
interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'flat' | 'raised' | 'inset';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
    ({ className, variant = 'raised', padding = 'md', children, ...props }, ref) => {
        const variantClasses = {
            flat: "bg-neo-bg",
            raised: "bg-neo-bg shadow-neo-out",
            inset: "bg-neo-bg shadow-neo-in"
        };

        const paddingClasses = {
            none: "p-0",
            sm: "p-4",
            md: "p-6",
            lg: "p-8"
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-neo",
                    variantClasses[variant],
                    paddingClasses[padding],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
NeoCard.displayName = 'NeoCard';
