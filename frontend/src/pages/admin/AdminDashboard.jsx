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

// ─── Quick access card ─────────────────────────────────────────────────────
const QuickCard = ({ icon: Icon, label, description, badge, badgeColor = 'neutral', to, color = 'neutral' }) => {
    const navigate = useNavigate()
    const iconColors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100',
    }
    const badgeColors = {
        amber: 'bg-amber-100 text-amber-700',
        green: 'bg-green-100 text-green-700',
        blue: 'bg-blue-100 text-blue-700',
        red: 'bg-red-100 text-red-600',
        neutral: 'bg-neutral-100 text-neutral-600',
    }
    return (
        <button
            onClick={() => navigate(to)}
            className="group flex items-center gap-4 bg-white border border-neutral-200 rounded-2xl p-5 hover:shadow-md hover:border-neutral-300 transition-all text-left w-full"
        >
            <div className={clsx('p-3 rounded-2xl border flex-shrink-0', iconColors[color])}>
                <Icon size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-neutral-900">{label}</p>
                    {badge !== undefined && (
                        <span className={clsx('text-[10px] font-black px-1.5 py-0.5 rounded-full', badgeColors[badgeColor])}>
                            {badge}
                        </span>
                    )}
                </div>
                <p className="text-xs text-neutral-400 font-medium mt-0.5">{description}</p>
            </div>
            <ArrowRight size={15} className="text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>
    )
}

// ─── Skeleton stat ─────────────────────────────────────────────────────────
const SkeletonStat = () => (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 animate-pulse flex-shrink-0" />
        <div className="space-y-2">
            <div className="h-6 w-10 bg-neutral-100 rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-neutral-100 rounded-full animate-pulse" />
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900">Admin Overview</h2>
                <p className="text-neutral-500 mt-1 font-medium">Manage institutional operations and user accounts.</p>
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
                <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.15em] mb-3">Quick Access</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <QuickCard
                        icon={UserCog}
                        label="Manage All Users"
                        description="Search, suspend, or activate any account"
                        badge={loading ? '···' : stats?.total}
                        badgeColor="blue"
                        to="/admin/users"
                        color="neutral"
                    />
                    <QuickCard
                        icon={GraduationCap}
                        label="Students"
                        description="View and manage all student accounts"
                        badge={loading ? '···' : stats?.students}
                        badgeColor="blue"
                        to="/admin/students"
                        color="blue"
                    />
                    <QuickCard
                        icon={Users}
                        label="Teachers"
                        description="View and manage all teacher accounts"
                        badge={loading ? '···' : stats?.teachers}
                        badgeColor="neutral"
                        to="/admin/teachers"
                        color="purple"
                    />
                    <QuickCard
                        icon={CheckSquare}
                        label="Pending Approvals"
                        description="Review new registration requests"
                        badge={loading ? '···' : stats?.pending}
                        badgeColor={stats?.pending > 0 ? 'amber' : 'neutral'}
                        to="/admin/approvals"
                        color="amber"
                    />
                    <QuickCard
                        icon={Calendar}
                        label="Events"
                        description="Manage academic events and schedules"
                        to="/admin/events"
                        color="green"
                    />
                    <QuickCard
                        icon={Shield}
                        label="Classes"
                        description="Manage class groups and sections"
                        to="/admin/classes"
                        color="neutral"
                    />
                </div>
            </div>
        </div>
    )
}

// ─── Stat pill ─────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value, color }) => {
    const colors = {
        neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
    }
    return (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={clsx('p-3 rounded-2xl border flex-shrink-0', colors[color])}>
                <Icon size={18} strokeWidth={2} />
            </div>
            <div>
                <p className="text-2xl font-extrabold text-neutral-900 leading-none">{value}</p>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{label}</p>
            </div>
        </div>
    )
}

export default AdminDashboard
