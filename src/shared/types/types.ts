/**
 * BEAUTY SALON NEOMORPHIC APP - Type Definitions
 */

export interface Staff {
  id: string;
  name: string;
  photo?: string;
  specialty?: string;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  category: 'makeup' | 'hairstyle';
  duration: number; // in minutes
  description?: string;
  tags?: string[]; // For additional categorization (e.g., 'noiva', 'festa', etc.)
  orgId: string;
  createdAt?: Date;
}

export interface Appointment {
  id: string;
  orgId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  services: string[]; // service IDs
  staffId: string; // The professional assigned
  totalAmount: number;
  depositPaid: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  instagram?: string;
  birthday?: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: Date;
  lastVisit?: Date;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
  category: string;
  uploadDate: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

export interface StatsData {
  monthlyRevenue: number;
  monthlyAppointments: number;
  clientRetention: number;
  topServices: { name: string; count: number }[];
  revenueByDay: { date: string; amount: number }[];
}

// Multi-Tenant SaaS Types

export type UserRole = 'owner' | 'employee' | 'client';

export interface UserPermissions {
  canViewGlobalAgenda: boolean;    // Ver Agenda Global
  canManagePayments: boolean;       // Gerenciar Cobranças
  canViewFinancialReports: boolean; // Ver Performance/Faturamento
  canEditServices: boolean;         // Editar Serviços (CMS)
  canManageTeam: boolean;           // Gerenciar Equipe
  canViewClients: boolean;          // Ver Clientes
  canManageAppointments: boolean;   // Gerenciar Agendamentos
}

export const DEFAULT_EMPLOYEE_PERMISSIONS: UserPermissions = {
  canViewGlobalAgenda: false,
  canManagePayments: false,
  canViewFinancialReports: false,
  canEditServices: false,
  canManageTeam: false,
  canViewClients: true,
  canManageAppointments: true,
};

export const OWNER_PERMISSIONS: UserPermissions = {
  canViewGlobalAgenda: true,
  canManagePayments: true,
  canViewFinancialReports: true,
  canEditServices: true,
  canManageTeam: true,
  canViewClients: true,
  canManageAppointments: true,
};

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  preferredName?: string; // Nickname or preferred name
  photoURL: string | null;
  orgId: string;
  role: UserRole;
  permissions: UserPermissions;
  commissionRate?: number; // Percentage (0-100)
  specialty?: string; // e.g., "Maquiagem", "Cabelo"
  createdAt: Date;
  lastLogin: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  settings: {
    logo?: string;
    backgroundUrl?: string; // Global background image
    primaryColor?: string;
    phone?: string;
    address?: string;
    businessHours?: {
      [key: string]: { open: string; close: string; closed?: boolean };
    };
  };
}

export interface BusinessHours {
  monday: { open: string; close: string; closed?: boolean };
  tuesday: { open: string; close: string; closed?: boolean };
  wednesday: { open: string; close: string; closed?: boolean };
  thursday: { open: string; close: string; closed?: boolean };
  friday: { open: string; close: string; closed?: boolean };
  saturday: { open: string; close: string; closed?: boolean };
  sunday: { open: string; close: string; closed?: boolean };
}

export const SERVICES_DATA: Service[] = [
  // Makeup Services
  {
    id: 'makeup-basic',
    name: 'Maquiagem',
    price: 160,
    duration: 60,
    category: 'makeup',
    description: 'Maquiagem completa com produtos profissionais',
    active: true,
  },
  {
    id: 'makeup-combo',
    name: 'Combo (Seg-Qui)',
    price: 190,
    duration: 90,
    category: 'makeup',
    description: 'Maquiagem + Designer de sobrancelhas',
    active: true,
  },
  // Hairstyle Services
  {
    id: 'hair-waves',
    name: 'Ondas',
    price: 70,
    duration: 45,
    category: 'hairstyle',
    description: 'Ondas naturais com finalização',
    active: true,
  },
  {
    id: 'hair-semi-updo',
    name: 'Semi-Preso',
    price: 110,
    duration: 60,
    category: 'hairstyle',
    description: 'Cabelo preso parcialmente',
    active: true,
  },
  {
    id: 'hair-ponytail',
    name: 'Cabelo Preso',
    price: 120,
    duration: 60,
    category: 'hairstyle',
    description: 'Cobertura com rabo de cavalo',
    active: true,
  },
  {
    id: 'hair-bun',
    name: 'Coque',
    price: 140,
    duration: 75,
    category: 'hairstyle',
    description: 'Coque moderno com acessórios',
    active: true,
  },
];

export const WEEKDAY_DISCOUNTS = {
  1: 0.10, // Monday - 10% off (already in combo price)
  2: 0.10, // Tuesday
  3: 0.10, // Wednesday
  4: 0.10, // Thursday
  0: 0, // Sunday
  5: 0, // Friday
  6: 0, // Saturday
};

export const TURNOVER_BUFFER = 15; // minutes

export const STATS_INITIAL: StatsData = {
  monthlyRevenue: 0,
  monthlyAppointments: 0,
  clientRetention: 0,
  topServices: [],
  revenueByDay: [],
};
