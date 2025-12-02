# CoHabit Web Frontend

A modern React web application for household task management.

## Features

- 🔐 **Authentication** - Secure login and signup
- 🏠 **Household Management** - Create or join households
- ✅ **Task Management** - Create and complete tasks
- 📋 **Task List** - View all tasks with name, description, and complete button
- 👤 **Profile** - Update display name, username, and password

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

## Prerequisites

- Node.js 18+
- Backend API running on `http://localhost:8080`

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens at: **http://localhost:3000**

## Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Environment Variables

Create `.env.development` for local development:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For production, create `.env.production`:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input, etc.)
│   ├── layout/          # Layout components (Header, Container, ProtectedRoute)
│   └── features/        # Feature-specific components (UserCard, StatusBadge)
├── pages/               # Page components
│   ├── HomePage.jsx     # Landing page with API health check
│   ├── LoginPage.jsx    # Login/signup page
│   ├── TasksPage.jsx    # Task list and management
│   ├── HouseholdPage.jsx   # Household management
│   └── ProfilePage.jsx  # User profile settings
├── services/
│   ├── api.js           # Axios instance and API services
│   └── auth.js          # Authentication service
├── utils/               # Utility functions
├── config/              # Configuration
├── App.jsx              # Root component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles and Tailwind config
```

## Available Pages

### Public Routes
- `/login` - Login and signup

### Protected Routes (require authentication)
- `/` - Home page
- `/tasks` - Task list and management
- `/household` - Household management
- `/profile` - User profile settings

## API Integration

The app communicates with the backend API via Axios. All API calls are centralized in `src/services/api.js`.

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Token automatically included in all subsequent API requests
5. If token expires or is invalid, user redirected to login

### API Services

**Auth Service** (`src/services/auth.js`):
- `login(email, password)` - User login
- `register(userData)` - User registration
- `logout()` - User logout
- `isAuthenticated()` - Check if user is logged in

**API Service** (`src/services/api.js`):
- `healthCheck()` - Check API status
- `userService.getAllUsers()` - Get all users

## Styling with Tailwind CSS v4

This project uses Tailwind CSS v4 with a custom dark theme:

### Theme Colors
- **Background**: `#0F1419` (dark)
- **Secondary Background**: `#1A1F28` (cards)
- **Foreground**: `#FFFFFF` (text)
- **Accent**: `#7FE7CC` (mint green)
- **Border**: `#7FE7CC` (mint green)

### Using Tailwind Classes

```jsx
<div className="bg-background text-foreground p-4 rounded-lg border-2 border-mint">
  <h1 className="text-2xl font-bold text-mint">Hello World</h1>
</div>
```

### Custom Theme Configuration

Theme is defined in `src/index.css` using the `@theme` directive (Tailwind v4 syntax):

```css
@theme {
  --color-background: #0f1419;
  --color-mint: #7fe7cc;
  /* ... */
}
```

## Components

### UI Components (shadcn/ui)

Located in `src/components/ui/`:
- `Button` - Buttons with variants (default, outline, ghost)
- `Card` - Container cards
- `Input` - Form inputs
- `Label` - Form labels
- `Badge` - Status badges
- `Spinner` - Loading spinner
- `Separator` - Divider lines

### Layout Components

- `Header` - Top navigation bar (desktop) with menu
- `BottomNav` - Bottom navigation bar (mobile)
- `Container` - Page container with max-width and padding
- `ProtectedRoute` - Route wrapper requiring authentication

## Responsive Design

The app is mobile-first and responsive:

- **Mobile** (< 768px): Bottom navigation, single column layout
- **Tablet** (768px - 1024px): Top navigation, 2 column grid
- **Desktop** (> 1024px): Top navigation, 3 column grid

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant hot module replacement. Changes to components will update without page refresh.

### Path Aliases

The project uses `@` as an alias for the `src` directory:

```jsx
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth"
```

### Toast Notifications

Use Sonner for user notifications:

```jsx
import { toast } from "sonner"

toast.success("Task completed!")
toast.error("Failed to save")
```

## Troubleshooting

### Can't connect to backend

**Error**: Network error when calling API

**Solutions**:
1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check `VITE_API_BASE_URL` in `.env.development`
3. Ensure no CORS errors in browser console

### Authentication issues

**Error**: Constant redirects to login page

**Solutions**:
1. Check if token exists: Open DevTools → Application → Local Storage → `authToken`
2. Token may be expired (24h expiry) - login again
3. Clear localStorage and try again

### Styling not working

**Error**: Tailwind classes not applying

**Solutions**:
1. Restart dev server: `npm run dev`
2. Check `index.css` imports Tailwind correctly
3. Verify class names match Tailwind v4 syntax

### Build errors

**Error**: Build fails with module errors

**Solutions**:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private - All Rights Reserved
