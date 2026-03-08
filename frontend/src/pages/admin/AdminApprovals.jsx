import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { clsx } from 'clsx'
import {
    Check,
    Clock,
    GraduationCap,
    ShieldCheck,
    UserCheck,
    Users,
    UserX,
    X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Status badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        approved: 'bg-green-50 text-green-700 border-green-200',
        rejected: 'bg-red-50 text-red-600 border-red-200',
    }
    const icons = {
        pending: <Clock size={11} strokeWidth={3} />,
        approved: <Check size={11} strokeWidth={3} />,
        rejected: <X size={11} strokeWidth={3} />,
    }
    return (
        <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider', map[status] || map.pending)}>
            {icons[status]}
            {status}
        </span>
    )
}

// ─── Role badge ────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
    const map = {
        student: { cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: <GraduationCap size={11} /> },
        teacher: { cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: <ShieldCheck size={11} /> },
        admin: { cls: 'bg-neutral-100 text-neutral-600 border-neutral-200', icon: <UserCheck size={11} /> },
    }
    const cfg = map[role] || map.student
    return (
        <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-bold capitalize', cfg.cls)}>
            {cfg.icon}
            {role}
        </span>
    )
}

// ─── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-neutral-100 animate-pulse" /><div className="h-4 w-28 bg-neutral-100 rounded-full animate-pulse" /></div></td>
        {[60, 45, 50].map((w, i) => (
            <td key={i} className="px-5 py-4"><div className={`h-4 bg-neutral-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} /></td>
        ))}
        <td className="px-5 py-4"><div className="flex gap-2"><div className="h-8 w-20 bg-neutral-100 rounded-xl animate-pulse" /><div className="h-8 w-16 bg-neutral-100 rounded-xl animate-pulse" /></div></td>
    </tr>
)

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminApprovals = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState({}) // { [userId]: 'approving' | 'rejecting' }
    const [filter, setFilter] = useState('all') // 'all' | 'student' | 'teacher'

    const fetchPending = async () => {
        try {
            const res = await api.get('/users/pending')
            if (res.data.success) {
                setUsers(res.data.data?.users || [])
            }
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to load pending users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPending() }, [])

    const handleApprove = async (userId, name) => {
        setActionLoading(p => ({ ...p, [userId]: 'approving' }))
        try {
            await api.patch(`/users/${userId}/approve`)
            showSuccess(`${name} approved successfully`)
            await fetchPending()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to approve user')
        } finally {
            setActionLoading(p => { const n = { ...p }; delete n[userId]; return n })
        }
    }

    const handleReject = async (userId, name) => {
        setActionLoading(p => ({ ...p, [userId]: 'rejecting' }))
        try {
            await api.patch(`/users/${userId}/reject`)
            showSuccess(`${name} rejected`)
            await fetchPending()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to reject user')
        } finally {
            setActionLoading(p => { const n = { ...p }; delete n[userId]; return n })
        }
    }

    const filtered = filter === 'all' ? users : users.filter(u => u.role === filter)

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">User Approvals</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Review and approve pending account registrations.</p>
                </div>
                {!loading && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-2xl text-sm">
                        <Clock size={15} className="text-amber-500" />
                        <span className="font-bold text-amber-800">{users.length}</span>
                        <span className="text-amber-600 font-medium">pending approval{users.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* ── Filter tabs ────────────────────────────────────────────── */}
            <div className="flex gap-2">
                {[
                    { key: 'all', label: 'All', icon: Users },
                    { key: 'student', label: 'Students', icon: GraduationCap },
                    { key: 'teacher', label: 'Teachers', icon: ShieldCheck },
                ].map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setFilter(key)}
                        className={clsx(
                            'inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all',
                            filter === key
                                ? 'bg-neutral-900 text-white border-neutral-900'
                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900'
                        )}>
                        <Icon size={13} strokeWidth={2.5} />
                        {label}
                        {!loading && (
                            <span className={clsx('ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-black',
                                filter === key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
                                {key === 'all' ? users.length : users.filter(u => u.role === key).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* ── Table card ─────────────────────────────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/80 border-b border-neutral-100">
                            <tr>
                                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center mb-4 border border-green-100">
                            <UserCheck className="w-7 h-7 text-green-400" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">
                            {filter === 'all' ? 'No pending approvals' : `No pending ${filter}s`}
                        </h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">All caught up! New registrations will appear here.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/80 border-b border-neutral-100">
                                <tr>
                                    {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(user => {
                                    const busy = actionLoading[user._id]
                                    return (
                                        <tr key={user._id} className="hover:bg-neutral-50/60 transition-colors group">

                                            {/* Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-2xl bg-neutral-100 group-hover:bg-white border border-neutral-100 transition-colors flex items-center justify-center text-sm font-black text-neutral-600 flex-shrink-0">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-neutral-900 whitespace-nowrap">{user.name}</p>
                                                        <p className="text-[11px] text-neutral-400 font-medium">
                                                            Registered {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-neutral-500 font-medium">{user.email}</span>
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-4">
                                                <RoleBadge role={user.role} />
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={user.status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApprove(user._id, user.name)}
                                                        disabled={!!busy}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {busy === 'approving'
                                                            ? <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                            : <UserCheck size={13} strokeWidth={2.5} />
                                                        }
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(user._id, user.name)}
                                                        disabled={!!busy}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {busy === 'rejecting'
                                                            ? <span className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                                                            : <UserX size={13} strokeWidth={2.5} />
                                                        }
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminApprovals
