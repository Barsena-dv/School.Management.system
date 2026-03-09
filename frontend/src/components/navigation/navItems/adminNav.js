import {
    BookOpen,
    CalendarCheck, CheckSquare, ClipboardList,
    GraduationCap,
    LayoutDashboard,
    Link2,
    UserCog,
    Users
} from 'lucide-react'

const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Users', path: '/admin/users', icon: UserCog },
    { label: 'Students', path: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', path: '/admin/teachers', icon: Users },
    { label: 'Classes', path: '/admin/classes', icon: BookOpen },
    { label: 'Subjects', path: '/admin/subjects', icon: ClipboardList },
    { label: 'Enrollments', path: '/admin/enrollments', icon: Link2 },
    { label: 'Events', path: '/admin/events', icon: CalendarCheck },
    { label: 'Approvals', path: '/admin/approvals', icon: CheckSquare },
]

export default adminNavItems
