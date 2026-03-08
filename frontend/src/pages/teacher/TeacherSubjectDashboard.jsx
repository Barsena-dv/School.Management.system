import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { clsx } from 'clsx'
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    ClipboardList,
    FileText,
    GraduationCap,
    Layers,
    Plus,
    TrendingUp,
    Users,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ─── Stat card ─────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = 'neutral', loading }) => {
    const colorMap = {
        neutral: 'bg-neutral-50 text-neutral-600 border-neutral-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
    }
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={clsx('p-3 rounded-2xl border flex-shrink-0', colorMap[color])}>
                <Icon size={20} strokeWidth={2} />
            </div>
            <div>
                {loading
                    ? <div className="h-6 w-10 bg-neutral-100 rounded-full animate-pulse mb-1" />
                    : <p className="text-2xl font-extrabold text-neutral-900 leading-none">{value}</p>
                }
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{label}</p>
            </div>
        </div>
    )
}

// ─── Quick action button ────────────────────────────────────────────────────
const QuickAction = ({ icon: Icon, label, description, onClick, accent = false }) => (
    <button
        onClick={onClick}
        className={clsx(
            'flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border text-left transition-all group',
            accent
                ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 text-white'
                : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-sm text-neutral-700'
        )}
    >
        <div className={clsx('p-2 rounded-xl flex-shrink-0', accent ? 'bg-white/10' : 'bg-neutral-50 group-hover:bg-neutral-100 transition-colors')}>
            <Icon size={15} strokeWidth={2.5} className={accent ? 'text-white' : 'text-neutral-600'} />
        </div>
        <div className="flex-1 min-w-0">
            <p className={clsx('text-xs font-bold uppercase tracking-wider', accent ? 'text-white' : 'text-neutral-800')}>{label}</p>
            {description && <p className={clsx('text-[11px] font-medium mt-0.5 truncate', accent ? 'text-white/60' : 'text-neutral-400')}>{description}</p>}
        </div>
        <ChevronRight size={14} className={clsx('flex-shrink-0 group-hover:translate-x-0.5 transition-transform', accent ? 'text-white/60' : 'text-neutral-300')} />
    </button>
)

