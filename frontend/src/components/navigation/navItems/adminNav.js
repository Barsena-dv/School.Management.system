import {
    BookOpen,
    CalendarCheck, CheckSquare, ClipboardList,
    GraduationCap,
    LayoutDashboard, Users
} from 'lucide-react'

const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Students', path: '/admin/students', icon: GraduationCap },
    { label: 'Teachers', path: '/admin/teachers', icon: Users },
    { label: 'Classes', path: '/admin/classes', icon: BookOpen },
    { label: 'Subjects', path: '/admin/subjects', icon: ClipboardList },
    { label: 'Events', path: '/admin/events', icon: CalendarCheck },
    { label: 'Approvals', path: '/admin/approvals', icon: CheckSquare },
]

export default adminNavItems
