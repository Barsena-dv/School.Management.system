import api from '@/services/api'
import { showError } from '@/utils/toast'
import {
    ArrowLeft,
    BookOpen,
    ChevronRight,
    ClipboardList,
    GraduationCap,
    Hash,
    Mail,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ── Loading skeleton ───────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        {[80, 55, 70, 40].map((w, i) => (
            <td key={i} className="px-5 py-4">
                <div className={`h-4 bg-bg-subtle rounded-full animate-pulse`} style={{ width: `${w}%` }} />
            </td>
        ))}
    </tr>
)

// ── Main page ──────────────────────────────────────────────────────────────
const TeacherSubjectStudents = () => {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [students, setStudents] = useState([])
    const [subjectName, setSubjectName] = useState('')
    const [className, setClassName] = useState('')
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Fetch students for this subject
                const studentsRes = await api.get(`/subjects/${subjectId}/students`)
                if (studentsRes.data.success) {
                    setStudents(studentsRes.data.data?.students || [])
                }

                // Fetch subject metadata for the header
                const subjectRes = await api.get(`/subjects/${subjectId}`)
                if (subjectRes.data.success) {
                    const s = subjectRes.data.data?.subject
                    setSubjectName(s?.name || '')
                    const cls = s?.class
                    setClassName(cls ? `Grade ${cls.grade}${cls.section ? ` – ${cls.section}` : ''}` : '')
                }
            } catch {
                showError('Failed to load student list')
            } finally {
                setLoading(false)
            }
        }

        fetchStudents()
    }, [subjectId])

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-lg border border-border hover:bg-bg-subtle transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <BookOpen size={14} className="text-text-muted" />
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                {loading ? '···' : subjectName}
                            </span>
                            {!loading && className && (
                                <>
                                    <span className="text-neutral-200">·</span>
                                    <span className="text-xs font-medium text-text-muted">{className}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-xl font-bold font-heading text-text-primary tracking-tight">Enrolled Students</h1>
                    </div>
                </div>

                {/* Stats + search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Total pill */}
                    {!loading && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg shadow-sm text-sm flex-shrink-0">
                            <Users size={15} className="text-text-muted" />
                            <span className="font-bold text-text-primary">{students.length}</span>
                            <span className="text-text-muted font-medium">student{students.length !== 1 ? 's' : ''}</span>
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative w-full sm:w-auto">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email or roll..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* ── Table card ────────────────────────────────────────────── */}
            <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-bg-subtle/50 border-b border-border">
                            <tr>
                                {['Roll No.', 'Student Name', 'Email', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-bg-subtle rounded-lg flex items-center justify-center mb-4 border border-border">
                            <Users className="w-7 h-7 text-text-muted/40" />
                        </div>
                        <h3 className="text-base font-bold text-text-primary">
                            {searchQuery ? 'No matches found' : 'No students enrolled'}
                        </h3>
                        <p className="text-sm text-text-muted font-medium mt-1 max-w-xs">
                            {searchQuery
                                ? 'Try adjusting your search term.'
                                : 'Students enrolled in this subject will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-subtle/50 border-b border-border">
                                <tr>
                                    {['Roll No.', 'Student Name', 'Email', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filtered.map((student, idx) => (
                                    <tr key={student.studentId || idx} className="hover:bg-bg-subtle/30 transition-colors group">

                                        {/* Roll Number */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hash size={13} className="text-text-muted/40" />
                                                <span className="text-sm font-bold text-text-primary tracking-wide">{student.rollNumber}</span>
                                            </div>
                                        </td>

                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-bg-subtle group-hover:bg-surface border border-border transition-colors flex items-center justify-center text-xs font-bold text-text-secondary flex-shrink-0">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-text-primary whitespace-nowrap">{student.name}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Mail size={13} className="text-text-muted/40 flex-shrink-0" />
                                                <span className="text-sm text-text-muted font-medium">{student.email}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <ActionBtn
                                                    icon={ClipboardList}
                                                    label="Attendance"
                                                    onClick={() => navigate(`/teacher/students/${student.studentId}/attendance`)}
                                                />
                                                <ActionBtn
                                                    icon={GraduationCap}
                                                    label="Marks"
                                                    onClick={() => navigate(`/teacher/students/${student.studentId}/marks`)}
                                                    accent
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Compact action button ──────────────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, onClick, accent = false }) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap group/btn
            ${accent
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-bg-subtle text-text-secondary hover:bg-neutral-200 hover:text-text-primary'
            }`}
    >
        <Icon size={13} strokeWidth={2.5} />
        {label}
        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
    </button>
)

export default TeacherSubjectStudents
