/**
 * BEAUTY SALON NEOMORPHIC APP - Bottom Sheet Component
 * iOS-style bottom sheet with Framer Motion
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { Button } from './NeoComponents';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  headerIcon?: React.ReactNode;
  showHandle?: boolean;
  snapPoints?: number[];
  initialSnap?: number;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  headerIcon,
  showHandle = true,
  snapPoints = [0.3, 0.5, 0.7, 0.95],
  initialSnap = 1,
  className,
}) => {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = useCallback((_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const velocity = info.velocity.y;
    const threshold = 1000;

    if (velocity > threshold) {
      onClose();
    }
  }, [onClose]);

  const variants = {
    hidden: { y: '100%' },
    visible: {
      y: '0%',
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        mass: 0.8,
      },
    },
    exit: {
      y: '100%',
      transition: {
        duration: 0.3,
        ease: [0.32, 0.72, 0, 1],
      },
    },
  };

  const snapTo = (index: number) => {
    setCurrentSnap(index);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed inset-x-0 bottom-0 bg-neo-bg rounded-t-3xl',
              'shadow-neo-out-lg z-50',
              'max-h-[95vh] overflow-hidden',
              className
            )}
          >
            {/* Handle */}
            {showHandle && (
              <div
                className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-1 bg-neo-text-secondary/30 rounded-full" />
              </div>
            )}

            {/* Header with pink icon */}
            {(title || headerIcon) && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-3">
                  {headerIcon && (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-gold flex items-center justify-center shadow-lg shrink-0">
                      {headerIcon}
                    </div>
                  )}
                  {title && (
                    <h2 className="text-xl font-semibold text-neo-text flex-1">{title}</h2>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 text-neo-text-secondary hover:text-neo-text transition-colors shrink-0"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-safe overflow-y-auto max-h-[calc(95vh-80px)]">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Compact Bottom Sheet (for quick actions)
interface CompactBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const CompactBottomSheet: React.FC<CompactBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      snapPoints={[0, 0.4]}
      initialSnap={1}
      className="max-h-[50vh]"
    >
      {children}
    </BottomSheet>
  );
};

// Action Bottom Sheet (for quick actions menu)
interface ActionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    danger?: boolean;
  }[];
  title?: string;
  headerIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const ActionBottomSheet: React.FC<ActionBottomSheetProps> = ({
  isOpen,
  onClose,
  actions = [],
  title,
  headerIcon,
  children,
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerIcon={headerIcon}
      showHandle={false}
      snapPoints={[0, 0.6]}
      initialSnap={1}
    >
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                onClose();
              }}
              className={cn(
                'w-full p-4 rounded-neo flex items-center gap-4',
                'bg-neo-bg shadow-neo-out',
                'active:shadow-neo-pressed transition-all',
                action.danger ? 'text-neo-danger' : 'text-neo-text'
              )}
            >
              <span className="w-6 h-6 flex items-center justify-center">
                {action.icon}
              </span>
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}
      {children}
    </BottomSheet>
  );
};

// Booking Bottom Sheet (multi-step wizard)
interface BookingBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  step: number;
  totalSteps: number;
  children: React.ReactNode;
  title?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  showNavigation?: boolean;
}

export const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
  isOpen,
  onClose,
  step,
  totalSteps,
  children,
  title,
  onNext,
  onBack,
  nextLabel = 'Continuar',
  backLabel = 'Voltar',
  showNavigation = true,
}) => {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      showHandle={true}
      snapPoints={[0, 0.7, 0.9]}
      initialSnap={1}
      className="max-h-[95vh]"
    >
      {title && (
        <h2 className="text-lg font-semibold text-neo-text mb-4">{title}</h2>
      )}
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-neo-text-secondary mb-2">
          <span>Passo {step + 1} de {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-neo-bg rounded-full shadow-neo-in overflow-hidden">
          <motion.div
            className="h-full bg-neo-accent rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="pb-6">
        {children}
      </div>

      {/* Navigation */}
      {showNavigation && (
        <div className="flex gap-4 pt-4 border-t border-neo-text-secondary/10">
          {step > 0 && onBack && (
            <Button variant="ghost" onClick={onBack} className="flex-1">
              {backLabel}
            </Button>
          )}
          {onNext && (
            <Button variant="primary" onClick={onNext} className="flex-1">
              {nextLabel}
            </Button>
          )}
        </div>
      )}
    </BottomSheet>
  );
};
