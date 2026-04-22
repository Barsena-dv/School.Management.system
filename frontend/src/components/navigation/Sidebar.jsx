import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

export { default as adminNavItems } from './navItems/adminNav'
export { default as studentNavItems } from './navItems/studentNav'
export { default as teacherNavItems } from './navItems/teacherNav'

const Sidebar = ({ navItems = [], collapsed, onToggle, mobileOpen, onMobileClose }) => {
    const location = useLocation()
    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(path + '/')

    return (
        <>
            {mobileOpen && (
                <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onMobileClose} />
            )}

            <aside
                style={{
                    width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
                    backgroundColor: 'var(--sidebar-bg)',
                    color: 'var(--sidebar-text)',
                    transition: 'width 300ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)',
                    position: 'fixed',
                    top: 0, left: 0, bottom: 0,
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    borderRight: '1px solid var(--sidebar-border)',
                    boxShadow: 'none',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
                className="lg:!transform-none"
            >
                {/* ── Logo / header ──────────────────────────────────────── */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: collapsed ? '1.25rem 0' : '1.25rem 1rem',
                    borderBottom: '1px solid var(--sidebar-border)',
                    minHeight: 'var(--navbar-height)',
                    gap: '0.5rem',
                }}>
                    {!collapsed && (
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{
                                    background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                    boxShadow: '0 0 14px var(--primary-glow)',
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </div>
                            <span style={{
                                fontFamily: "'Outfit', system-ui, sans-serif",
                                fontWeight: 700,
                                fontSize: '1rem',
                                letterSpacing: '-0.02em',
                                color: 'var(--sidebar-text-active)',
                                whiteSpace: 'nowrap',
                            }}>
                                EduPortal
                            </span>
                        </div>
                    )}

                    {collapsed && (
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                boxShadow: '0 0 14px var(--primary-glow)',
                            }}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c3 3 9 3 12 0v-5" />
                            </svg>
                        </div>
                    )}

                    {/* Desktop collapse toggle */}
                    {!collapsed && (
                        <button
                            onClick={onToggle}
                            className="lg:flex hidden"
                            style={{
                                background: 'var(--sidebar-hover)',
                                border: '1px solid var(--sidebar-border)',
                                borderRadius: '6px',
                                padding: '5px',
                                cursor: 'pointer',
                                color: 'var(--sidebar-text)',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 200ms ease',
                            }}
                        >
                            <ChevronLeft size={14} />
                        </button>
                    )}

                    {collapsed && (
                        <button
                            onClick={onToggle}
                            className="lg:flex hidden mt-2"
                            style={{
                                background: 'var(--sidebar-hover)',
                                border: '1px solid var(--sidebar-border)',
                                borderRadius: '6px',
                                padding: '5px',
                                cursor: 'pointer',
                                color: 'var(--sidebar-text)',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 200ms ease',
                            }}
                        >
                            <ChevronRight size={14} />
                        </button>
                    )}

                    {/* Mobile close */}
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden flex"
                        style={{
                            background: 'var(--sidebar-hover)',
                            border: '1px solid var(--sidebar-border)',
                            borderRadius: '6px',
                            padding: '5px',
                            cursor: 'pointer',
                            color: 'var(--sidebar-text)',
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* ── Section label ──────────────────────────────────────── */}
                {!collapsed && (
                    <div style={{
                        padding: '1rem 1.25rem 0.4rem',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: 'var(--sidebar-text)',
                        opacity: 0.5,
                    }}>
                        Navigation
                    </div>
                )}

                {/* ── Nav items ──────────────────────────────────────────── */}
                <nav style={{ flex: 1, padding: '0.5rem 0' }}>
                    {navItems.map(({ label, path, icon: Icon }) => {
                        const active = isActive(path)
                        return (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={onMobileClose}
                                title={collapsed ? label : undefined}
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: collapsed ? '0.625rem 0' : '0.5rem 1rem',
                                    margin: collapsed ? '0.125rem 0' : '0.125rem 0.75rem',
                                    borderRadius: collapsed ? 0 : '8px',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    fontSize: '0.8125rem',
                                    fontWeight: active ? 600 : 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    color: active ? 'var(--sidebar-text-active)' : 'var(--sidebar-text)',
                                    backgroundColor: active ? 'var(--sidebar-hover)' : 'transparent',
                                    transition: 'all 200ms ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'
                                        e.currentTarget.style.color = 'var(--sidebar-text-active)'
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                        e.currentTarget.style.color = 'var(--sidebar-text)'
                                    }
                                }}
                            >
                                {/* Active glow bar */}
                                {active && !collapsed && (
                                    <div style={{
                                        position: 'absolute',
                                        left: 0,
                                        top: '20%',
                                        bottom: '20%',
                                        width: '3px',
                                        background: 'var(--primary)',
                                        borderRadius: '0 4px 4px 0',
                                        boxShadow: '0 0 8px var(--primary-glow)',
                                    }} />
                                )}

                                <Icon size={17} strokeWidth={active ? 2.25 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && <span>{label}</span>}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* ── Bottom status card ─────────────────────────────────── */}
                {!collapsed && (
                    <div style={{
                        margin: '0 0.75rem 1rem',
                        padding: '0.875rem',
                        borderRadius: '10px',
                        background: 'var(--sidebar-hover)',
                        border: '1px solid var(--sidebar-border)',
                    }}>
                        <p style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--sidebar-text)',
                            opacity: 0.6,
                            marginBottom: '0.375rem',
                        }}>System</p>
                        <div className="flex items-center gap-2">
                            <div style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: '#10B981',
                                boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                            }} />
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                color: 'var(--sidebar-text-active)',
                            }}>All systems active</span>
                        </div>
                    </div>
                )}
            </aside>
        </>
    )
}

export default Sidebar
