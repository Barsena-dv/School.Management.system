import {
    BarChart2,
    Bell,
    CalendarCheck,
    CalendarDays,
    FileText,
    LayoutDashboard
} from 'lucide-react'

const studentNavItems = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Attendance', path: '/student/attendance', icon: CalendarCheck },
    { label: 'Assignments', path: '/student/assignments', icon: FileText },
    { label: 'Marks', path: '/student/marks', icon: BarChart2 },
    { label: 'Events', path: '/student/events', icon: CalendarDays },
    { label: 'Notifications', path: '/student/notifications', icon: Bell },
]

export default studentNavItems
