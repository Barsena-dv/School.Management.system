const SectionHeader = ({ title, description, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
            <div>
                <h2 className="text-base font-bold text-text-primary tracking-tight font-heading">{title}</h2>
                {description && <p className="text-sm text-text-muted mt-0.5">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    )
}

export default SectionHeader
