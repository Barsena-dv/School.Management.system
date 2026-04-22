# 🎓 EduPortal: The Next-Gen Academic OS

[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://school-management-system-three-theta.vercel.app/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://school-management-system-j3kf.onrender.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**EduPortal** is a state-of-the-art School Management System designed with a focus on speed, aesthetics, and institutional efficiency. Built on the high-performance MERN stack, it features a professional "Hybrid Tech" design system that balances a deep-space aesthetic with studious legibility.

---

## 🌐 Live Demo

- **Frontend (SPA):** [school-management-system-three-theta.vercel.app](https://school-management-system-three-theta.vercel.app/)
- **Backend (API):** [school-management-system-j3kf.onrender.com](https://school-management-system-j3kf.onrender.com/api/health)

---

## ✨ Key Features

### 🏢 Administrator Portal
- **User Orchestration:** Approve or reject new registrations with a streamlined workflow.
- **Institutional Guardrails:** Manage classes, subjects, and global enrollments.
- **Live Stats:** Real-time visibility into student and teacher populations.

### 🍎 Teacher Dashboard
- **Attendance Engine:** Rapid subject-wise attendance marking with historical tracking.
- **Academic Pipeline:** Create assignments and review submissions with in-system grading.
- **Student Analytics:** Monitor class performance through visual dashboards.

### 🎓 Student Experience
- **Submission Hub:** Advanced assignment tracking with file upload capabilities.
- **Performance Tracking:** Visual marks breakdown with glowing progress indicators.
- **Campus Connectivity:** Stay updated via the Events calendar and personal Notifications.

---

## 🎨 Design Philosophy: "Hybrid Tech"

The UI is engineered for clarity and "wow" factor, featuring:
- **Deep Space Navigation:** A high-contrast `#090A0F` sidebar with glowing indigo active states.
- **Glassmorphism:** Frosted-glass navbars with `20px` background blur for a premium feel.
- **Modern Typography:** `Outfit` for geometric headings and `Inter` for crisp body text.
- **Dynamic Feedback:** Micro-animations, glowing progress bars, and scroll-triggered fade-ins.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Axios, Recharts |
| **Backend** | Node.js, Express 5, JWT Authentication, Multer (File Handling) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+)
- MongoDB (Local or Atlas)

### Local Development

1. **Clone & Install:**
   ```bash
   git clone https://github.com/your-username/EduPortal.git
   cd EduPortal
   npm install  # Install root dev dependencies
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   # Create a .env file with: PORT, MONGO_URI, JWT_SECRET
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with: VITE_API_BASE_URL (points to backend /api)
   npm run dev
   ```

---

## 📦 Deployment Configuration

### Frontend (Vercel)
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Frontend Rewrite:** Includes `vercel.json` for SPA support.

### Backend (Render)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start` (Standardized production entry)

---

## 📜 License
Personal project created with precision. For licensing inquiries, please contact the developer.
