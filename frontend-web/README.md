# CoHabit - Household Management App

A modern web application for managing household tasks, tracking progress, and gamifying chore completion.

## Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner

## Features

- 🏠 **Household Management** - Manage household members and roles
- ✅ **Task Tracking** - Create, assign, and complete tasks
- 🏆 **Leaderboard** - Track XP and compete with household members
- 👤 **Profile Management** - Update display name, username, password
- 🎨 **Dark Theme** - Beautiful mint-accented dark UI
- 📱 **Responsive Design** - Works on mobile, tablet, and desktop

## Getting Started

### Prerequisites

- Node.js 18+
- Java Spring Boot backend running on port 8080

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

## Project Structure

```
frontend-web/
├── src/
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   ├── layout/      # Layout components (Header, Container)
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Page components
│   ├── services/        # API services (auth, api)
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration
│   └── index.css        # Global styles & Tailwind config
├── public/              # Static assets
└── index.html           # HTML entry point
```

## Environment Variables

Create `.env.development` for local development:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

## License

Private - All Rights Reserved
