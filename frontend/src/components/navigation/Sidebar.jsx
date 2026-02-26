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
                <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onMobileClose} />
            )}

            <aside
                style={{
                    width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text-primary)',
                    transition: 'width 250ms ease, transform 250ms ease',
                    position: 'fixed',
                    top: 0, left: 0, bottom: 0,
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    borderRight: '1px solid var(--border)',
                    boxShadow: 'none',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
                className="lg:!transform-none"
            >
                {/* Logo / header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between',
                    padding: collapsed ? '1.25rem 0' : '1.25rem 1rem',
                    borderBottom: '1px solid var(--border)',
                    minHeight: 'var(--navbar-height)',
                    gap: '0.5rem',
                }}>
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0 shadow-sm">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.01em', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                                EduPortal
                            </span>
                        </div>
                    )}

                    {/* Desktop collapse toggle */}
                    <button
                        onClick={onToggle}
                        className="lg:flex hidden"
                        style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '5px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                    </button>

                    {/* Mobile close */}
                    <button
                        onClick={onMobileClose}
                        className="lg:hidden flex"
                        style={{
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '5px',
                            // margin: '5px',
                            cursor: 'pointer',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Nav items */}
                <nav style={{ flex: 1, padding: '1rem 0' }}>
                    {navItems.map(({ label, path, icon: Icon }) => {
                        const active = isActive(path)
                        return (
                            <NavLink
                                key={path}
                                to={path}
                                onClick={onMobileClose}
                                title={collapsed ? label : undefined}
                                className={({ isActive }) => `
                   flex items-center gap-3 relative transition-all duration-200
                   ${collapsed ? 'justify-center py-2.5' : 'py-2 px-4 mx-3 rounded-lg'}
                   ${active
                                        ? 'bg-primary-subtle text-primary font-semibold'
                                        : 'text-text-secondary hover:bg-bg hover:text-text-primary'}
                `}
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                })}
                            >
                                {/* Active indicator bar */}
                                {active && !collapsed && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" />
                                )}

                                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} style={{ flexShrink: 0 }} />
                                {!collapsed && <span>{label}</span>}
                            </NavLink>
                        )
                    })}
                </nav>

                {/* Potential upgrade / info section if not collapsed */}
                {!collapsed && (
                    <div className="p-4 mx-3 mb-4 rounded-xl bg-bg border border-border">
                        <p className="text-[0.7rem] font-bold text-text-muted uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-xs font-medium text-text-primary">All systems active</span>
                        </div>
                    </div>
                )}
            </aside>
        </>
    )
}

export default Sidebar
