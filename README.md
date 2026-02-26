# EduPortal - Student Dashboard

A modern, academic-themed student information system built with a React frontend and an Express backend.

## Architecture

This project follows a monorepo-style structure:

- **Frontend**: Located in the `/frontend` directory. Built with React, Vite, and Tailwind CSS (v4). It uses an Apple-inspired academic design with a light-first theme.
- **Backend**: Located in the `/backend` directory. Built with Express and Node.js. Handles authentication, user management, and dashboard data.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository.
2. Install root dependencies (if any):
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

To run the project in development mode:

#### Start the Backend
```bash
cd backend
npm run dev
```

#### Start the Frontend
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Design System

The UI uses a custom design system defined in `frontend/src/theme/tokens.css` and integrated via Tailwind CSS v4 in `frontend/src/index.css`.

- **Primary Color**: Academic Blue (`#1D3461`)
- **Accent Color**: Muted Teal (`#1B7A78`)
- **Background**: Warm Off-white (`#F7F7F5`)

## Features

- **Dashboard**: Role-based views for Admin, Student, and Teacher.
- **Authentication**: Secure login and registration flow.
- **Grid Layouts**: Responsive cards for metrics and notifications.
- **Sidebar**: Modern light-surface navigation with collapsed states.

## License

Personal project by [User Name].
