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
                <div className={`h-4 bg-neutral-100 rounded-full animate-pulse`} style={{ width: `${w}%` }} />
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-900 flex-shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <BookOpen size={14} className="text-neutral-400" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                {loading ? '···' : subjectName}
                            </span>
                            {!loading && className && (
                                <>
                                    <span className="text-neutral-200">·</span>
                                    <span className="text-xs font-medium text-neutral-400">{className}</span>
                                </>
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Enrolled Students</h1>
                    </div>
                </div>

                {/* Stats + search */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {/* Total pill */}
                    {!loading && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl shadow-sm text-sm flex-shrink-0">
                            <Users size={15} className="text-neutral-400" />
                            <span className="font-bold text-neutral-900">{students.length}</span>
                            <span className="text-neutral-500 font-medium">student{students.length !== 1 ? 's' : ''}</span>
                        </div>
                    )}

                    {/* Search */}
                    <div className="relative w-full sm:w-auto">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by name, email or roll..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all w-full sm:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* ── Table card ────────────────────────────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/80 border-b border-neutral-100">
                            <tr>
                                {['Roll No.', 'Student Name', 'Email', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center mb-4 border border-neutral-100">
                            <Users className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">
                            {searchQuery ? 'No matches found' : 'No students enrolled'}
                        </h3>
                        <p className="text-sm text-neutral-500 font-medium mt-1 max-w-xs">
                            {searchQuery
                                ? 'Try adjusting your search term.'
                                : 'Students enrolled in this subject will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/80 border-b border-neutral-100">
                                <tr>
                                    {['Roll No.', 'Student Name', 'Email', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filtered.map((student, idx) => (
                                    <tr key={student.studentId || idx} className="hover:bg-neutral-50/60 transition-colors group">

                                        {/* Roll Number */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Hash size={13} className="text-neutral-300" />
                                                <span className="text-sm font-black text-neutral-900 tracking-wide">{student.rollNumber}</span>
                                            </div>
                                        </td>

                                        {/* Name */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-white border border-neutral-100 transition-colors flex items-center justify-center text-xs font-black text-neutral-600 flex-shrink-0">
                                                    {student.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">{student.name}</span>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Mail size={13} className="text-neutral-300 flex-shrink-0" />
                                                <span className="text-sm text-neutral-500 font-medium">{student.email}</span>
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
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
            }`}
    >
        <Icon size={13} strokeWidth={2.5} />
        {label}
        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
    </button>
)

export default TeacherSubjectStudents
