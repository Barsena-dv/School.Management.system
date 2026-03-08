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
                <div className="h-4 bg-neutral-100 rounded-full animate-pulse" style={{ width: `${55 + i * 7}%` }} />
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Assignments</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Review submitted work and manage deadlines.</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative group">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search assignments..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all w-full md:w-60"
                        />
                    </div>
                    {/* Tip: create from Subjects page */}
                    <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-400 font-medium bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 whitespace-nowrap">
                        <BookOpen size={13} />
                        Create via Subjects
                    </div>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/80 border-b border-neutral-100">
                            <tr>
                                {['Title', 'Subject', 'Max Marks', 'Deadline', 'Status', 'Submissions'].map(h => (
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
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center mb-4 border border-neutral-100">
                            <GraduationCap className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">
                            {searchQuery ? 'No matches found' : 'No assignments yet'}
                        </h3>
                        <p className="text-sm text-neutral-500 font-medium mt-1 max-w-xs">
                            {searchQuery
                                ? 'Try a different search term.'
                                : 'Create assignments from the Subjects page to get started.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/80 border-b border-neutral-100">
                                <tr>
                                    {['Title', 'Subject', 'Max Marks', 'Deadline', 'Status', 'Submissions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(assignment => {
                                    const deadline = new Date(assignment.deadline)
                                    const isExpired = deadline < new Date()
                                    const daysLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24))
                                    const isUrgent = daysLeft <= 2 && !isExpired

                                    return (
                                        <tr key={assignment._id} className="hover:bg-neutral-50/60 transition-colors group">
                                            {/* Title */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white border border-neutral-100 transition-colors">
                                                        <FileText size={14} className="text-neutral-500" />
                                                    </div>
                                                    <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">{assignment.title}</span>
                                                </div>
                                            </td>

                                            {/* Subject */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-neutral-500 font-medium">{assignment.subject?.name || '—'}</span>
                                            </td>

                                            {/* Max Marks */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm font-black text-neutral-900">{assignment.maxMarks ?? '—'}</span>
                                            </td>

                                            {/* Deadline */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-neutral-400 flex-shrink-0" />
                                                    <span className="text-xs font-medium text-neutral-600 whitespace-nowrap">
                                                        {deadline.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    {isUrgent && (
                                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-wider animate-pulse ml-1">Soon</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={13} className={isExpired ? 'text-red-400' : 'text-amber-500'} />
                                                    <span className={`text-xs font-bold ${isExpired ? 'text-red-500' : 'text-amber-600'}`}>
                                                        {isExpired ? 'Closed' : 'Active'}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* View Submissions */}
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => navigate(`/teacher/assignments/${assignment._id}/submissions`)}
                                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl transition-colors group/btn"
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
