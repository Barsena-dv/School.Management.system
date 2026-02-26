import { Outlet } from 'react-router-dom'

/**
 * PublicLayout — centered container for auth pages.
 * Follows the Light-first academic system.
 */
const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[400px]">
                {/* Brand Identity */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-soft mb-3">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-text-primary">
                        EduPortal
                    </span>
                    <p className="text-sm text-text-secondary mt-1">Student Information System</p>
                </div>

                <Outlet />
            </div>
        </div>
    )
}

export default PublicLayout
