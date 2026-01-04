import React from 'react';
import { cn } from '../../lib/utils';

// ===== TYPOGRAPHY COMPONENT =====
interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption' | 'label';
    as?: React.ElementType;
}

export const Typography: React.FC<TypographyProps> = ({
    variant,
    children,
    className,
    as,
    ...props
}) => {
    const variants = {
        h1: { tag: 'h1', class: 'text-4xl md:text-5xl font-display font-bold text-neo-text' },
        h2: { tag: 'h2', class: 'text-3xl md:text-4xl font-display font-semibold text-neo-text' },
        h3: { tag: 'h3', class: 'text-2xl md:text-3xl font-display font-semibold text-neo-text' },
        h4: { tag: 'h4', class: 'text-xl md:text-2xl font-display font-medium text-neo-text' },
        h5: { tag: 'h5', class: 'text-lg md:text-xl font-display font-medium text-neo-text' },
        h6: { tag: 'h6', class: 'text-base md:text-lg font-display font-medium text-neo-text' },
        body: { tag: 'p', class: 'text-base font-body text-neo-text' },
        caption: { tag: 'p', class: 'text-sm font-body text-neo-text-secondary' },
        label: { tag: 'label', class: 'text-sm font-body font-medium text-neo-text' }
    };

    const { tag: Tag, class: variantClass } = variants[variant];
    const Component = (as || Tag) as any;

    return <Component className={cn(variantClass, className)} {...props}>{children}</Component>;
};
