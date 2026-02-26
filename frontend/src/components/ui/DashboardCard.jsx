import { clsx } from 'clsx'

const DashboardCard = ({
    title,
    subtitle,
    value,
    icon: Icon,
    children,
    className,
    padding = true
}) => {
    return (
        <div className={clsx(
            'bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden',
            'hover:shadow-md transition-all duration-300',
            className
        )}>
            {(title || subtitle || Icon) && (
                <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                    <div>
                        {title && <h3 className="text-sm font-semibold text-neutral-600 uppercase tracking-wider">{title}</h3>}
                        {value && <div className="text-3xl font-bold text-neutral-900 mt-1">{value}</div>}
                        {subtitle && <p className="text-xs text-neutral-500 mt-1 font-medium">{subtitle}</p>}
                    </div>
                    {Icon && (
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100 text-neutral-600 shadow-sm">
                            <Icon size={20} />
                        </div>
                    )}
                </div>
            )}
            <div className={clsx(padding && 'p-6 Pt-0')}>
                {children}
            </div>
        </div>
    )
}

export default DashboardCard
