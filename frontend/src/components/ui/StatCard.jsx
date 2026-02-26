import { clsx } from 'clsx'
import Card from './Card'

const StatCard = ({ title, value, description, icon: Icon, children, className }) => {
    return (
        <Card className={clsx('hover:shadow-md transition-shadow duration-200', className)}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
                    {value && <p className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{value}</p>}
                </div>
                {Icon && (
                    <div className="p-2.5 bg-primary-subtle rounded-xl text-primary shrink-0 shadow-sm">
                        <Icon size={20} strokeWidth={2.25} />
                    </div>
                )}
            </div>
            {description && <p className="text-xs text-text-muted leading-relaxed">{description}</p>}
            {children && <div className="mt-4">{children}</div>}
        </Card>
    )
}

export default StatCard
