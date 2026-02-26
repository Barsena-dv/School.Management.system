import { clsx } from 'clsx'

const variantClasses = {
    primary: 'bg-primary text-text-inverse hover:bg-primary-hover border-transparent shadow-sm',
    secondary: 'bg-bg-subtle text-text-primary hover:bg-border border-border',
    danger: 'bg-danger text-text-inverse hover:bg-danger-hover border-transparent shadow-sm',
    outline: 'bg-transparent text-text-primary hover:bg-bg-subtle border-border',
}

const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.25 gap-2',
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
    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(
                'inline-flex items-center justify-center font-semibold rounded-xl border',
                'transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                variantClasses[variant],
                sizeClasses[size],
                className
            )}
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
