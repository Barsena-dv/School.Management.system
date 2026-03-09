import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import {
    BookOpen,
    Edit2,
    GraduationCap,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// ─── Modal field helper ────────────────────────────────────────────────────
const Field = ({ label, children }) => (
    <div>
        <label className="block text-xs font-black text-neutral-500 uppercase tracking-widest mb-1.5">{label}</label>
        {children}
    </div>
)

const inputCls = "w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"

// ─── Create / Edit modal ───────────────────────────────────────────────────
const ClassModal = ({ isOpen, onClose, onSaved, editing }) => {
    const isEdit = !!editing
    const [form, setForm] = useState({ grade: '', section: '', academicYear: '' })
    const [loading, setLoading] = useState(false)

    // Populate form when editing
    useEffect(() => {
        if (editing) {
            setForm({ grade: editing.grade || '', section: editing.section || '', academicYear: editing.academicYear || '' })
        } else {
            setForm({ grade: '', section: '', academicYear: '' })
        }
    }, [editing, isOpen])

    if (!isOpen) return null

    const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (isEdit) {
                await api.patch(`/classes/${editing._id}`, form)
                showSuccess('Class updated!')
            } else {
                await api.post('/classes', form)
                showSuccess('Class created!')
            }
            onSaved()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} class`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            {isEdit ? 'Edit Class' : 'Create Class'}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">
                            {isEdit ? 'Update class details below.' : 'Add a new class to the system.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
                        <X size={20} className="text-neutral-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <Field label="Grade / Class Name">
                        <input
                            required value={form.grade} onChange={set('grade')}
                            className={inputCls} placeholder="e.g. Grade 10, Class 12A" />
                    </Field>

                    <Field label="Section">
                        <input
                            required value={form.section} onChange={set('section')}
                            className={inputCls} placeholder="e.g. A, B, Science" />
                    </Field>

                    <Field label="Academic Year">
                        <input
                            required value={form.academicYear} onChange={set('academicYear')}
                            className={inputCls} placeholder="e.g. 2024-2025" />
                    </Field>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50">
                            {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Class')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Confirm delete modal ──────────────────────────────────────────────────
const DeleteModal = ({ classItem, onClose, onDeleted }) => {
    const [loading, setLoading] = useState(false)
    if (!classItem) return null

    const handleDelete = async () => {
        setLoading(true)
        try {
            await api.delete(`/classes/${classItem._id}`)
            showSuccess('Class deleted')
            onDeleted()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to delete class')
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
                    <h3 className="text-lg font-bold text-neutral-900">Delete Class?</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        <span className="font-bold text-neutral-700">{classItem.grade} – {classItem.section}</span> will be permanently removed. This cannot be undone.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-red-600 text-sm font-bold text-white hover:bg-red-700 transition-colors disabled:opacity-50">
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Skeleton row ──────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        {[40, 30, 35, 20].map((w, i) => (
            <td key={i} className="px-5 py-4">
                <div className={`h-4 bg-neutral-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
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

// ─── Main page ─────────────────────────────────────────────────────────────
const AdminClasses = () => {
    const [classes, setClasses] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)      // class being edited
    const [deleting, setDeleting] = useState(null)    // class being deleted

    const fetchClasses = async () => {
        try {
            const res = await api.get('/classes')
            if (res.data.success) setClasses(res.data.data?.classes || [])
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to load classes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchClasses() }, [])

    const filtered = classes.filter(c => {
        const q = search.toLowerCase()
        return !q || c.grade?.toLowerCase().includes(q) || c.section?.toLowerCase().includes(q) || c.academicYear?.includes(q)
    })

    const openCreate = () => { setEditing(null); setModalOpen(true) }
    const openEdit = (cls) => { setEditing(cls); setModalOpen(true) }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Classes</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage all class groups and sections.</p>
                </div>
                <button onClick={openCreate}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white text-sm font-bold rounded-2xl hover:bg-neutral-800 transition-colors shadow-sm flex-shrink-0">
                    <Plus size={16} strokeWidth={2.5} />
                    Create Class
                </button>
            </div>

            {/* ── Search ─────────────────────────────────────────────────── */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search by grade, section, year..."
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
                            {search ? 'No classes match your search' : 'No classes yet'}
                        </h3>
                        <p className="text-sm text-neutral-400 font-medium mt-1">
                            {search ? 'Try different keywords.' : 'Click "Create Class" to add the first one.'}
                        </p>
                        {!search && (
                            <button onClick={openCreate}
                                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors">
                                <Plus size={13} strokeWidth={2.5} /> Create Class
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <THead />
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map(cls => (
                                    <tr key={cls._id} className="hover:bg-neutral-50/60 transition-colors group">

                                        {/* Grade */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                                    <GraduationCap size={15} className="text-blue-600" />
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900">{cls.grade}</span>
                                            </div>
                                        </td>

                                        {/* Section */}
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200">
                                                {cls.section}
                                            </span>
                                        </td>

                                        {/* Academic Year */}
                                        <td className="px-5 py-4">
                                            <span className="text-sm text-neutral-600 font-medium">{cls.academicYear}</span>
                                        </td>

                                        {/* Class Teacher */}
                                        <td className="px-5 py-4">
                                            {cls.classTeacher
                                                ? <span className="text-sm text-neutral-700 font-medium">{cls.classTeacher.name}</span>
                                                : <span className="text-xs text-neutral-300 font-medium">—</span>
                                            }
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(cls)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-xl transition-colors">
                                                    <Edit2 size={12} strokeWidth={2.5} /> Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleting(cls)}
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
            <ClassModal
                isOpen={modalOpen}
                onClose={() => { setModalOpen(false); setEditing(null) }}
                onSaved={fetchClasses}
                editing={editing}
            />
            <DeleteModal
                classItem={deleting}
                onClose={() => setDeleting(null)}
                onDeleted={fetchClasses}
            />
        </div>
    )
}

// ─── Table header ──────────────────────────────────────────────────────────
const THead = () => (
    <thead className="bg-neutral-50/80 border-b border-neutral-100">
        <tr>
            {['Grade / Name', 'Section', 'Academic Year', 'Class Teacher', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
            ))}
        </tr>
    </thead>
)

export default AdminClasses
