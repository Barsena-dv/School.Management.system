import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { clsx } from 'clsx'
import {
    Check,
    Clock,
    GraduationCap,
    Search,
    ShieldCheck,
    ShieldOff,
    UserCheck,
    Users,
    UserX,
    X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

// ─── Status badge ──────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const map = {
        pending: { cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={11} strokeWidth={3} /> },
        approved: { cls: 'bg-green-50 text-green-700 border-green-200', icon: <Check size={11} strokeWidth={3} /> },
        rejected: { cls: 'bg-red-50 text-red-600 border-red-200', icon: <X size={11} strokeWidth={3} /> },
        suspended: { cls: 'bg-neutral-100 text-neutral-500 border-neutral-200', icon: <ShieldOff size={11} strokeWidth={3} /> },
    }
    const cfg = map[status] || map.pending
    return (
        <span className={clsx('inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider', cfg.cls)}>
            {cfg.icon}{status}
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
            {cfg.icon}{role}
        </span>
    )
}

// ─── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        <td className="px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-neutral-100 animate-pulse flex-shrink-0" />
                <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-neutral-100 rounded-full animate-pulse" />
                    <div className="h-3 w-20 bg-neutral-100 rounded-full animate-pulse" />
                </div>
            </div>
        </td>
        {[55, 40, 45].map((w, i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-neutral-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
            </td>
        ))}
        <td className="px-5 py-4">
            <div className="flex gap-2">
                <div className="h-8 w-20 bg-neutral-100 rounded-xl animate-pulse" />
                <div className="h-8 w-16 bg-neutral-100 rounded-xl animate-pulse" />
            </div>
        </td>
    </tr>
)

// ─── Filter tab ────────────────────────────────────────────────────────────
const FilterTab = ({ active, onClick, children }) => (
    <button onClick={onClick}
        className={clsx(
            'px-4 py-2 rounded-xl text-xs font-bold border transition-all',
            active
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300 hover:text-neutral-900'
        )}>
        {children}
    </button>
)

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminUsers = ({ defaultRole = 'all' }) => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState({}) // { [userId]: true }
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState(defaultRole)
    const [statusFilter, setStatusFilter] = useState('all')

    // Re-sync filter if defaultRole prop changes (e.g. navigating between /students and /teachers)
    useEffect(() => { setRoleFilter(defaultRole); setSearch('') }, [defaultRole])


    const fetchUsers = async () => {
        try {
            const res = await api.get('/users')
            if (res.data.success) setUsers(res.data.data?.users || [])
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    // Filtered list
    const filtered = useMemo(() => {
        return users.filter(u => {
            const matchRole = roleFilter === 'all' || u.role === roleFilter
            const matchStatus = statusFilter === 'all' || u.status === statusFilter
            const q = search.toLowerCase()
            const matchSearch = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
            return matchRole && matchStatus && matchSearch
        })
    }, [users, roleFilter, statusFilter, search])

    const handleStatusChange = async (userId, newStatus, name) => {
        setActionLoading(p => ({ ...p, [userId]: true }))
        try {
            await api.patch(`/users/${userId}/status`, { status: newStatus })
            showSuccess(`${name} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully`)
            // Optimistic update
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, status: newStatus } : u))
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to update status')
        } finally {
            setActionLoading(p => { const n = { ...p }; delete n[userId]; return n })
        }
    }

    const roleCounts = useMemo(() => ({
        all: users.length,
        student: users.filter(u => u.role === 'student').length,
        teacher: users.filter(u => u.role === 'teacher').length,
        admin: users.filter(u => u.role === 'admin').length,
    }), [users])

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Users</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage all registered users — students, teachers, and admins.</p>
                </div>
                {!loading && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl shadow-sm text-sm">
                        <Users size={15} className="text-neutral-400" />
                        <span className="font-bold text-neutral-900">{users.length}</span>
                        <span className="text-neutral-500 font-medium">total users</span>
                    </div>
                )}
            </div>

            {/* ── Filters ───────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                    />
                </div>

                {/* Role filter */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'student', label: 'Students' },
                        { key: 'teacher', label: 'Teachers' },
                        { key: 'admin', label: 'Admins' },
                    ].map(({ key, label }) => (
                        <FilterTab key={key} active={roleFilter === key} onClick={() => setRoleFilter(key)}>
                            {label}
                            {!loading && (
                                <span className={clsx('ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-black',
                                    roleFilter === key ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
                                    {roleCounts[key]}
                                </span>
                            )}
                        </FilterTab>
                    ))}
                </div>

                {/* Status filter */}
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'all', label: 'Any Status' },
                        { key: 'approved', label: 'Approved' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'suspended', label: 'Suspended' },
                    ].map(({ key, label }) => (
                        <FilterTab key={key} active={statusFilter === key} onClick={() => setStatusFilter(key)}>
                            {label}
                        </FilterTab>
                    ))}
                </div>
            </div>

            {/* ── Table card ─────────────────────────────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <THead />
                        <tbody className="divide-y divide-neutral-50">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center mb-4 border border-neutral-100">
                            <Users className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">No users found</h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <THead />
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(user => {
                                    const busy = actionLoading[user._id]
                                    const isApproved = user.status === 'approved'
                                    const isSuspended = user.status === 'suspended'

                                    return (
                                        <tr key={user._id} className="hover:bg-neutral-50/60 transition-colors group">

                                            {/* Name + date */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-2xl bg-neutral-100 group-hover:bg-white border border-neutral-100 transition-colors flex items-center justify-center text-sm font-black text-neutral-600 flex-shrink-0">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-neutral-900 whitespace-nowrap">{user.name}</p>
                                                        <p className="text-[11px] text-neutral-400 font-medium">
                                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-neutral-500 font-medium">{user.email}</span>
                                            </td>

                                            {/* Role */}
                                            <td className="px-5 py-4"><RoleBadge role={user.role} /></td>

                                            {/* Status */}
                                            <td className="px-5 py-4"><StatusBadge status={user.status} /></td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                {user.role === 'admin' ? (
                                                    <span className="text-xs text-neutral-300 font-medium">—</span>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        {isSuspended || !isApproved ? (
                                                            <ActionBtn
                                                                icon={UserCheck}
                                                                label="Activate"
                                                                busy={busy}
                                                                onClick={() => handleStatusChange(user._id, 'approved', user.name)}
                                                                color="green"
                                                            />
                                                        ) : (
                                                            <ActionBtn
                                                                icon={UserX}
                                                                label="Suspend"
                                                                busy={busy}
                                                                onClick={() => handleStatusChange(user._id, 'suspended', user.name)}
                                                                color="red"
                                                            />
                                                        )}
                                                    </div>
                                                )}
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

// ─── Table header ──────────────────────────────────────────────────────────
const THead = () => (
    <thead className="bg-neutral-50/80 border-b border-neutral-100">
        <tr>
            {['Name', 'Email', 'Role', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
            ))}
        </tr>
    </thead>
)

// ─── Action button ─────────────────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, onClick, busy, color = 'neutral' }) => {
    const colors = {
        green: 'bg-green-600 hover:bg-green-700 text-white',
        red: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200',
    }
    return (
        <button onClick={onClick} disabled={busy}
            className={clsx(
                'inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
                colors[color]
            )}>
            {busy
                ? <span className={clsx('w-3 h-3 border-2 rounded-full animate-spin', color === 'green' ? 'border-white/40 border-t-white' : 'border-red-300 border-t-red-600')} />
                : <Icon size={13} strokeWidth={2.5} />
            }
            {label}
        </button>
    )
}

export default AdminUsers
