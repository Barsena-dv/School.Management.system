import { clsx } from 'clsx'
import Card from './Card'

const StatCard = ({ title, value, description, icon: Icon, children, className }) => {
    return (
        <Card className={clsx('hover:border-primary/20 transition-all duration-200', className)}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="text-xs font-semibold text-text-muted uppercase tracking-widest font-heading">{title}</h3>
                    {value && (
                        <p className="text-2xl font-bold text-text-primary mt-1.5 tracking-tight font-heading">
                            {value}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className="p-2 bg-primary-subtle rounded-lg text-primary shrink-0">
                        <Icon size={18} strokeWidth={2} />
                    </div>
                )}
            </div>
            {description && <p className="text-xs text-text-muted leading-relaxed">{description}</p>}
            {children && <div className="mt-4">{children}</div>}
        </Card>
    )
}

export default StatCard
