import { FileQuestion } from 'lucide-react'

const EmptyState = ({
    title = "No data available",
    description = "There is nothing to show here yet.",
    icon: Icon = FileQuestion
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
            <div className="p-3 bg-white rounded-full shadow-sm border border-neutral-100 mb-4 text-neutral-400">
                <Icon size={24} />
            </div>
            <h3 className="text-sm font-medium text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500 mt-1 text-center max-w-[200px]">{description}</p>
        </div>
    )
}

export default EmptyState
