import {
    BarChart2,
    BookOpen, CalendarCheck, FileText,
    LayoutDashboard
} from 'lucide-react'

const teacherNavItems = [
    { label: 'Dashboard', path: '/teacher', icon: LayoutDashboard },
    { label: 'Subjects', path: '/teacher/subjects', icon: BookOpen },
    { label: 'Attendance', path: '/teacher/attendance', icon: CalendarCheck },
    { label: 'Assignments', path: '/teacher/assignments', icon: FileText },
    { label: 'Marks', path: '/teacher/marks', icon: BarChart2 },
]

export default teacherNavItems
