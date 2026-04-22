import { clsx } from 'clsx'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
}

const Modal = ({
    open,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnBackdrop = true,
    className,
}) => {
    const dialogRef = useRef(null)

    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && open) onClose?.() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [open, onClose])

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                }}
                onClick={closeOnBackdrop ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={dialogRef}
                className={clsx(
                    'relative z-10 w-full bg-surface rounded-lg border border-border',
                    'shadow-xl flex flex-col max-h-[90vh]',
                    sizeClasses[size],
                    className
                )}
                style={{
                    animation: 'modalIn 200ms ease-out forwards',
                }}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                        <h2
                            id="modal-title"
                            className="text-base font-bold text-text-primary font-heading tracking-tight"
                        >
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-subtle transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Scrollable body */}
                <div className="overflow-y-auto px-5 py-4 flex-1">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border shrink-0">
                        {footer}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.97) translateY(8px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    )
}

export default Modal
