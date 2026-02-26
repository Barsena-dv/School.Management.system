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
        <div className="surface p-8">
            <div className="mb-6">
                <h1 className="text-[1.25rem] font-bold text-text-primary tracking-tight">Sign In</h1>
                <p className="text-sm text-text-secondary mt-1">Access your academic portal</p>
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
                />

                <div className="flex items-center justify-between text-xs py-1">
                    <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                        Stay signed in
                    </label>
                    <button type="button" className="font-semibold text-primary hover:text-primary-hover">
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

            <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-xs text-text-secondary">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="font-bold text-primary hover:text-primary-hover"
                    >
                        Request Access
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login
