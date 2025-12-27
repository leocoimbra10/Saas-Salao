/**
 * BEAUTY SALON NEOMORPHIC APP - Neomorphic UI Components
 */
import React from 'react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  active?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'secondary', size = 'md', loading, active, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'text-neo-accent',
      secondary: 'text-neo-text',
      danger: 'text-neo-danger',
      ghost: 'text-neo-text-secondary bg-transparent shadow-none',
      glass: 'btn-glass-glow',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    // Determine if this should use glass style or neo style
    const isGlass = variant === 'glass';

    return (
      <button
        ref={ref}
        className={cn(
          // Base neu-glass-light styles (applied to all non-ghost buttons)
          !isGlass && variant !== 'ghost' && 'btn-neu-glass-light',
          isGlass && 'btn-glass-glow',
          // Active state
          active && 'active',
          // Common properties
          'rounded-neo font-semibold transition-all duration-200',
          'flex items-center justify-center gap-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        aria-pressed={active}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  pressed?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, pressed, ...props }) => {
  return (
    <div
      className={cn(
        'bg-neo-bg rounded-neo transition-all duration-200',
        pressed ? 'shadow-neo-pressed' : 'shadow-neo-out',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
Card.displayName = 'Card';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neo-text-secondary mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-secondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'bg-neo-bg rounded-neo shadow-neo-in px-4 py-3 text-neo-text',
              'placeholder:text-neo-text-secondary outline-none',
              'focus:ring-2 focus:ring-neo-accent/20 transition-all duration-200',
              'w-full',
              icon && 'pl-12',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-neo-danger">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neo-text-secondary mb-2">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'bg-neo-bg rounded-neo shadow-neo-in px-4 py-3 text-neo-text',
            'outline-none cursor-pointer appearance-none',
            'focus:ring-2 focus:ring-neo-accent/20 transition-all duration-200',
            'w-full',
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
      </div>
    );
  }
);
Select.displayName = 'Select';

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'neutral', children, ...props }) => {
  const variants = {
    success: 'bg-neo-success/10 text-neo-success',
    warning: 'bg-neo-warning/10 text-neo-warning',
    danger: 'bg-neo-danger/10 text-neo-danger',
    info: 'bg-neo-info/10 text-neo-info',
    neutral: 'bg-neo-bg shadow-neo-out text-neo-text',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1',
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

// Avatar Component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
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
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-xl',
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
        'bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center',
        'overflow-hidden',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-neo-accent font-semibold">
          {name ? getInitials(name) : '?'}
        </span>
      )}
    </div>
  );
};
Avatar.displayName = 'Avatar';

// Toggle Component - LED Glass Effect
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ROSE = '#E8A0B8';
const GOLD = ROSE;

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled
}) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          // Base Track Styling
          'w-14 h-7 rounded-full cursor-pointer relative',
          'transition-all duration-300 ease-in-out',
          // Neomorphic Recessed Track
          checked
            ? 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]'
            : 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        style={{
          background: checked
            ? `linear-gradient(135deg, #FF69B4 0%, ${GOLD} 100%)`
            : 'rgba(148, 163, 184, 0.2)'
        }}
        disabled={disabled}
      >
        {/* Sliding Knob with LED Glow */}
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'absolute w-6 h-6 rounded-full top-0.5',
            // 3D Glass Glint
            'bg-white shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.2)]',
            'transition-shadow duration-300'
          )}
          style={{
            left: checked ? 'calc(100% - 1.625rem)' : '0.125rem',
            // LED Neon Glow when active - MAXIMUM INTENSITY
            boxShadow: checked
              ? `inset 0 1px 1px 0 rgba(255,255,255,0.9), 0 0 8px #FF69B4, 0 0 16px #FF69B4, 0 0 24px ${GOLD}, 0 0 40px ${GOLD}CC, 0 0 60px ${GOLD}80`
              : 'inset 0 1px 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.2)'
          }}
        />
      </button>
      {label && (
        <span className="text-neo-text font-medium">{label}</span>
      )}
    </label>
  );
};
Toggle.displayName = 'Toggle';

// Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  label,
  ...props
}) => {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          {...props}
        />
        <div className={cn(
          'w-6 h-6 rounded-neo-sm transition-all duration-200',
          props.checked
            ? 'bg-neo-accent shadow-neo-pressed'
            : 'bg-neo-bg shadow-neo-in'
        )}>
          {props.checked && (
            <svg
              className="w-full h-full text-white p-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
      {label && (
        <span className="text-neo-text text-sm">{label}</span>
      )}
    </label>
  );
};

// Progress Component
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
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm text-neo-text-secondary">Progresso</span>
          <span className="text-sm text-neo-accent font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="bg-neo-bg rounded-full shadow-neo-in overflow-hidden h-3">
        <motion.div
          className="h-full bg-neo-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
Progress.displayName = 'Progress';

// Divider Component
export const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('h-px bg-neo-text-secondary/20 my-4', className)} />
  );
};
Divider.displayName = 'Divider';

// Empty State Component
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
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="w-20 h-20 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center mb-4 text-neo-text-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-neo-text mb-2">{title}</h3>
      {description && (
        <p className="text-neo-text-secondary mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
};
EmptyState.displayName = 'EmptyState';

// Loading Spinner
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={cn('animate-spin text-neo-accent', sizes[size])}
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};
Spinner.displayName = 'Spinner';
