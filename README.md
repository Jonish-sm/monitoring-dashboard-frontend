# API Monitoring Dashboard - Frontend

Production-ready API monitoring dashboard built with Next.js 14+, TypeScript, Tailwind CSS, and Shadcn UI.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Backend API running at `http://localhost:3001`

### Installation
```bash
npm install
```

### Environment Setup
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Development
```bash
npm run dev
```
Access at [http://localhost:3000](http://localhost:3000)

### Production
```bash
npm run build
npm start
```

## 🎯 Features

- ✅ **Real-time Monitoring**: Auto-refresh endpoints and alerts every 10-15 seconds
- ✅ **Full CRUD**: Create, update, delete endpoints with validation
- ✅ **Analytics Dashboard**: Stats cards, uptime charts, live status grid
- ✅ **Alert Management**: Filter, acknowledge, and track alerts
- ✅ **Health Logs**: View all health check logs with search and pagination
- ✅ **Dark Mode**: Premium glassmorphism design with vibrant gradients
- ✅ **Animations**: Smooth Framer Motion transitions
- ✅ **Responsive**: Mobile, tablet, and desktop layouts

## 📁 Tech Stack

- **Next.js 16** with App Router
- **TypeScript** with strict type checking
- **Tailwind CSS 4** for styling
- **Shadcn UI** components
- **TanStack Query** for data fetching
- **React Hook Form + Zod** for validation
- **Recharts** for data visualization
- **Framer Motion** for animations

## 📱 Pages

- **Dashboard** (`/`) - Overview with stats, charts, and live status
- **Endpoints** (`/endpoints`) - Manage API endpoints (CRUD)
- **Endpoint Detail** (`/endpoints/[id]`) - Analytics and health logs
- **Alerts** (`/alerts`) - Alert management with filtering
- **Logs** (`/logs`) - Health check logs

## 🛠️ Project Structure

```
app/               # Next.js pages (App Router)
components/        # React components
  ├── ui/         # Shadcn UI components
  ├── layout/     # Layout components (Sidebar)
  ├── dashboard/  # Dashboard-specific components
  ├── endpoints/  # Endpoint-related components
  └── shared/     # Reusable components
hooks/            # React Query hooks
lib/              # Utilities and API clients
  ├── api/       # API service functions
  ├── types/     # TypeScript types
  └── utils/     # Helper functions
```

## 🎨 Design

- Dark mode with slate background (#0F172A)
- Glassmorphism effects on cards
- Gradient backgrounds (blue→purple)
- Pulsating status indicators
- Smooth hover effects and transitions

## 🔧 Configuration

Polling intervals in `lib/constants.ts`:
- Endpoints: 10 seconds
- Alerts: 15 seconds
- Health Logs: 30 seconds

## 📄 License

MIT
