import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/services/api'
import { showError } from '@/utils/toast'
import { loginValidators, validate } from '@/utils/validators'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLE_REDIRECT = {
    admin: '/admin',
    teacher: '/teacher',
    student: '/student',
}

const Login = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate(form, loginValidators)
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }
        setLoading(true)
        try {
            const { data } = await api.post('/auth/login', form)
            localStorage.setItem('token', data.data.token)
            localStorage.setItem('user', JSON.stringify(data.data.user))
            const redirect = ROLE_REDIRECT[data.data.user.role] ?? '/login'
            navigate(redirect, { replace: true })
        } catch (err) {
            const message = err.response?.data?.message ?? 'Login failed. Please try again.'
            showError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{
                    fontFamily: "'Outfit', system-ui, sans-serif",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                }}>Sign In</h1>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#9CA3AF',
                    marginTop: '0.25rem',
                }}>Access your academic portal</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <Input
                    label="Institutional Email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@school.edu"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                    }}
                />
                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                    }}
                />

                <div className="flex items-center justify-between text-xs py-1">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#9CA3AF' }}>
                        <input type="checkbox" style={{
                            width: '14px', height: '14px', borderRadius: '4px',
                            accentColor: 'var(--primary)',
                        }} />
                        Stay signed in
                    </label>
                    <button type="button" style={{
                        fontWeight: 600,
                        color: 'var(--primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                    }}>
                        Forgot password?
                    </button>
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="w-full mt-2"
                >
                    {loading ? 'Authenticating…' : 'Sign In'}
                </Button>
            </form>

            <div style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            fontWeight: 700,
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Request Access
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
