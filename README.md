<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

# 📡 API Monitoring Dashboard

A **production-ready, real-time API monitoring dashboard** built with modern web technologies. Monitor the health of your API endpoints, track response times, manage alerts, and visualize uptime analytics — all from a sleek, dark-themed interface.

---

## ✨ Overview

API Monitoring Dashboard provides a centralized platform for teams to keep an eye on their API infrastructure. It integrates with a backend service that performs automated health checks at configurable intervals and surfaces that data through intuitive charts, tables, and status indicators.

**Key Capabilities:**

- 📊 **Real-time Dashboard** — Live status overview with auto-refreshing stats, uptime charts, and alert summaries
- 🔗 **Endpoint Management** — Full CRUD operations to add, edit, activate/deactivate, and remove monitored endpoints
- 📈 **Analytics & Charts** — Response time trends and uptime percentage visualizations powered by Recharts
- 🔔 **Alert System** — Filter, acknowledge, and track alerts with severity-based categorization
- 📋 **Health Logs** — Searchable, paginated history of every health check performed

---

## 🖥️ Screenshots

| Dashboard | Endpoint Detail |
|-----------|----------------|
| Stats cards, live status grid, uptime chart, recent alerts | Analytics cards, response time chart, health logs, alerts |

| Endpoints Management | Alerts Page |
|----------------------|-------------|
| Sortable table, search, CRUD dialogs | Filterable tabs, acknowledge actions, severity badges |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20 or higher
- **npm** or **yarn** package manager
- **Backend API** running (default: `http://localhost:3001`)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monitoring-dashboard-frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