// ─── Create Assignment modal ────────────────────────────────────────────────
const CreateAssignmentModal = ({ subjectId, isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', description: '', deadline: '', maxMarks: '' })
    const [loading, setLoading] = useState(false)
    if (!isOpen) return null
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await api.post('/assignments', { ...form, subjectId, maxMarks: Number(form.maxMarks) })
            showSuccess('Assignment created!'); onCreated(); onClose()
            setForm({ title: '', description: '', deadline: '', maxMarks: '' })
        } catch (err) { showError(err.response?.data?.message || 'Failed to create assignment') }
        finally { setLoading(false) }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div><h3 className="text-lg font-bold text-neutral-900">Create Assignment</h3><p className="text-xs text-neutral-500 font-medium mt-0.5">Students will be notified</p></div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"><X size={20} className="text-neutral-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Title</label>
                        <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="e.g. Chapter 3 Exercise" /></div>
                    <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Description</label>
                        <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all resize-none" placeholder="Describe the task..." /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Max Marks</label>
                            <input required type="number" min={1} value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="100" /></div>
                        <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Deadline</label>
                            <input required type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" /></div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">{loading ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Create Assessment modal ────────────────────────────────────────────────
const EXAM_TYPES = ['Midterm', 'Final', 'Unit Test', 'Practical']
const CreateAssessmentModal = ({ subjectId, isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', maxMarks: '', examType: 'Unit Test', date: '' })
    const [loading, setLoading] = useState(false)
    if (!isOpen) return null
    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true)
        try {
            await api.post('/assessments', { ...form, subjectId, maxMarks: Number(form.maxMarks) })
            showSuccess('Assessment scheduled!'); onCreated(); onClose()
            setForm({ title: '', maxMarks: '', examType: 'Unit Test', date: '' })
        } catch (err) { showError(err.response?.data?.message || 'Failed to create assessment') }
        finally { setLoading(false) }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div><h3 className="text-lg font-bold text-neutral-900">Schedule Assessment</h3><p className="text-xs text-neutral-500 font-medium mt-0.5">Students will be notified</p></div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"><X size={20} className="text-neutral-400" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Title</label>
                        <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="e.g. Unit 2 Midterm" /></div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Max Marks</label>
                            <input required type="number" min={1} value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="100" /></div>
                        <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Exam Type</label>
                            <select value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all bg-white">
                                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select></div>
                    </div>
                    <div><label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Date</label>
                        <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" /></div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">{loading ? 'Saving...' : 'Schedule'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Main page ─────────────────────────────────────────────────────────────
const TeacherSubjectDashboard = () => {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [subject, setSubject] = useState(null)
    const [students, setStudents] = useState([])
    const [assignments, setAssignments] = useState([])
    const [assessments, setAssessments] = useState([])
    const [loading, setLoading] = useState(true)
    const [assignModal, setAssignModal] = useState(false)
    const [assessModal, setAssessModal] = useState(false)

    const fetchAll = async () => {
        setLoading(true)
        const results = await Promise.allSettled([
            api.get(`/subjects/${subjectId}`),
            api.get(`/subjects/${subjectId}/students`),
            api.get(`/assignments/subject/${subjectId}`),
            api.get(`/assessments/subject/${subjectId}`),
        ])

        if (results[0].status === 'fulfilled' && results[0].value.data.success) {
            setSubject(results[0].value.data.data?.subject)
        }
        if (results[1].status === 'fulfilled' && results[1].value.data.success) {
            setStudents(results[1].value.data.data?.students || [])
        }
        if (results[2].status === 'fulfilled' && results[2].value.data.success) {
            setAssignments(results[2].value.data.data?.assignments || [])
        }
        if (results[3].status === 'fulfilled' && results[3].value.data.success) {
            setAssessments(results[3].value.data.data?.assessments || [])
        }

        setLoading(false)
    }

    useEffect(() => { fetchAll() }, [subjectId])

    const subjectName = subject?.name || '···'
    const classLabel = subject?.class
        ? `Grade ${subject.class.grade}${subject.class.section ? ` – ${subject.class.section}` : ''}`
        : ''

    // Derived: upcoming assessments (sorted by date)
    const upcomingAssessments = assessments
        .filter(a => new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5)

    // Derived: recent assignments (most recent 5)
    const recentAssignments = [...assignments]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/teacher/subjects')}
                        className="p-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-900 flex-shrink-0">
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Layers size={13} className="text-neutral-400" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                {loading ? '···' : classLabel}
                            </span>
                        </div>
                        {loading
                            ? <div className="h-7 w-40 bg-neutral-100 rounded-full animate-pulse" />
                            : <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{subjectName}</h1>
                        }
                    </div>
                </div>
            </div>

            {/* ── Stats grid ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Users} label="Students" value={students.length} color="blue" loading={loading} />
                <StatCard icon={FileText} label="Assignments" value={assignments.length} color="purple" loading={loading} />
                <StatCard icon={GraduationCap} label="Assessments" value={assessments.length} color="amber" loading={loading} />
                <StatCard icon={TrendingUp} label="Upcoming Exams" value={upcomingAssessments.length} color="green" loading={loading} />
            </div>

            {/* ── Main content ────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Quick actions column */}
                <div className="space-y-3">
                    <h2 className="text-xs font-black text-neutral-400 uppercase tracking-[0.15em] px-1">Quick Actions</h2>
                    <div className="space-y-2">
                        <QuickAction icon={Users} label="View Students" description={`${students.length} enrolled`}
                            onClick={() => navigate(`/teacher/subjects/${subjectId}/students`)} />
                        <QuickAction icon={ClipboardList} label="Take Attendance" description="Mark today's session"
                            onClick={() => navigate(`/teacher/subjects/${subjectId}/attendance`)} />
                        <QuickAction icon={Plus} label="Create Assignment" description="Post a new task" accent
                            onClick={() => setAssignModal(true)} />
                        <QuickAction icon={GraduationCap} label="Schedule Assessment" description="Exam or unit test"
                            onClick={() => setAssessModal(true)} />
                    </div>
                </div>

                {/* Recent assignments */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-black text-neutral-400 uppercase tracking-[0.15em]">Recent Assignments</h2>
                        <button onClick={() => navigate('/teacher/assignments')}
                            className="text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1">
                            All <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm divide-y divide-neutral-50 overflow-hidden">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                                    <div className="w-7 h-7 bg-neutral-100 rounded-xl animate-pulse flex-shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-3 w-3/4 bg-neutral-100 rounded-full animate-pulse" />
                                        <div className="h-2.5 w-1/2 bg-neutral-100 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : recentAssignments.length === 0 ? (
                            <div className="py-10 text-center">
                                <FileText className="w-6 h-6 text-neutral-200 mx-auto mb-2" />
                                <p className="text-xs text-neutral-400 font-medium">No assignments yet</p>
                            </div>
                        ) : (
                            recentAssignments.map(a => {
                                const isExpired = new Date(a.deadline) < new Date()
                                return (
                                    <div key={a._id}
                                        onClick={() => navigate(`/teacher/assignments/${a._id}/submissions`)}
                                        className="flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50/60 transition-colors cursor-pointer group">
                                        <div className="w-7 h-7 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-neutral-100 transition-colors">
                                            <FileText size={13} className="text-neutral-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-neutral-900 truncate">{a.title}</p>
                                            <p className={clsx('text-[11px] font-medium', isExpired ? 'text-red-400' : 'text-neutral-400')}>
                                                {isExpired ? 'Closed · ' : 'Due · '}
                                                {new Date(a.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <ChevronRight size={13} className="text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all" />
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Upcoming assessments */}
                <div className="space-y-3">
                    <h2 className="text-xs font-black text-neutral-400 uppercase tracking-[0.15em] px-1">Upcoming Assessments</h2>
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm divide-y divide-neutral-50 overflow-hidden">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                                    <div className="w-7 h-7 bg-neutral-100 rounded-xl animate-pulse flex-shrink-0" />
                                    <div className="space-y-1.5 flex-1">
                                        <div className="h-3 w-3/4 bg-neutral-100 rounded-full animate-pulse" />
                                        <div className="h-2.5 w-1/2 bg-neutral-100 rounded-full animate-pulse" />
                                    </div>
                                </div>
                            ))
                        ) : upcomingAssessments.length === 0 ? (
                            <div className="py-10 text-center">
                                <GraduationCap className="w-6 h-6 text-neutral-200 mx-auto mb-2" />
                                <p className="text-xs text-neutral-400 font-medium">No upcoming assessments</p>
                            </div>
                        ) : (
                            upcomingAssessments.map(a => {
                                const daysLeft = Math.ceil((new Date(a.date) - new Date()) / (1000 * 60 * 60 * 24))
                                const isUrgent = daysLeft <= 3
                                return (
                                    <div key={a._id} className="flex items-center gap-3 px-4 py-3.5">
                                        <div className={clsx('w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border',
                                            isUrgent ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100')}>
                                            <Calendar size={13} className={isUrgent ? 'text-red-500' : 'text-amber-500'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-neutral-900 truncate">{a.title}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-medium text-neutral-400">
                                                    {new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className={clsx('text-[10px] font-black uppercase tracking-wider', isUrgent ? 'text-red-500' : 'text-amber-500')}>
                                                    {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-neutral-400 bg-neutral-50 border border-neutral-100 rounded-lg px-2 py-1 whitespace-nowrap">
                                            {a.examType}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <CreateAssignmentModal subjectId={subjectId} isOpen={assignModal} onClose={() => setAssignModal(false)} onCreated={fetchAll} />
            <CreateAssessmentModal subjectId={subjectId} isOpen={assessModal} onClose={() => setAssessModal(false)} onCreated={fetchAll} />
        </div>
    )
}

export default TeacherSubjectDashboard
