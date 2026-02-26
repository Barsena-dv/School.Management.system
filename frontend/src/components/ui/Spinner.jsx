import { clsx } from 'clsx'

const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-9 w-9 border-[3px]',
    xl: 'h-12 w-12 border-4',
}

const Spinner = ({ size = 'md', className }) => (
    <span
        role="status"
        aria-label="Loading"
        className={clsx(
            'inline-block rounded-full border-[#e2e8f0] border-t-[#0f1f3d] animate-spin',
            sizeMap[size],
            className
        )}
    />
)

// Full-page centered loading state
Spinner.Page = ({ message = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-[#475569]">{message}</p>
    </div>
)

// Inline loading inside a container
Spinner.Inline = ({ message }) => (
    <div className="flex items-center gap-2">
        <Spinner size="sm" />
        {message && <span className="text-sm text-[#475569]">{message}</span>}
    </div>
)

export default Spinner