> **Note:** Update this URL to point to your deployed backend if running in production.

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) + [Radix Primitives](https://www.radix-ui.com/) |
| **Data Fetching** | [TanStack React Query 5](https://tanstack.com/query) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Charts** | [Recharts 3](https://recharts.org/) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Forms** | [React Hook Form 7](https://react-hook-form.com/) + [Zod 4](https://zod.dev/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Date Handling** | [date-fns 4](https://date-fns.org/) |
| **State** | [Zustand 5](https://zustand.docs.pmnd.rs/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.dev/) |

---

## 📁 Project Structure

```
monitoring-dashboard-frontend/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Dashboard (home page)
│   ├── layout.tsx                # Root layout with sidebar & providers
│   ├── globals.css               # Global styles, theme, animations
│   ├── endpoints/
│   │   ├── page.tsx              # Endpoints listing & management
│   │   └── [id]/
│   │       └── page.tsx          # Endpoint detail with analytics
│   ├── alerts/
│   │   └── page.tsx              # Alerts management with filters
│   └── logs/
│       └── page.tsx              # Health check log viewer
│
├── components/
│   ├── ui/                       # Shadcn UI primitives (Button, Card, Dialog, etc.)
│   ├── layout/
│   │   └── Sidebar.tsx           # App navigation sidebar
│   ├── dashboard/
│   │   ├── StatsCard.tsx         # Animated stats display card
│   │   ├── StatusGrid.tsx        # Live endpoint status grid
│   │   ├── RecentAlerts.tsx      # Recent alerts panel
│   │   ├── UptimeChart.tsx       # Uptime percentage area chart
│   │   └── ResponseTimeChart.tsx # Response time trend area chart
│   ├── endpoints/
│   │   ├── CreateEndpointDialog.tsx  # Add new endpoint modal form
│   │   └── EndpointActions.tsx      # Edit, delete, toggle actions
│   ├── shared/
│   │   └── DataTable.tsx         # Reusable sortable data table
│   └── providers/
│       └── query-provider.tsx    # React Query provider wrapper
│
├── hooks/
│   ├── useEndpoints.ts           # CRUD hooks for endpoints
│   ├── useAlerts.ts              # Alert fetching & acknowledge hooks
│   ├── useHealthLogs.ts          # Health log & analytics hooks
│   └── useDebounce.ts            # Input debounce utility hook
│
├── lib/
│   ├── api/
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── endpoints.ts          # Endpoint API functions
│   │   ├── health-logs.ts        # Health log & analytics API functions
│   │   └── alerts.ts             # Alert API functions
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces & DTOs
│   ├── utils/
│   │   ├── format.ts             # Date, number, duration formatters
│   │   └── validation.ts         # Zod schemas for form validation
│   ├── constants.ts              # App constants & configurations
│   └── utils.ts                  # General utilities (cn helper)
│
└── public/                       # Static assets
```

---

## 📱 Pages & Features

### Dashboard (`/`)

The main overview page providing a bird's-eye view of your entire API infrastructure.

- **Stats Cards** — Total endpoints, active endpoints, unacknowledged alerts, and average uptime (computed from real health checks)
- **Uptime Chart** — 24-hour area chart showing uptime percentage trends derived from actual health log data
- **Live Status Grid** — Visual grid of all endpoints with click-through to detail pages
- **Recent Alerts** — Quick-glance panel of the latest unacknowledged alerts with inline acknowledge buttons

### Endpoints Management (`/endpoints`)

Full lifecycle management for monitored API endpoints.

- **Data Table** — Sortable columns for name, method, status, check interval, and expected status
- **Search** — Debounced search by endpoint name
- **Create Endpoint** — Modal form with validation (name, URL, HTTP method, expected status, check interval)
- **Inline Actions** — Edit, view details, activate/deactivate, and delete with confirmation dialog
- **Pagination** — Configurable page sizes (10, 25, 50, 100)

### Endpoint Detail (`/endpoints/[id]`)

Deep-dive analytics and history for a single endpoint.

- **Analytics Cards** — Total checks, uptime %, average response time, last check status
- **Time Range Selector** — Toggle between 1h, 6h, 24h, 7d, and 30d views
- **Response Time Chart** — Trend visualization of response times using Recharts area chart
- **Health Logs Table** — Paginated table of individual health checks with status codes and error messages
- **Endpoint Alerts** — Alerts specific to this endpoint with severity badges

### Alerts (`/alerts`)

Centralized alert management and triage.

- **Filter Tabs** — All, Unacknowledged, Acknowledged
- **Alert Cards** — Severity-coded badges (HIGH/MEDIUM/LOW), alert type icons (🔴 DOWN, 🟡 SLOW, ⚠️ ERROR)
- **Acknowledge Action** — One-click acknowledgement with toast confirmation
- **Pagination** — Configurable page sizes

### Health Logs (`/logs`)

Complete audit trail of every health check executed.

- **Searchable Table** — Filter by error message content
- **Log Details** — Timestamp, endpoint ID, status code, response time, success/failure, error messages
- **Pagination** — Navigate through large datasets efficiently

---

## 🔄 Real-Time Updates

The dashboard uses polling via React Query to keep data fresh without requiring manual page refreshes:

| Data | Polling Interval |
|------|-----------------|
| Endpoints | Every **10 seconds** |
| Alerts | Every **15 seconds** |
| Health Logs | Every **30 seconds** |

Polling intervals are configurable in `lib/constants.ts`.

---

## 🎨 Design System

The application follows a **dark-first design philosophy** with a focus on premium aesthetics:

- **Color Palette** — Dark slate backgrounds (`#0F172A`, `#1E293B`) with vibrant gradients
- **Gradients** — Blue → Purple primary (`#3B82F6` → `#8B5CF6`), Emerald success, Amber warning, Red error
- **Glassmorphism** — Frosted glass card effects with `backdrop-blur` and subtle borders
- **Typography** — Inter font family for clean readability
- **Animations** — Framer Motion page transitions, card entrance animations, and hover micro-interactions
- **Status Indicators** — Pulsating glow animations for real-time status visibility

---

## 🔌 Backend API Integration

This frontend connects to a NestJS backend API. The expected API endpoints are:

### Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/endpoints` | List all endpoints |
| `GET` | `/api/endpoints/:id` | Get endpoint by ID |
| `POST` | `/api/endpoints` | Create new endpoint |
| `PUT` | `/api/endpoints/:id` | Update endpoint |
| `DELETE` | `/api/endpoints/:id` | Delete endpoint |

### Health Logs
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/health-logs` | List all health logs |
| `GET` | `/api/health-logs/endpoint/:id` | Logs for specific endpoint |
| `GET` | `/api/health-logs/analytics/:id` | Analytics for endpoint |

### Alerts
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/alerts` | List all alerts |
| `GET` | `/api/alerts/endpoint/:id` | Alerts for specific endpoint |
| `PUT` | `/api/alerts/:id/acknowledge` | Acknowledge an alert |

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

### Customization Points

- **Polling intervals** — `lib/constants.ts` → `POLLING_INTERVALS`
- **Color scheme** — `app/globals.css` → CSS custom properties in `.dark` block
- **Time ranges** — `lib/constants.ts` → `TIME_RANGES`
- **HTTP methods** — `lib/constants.ts` → `HTTP_METHODS`

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
</p>
