import { clsx } from 'clsx'

const variantStyles = {
    primary: {
        background: 'var(--primary)',
        color: 'var(--text-inverse)',
        border: '1px solid transparent',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    primaryHover: {
        background: 'var(--primary-hover)',
        boxShadow: 'var(--shadow-glow)',
    },
    secondary: {
        background: 'var(--bg-subtle)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        boxShadow: 'none',
    },
    secondaryHover: {
        background: 'var(--border)',
        borderColor: 'var(--border-strong)',
    },
    danger: {
        background: 'var(--danger)',
        color: 'var(--text-inverse)',
        border: '1px solid transparent',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    dangerHover: {
        background: 'var(--danger-hover)',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.35)',
    },
    outline: {
        background: 'transparent',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        boxShadow: 'none',
    },
    outlineHover: {
        background: 'var(--bg-subtle)',
        borderColor: 'var(--border-strong)',
    },
}

const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
}

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    disabled,
    loading,
    type = 'button',
    onClick,
    ...props
}) => {
    const baseStyle = variantStyles[variant] || variantStyles.primary
    const hoverStyle = variantStyles[`${variant}Hover`] || {}

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(
                'inline-flex items-center justify-center font-semibold rounded-lg',
                'transition-all duration-200 cursor-pointer select-none',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'active:scale-[0.97]',
                sizeClasses[size],
                className
            )}
            style={{
                ...baseStyle,
                fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
                if (!disabled && !loading) {
                    Object.assign(e.currentTarget.style, hoverStyle)
                    e.currentTarget.style.transform = 'translateY(-1px)'
                }
            }}
            onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, baseStyle)
                e.currentTarget.style.transform = 'translateY(0)'
            }}
            {...props}
        >
            {loading && (
                <svg
                    className="animate-spin h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
            )}
            {children}
        </button>
    )
}

export default Button
