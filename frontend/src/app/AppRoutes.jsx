import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'

import AdminLayout from '@/layouts/AdminLayout'
import PublicLayout from '@/layouts/PublicLayout'
import StudentLayout from '@/layouts/StudentLayout'
import TeacherLayout from '@/layouts/TeacherLayout'

import AdminApprovals from '../pages/admin/AdminApprovals'
import AdminClasses from '../pages/admin/AdminClasses'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminEnrollments from '../pages/admin/AdminEnrollments'
import AdminEvents from '../pages/admin/AdminEvents'
import AdminSubjects from '../pages/admin/AdminSubjects'
import AdminUsers from '../pages/admin/AdminUsers'
import Login from '../pages/auth/LoginPage'
import Register from '../pages/auth/RegisterPage'
import StudentAssignments from '../pages/student/StudentAssignments'
import StudentAttendance from '../pages/student/StudentAttendance'
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentEvents from '../pages/student/StudentEvents'
import StudentMarks from '../pages/student/StudentMarks'
import StudentNotifications from '../pages/student/StudentNotifications'
import StudentAnalytics from '../pages/student/StudentAnalytics'
import TeacherAssignments from '../pages/teacher/TeacherAssignments'
import TeacherAttendance from '../pages/teacher/TeacherAttendance'
import TeacherAttendanceOverview from '../pages/teacher/TeacherAttendanceOverview'
import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import TeacherMarksOverview from '../pages/teacher/TeacherMarksOverview'
import TeacherSubjectDashboard from '../pages/teacher/TeacherSubjectDashboard'
import TeacherSubjectStudents from '../pages/teacher/TeacherSubjectStudents'
import TeacherSubjects from '../pages/teacher/TeacherSubjects'
import TeacherSubmissions from '../pages/teacher/TeacherSubmissions'


// Pages — replace Placeholder with real imports as pages are built
const Placeholder = ({ label }) => (
    <div className="p-8">
        <h2 className="text-xl font-semibold text-text-primary">{label}</h2>
        <p className="text-text-secondary mt-2 font-medium">Coming soon.</p>
    </div>
)

const router = createBrowserRouter([
    // ── Landing page ─────────────────────────────────────────────
    {
        path: '/',
        element: <LandingPage />,
    },

    // ── Public / Auth ─────────────────────────────────────────────
    {
        element: <PublicLayout />,
        children: [
            { path: '/login', element: <Login /> },
            { path: '/register', element: <Register /> },
        ],
    },

    // ── Admin ─────────────────────────────────────────────────────
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: 'users', element: <AdminUsers /> },
            { path: 'students', element: <AdminUsers defaultRole="student" /> },
            { path: 'teachers', element: <AdminUsers defaultRole="teacher" /> },
            { path: 'classes', element: <AdminClasses /> },
            { path: 'subjects', element: <AdminSubjects /> },
            { path: 'enrollments', element: <AdminEnrollments /> },
            { path: 'events', element: <AdminEvents /> },
            { path: 'approvals', element: <AdminApprovals /> },
        ],
    },

    // ── Teacher ───────────────────────────────────────────────────
    {
        path: '/teacher',
        element: <TeacherLayout />,
        children: [
            { index: true, element: <TeacherDashboard /> },
            { path: 'subjects', element: <TeacherSubjects /> },
            { path: 'subjects/:subjectId', element: <TeacherSubjectDashboard /> },
            { path: 'subjects/:subjectId/students', element: <TeacherSubjectStudents /> },
            { path: 'attendance', element: <TeacherAttendanceOverview /> },
            { path: 'subjects/:subjectId/attendance', element: <TeacherAttendance /> },
            { path: 'assignments', element: <TeacherAssignments /> },
            { path: 'assignments/:assignmentId/submissions', element: <TeacherSubmissions /> },
            { path: 'marks', element: <TeacherMarksOverview /> },
        ],
    },

    // ── Student ───────────────────────────────────────────────────
    {
        path: '/student',
        element: <StudentLayout />,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: 'analytics', element: <StudentAnalytics /> },
            { path: 'attendance', element: <StudentAttendance /> },
            { path: 'assignments', element: <StudentAssignments /> },
            { path: 'marks', element: <StudentMarks /> },
            { path: 'events', element: <StudentEvents /> },
            { path: 'notifications', element: <StudentNotifications /> },
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
