import { clsx } from 'clsx';

const StatusBadge = ({ status }) => {
    const getStyles = (status) => {
        switch (status) {
            case 'Not Submitted':
                return 'bg-bg-subtle text-text-muted border-border';
            case 'Submitted':
                return 'bg-primary-subtle text-primary border-primary/20';
            case 'Graded':
                return 'bg-success-subtle text-success border-success/20';
            default:
                return 'bg-bg-subtle text-text-muted border-border';
        }
    };

    return (
        <span className={clsx(
            'rounded-md px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap border',
            'font-heading tracking-tight',
            getStyles(status)
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
