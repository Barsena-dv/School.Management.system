import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { registerValidators, validate } from '@/utils/validators'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }))
    }

    const handleRoleSelect = (role) => {
        setForm((prev) => ({ ...prev, role }))
        if (errors.role) setErrors((prev) => ({ ...prev, role: null }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const validationErrors = validate(form, registerValidators)
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors)
            return
        }
        setLoading(true)
        try {
            await api.post('/auth/register', form)
            showSuccess('Registration successful. Please log in.')
            navigate('/login')
        } catch (err) {
            const message = err.response?.data?.message ?? 'Registration failed. Please try again.'
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
                }}>Request Access</h1>
                <p style={{
                    fontSize: '0.875rem',
                    color: '#9CA3AF',
                    marginTop: '0.25rem',
                }}>Create an account for the academic portal</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Role selector */}
                <div>
                    <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: "'Outfit', 'Inter', system-ui, sans-serif",
                        color: '#9CA3AF',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem',
                        paddingLeft: '2px',
                    }}>
                        I am a...
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {['student', 'teacher'].map((role) => (
                            <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleSelect(role)}
                                style={{
                                    padding: '0.625rem',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    fontFamily: "'Outfit', sans-serif",
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 200ms ease',
                                    border: form.role === role
                                        ? '1px solid var(--primary)'
                                        : '1px solid rgba(255,255,255,0.1)',
                                    background: form.role === role
                                        ? 'rgba(79, 70, 229, 0.15)'
                                        : 'rgba(255,255,255,0.04)',
                                    color: form.role === role ? '#A5B4FC' : '#9CA3AF',
                                    boxShadow: form.role === role
                                        ? '0 0 12px rgba(79, 70, 229, 0.2)'
                                        : 'none',
                                }}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
                    {errors.role && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.375rem' }}>{errors.role}</p>}
                </div>

                <Input
                    label="Full Name"
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#FFFFFF',
                    }}
                />
                
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
                    autoComplete="new-password"
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

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="w-full mt-2"
                >
                    {loading ? 'Submitting…' : 'Create Account'}
                </Button>
            </form>

            <div style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
            }}>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            fontWeight: 700,
                            color: 'var(--primary)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage
