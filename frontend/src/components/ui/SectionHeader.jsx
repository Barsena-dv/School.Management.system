const SectionHeader = ({ title, description, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">{title}</h2>
                {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
    )
}

export default SectionHeader
