import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import {
    BookOpen,
    ChevronDown,
    Edit2,
    GraduationCap,
    Plus,
    Search,
    Trash2,
    X
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Shared field wrapper ──────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
)

const inputCls = "w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
const selectCls = "w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all bg-white appearance-none pr-10"

// ─── Select wrapper (adds chevron) ────────────────────────────────────────
const SelectWrap = ({ children }) => (
    <div className="relative">
        {children}
        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
    </div>
)

// ─── Create / Edit modal ───────────────────────────────────────────────────
const SubjectModal = ({ isOpen, onClose, onSaved, editing, classes, teachers }) => {
    const isEdit = !!editing
    const [form, setForm] = useState({ name: '', classId: '', teacherId: '' })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (editing) {
            setForm({
                name: editing.name || '',
                classId: editing.class?._id || '',
                teacherId: editing.teacher?._id || '',
            })
        } else {
            setForm({ name: '', classId: '', teacherId: '' })
        }
    }, [editing, isOpen])

    if (!isOpen) return null

    const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (isEdit) {
                await api.patch(`/subjects/${editing._id}`, form)
                showSuccess('Subject updated!')
            } else {
                await api.post('/subjects', form)
                showSuccess('Subject created!')
            }
            onSaved()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} subject`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">{isEdit ? 'Edit Subject' : 'Create Subject'}</h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">
                            {isEdit ? 'Update subject details below.' : 'Add a new subject to the system.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Name */}
                    <Field label="Subject Name">
                        <input required value={form.name} onChange={set('name')}
                            className={inputCls} placeholder="e.g. Mathematics, Physics" />
                    </Field>

                    {/* Class */}
                    <Field label="Class">
                        <SelectWrap>
                            <select required value={form.classId} onChange={set('classId')} className={selectCls}>
                                <option value="">Select a class…</option>
                                {classes.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.grade} – {c.section} ({c.academicYear})
                                    </option>
                                ))}
                            </select>
                        </SelectWrap>
                    </Field>

                    {/* Teacher */}
                    <Field label="Assigned Teacher">
                        <SelectWrap>
                            <select required value={form.teacherId} onChange={set('teacherId')} className={selectCls}>
                                <option value="">Select a teacher…</option>
                                {teachers.map(t => (
                                    <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
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
                            {loading ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Subject')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Confirm delete modal ──────────────────────────────────────────────────
const DeleteModal = ({ subject, onClose, onDeleted }) => {
    const [loading, setLoading] = useState(false)
    if (!subject) return null

    const handleDelete = async () => {
        setLoading(true)
        try {
            await api.delete(`/subjects/${subject._id}`)
            showSuccess('Subject deleted')
            onDeleted()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to delete subject')
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
                    <h3 className="text-lg font-bold text-neutral-900">Delete Subject?</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        <span className="font-bold text-neutral-700">{subject.name}</span> will be permanently removed. This cannot be undone.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                        {loading ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        {[40, 35, 30].map((w, i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-neutral-100 rounded-full animate-pulse" style={{ width: `${w}%` }} />
            </td>
        ))}
        <td className="px-5 py-4">
            <div className="flex gap-2">
                <div className="h-8 w-16 bg-neutral-100 rounded-xl animate-pulse" />
                <div className="h-8 w-16 bg-neutral-100 rounded-xl animate-pulse" />
            </div>
        </td>
    </tr>
)

// ─── Table header ──────────────────────────────────────────────────────────
const THead = () => (
    <thead className="bg-neutral-50/80 border-b border-neutral-100">
        <tr>
            {['Subject Name', 'Class', 'Teacher', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
            ))}
        </tr>
    </thead>
)

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminSubjects = () => {
    const [subjects, setSubjects] = useState([])
    const [classes, setClasses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleting, setDeleting] = useState(null)

    // Fetch subjects, classes and teachers in parallel
    const fetchAll = async () => {
        setLoading(true)
        const [subjectsRes, classesRes, teachersRes] = await Promise.allSettled([
            api.get('/subjects'),
            api.get('/classes'),
            api.get('/users?role=teacher'),
        ])
        if (subjectsRes.status === 'fulfilled' && subjectsRes.value.data.success)
            setSubjects(subjectsRes.value.data.data?.subjects || [])
        if (classesRes.status === 'fulfilled' && classesRes.value.data.success)
            setClasses(classesRes.value.data.data?.classes || [])
        if (teachersRes.status === 'fulfilled' && teachersRes.value.data.success)
            setTeachers(teachersRes.value.data.data?.users?.filter(u => u.status === 'approved') || [])
        setLoading(false)
    }

    useEffect(() => { fetchAll() }, [])

    const filtered = subjects.filter(s => {
        const q = search.toLowerCase()
        return !q
            || s.name?.toLowerCase().includes(q)
            || s.class?.grade?.toLowerCase().includes(q)
            || s.class?.section?.toLowerCase().includes(q)
            || s.teacher?.name?.toLowerCase().includes(q)
    })

    const openCreate = () => { setEditing(null); setModalOpen(true) }
    const openEdit = (s) => { setEditing(s); setModalOpen(true) }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Subjects</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage all subjects, their classes, and assigned teachers.</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                    {!loading && (
                        <span className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600">
                            {subjects.length} subject{subjects.length !== 1 ? 's' : ''}
                        </span>
                    )}
                    <button onClick={openCreate}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 transition-colors shadow-sm">
                        <Plus size={16} strokeWidth={2.5} />
                        Create Subject
                    </button>
                </div>
            </div>

            {/* ── Search ─────────────────────────────────────────────────── */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by name, class, or teacher…"
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
                            <BookOpen className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">
                            {search ? 'No subjects match your search' : 'No subjects yet'}
                        </h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">
                            {search ? 'Try different keywords.' : 'Click "Create Subject" to add the first one.'}
                        </p>
                        {!search && (
                            <button onClick={openCreate}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors">
                                <Plus size={13} strokeWidth={2.5} /> Create Subject
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <THead />
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(s => (
                                    <tr key={s._id} className="hover:bg-neutral-50/60 transition-colors group">

                                        {/* Subject name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                                                    <BookOpen size={14} className="text-purple-600" />
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900">{s.name}</span>
                                            </div>
                                        </td>

                                        {/* Class */}
                                        <td className="px-5 py-4">
                                            {s.class ? (
                                                <div className="flex items-center gap-1.5">
                                                    <GraduationCap size={13} className="text-neutral-400" />
                                                    <span className="text-sm text-neutral-700 font-medium">
                                                        {s.class.grade} – {s.class.section}
                                                    </span>
                                                    <span className="text-[11px] text-neutral-400 font-medium">({s.class.academicYear})</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-300">—</span>
                                            )}
                                        </td>

                                        {/* Teacher */}
                                        <td className="px-5 py-4">
                                            {s.teacher ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center text-[10px] font-black text-neutral-600 flex-shrink-0">
                                                        {s.teacher.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-neutral-700 font-medium">{s.teacher.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-300">Unassigned</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(s)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl transition-colors">
                                                    <Edit2 size={12} strokeWidth={2.5} /> Edit
                                                </button>
                                                <button onClick={() => setDeleting(s)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold rounded-xl transition-colors">
                                                    <Trash2 size={12} strokeWidth={2.5} /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Modals ─────────────────────────────────────────────────── */}
            <SubjectModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditing(null) }}
                onSaved={fetchAll}
                editing={editing}
                classes={classes}
                teachers={teachers}
            />
            <DeleteModal
                subject={deleting}
                onClose={() => setDeleting(null)}
                onDeleted={fetchAll}
            />
        </div>
    )
}

export default AdminSubjects
