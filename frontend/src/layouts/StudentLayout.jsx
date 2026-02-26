import Navbar from '@/components/navigation/Navbar'
import studentNavItems from '@/components/navigation/navItems/studentNav'
import Sidebar from '@/components/navigation/Sidebar'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

const PAGE_TITLES = {
    '/student': 'Dashboard',
    '/student/attendance': 'Attendance',
    '/student/assignments': 'Assignments',
    '/student/marks': 'Marks',
    '/student/events': 'Events',
    '/student/notifications': 'Notifications',
}

const StudentLayout = () => {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
    const location = useLocation()

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024
            setIsMobile(mobile)
            if (!mobile) setMobileOpen(false)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => { setMobileOpen(false) }, [location.pathname])

    const handleSidebarToggle = () => {
        if (isMobile) setMobileOpen((o) => !o)
        else setCollapsed((c) => !c)
    }

    const sidebarWidth = isMobile ? 0 : collapsed ? 64 : 240
    const title = PAGE_TITLES[location.pathname] ?? 'Student Portal'
    const user = JSON.parse(localStorage.getItem('user') || 'null')

    return (
        <div className="flex min-h-screen bg-bg">
            <Sidebar
                navItems={studentNavItems}
                collapsed={collapsed}
                onToggle={handleSidebarToggle}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div
                className="flex flex-1 flex-col min-w-0 transition-[margin-left] duration-250 ease-in-out"
                style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
            >
                <Navbar
                    onSidebarToggle={handleSidebarToggle}
                    title={title}
                    user={user}
                />
                <main className="flex-1 overflow-y-auto px-8 py-8 bg-bg">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default StudentLayout
