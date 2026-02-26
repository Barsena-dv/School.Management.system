import { Toaster } from 'react-hot-toast'
import AppRoutes from './app/AppRoutes'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 72 }} // below the 64px sticky navbar
        toastOptions={{
          // Global defaults — individual toasts override via showSuccess/showError
          duration: 4000,
          style: {
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
          },
        }}
      />
    </>
  )
}

export default App
