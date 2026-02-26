import { clsx } from 'clsx'

const variantClasses = {
    default: 'bg-[#e2e8f0] text-[#475569]',
    success: 'bg-[#dcfce7] text-[#16a34a]',
    warning: 'bg-[#fef9c3] text-[#ca8a04]',
    danger: 'bg-[#fee2e2] text-[#dc2626]',
    info: 'bg-[#dbeafe] text-[#2563eb]',
    navy: 'bg-[#0f1f3d] text-white',
}

const Badge = ({ children, variant = 'default', className, ...props }) => (
    <span
        className={clsx(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            variantClasses[variant],
            className
        )}
        {...props}
    >
        {children}
    </span>
)

export default Badge
