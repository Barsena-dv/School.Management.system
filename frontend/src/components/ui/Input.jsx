import { clsx } from 'clsx'

const Input = ({
    label,
    id,
    error,
    hint,
    className,
    required,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-[0.8125rem] font-semibold text-text-primary/90 ml-0.5"
                >
                    {label}
                    {required && <span className="text-danger ml-0.5">*</span>}
                </label>
            )}

            <input
                id={inputId}
                required={required}
                className={clsx(
                    'w-full rounded-xl border px-3.5 py-2.5 text-sm text-text-primary',
                    'bg-surface placeholder:text-text-muted/60',
                    'outline-none transition-all duration-200',
                    error
                        ? 'border-danger focus:ring-2 focus:ring-danger/10'
                        : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/5',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle',
                    className
                )}
                {...props}
            />

            {error && (
                <p className="text-xs font-medium text-danger mt-0.5 ml-0.5">{error}</p>
            )}
            {hint && !error && (
                <p className="text-xs text-text-muted mt-0.5 ml-0.5">{hint}</p>
            )}
        </div>
    )
}

export default Input
