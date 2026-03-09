import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import {
    BookOpen,
    ChevronDown,
    GraduationCap,
    Link2,
    Plus,
    Search,
    Trash2,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Field wrapper ─────────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
)

const selectCls = "w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all bg-white appearance-none pr-10"

const SelectWrap = ({ children }) => (
    <div className="relative">
        {children}
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
    </div>
)

// ─── Create Enrollment modal ───────────────────────────────────────────────
const EnrollModal = ({ isOpen, onClose, onSaved, students, subjects }) => {
    const [form, setForm] = useState({ studentId: '', subjectId: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => { if (isOpen) setForm({ studentId: '', subjectId: '' }) }, [isOpen])
    if (!isOpen) return null

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // enrollStudent backend accepts userId (not studentId/_id)
            const student = students.find(s => s._id === form.studentId)
            await api.post('/student-subjects/enroll', {
                studentId: student?.userId || form.studentId,
                subjectId: form.subjectId,
            })
            showSuccess('Student enrolled successfully!')
            onSaved()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to enroll student')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">Create Enrollment</h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">Enroll a student in a subject.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Student */}
                    <Field label="Student">
                        <SelectWrap>
                            <select required value={form.studentId} onChange={set('studentId')} className={selectCls}>
                                <option value="">Select a student…</option>
                                {students.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} ({s.rollNumber})
                                    </option>
                                ))}
                            </select>
                        </SelectWrap>
                    </Field>

                    {/* Subject */}
                    <Field label="Subject">
                        <SelectWrap>
                            <select required value={form.subjectId} onChange={set('subjectId')} className={selectCls}>
                                <option value="">Select a subject…</option>
                                {subjects.map(s => (
                                    <option key={s._id} value={s._id}>
                                        {s.name} — {s.class?.grade} {s.class?.section}
                                    </option>
                                ))}
                            </select>
                        </SelectWrap>
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">
                            {loading ? 'Enrolling…' : 'Enroll Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Confirm delete modal ──────────────────────────────────────────────────
const DeleteModal = ({ enrollment, onClose, onDeleted }) => {
    const [loading, setLoading] = useState(false)
    if (!enrollment) return null

    const studentName = enrollment.student?.user?.name || '—'
    const subjectName = enrollment.subject?.name || '—'

    const handleDelete = async () => {
        setLoading(true)
        try {
            await api.delete(`/student-subjects/${enrollment._id}`)
            showSuccess('Enrollment removed')
            onDeleted()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to delete enrollment')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-5">
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mb-4">
                        <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900">Remove Enrollment?</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        <span className="font-bold text-neutral-700">{studentName}</span> will be unenrolled from{' '}
                        <span className="font-bold text-neutral-700">{subjectName}</span>. This cannot be undone.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                        {loading ? 'Removing…' : 'Remove'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        {[35, 30, 28, 25].map((w, i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-neutral-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
            </td>
        ))}
        <td className="px-5 py-4">
            <div className="h-8 w-20 bg-neutral-100 rounded-xl animate-pulse" />
        </td>
    </tr>
)

// ─── Table header ──────────────────────────────────────────────────────────
const THead = () => (
    <thead className="bg-neutral-50/80 border-b border-neutral-100">
        <tr>
            {['Student', 'Subject', 'Class', 'Teacher', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
            ))}
        </tr>
    </thead>
)

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminEnrollments = () => {
    const [enrollments, setEnrollments] = useState([])
    const [students, setStudents] = useState([])  // student profiles for dropdown
    const [subjects, setSubjects] = useState([])  // subjects for dropdown
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [deleting, setDeleting] = useState(null)

    const fetchAll = async () => {
        setLoading(true)
        const [enrollRes, studRes, subjRes] = await Promise.allSettled([
            api.get('/student-subjects'),
            api.get('/student-subjects/students'),
            api.get('/subjects'),
        ])
        if (enrollRes.status === 'fulfilled' && enrollRes.value.data.success)
            setEnrollments(enrollRes.value.data.data?.enrollments || [])
        if (studRes.status === 'fulfilled' && studRes.value.data.success)
            setStudents(studRes.value.data.data?.students || [])
        if (subjRes.status === 'fulfilled' && subjRes.value.data.success)
            setSubjects(subjRes.value.data.data?.subjects || [])
        setLoading(false)
    }

    useEffect(() => { fetchAll() }, [])

    const filtered = enrollments.filter(e => {
        const q = search.toLowerCase()
        return !q
            || e.student?.user?.name?.toLowerCase().includes(q)
            || e.subject?.name?.toLowerCase().includes(q)
            || e.subject?.class?.grade?.toLowerCase().includes(q)
            || e.subject?.teacher?.name?.toLowerCase().includes(q)
    })

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Enrollments</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage student-subject enrollment records.</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    {!loading && (
                        <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600">
                            {enrollments.length} enrollment{enrollments.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    <button onClick={() => setModalOpen(true)}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 transition-colors shadow-sm">
                        <Plus size={16} strokeWidth={2.5} />
                        Enroll Student
                    </button>
                </div>
            </div>

            {/* ── Search ─────────────────────────────────────────────────── */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by student, subject, teacher…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 w-full bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                />
            </div>

            {/* ── Table card ─────────────────────────────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <THead />
                        <tbody className="divide-y divide-neutral-50">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center mb-4 border border-neutral-100">
                            <Link2 className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">
                            {search ? 'No enrollments match your search' : 'No enrollments yet'}
                        </h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">
                            {search ? 'Try different keywords.' : 'Click "Enroll Student" to add the first enrollment.'}
                        </p>
                        {!search && (
                            <button onClick={() => setModalOpen(true)}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors">
                                <Plus size={13} strokeWidth={2.5} /> Enroll Student
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <THead />
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(e => (
                                    <tr key={e._id} className="hover:bg-neutral-50/60 transition-colors group">

                                        {/* Student */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-xs font-black text-blue-600 group-hover:bg-blue-100 transition-colors">
                                                    {e.student?.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-neutral-900">{e.student?.user?.name || '—'}</p>
                                                    <p className="text-[11px] text-neutral-400 font-medium">Roll: {e.student?.rollNumber || '—'}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Subject */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <BookOpen size={13} className="text-purple-400 flex-shrink-0" />
                                                <span className="text-sm font-bold text-neutral-800">{e.subject?.name || '—'}</span>
                                            </div>
                                        </td>

                                        {/* Class */}
                                        <td className="px-5 py-4">
                                            {e.subject?.class ? (
                                                <div className="flex items-center gap-1.5">
                                                    <GraduationCap size={13} className="text-neutral-400" />
                                                    <span className="text-sm text-neutral-600 font-medium">
                                                        {e.subject.class.grade} – {e.subject.class.section}
                                                    </span>
                                                </div>
                                            ) : <span className="text-xs text-neutral-300">—</span>}
                                        </td>

                                        {/* Teacher */}
                                        <td className="px-5 py-4">
                                            {e.subject?.teacher ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center text-[10px] font-black text-neutral-600">
                                                        {e.subject.teacher.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-neutral-600 font-medium">{e.subject.teacher.name}</span>
                                                </div>
                                            ) : <span className="text-xs text-neutral-300">—</span>}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <button onClick={() => setDeleting(e)}
                                                className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-xl transition-colors">
                                                <Trash2 size={12} strokeWidth={2.5} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modals ─────────────────────────────────────────────────── */}
            <EnrollModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={fetchAll}
                students={students}
                subjects={subjects}
            />
            <DeleteModal
                enrollment={deleting}
                onClose={() => setDeleting(null)}
                onDeleted={fetchAll}
            />
        </div>
    )
}

export default AdminEnrollments
