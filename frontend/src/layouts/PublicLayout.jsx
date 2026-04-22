import { Outlet } from 'react-router-dom'

/**
 * PublicLayout — centered container for auth pages.
 * Hybrid Tech & Studious aesthetic with gradient background.
 */
const PublicLayout = () => {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #090A0F 0%, #0F1118 40%, #161830 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative grid */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(79, 70, 229, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(79, 70, 229, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                pointerEvents: 'none',
            }} />

            {/* Decorative glow orbs */}
            <div style={{
                position: 'absolute',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
                top: '-100px',
                right: '-100px',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
                bottom: '-80px',
                left: '-80px',
                pointerEvents: 'none',
            }} />

            <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
                {/* Brand Identity */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '2.5rem',
                }}>
                    <div
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.875rem',
                            boxShadow: '0 0 20px var(--primary-glow), 0 4px 12px rgba(0,0,0,0.3)',
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <span style={{
                        fontFamily: "'Outfit', system-ui, sans-serif",
                        fontSize: '1.375rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#FFFFFF',
                    }}>
                        EduPortal
                    </span>
                    <p style={{
                        fontSize: '0.8125rem',
                        color: '#9CA3AF',
                        marginTop: '0.375rem',
                        fontWeight: 500,
                    }}>Student Information System</p>
                </div>

                <Outlet />
            </div>
        </div>
    )
}

export default PublicLayout
