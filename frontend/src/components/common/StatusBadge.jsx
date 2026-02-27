import { clsx } from 'clsx';

const StatusBadge = ({ status }) => {
    const getStyles = (status) => {
        switch (status) {
            case 'Not Submitted':
                return 'bg-gray-100 text-gray-700';
            case 'Submitted':
                return 'bg-blue-100 text-blue-700';
            case 'Graded':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <span className={clsx(
            'rounded-full px-3 py-1 text-sm font-medium whitespace-nowrap',
            getStyles(status)
        )}>
            {status}
        </span>
    );
};

export default StatusBadge;
