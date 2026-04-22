import api from '@/services/api'
import { showError } from '@/utils/toast'
import {
    BookOpen,
    Calendar,
    ChevronRight,
    Clock,
    FileText,
    GraduationCap,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SkeletonRow = () => (
    <tr>
        {[1, 2, 3, 4, 5, 6].map(i => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-bg-subtle rounded-full animate-pulse" style={{ width: `${55 + i * 7}%` }} />
            </td>
        ))}
    </tr>
)

const TeacherAssignments = () => {
    const navigate = useNavigate()
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/assignments')
                if (res.data.success) {
                    setAssignments(res.data.data?.assignments || [])
                }
            } catch {
                showError('Failed to load assignments')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [])

    const filtered = assignments.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div>
                    <h1 className="text-xl font-bold font-heading text-text-primary tracking-tight">Assignments</h1>
                    <p className="text-text-muted mt-1 font-medium">Review submitted work and manage deadlines.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all w-full md:w-60"
                        />
                    </div>
                    {/* Tip: create from Subjects page */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-text-muted font-medium bg-bg-subtle border border-border rounded-xl px-3 py-2 whitespace-nowrap">
                        <BookOpen size={13} />
                        Create via Subjects
                    </div>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-bg-subtle/50 border-b border-border">
                            <tr>
                                {['Title', 'Subject', 'Max Marks', 'Deadline', 'Status', 'Submissions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-bg-subtle rounded-lg flex items-center justify-center mb-4 border border-border">
                            <GraduationCap className="w-7 h-7 text-text-muted/40" />
                        </div>
                        <h3 className="text-base font-bold text-text-primary">
                            {searchQuery ? 'No matches found' : 'No assignments yet'}
                        </h3>
                        <p className="text-sm text-text-muted font-medium mt-1 max-w-xs">
                            {searchQuery
                                ? 'Try a different search term.'
                                : 'Create assignments from the Subjects page to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-subtle/50 border-b border-border">
                                <tr>
                                    {['Title', 'Subject', 'Max Marks', 'Deadline', 'Status', 'Submissions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map(assignment => {
                                    const deadline = new Date(assignment.deadline)
                                    const isExpired = deadline < new Date()
                                    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
                                    const isUrgent = daysLeft <= 2 && !isExpired

                                    return (
                                        <tr key={assignment._id} className="hover:bg-bg-subtle/30 transition-colors group">
                                            {/* Title */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-bg-subtle flex items-center justify-center flex-shrink-0 group-hover:bg-surface border border-border transition-colors">
                                                        <FileText size={14} className="text-text-muted" />
                                                    </div>
                                                    <span className="text-sm font-bold text-text-primary whitespace-nowrap">{assignment.title}</span>
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-text-muted font-medium">{assignment.subject?.name || '—'}</span>
                                            </td>

                                            {/* Max Marks */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-bold text-text-primary">{assignment.maxMarks ?? '—'}</span>
                                            </td>

                                            {/* Deadline */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-text-muted flex-shrink-0" />
                                                    <span className="text-xs font-medium text-text-secondary whitespace-nowrap">
                                                        {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    {isUrgent && (
                                                        <span className="text-[10px] font-bold text-danger uppercase tracking-wider animate-pulse ml-1">Soon</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={13} className={isExpired ? 'text-red-400' : 'text-warning'} />
                                                    <span className={`text-xs font-bold ${isExpired ? 'text-danger' : 'text-warning'}`}>
                                                        {isExpired ? 'Closed' : 'Active'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* View Submissions */}
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => navigate(`/teacher/assignments/${assignment._id}/submissions`)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-text-primary bg-bg-subtle hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors group/btn"
                                                >
                                                    <Users size={13} />
                                                    Submissions
                                                    <ChevronRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                                                </button>
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

export default TeacherAssignments
