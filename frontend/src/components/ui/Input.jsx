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
                    style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        paddingLeft: '2px',
                    }}
                >
                    {label}
                    {required && <span style={{ color: 'var(--danger)', marginLeft: '3px' }}>*</span>}
                </label>
            )}

            <input
                id={inputId}
                required={required}
                className={clsx(className)}
                style={{
                    width: '100%',
                    borderRadius: '8px',
                    border: error ? '1px solid var(--danger)' : '1px solid var(--border)',
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    background: 'var(--surface)',
                    outline: 'none',
                    transition: 'all 200ms ease',
                    fontFamily: "'Inter', system-ui, sans-serif",
                }}
                onFocus={(e) => {
                    if (!error) {
                        e.currentTarget.style.borderColor = 'var(--primary)'
                        e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-subtle), var(--shadow-glow)'
                    } else {
                        e.currentTarget.style.boxShadow = '0 0 0 3px var(--danger-subtle)'
                    }
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? 'var(--danger)' : 'var(--border)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
                {...props}
            />

            {error && (
                <p style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: 'var(--danger)',
                    marginTop: '2px',
                    paddingLeft: '2px',
                }}>{error}</p>
            )}
            {hint && !error && (
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    paddingLeft: '2px',
                }}>{hint}</p>
            )}
        </div>
    )
}

export default Input
