# SkillEngine - Geniura LMS Admin Dashboard

**Production URL:** https://skill.geniura.com

A comprehensive, modern Learning Management System (LMS) admin dashboard built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with Keycloak SSO
- **State Management**: TanStack Query for server state, Zustand for client state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table v8
- **Charts**: Recharts
- **Real-time**: Pusher integration ready
- **Dark Mode**: Full support with next-themes
- **Type-safe**: Strict TypeScript configuration
- **Role-based Access Control**: Comprehensive permission system

## 📁 Project Structure

```
academy-lms-admin/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth route group
│   ├── (dashboard)/         # Dashboard route group
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   └── shared/              # Shared components
├── features/                # Feature-based modules
│   ├── auth/                # Authentication
│   ├── users/               # User management
│   ├── courses/             # Course management
│   └── ...
├── lib/                     # Utilities and helpers
│   ├── api/                 # API client
│   ├── auth/                # Auth utilities
│   ├── constants/           # Constants
│   ├── types/               # TypeScript types
│   └── utils/               # Helper functions
├── providers/               # React context providers
├── store/                   # Zustand stores
└── styles/                  # Global styles
```

## 🛠️ Tech Stack

### Core
- **Framework**: Next.js 14.2+
- **Language**: TypeScript 5+ (Strict Mode)
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui + Radix UI

### State Management
- **Server State**: TanStack Query v5 (React Query)
- **Client State**: Zustand 4.5+
- **Forms**: React Hook Form 7.51+

### Data & Validation
- **Schema Validation**: Zod 3.22+
- **HTTP Client**: Axios 1.6+
- **Date Handling**: date-fns 3.3+

### Authentication & Authorization
- **Auth**: NextAuth.js 4.24+
- **Provider**: Keycloak
- **RBAC**: Custom permission system

### UI & UX
- **Icons**: Lucide React
- **Charts**: Recharts 2.12+
- **Command Palette**: cmdk
- **Notifications**: Sonner
- **Theme**: next-themes 0.3+

### Development Tools
- **Linting**: ESLint 8+
- **Formatting**: Prettier 3.2+
- **Git Hooks**: Husky + lint-staged
- **Testing**: Vitest + Testing Library + Playwright

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- Access to Keycloak instance (for SSO)

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd academy-lms-admin
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# App
NEXT_PUBLIC_APP_URL=https://skill.geniura.com
NEXT_PUBLIC_APP_NAME=SkillEngine

# API
NEXT_PUBLIC_API_URL=https://skill.geniura.com/api/v1

# Auth (Keycloak)
KEYCLOAK_URL=https://auth.geniura.com
KEYCLOAK_REALM=skillengine
KEYCLOAK_CLIENT_ID=skillengine-admin
KEYCLOAK_CLIENT_SECRET=your-secret-here

# NextAuth
NEXTAUTH_URL=https://skill.geniura.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
```

**For Local Development:**
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXTAUTH_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Core Concepts

### Authentication & Authorization

The application uses NextAuth.js with Keycloak for SSO authentication. The permission system is role-based with granular permissions.

#### Roles

- **Super Admin**: Full system access
- **Admin**: Most administrative functions
- **Pedagogic Manager**: Course and session management
- **Content Manager**: Content creation and editing
- **Staff**: Read access with limited write permissions
- **Viewer**: Read-only access

#### Using Permissions

```typescript
import { PermissionGate } from '@/components/shared/permission-gate';
import { Permission } from '@/lib/constants/permissions';

// In a component
<PermissionGate permission={Permission.USERS_CREATE}>
  <CreateUserButton />
</PermissionGate>

// In a hook
import { usePermissions } from '@/features/auth/hooks/use-permissions';

function MyComponent() {
  const { hasPermission } = usePermissions();

  if (hasPermission(Permission.USERS_EDIT)) {
    // Show edit button
  }
}
```

### API Client

The API client is pre-configured with Axios and includes:
- Automatic token injection
- Token refresh on 401
- Tenant ID header injection
- Error handling

```typescript
import { apiClient } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';

// GET request
const { data } = await apiClient.get(endpoints.users.list);

// POST request
const { data } = await apiClient.post(endpoints.users.create, userData);
```

### Type Safety

All entities have comprehensive TypeScript types:

```typescript
import { User, Course, Session } from '@/lib/types';

const user: User = {
  id: '123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  // ... fully typed
};
```

## 🎨 UI Components

### Using shadcn/ui Components

Components can be added via CLI:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
```

### Custom Components

Key custom components:

- **PermissionGate**: Conditional rendering based on permissions
- **ProtectedRoute**: Route protection with authentication
- **DataTable**: Advanced table with sorting, filtering, pagination

## 📊 Data Entities

The system manages the following core entities:

- **Users**: Students, instructors, and admin users
- **Courses**: Online courses with modules and lessons
- **Sessions**: Live class sessions (via Daily.co or BigBlueButton)
- **Instructors**: Instructor profiles with availability
- **Enrollments**: Student course enrollments with progress
- **Notifications**: System notifications
- **Tenants**: Multi-tenant organization support

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Next.js 14 setup
- [x] TypeScript configuration
- [x] Tailwind CSS + shadcn/ui
- [x] Authentication with NextAuth.js
- [x] API client setup
- [x] Type system
- [x] Providers and stores
- [x] Basic app structure

### Phase 2: Core Features ✅ (Completed)
- [x] Main dashboard with KPIs
- [x] Sidebar and header navigation
- [x] Data tables with filters
- [x] User management (list page with API integration)
- [x] Course management (structure ready)
- [x] Session management (structure ready)
- [x] Instructor management (structure ready)
- [x] Settings page
- [x] shadcn/ui components (Button, Card, Table, etc.)
- [x] Shared components (StatusBadge, EmptyState, etc.)
- [x] TanStack Table integration
- [x] TanStack Query setup
- [x] Permission gates

### Phase 3: Advanced Features ✅ (Completed)
- [x] Form dialogs with React Hook Form + Zod
- [x] User create/edit dialog with full validation
- [x] Courses management with DataTable
- [x] Analytics dashboards with Recharts
- [x] Global search with cmdk (⌘K)
- [x] Enrollment trend charts (Line charts)
- [x] Revenue analytics (Bar charts)
- [x] Additional UI components (Dialog, Select, Textarea)

### Phase 4: Ready for Production (Optional)
- [ ] Session scheduling with calendar view
- [ ] Course curriculum builder
- [ ] Reports with export (CSV/Excel/PDF)
- [ ] Real-time notifications with Pusher
- [ ] Real-time notifications
- [ ] Live session integration
- [ ] Global search (⌘K)
- [ ] Bulk actions
- [ ] Content library

### Phase 4: Polish (Planned)
- [ ] Internationalization (i18n)
- [ ] Dark mode refinement
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Testing suite
- [ ] Documentation

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run unit tests with UI
npm run test:ui

# Run E2E tests
npm run test:e2e
```

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 📝 Code Style

This project follows strict code quality standards:

- **TypeScript Strict Mode**: No `any` types allowed
- **ESLint**: Enforced code style
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for linting and formatting

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📄 License

This project is proprietary software for Academy LMS.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Open an issue on GitHub
- Contact the development team

---

**Note**: This is an active development project. The foundation is complete and core features are being implemented. See the Roadmap section for current progress.
