import { FileQuestion } from 'lucide-react'

const EmptyState = ({
    title = "No data available",
    description = "There is nothing to show here yet.",
    icon: Icon = FileQuestion
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 rounded-lg border border-dashed border-border">
            <div
                className="p-3 rounded-lg mb-4"
                style={{
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                }}
            >
                <Icon size={22} strokeWidth={1.75} />
            </div>
            <h3 className="text-sm font-semibold text-text-primary font-heading">{title}</h3>
            <p className="text-xs text-text-muted mt-1.5 text-center max-w-[240px] leading-relaxed">{description}</p>
        </div>
    )
}

export default EmptyState
