import api from '@/services/api'
import { clsx } from 'clsx'
import {
    ArrowRight,
    Calendar,
    CheckSquare,
    Clock,
    GraduationCap,
    Shield,
    UserCog,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Stat card ─────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value, color }) => {
    const colors = {
        neutral: { bg: 'var(--bg-subtle)', text: 'var(--text-secondary)', border: 'var(--border)' },
        blue: { bg: 'var(--primary-subtle)', text: 'var(--primary)', border: 'rgba(79,70,229,0.15)' },
        purple: { bg: 'var(--accent-subtle)', text: 'var(--accent)', border: 'rgba(6,182,212,0.15)' },
        amber: { bg: 'var(--warning-subtle)', text: 'var(--warning)', border: 'rgba(245,158,11,0.15)' },
    }
    const c = colors[color] || colors.neutral
    return (
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3.5 hover:border-primary/20 hover:shadow-md transition-all">
            <div
                className="p-2.5 rounded-lg flex-shrink-0"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
            >
                <Icon size={17} strokeWidth={2} />
            </div>
            <div>
                <p className="text-xl font-bold font-heading text-text-primary leading-none font-heading">{value}</p>
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mt-0.5 font-heading">{label}</p>
            </div>
        </div>
    )
}

// ─── Quick access card ─────────────────────────────────────────────────────
const QuickCard = ({ icon: Icon, label, description, badge, badgeColor = 'neutral', to, color = 'neutral' }) => {
    const navigate = useNavigate()
    const iconColors = {
        blue: { bg: 'var(--primary-subtle)', text: 'var(--primary)' },
        purple: { bg: 'var(--accent-subtle)', text: 'var(--accent)' },
        amber: { bg: 'var(--warning-subtle)', text: 'var(--warning)' },
        green: { bg: 'var(--success-subtle)', text: 'var(--success)' },
        neutral: { bg: 'var(--bg-subtle)', text: 'var(--text-secondary)' },
    }
    const badgeColors = {
        amber: 'bg-warning-subtle text-warning border-warning/20',
        green: 'bg-success-subtle text-success border-success/20',
        blue: 'bg-primary-subtle text-primary border-primary/20',
        red: 'bg-danger-subtle text-danger border-danger/20',
        neutral: 'bg-bg-subtle text-text-muted border-border',
    }
    const ic = iconColors[color] || iconColors.neutral
    return (
        <button
            onClick={() => navigate(to)}
            className="group flex items-center gap-3.5 bg-surface border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-md transition-all text-left w-full"
        >
            <div
                className="p-2.5 rounded-lg flex-shrink-0 transition-colors"
                style={{ background: ic.bg, color: ic.text }}
            >
                <Icon size={17} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-text-primary font-heading">{label}</p>
                    {badge !== undefined && (
                        <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-md border', badgeColors[badgeColor])}>
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-text-muted mt-0.5">{description}</p>
            </div>
            <ArrowRight size={14} className="text-text-muted/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>
    )
}

// ─── Skeleton stat ─────────────────────────────────────────────────────────
const SkeletonStat = () => (
    <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-lg bg-bg-subtle animate-pulse flex-shrink-0" />
        <div className="space-y-2">
            <div className="h-6 w-10 bg-bg-subtle rounded animate-pulse" />
            <div className="h-3 w-20 bg-bg-subtle rounded animate-pulse" />
        </div>
    </div>
)

// ─── Main Dashboard ────────────────────────────────────────────────────────
const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, pendingRes] = await Promise.allSettled([
                    api.get('/users'),
                    api.get('/users/pending'),
                ])
                const allUsers = usersRes.status === 'fulfilled' && usersRes.value.data.success
                    ? usersRes.value.data.data.users : []
                const pendingUsers = pendingRes.status === 'fulfilled' && pendingRes.value.data.success
                    ? pendingRes.value.data.data.users : []

                setStats({
                    total: allUsers.length,
                    students: allUsers.filter(u => u.role === 'student').length,
                    teachers: allUsers.filter(u => u.role === 'teacher').length,
                    pending: pendingUsers.length,
                })
            } catch {
                // fail silently — just show 0s
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="border-b border-border pb-5">
                <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">Admin Overview</h2>
                <p className="text-text-muted mt-1 text-sm">Manage institutional operations and user accounts.</p>
            </div>

            {/* Live stat row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {loading ? (
                    [1, 2, 3, 4].map(i => <SkeletonStat key={i} />)
                ) : (
                    <>
                        <StatPill icon={UserCog} label="All Users" value={stats?.total ?? 0} color="neutral" />
                        <StatPill icon={GraduationCap} label="Students" value={stats?.students ?? 0} color="blue" />
                        <StatPill icon={Users} label="Teachers" value={stats?.teachers ?? 0} color="purple" />
                        <StatPill icon={Clock} label="Pending" value={stats?.pending ?? 0} color="amber" />
                    </>
                )}
            </div>

            {/* Quick access */}
            <div>
                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3 font-heading">Quick Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <QuickCard
                        icon={UserCog} label="Manage All Users"
                        description="Search, suspend, or activate any account"
                        badge={loading ? '···' : stats?.total} badgeColor="blue"
                        to="/admin/users" color="neutral"
                    />
                    <QuickCard
                        icon={GraduationCap} label="Students"
                        description="View and manage all student accounts"
                        badge={loading ? '···' : stats?.students} badgeColor="blue"
                        to="/admin/students" color="blue"
                    />
                    <QuickCard
                        icon={Users} label="Teachers"
                        description="View and manage all teacher accounts"
                        badge={loading ? '···' : stats?.teachers} badgeColor="neutral"
                        to="/admin/teachers" color="purple"
                    />
                    <QuickCard
                        icon={CheckSquare} label="Pending Approvals"
                        description="Review new registration requests"
                        badge={loading ? '···' : stats?.pending}
                        badgeColor={stats?.pending > 0 ? 'amber' : 'neutral'}
                        to="/admin/approvals" color="amber"
                    />
                    <QuickCard
                        icon={Calendar} label="Events"
                        description="Manage academic events and schedules"
                        to="/admin/events" color="green"
                    />
                    <QuickCard
                        icon={Shield} label="Classes"
                        description="Manage class groups and sections"
                        to="/admin/classes" color="neutral"
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
