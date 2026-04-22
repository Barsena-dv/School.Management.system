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
            'bg-surface rounded-lg border border-border overflow-hidden',
            'hover:border-border-strong hover:shadow-md transition-all duration-300',
            className
        )}>
            {(title || subtitle || Icon) && (
                <div className="px-5 pt-5 pb-2 flex items-start justify-between">
                    <div>
                        {title && (
                            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest font-heading">
                                {title}
                            </h3>
                        )}
                        {value && (
                            <div className="text-3xl font-bold text-text-primary mt-1.5 tracking-tight font-heading">
                                {value}
                            </div>
                        )}
                        {subtitle && (
                            <p className="text-xs text-text-muted mt-1 font-medium">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {Icon && (
                        <div className="p-2 bg-primary-subtle rounded-lg text-primary">
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}
                </div>
            )}
            <div className={clsx(padding && 'p-5 pt-0')}>
                {children}
            </div>
        </div>
    )
}

export default DashboardCard
