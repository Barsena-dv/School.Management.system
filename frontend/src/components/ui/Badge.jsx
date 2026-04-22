import { clsx } from 'clsx'

const variantClasses = {
    default: 'bg-bg-subtle text-text-secondary border-border',
    success: 'bg-success-subtle text-success border-success/20',
    warning: 'bg-warning-subtle text-warning border-warning/20',
    danger: 'bg-danger-subtle text-danger border-danger/20',
    info: 'bg-primary-subtle text-primary border-primary/20',
    navy: 'bg-sidebar-bg text-white border-sidebar-border',
}

const Badge = ({ children, variant = 'default', className, ...props }) => (
    <span
        className={clsx(
            'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border',
            'font-heading tracking-tight',
            variantClasses[variant],
            className
        )}
        {...props}
    >
        {children}
    </span>
)

export default Badge
