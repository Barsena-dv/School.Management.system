import { Bell, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onSidebarToggle, title = 'Dashboard', user, unreadCount = 0 }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between h-[var(--navbar-height)] px-6 gap-4 bg-white/70 backdrop-blur-md border-b border-border">

            {/* Left: toggle + page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onSidebarToggle}
                    className="p-1.5 rounded-md text-text-primary hover:bg-bg-subtle transition-colors duration-120 focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label="Toggle sidebar"
                >
                    <Menu size={20} />
                </button>
                {/* <h1 className="text-[1rem] font-semibold text-text-primary whitespace-nowrap">
                    {title}
                </h1> */}
            </div>

            {/* Right: bell + divider + user + logout */}
            <div className="flex items-center gap-1">

                {/* Bell */}
                <button
                    onClick={() => navigate('notifications')}
                    className="relative p-1.5 rounded-md text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-colors duration-120"
                    aria-label="Notifications"
                >
                    <Bell size={19} />
                    {unreadCount > 0 && (
                        <span className="absolute top-[3px] right-[3px] min-w-[15px] h-[15px] bg-danger text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center px-[3px]">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div className="w-px h-5 bg-border mx-1" />

                {/* User */}
                {user && (
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {user.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div className="hidden sm:block leading-tight">
                            <p className="text-[0.8125rem] font-semibold text-text-primary">{user.name}</p>
                            <p className="text-[0.7rem] text-text-muted capitalize">{user.role}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-md text-text-secondary hover:bg-bg-subtle hover:text-danger transition-colors duration-120 ml-1"
                    aria-label="Logout"
                    title="Logout"
                >
                    <LogOut size={17} />
                </button>
            </div>
        </header>
    )
}

export default Navbar
