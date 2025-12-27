// Shared - Public API
// Components
export { AppLayout } from './components/ui/AppLayout';
export { BottomSheet } from './components/ui/BottomSheet';
export { default as Navigation } from './components/ui/Navigation';
export * from './components/ui/NeoComponents';
export { SmartHeader } from './components/ui/SmartHeader';
export { ErrorBoundary } from './components/ErrorBoundary';

// Lib
export { db, auth, storage } from './lib/firebase';
export * from './lib/colors';
export { cn } from './lib/utils';

// Types
export * from './types/types';

// Hooks
export * from './hooks/hooks';
export { useIsMobile } from './hooks/use-mobile';

