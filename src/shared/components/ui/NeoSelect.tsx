import React from 'react';
import { cn } from '../../lib/utils';
import { Typography } from './Typography';

// ===== SELECT COMPONENT =====
interface NeoSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const NeoSelect = React.forwardRef<HTMLSelectElement, NeoSelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && <Typography variant="label" className="mb-2">{label}</Typography>}

                <select
                    ref={ref}
                    className={cn(
                        "w-full rounded-neo bg-neo-bg shadow-neo-in px-4 py-3 text-neo-text",
                        "focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all",
                        "cursor-pointer appearance-none",
                        error && "ring-2 ring-neo-danger",
                        className
                    )}
                    {...props}
                >
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {error && <Typography variant="caption" className="mt-1 text-neo-danger">{error}</Typography>}
            </div>
        );
    }
);
NeoSelect.displayName = 'NeoSelect';
