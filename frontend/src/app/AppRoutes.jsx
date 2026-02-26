import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import AdminLayout from '@/layouts/AdminLayout'
import PublicLayout from '@/layouts/PublicLayout'
import StudentLayout from '@/layouts/StudentLayout'
import TeacherLayout from '@/layouts/TeacherLayout'

import Login from '../pages/auth/LoginPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import StudentDashboard from '../pages/student/StudentDashboard'


// Pages — replace Placeholder with real imports as pages are built
const Placeholder = ({ label }) => (
    <div className="p-8">
        <h2 className="text-xl font-semibold text-text-primary">{label}</h2>
        <p className="text-text-secondary mt-2 font-medium">Coming soon.</p>
    </div>
)

const router = createBrowserRouter([
    // ── Default redirect ──────────────────────────────────────────
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // ── Public / Auth ─────────────────────────────────────────────
    {
        element: <PublicLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Placeholder label="Register" /> },
        ],
    },

    // ── Admin ─────────────────────────────────────────────────────
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard/> },
            { path: 'students', element: <Placeholder label="Students" /> },
            { path: 'teachers', element: <Placeholder label="Teachers" /> },
            { path: 'classes', element: <Placeholder label="Classes" /> },
            { path: 'subjects', element: <Placeholder label="Subjects" /> },
            { path: 'events', element: <Placeholder label="Events" /> },
            { path: 'approvals', element: <Placeholder label="Approvals" /> },
        ],
    },

    // ── Teacher ───────────────────────────────────────────────────
    {
        path: '/teacher',
        element: <TeacherLayout />,
        children: [
            { index: true, element: <TeacherDashboard /> },
            { path: 'subjects', element: <Placeholder label="My Subjects" /> },
            { path: 'attendance', element: <Placeholder label="Attendance" /> },
            { path: 'assignments', element: <Placeholder label="Assignments" /> },
            { path: 'marks', element: <Placeholder label="Marks" /> },
        ],
    },

    // ── Student ───────────────────────────────────────────────────
    {
        path: '/student',
        element: <StudentLayout />,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: 'attendance', element: <Placeholder label="Attendance" /> },
            { path: 'assignments', element: <Placeholder label="Assignments" /> },
            { path: 'marks', element: <Placeholder label="Marks" /> },
            { path: 'events', element: <Placeholder label="Events" /> },
            { path: 'notifications', element: <Placeholder label="Notifications" /> },
        ],
    },

    // ── Catch-all ─────────────────────────────────────────────────
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
])

const AppRoutes = () => <RouterProvider router={router} />

export default AppRoutes
