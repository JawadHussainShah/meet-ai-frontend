# 🎙️ Meeting AI

A modern, AI-powered meeting assistant built with Next.js 15. Transform your meetings into actionable insights with smart transcription, analysis, and task extraction.

## 🚀 Features

- **🎯 Smart Dashboard** - Overview of meeting insights and analytics
- **📝 Action Items** - Track and manage tasks from meetings
- **📊 Meeting Analytics** - Visualize meeting trends and patterns
- **🔐 Secure Authentication** - Email/password and Google OAuth
- **📱 Responsive Design** - Optimized for desktop, tablet, and mobile
- **🎨 Modern UI** - Built with shadcn/ui and Tailwind CSS
- **⚡ Fast Performance** - Next.js 15 with App Router

## 🏗️ Architecture

\`\`\`
meetingai/
├── 🖥️ Frontend (Next.js 15)
│   ├── app/                    # App Router pages
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and configurations
│   └── public/                 # Static assets
└── 🔧 Backend (FastAPI)
    ├── app/                    # Application code
    ├── alembic/                # Database migrations
    ├── scripts/                # Utility scripts
    └── requirements.txt        # Python dependencies
\`\`\`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Modern icon library
- **React Hook Form** - Performant forms with validation
- **Recharts** - Composable charting library

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Robust relational database
- **SQLAlchemy** - Python ORM
- **JWT** - Secure authentication
- **Google OAuth** - Social login
- **Alembic** - Database migrations

## 🚀 Quick Start (macOS)

### Prerequisites

\`\`\`bash
# Install Node.js (18+ required)
brew install node

# Verify installation
node --version  # Should be 18+
npm --version
\`\`\`

### Installation

\`\`\`bash
# Clone the repository
git clone <your-repo-url>
cd meetingai

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration (see Configuration section)

# Start development server
npm run dev
\`\`\`

Visit `http://localhost:3000` to see your application running! 🎉

## ⚙️ Configuration

Create `.env.local` in the project root:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback/google`
6. Copy the Client ID to your `.env.local`

## 📁 Project Structure

\`\`\`
meetingai/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Auth route group
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/              # Dashboard pages
│   ├── meetings/               # Meeting management
│   ├── action-items/           # Task management
│   ├── upload/                 # File upload
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/                 # Reusable components
│   ├── ui/                     # shadcn/ui components
│   ├── landing/                # Landing page components
│   ├── forms/                  # Form components
│   └── charts/                 # Chart components
├── hooks/                      # Custom React hooks
├── lib/                        # Utilities and configurations
├── public/                     # Static assets
└── styles/                     # Additional styles
\`\`\`

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible components:

- **Forms**: Input, Button, Select, Checkbox, etc.
- **Navigation**: Sidebar, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Dialog, Sheet
- **Data Display**: Table, Card, Badge, Avatar
- **Charts**: Built with Recharts for analytics

## 📱 Available Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript compiler

# Utilities
npm run clean        # Clean build artifacts
\`\`\`

## 🔗 Backend Integration

This frontend connects to a FastAPI backend. Make sure to:

1. **Start the backend server** (see [Backend README](./backend/README.md))
2. **Configure API URL** in `.env.local`
3. **Set up authentication** endpoints

### API Integration Example

\`\`\`typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export async function loginUser(email: string, password: string) {
  const response = await fetch(\`\${API_BASE_URL}/auth/login\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  return response.json()
}
\`\`\`

## 🎯 Key Pages

### 🏠 Landing Page (`/`)
- Hero section with value proposition
- Feature highlights
- How it works explanation
- Pricing plans
- Testimonials and FAQ

### 📊 Dashboard (`/dashboard`)
- Meeting analytics overview
- Recent meetings summary
- Action items status
- Performance metrics

### 📝 Meetings (`/meetings`)
- List all analyzed meetings
- Search and filter functionality
- Meeting details and transcripts
- Export capabilities

### ✅ Action Items (`/action-items`)
- Task management interface
- Priority and status tracking
- Due date management
- Assignment features

### 📤 Upload (`/upload`)
- File upload interface
- Platform integrations (Zoom, Teams, etc.)
- Processing status
- Upload history

## 🎨 Styling Guide

### Tailwind CSS Classes
\`\`\`css
/* Common patterns used in the project */
.container-padding { @apply px-4 sm:px-6 lg:px-8; }
.section-spacing { @apply py-12 sm:py-16 lg:py-20; }
.card-shadow { @apply shadow-sm border border-border; }
\`\`\`

### Color Scheme
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for supporting elements
- **Success**: Green for positive actions
- **Warning**: Yellow for caution
- **Error**: Red for errors

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Development

### Adding New Pages

\`\`\`bash
# Create a new page in the app directory
mkdir app/new-page
touch app/new-page/page.tsx
\`\`\`

### Adding New Components

\`\`\`bash
# Create a new component
touch components/my-component.tsx

# Add shadcn/ui component
npx shadcn@latest add button
\`\`\`

### Environment Variables

All client-side environment variables must be prefixed with `NEXT_PUBLIC_`:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## 🔧 Troubleshooting

### Common Issues

**Port 3000 already in use:**
\`\`\`bash
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
\`\`\`

**Environment variables not loading:**
\`\`\`bash
# Make sure .env.local exists and variables start with NEXT_PUBLIC_
# Restart the development server after changes
\`\`\`

**Build errors:**
\`\`\`bash
# Clear Next.js cache
rm -rf .next
npm run build
\`\`\`

**TypeScript errors:**
\`\`\`bash
# Run type checking
npm run type-check

# Fix common issues
npm run lint:fix
\`\`\`

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Follow the coding standards
4. Test your changes
5. Submit a pull request

### Coding Standards

- Use TypeScript for all new files
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add JSDoc comments for complex functions#   m e e t - a i - f r o n t e n d  
 