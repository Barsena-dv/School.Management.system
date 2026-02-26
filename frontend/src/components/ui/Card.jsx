import { clsx } from 'clsx'

const Card = ({ children, className, padding = true, ...props }) => (
    <div
        className={clsx(
            'bg-surface rounded-[14px] border border-border',
            'shadow-[0_1px_3px_rgba(0,0,0,0.05),_0_4px_16px_rgba(0,0,0,0.06)]',
            padding && 'p-6',
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
    <h3 className={clsx('text-[0.9375rem] font-semibold text-text-primary', className)} {...props}>
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
        className={clsx('flex items-center gap-2 mt-5 pt-4 border-t border-border', className)}
        {...props}
    >
        {children}
    </div>
)

export default Card
