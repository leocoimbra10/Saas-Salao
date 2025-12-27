# Salão Beauty - Mobile App

A beautiful, store-ready mobile application for beauty salon appointment management, built with React, TypeScript, and Neomorphic design.

## Features

### Client Experience
- 📱 **Mobile-First Design** - Optimized for iOS and Android with native app feel
- 🎨 **Light Neomorphic UI** - Soft, extruded design with Champagne Gold accents
- 📅 **Smart Booking** - Multi-step wizard with real-time pricing
- 💳 **Discount Logic** - Automatic 10% discount on weekdays (Mon-Thu)
- 🖼️ **Portfolio Gallery** - Image upload and browsing
- 📱 **WhatsApp Integration** - Direct booking confirmations

### Admin Dashboard
- 📊 **Real-time Calendar** - Visual appointment management
- 💰 **Revenue Tracking** - Monthly projections and statistics
- 👥 **Client Management** - History and contact information
- 🔔 **Smart Scheduling** - Automatic 15-min turnover buffer
- ⚙️ **Service Management** - CRUD operations for services
- 📈 **Pro Stats** - Hidden-until-toggled analytics panel

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + Neomorphic utilities
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd beauty-salon-neomorphic
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure Firebase:
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

4. Start development server:
```bash
pnpm dev
```

### Building for Production

```bash
pnpm build
```

## Project Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── NeoComponents.tsx    # Base neomorphic components
│   │   ├── BottomSheet.tsx      # iOS-style bottom sheets
│   │   ├── Calendar.tsx         # Calendar and time slots
│   │   ├── ServiceCard.tsx      # Service selection cards
│   │   ├── AppointmentCard.tsx  # Appointment display
│   │   └── Navigation.tsx       # Bottom nav & sidebar
│   └── pages/
│       ├── AdminDashboard.tsx   # Admin command center
│       ├── ClientBooking.tsx    # Booking wizard
│       ├── Portfolio.tsx        # Gallery management
│       └── ServicesManagement.tsx # Service CRUD
├── lib/
│   ├── firebase.ts              # Firebase configuration
│   ├── hooks.ts                 # Firestore data hooks
│   ├── types.ts                 # TypeScript interfaces
│   └── utils.ts                 # Utility functions
├── App.tsx                      # Main app with routing
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## Neomorphic Design System

### Color Palette
- Background: `#F0F0F3`
- Text Primary: `#4A4A58`
- Text Secondary: `#8D8D99`
- Accent: `#D4AF37` (Champagne Gold)
- Success: `#50C878`
- Danger: `#FF6B6B`

### Shadows
- **Outer**: `8px 8px 16px #D1D9E6, -8px -8px 16px #FFFFFF`
- **Inner**: `inset 8px 8px 16px #D1D9E6, inset -8px -8px 16px #FFFFFF`
- **Pressed**: `inset 4px 4px 8px #D1D9E6, inset -4px -4px 8px #FFFFFF`

### Border Radius
- Standard: `24px`
- Large: `32px`
- Small: `16px`

## Firebase Schema

### Collections

```
services/
├── {id}
│   ├── name: string
│   ├── price: number
│   ├── duration: number
│   ├── category: 'makeup' | 'hairstyle'
│   └── active: boolean

appointments/
├── {id}
│   ├── clientName: string
│   ├── clientPhone: string
│   ├── date: string (YYYY-MM-DD)
│   ├── time: string (HH:mm)
│   ├── services: string[]
│   ├── totalAmount: number
│   ├── depositPaid: number
│   └── status: 'pending' | 'confirmed' | 'completed' | 'cancelled'

clients/
├── {id}
│   ├── name: string
│   ├── phone: string
│   ├── email: string
│   ├── totalVisits: number
│   └── totalSpent: number

portfolio/
├── {id}
│   ├── imageUrl: string
│   ├── title: string
│   ├── category: string
│   └── uploadDate: timestamp
```

## Mobile Deployment

### Capacitor Setup

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

Configure `capacitor.config.json`:
```json
{
  "appId": "com.salao.beauty",
  "appName": "Salão Beauty",
  "webDir": "dist",
  "bundledWebRuntime": false
}
```

Build and sync:
```bash
pnpm build
npx cap sync
```

### iOS
```bash
npx cap add ios
npx cap open ios
```

### Android
```bash
npx cap add android
npx cap open android
```

## License

MIT License - see LICENSE file for details.

## Support

For support, email support@salaobeauty.com.br
