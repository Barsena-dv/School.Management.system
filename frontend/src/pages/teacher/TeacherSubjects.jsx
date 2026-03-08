import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import {
    BookOpen,
    ChevronRight,
    ClipboardList,
    FileText,
    GraduationCap,
    Layers,
    Plus,
    Users,
    X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── Inline modals ──────────────────────────────────────────────────────────

const CreateAssignmentModal = ({ subjectId, isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', description: '', deadline: '', maxMarks: '' })
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/assignments', { ...form, subjectId, maxMarks: Number(form.maxMarks) })
            showSuccess('Assignment created!')
            onCreated()
            onClose()
            setForm({ title: '', description: '', deadline: '', maxMarks: '' })
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to create assignment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Create Assignment</h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">Students will be notified</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Title</label>
                        <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="e.g. Chapter 3 Exercise" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Description</label>
                        <textarea required rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all resize-none" placeholder="Describe the assignment..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Max Marks</label>
                            <input required type="number" min={1} value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="100" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Deadline</label>
                            <input required type="datetime-local" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const EXAM_TYPES = ['Midterm', 'Final', 'Unit Test', 'Practical']

const CreateAssessmentModal = ({ subjectId, isOpen, onClose, onCreated }) => {
    const [form, setForm] = useState({ title: '', maxMarks: '', examType: 'Unit Test', date: '' })
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/assessments', { ...form, subjectId, maxMarks: Number(form.maxMarks) })
            showSuccess('Assessment scheduled!')
            onCreated()
            onClose()
            setForm({ title: '', maxMarks: '', examType: 'Unit Test', date: '' })
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to create assessment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Schedule Assessment</h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">Students will be notified</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Title</label>
                        <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="e.g. Unit 2 Midterm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Max Marks</label>
                            <input required type="number" min={1} value={form.maxMarks} onChange={e => setForm(p => ({ ...p, maxMarks: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" placeholder="100" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Exam Type</label>
                            <select value={form.examType} onChange={e => setForm(p => ({ ...p, examType: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all bg-white">
                                {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1.5">Date</label>
                        <input required type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">
                            {loading ? 'Scheduling...' : 'Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-2xl px-3 py-2">
        <Icon size={14} className="text-neutral-400 flex-shrink-0" />
        <span className="text-xs font-bold text-neutral-900">{value}</span>
        <span className="text-xs text-neutral-400 font-medium">{label}</span>
    </div>
)

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-6 space-y-4 animate-pulse">
        <div className="h-10 w-10 bg-neutral-100 rounded-2xl" />
        <div className="h-5 w-3/4 bg-neutral-100 rounded-full" />
        <div className="h-3 w-1/2 bg-neutral-100 rounded-full" />
        <div className="flex gap-2 flex-wrap">
            {[1, 2, 3].map(i => <div key={i} className="h-8 w-20 bg-neutral-100 rounded-2xl" />)}
        </div>
        <div className="h-px bg-neutral-100" />
        <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-9 bg-neutral-100 rounded-2xl" />)}
        </div>
    </div>
)

// ─── Main page ────────────────────────────────────────────────────────────────
const TeacherSubjects = () => {
    const navigate = useNavigate()
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [assignModal, setAssignModal] = useState(null)   // subjectId or null
    const [assessModal, setAssessModal] = useState(null)   // subjectId or null

    const fetchSubjects = async () => {
        try {
            const res = await api.get('/subjects')
            if (res.data.success) {
                setSubjects(res.data.data?.subjects || [])
            }
        } catch {
            showError('Failed to load subjects')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchSubjects() }, [])

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Subjects</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage assignments, assessments, and student attendance.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-500">
                    <Layers size={16} />
                    {!loading && <span>{subjects.length} subject{subjects.length !== 1 ? 's' : ''}</span>}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : subjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-neutral-50 rounded-3xl flex items-center justify-center mb-5 border border-neutral-100 shadow-inner">
                        <BookOpen className="w-9 h-9 text-neutral-300" />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">No subjects assigned</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-2 max-w-sm">
                        Contact your administrator to be assigned to a subject.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => {
                        const classLabel = subject.class
                            ? `Grade ${subject.class.grade}${subject.class.section ? ` – ${subject.class.section}` : ''}`
                            : 'No Class'

                        return (
                            <div key={subject._id}
                                className="bg-white rounded-3xl border border-neutral-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group overflow-hidden">

                                {/* Card header */}
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-neutral-50 rounded-2xl group-hover:bg-neutral-100 transition-colors border border-neutral-100">
                                            <BookOpen className="w-5 h-5 text-neutral-600" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-1">{subject.name}</h3>
                                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-5">{classLabel}</p>

                                    {/* Stats pills */}
                                    <div className="flex flex-wrap gap-2">
                                        <StatPill icon={Users} value={subject.studentCount ?? '—'} label="students" />
                                        <StatPill icon={FileText} value={subject.assignmentCount ?? '—'} label="tasks" />
                                        <StatPill icon={GraduationCap} value={subject.assessmentCount ?? '—'} label="exams" />
                                    </div>
                                </div>

                                {/* Action grid */}
                                <div className="border-t border-neutral-100 grid grid-cols-2 divide-x divide-y divide-neutral-100">
                                    <ActionBtn
                                        icon={Users}
                                        label="Students"
                                        onClick={() => navigate(`/teacher/subjects/${subject._id}/students`)}
                                    />
                                    <ActionBtn
                                        icon={ClipboardList}
                                        label="Attendance"
                                        onClick={() => navigate(`/teacher/subjects/${subject._id}/attendance`)}
                                    />
                                    <ActionBtn
                                        icon={Plus}
                                        label="Assignment"
                                        onClick={() => setAssignModal(subject._id)}
                                        accent
                                    />
                                    <ActionBtn
                                        icon={GraduationCap}
                                        label="Assessment"
                                        onClick={() => setAssessModal(subject._id)}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Modals */}
            <CreateAssignmentModal
                subjectId={assignModal}
                isOpen={!!assignModal}
                onClose={() => setAssignModal(null)}
                onCreated={fetchSubjects}
            />
            <CreateAssessmentModal
                subjectId={assessModal}
                isOpen={!!assessModal}
                onClose={() => setAssessModal(null)}
                onCreated={fetchSubjects}
            />
        </div>
    )
}

// ─── Action button ─────────────────────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, onClick, accent = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-between gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors group/btn
            ${accent
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-neutral-50/50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
    >
        <div className="flex items-center gap-2">
            <Icon size={14} strokeWidth={2.5} />
            {label}
        </div>
        <ChevronRight size={13} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all" />
    </button>
)

export default TeacherSubjects
