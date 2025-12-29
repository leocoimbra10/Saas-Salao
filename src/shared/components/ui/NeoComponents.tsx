/**
 * ENTERPRISE DESIGN SYSTEM - Unified Neomorphic Components
 * Single source of truth for all UI elements
 */
import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

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
// ===== SKELETON COMPONENT (MISSING FIX) =====
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-neo bg-neo-text-secondary/10", className)}
    {...props}
  />
);

EmptyState.displayName = 'EmptyState';

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

