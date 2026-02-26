import toast from 'react-hot-toast'

// Shared base style — matches project theme
const baseStyle = {
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'Inter, system-ui, sans-serif',
    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
    padding: '0.65rem 1rem',
    maxWidth: '360px',
}

export const showSuccess = (message) =>
    toast.success(message, {
        style: {
            ...baseStyle,
            background: '#f0fdf4',
            color: '#15803d',
            border: '1px solid #bbf7d0',
        },
        iconTheme: { primary: '#16a34a', secondary: '#f0fdf4' },
        duration: 3500,
    })

export const showError = (message) =>
    toast.error(message, {
        style: {
            ...baseStyle,
            background: '#fef2f2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
        },
        iconTheme: { primary: '#dc2626', secondary: '#fef2f2' },
        duration: 5000,
    })

export const showLoading = (message = 'Loading...') =>
    toast.loading(message, {
        style: {
            ...baseStyle,
            background: '#ffffff',
            color: '#0f1f3d',
            border: '1px solid #e2e8f0',
        },
    })

// Dismiss a specific or all toasts (e.g. dismiss a loading toast by id)
export const dismissToast = (id) => toast.dismiss(id)
