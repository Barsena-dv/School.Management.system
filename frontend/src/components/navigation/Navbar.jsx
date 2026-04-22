import { Bell, LogOut, Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ onSidebarToggle, title = 'Dashboard', user, unreadCount = 0 }) => {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/')
    }

    return (
        <header
            className="sticky top-0 z-20"
            style={{
                height: 'var(--navbar-height)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1.5rem',
                gap: '1rem',
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                borderBottom: '1px solid var(--border)',
            }}
        >

            {/* Left: toggle + breadcrumb */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onSidebarToggle}
                    style={{
                        padding: '7px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 200ms ease',
                    }}
                    aria-label="Toggle sidebar"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)'
                        e.currentTarget.style.color = 'var(--primary)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                >
                    <Menu size={18} />
                </button>

                {/* Search bar */}
                <div
                    className="hidden md:flex items-center gap-2"
                    style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--text-muted)',
                        fontSize: '0.8125rem',
                        minWidth: '200px',
                        cursor: 'text',
                        transition: 'all 200ms ease',
                    }}
                >
                    <Search size={14} />
                    <span>Search…</span>
                    <span
                        style={{
                            marginLeft: 'auto',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            fontSize: '0.625rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            background: 'var(--surface)',
                        }}
                    >⌘K</span>
                </div>
            </div>

            {/* Right: bell + divider + user + logout */}
            <div className="flex items-center gap-1">

                {/* Bell */}
                <button
                    onClick={() => navigate('notifications')}
                    style={{
                        position: 'relative',
                        padding: '7px',
                        borderRadius: '8px',
                        border: '1px solid transparent',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 200ms ease',
                    }}
                    aria-label="Notifications"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-subtle)'
                        e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                >
                    <Bell size={18} />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            minWidth: '15px',
                            height: '15px',
                            background: 'var(--danger)',
                            color: 'white',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            borderRadius: '9999px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 3px',
                            boxShadow: '0 0 6px rgba(239, 68, 68, 0.4)',
                        }}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Divider */}
                <div style={{
                    width: '1px',
                    height: '20px',
                    background: 'var(--border)',
                    margin: '0 0.375rem',
                }} />

                {/* User */}
                {user && (
                    <div className="flex items-center gap-2.5 px-1">
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: "'Outfit', sans-serif",
                            flexShrink: 0,
                            boxShadow: '0 0 8px var(--primary-glow)',
                        }}>
                            {user.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <div className="hidden sm:block" style={{ lineHeight: 1.3 }}>
                            <p style={{
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                fontFamily: "'Outfit', sans-serif",
                            }}>{user.name}</p>
                            <p style={{
                                fontSize: '0.6875rem',
                                color: 'var(--text-muted)',
                                textTransform: 'capitalize',
                            }}>{user.role}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '7px',
                        borderRadius: '8px',
                        border: '1px solid transparent',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '0.25rem',
                        transition: 'all 200ms ease',
                    }}
                    aria-label="Logout"
                    title="Logout"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--danger-subtle)'
                        e.currentTarget.style.color = 'var(--danger)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                        e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                >
                    <LogOut size={17} />
                </button>
            </div>
        </header>
    )
}

export default Navbar
