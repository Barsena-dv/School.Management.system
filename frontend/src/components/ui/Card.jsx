import { clsx } from 'clsx'

const Card = ({ children, className, padding = true, ...props }) => (
    <div
        className={clsx(
            'bg-surface rounded-lg border border-border shadow-soft',
            'hover:shadow-md transition-all duration-200',
            padding && 'p-5',
            className
        )}
        {...props}
    >
        {children}
    </div>
)

Card.Header = ({ children, className, ...props }) => (
    <div className={clsx('flex items-center justify-between mb-4', className)} {...props}>
        {children}
    </div>
)

Card.Title = ({ children, className, ...props }) => (
    <h3 className={clsx('text-sm font-bold text-text-primary font-heading tracking-tight', className)} {...props}>
        {children}
    </h3>
)

Card.Body = ({ children, className, ...props }) => (
    <div className={clsx('', className)} {...props}>
        {children}
    </div>
)

Card.Footer = ({ children, className, ...props }) => (
    <div
        className={clsx('flex items-center gap-2 mt-4 pt-4 border-t border-border', className)}
        {...props}
    >
        {children}
    </div>
)

export default Card
