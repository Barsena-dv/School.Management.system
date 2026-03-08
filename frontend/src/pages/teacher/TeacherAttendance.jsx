import AttendanceTable from '@/components/teacher/AttendanceTable'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import {
    ArrowLeft,
    BookOpen,
    Calendar,
    CheckCircle2,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Format a Date to YYYY-MM-DD for the date input
const toDateInputValue = (date) => date.toISOString().split('T')[0]

const TeacherAttendance = () => {
    const { subjectId } = useParams()
    const navigate = useNavigate()

    const [students, setStudents] = useState([])
    const [subjectName, setSubjectName] = useState('')
    const [className, setClassName] = useState('')
    const [attendance, setAttendance] = useState({}) // { [studentId]: 'present' | 'absent' }
    const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()))
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Fetch students + subject info on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // Fetch students (critical — page depends on this)
            try {
                const studentsRes = await api.get(`/subjects/${subjectId}/students`)
                if (studentsRes.data.success) {
                    const list = studentsRes.data.data?.students || []
                    setStudents(list)
                    // Default everyone to 'present'
                    const defaultAttendance = {}
                    list.forEach(s => { defaultAttendance[s.studentId] = 'present' })
                    setAttendance(defaultAttendance)
                }
            } catch (err) {
                console.error('Students fetch failed:', err.response?.data || err.message)
                showError('Failed to load students')
            } finally {
                setLoading(false)
            }

            // Fetch subject metadata (non-critical — only for the header)
            try {
                const subjectRes = await api.get(`/subjects/${subjectId}`)
                if (subjectRes.data.success) {
                    const s = subjectRes.data.data?.subject
                    setSubjectName(s?.name || '')
                    const cls = s?.class
                    setClassName(cls ? `Grade ${cls.grade}${cls.section ? ` – ${cls.section}` : ''}` : '')
                }
            } catch (err) {
                console.warn('Subject metadata fetch failed:', err.response?.data || err.message)
                // Non-fatal — header just shows without subject name
            }
        }
        fetchData()
    }, [subjectId])


    const handleAttendanceChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (students.length === 0) {
            showError('No students to mark attendance for')
            return
        }

        setSubmitting(true)
        let successCount = 0
        let alreadyMarked = 0
        let failed = 0

        await Promise.allSettled(
            students.map(async (student) => {
                const status = attendance[student.studentId] || 'present'
                try {
                    await api.post('/attendance', {
                        studentId: student.studentId,
                        subjectId,
                        date: selectedDate,
                        status,
                    })
                    successCount++
                } catch (err) {
                    if (err.response?.status === 409) {
                        alreadyMarked++
                    } else {
                        failed++
                    }
                }
            })
        )

        setSubmitting(false)

        if (successCount > 0) {
            showSuccess(`Attendance marked for ${successCount} student${successCount !== 1 ? 's' : ''}`)
        }
        if (alreadyMarked > 0) {
            showError(`${alreadyMarked} student${alreadyMarked !== 1 ? 's' : ''} already had attendance for this date`)
        }
        if (failed > 0) {
            showError(`${failed} record${failed !== 1 ? 's' : ''} failed to save`)
        }

        // Reset to all-present if some succeeded
        if (successCount > 0) {
            const reset = {}
            students.forEach(s => { reset[s.studentId] = 'present' })
            setAttendance(reset)
        }
    }

    // Quick summary stats
    const presentCount = Object.values(attendance).filter(v => v === 'present').length
    const absentCount = Object.values(attendance).filter(v => v === 'absent').length

    return (
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ─────────────────────────────────────────────────── */}
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
                            <BookOpen size={13} className="text-neutral-400" />
                            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                                {loading ? '···' : subjectName}
                            </span>
                            {!loading && className && (
                                <><span className="text-neutral-200">·</span>
                                    <span className="text-xs font-medium text-neutral-400">{className}</span></>
                            )}
                        </div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Mark Attendance</h1>
                    </div>
                </div>

                {/* Student count */}
                {!loading && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl shadow-sm text-sm">
                        <Users size={15} className="text-neutral-400" />
                        <span className="font-bold text-neutral-900">{students.length}</span>
                        <span className="text-neutral-500 font-medium">student{students.length !== 1 ? 's' : ''}</span>
                    </div>
                )}
            </div>

            {/* ── Controls bar ───────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-neutral-200 rounded-2xl px-5 py-4 shadow-sm">
                {/* Date picker */}
                <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-neutral-400 flex-shrink-0" />
                    <label className="text-xs font-black text-neutral-500 uppercase tracking-widest">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        max={toDateInputValue(new Date())}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="px-3 py-2 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                    />
                </div>

                {/* Live summary */}
                {!loading && students.length > 0 && (
                    <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-green-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            {presentCount} Present
                        </span>
                        <span className="text-neutral-200">|</span>
                        <span className="flex items-center gap-1.5 text-red-500">
                            <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                            {absentCount} Absent
                        </span>
                    </div>
                )}
            </div>

            {/* ── Table card ─────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                    <AttendanceTable
                        students={students}
                        attendance={attendance}
                        onAttendanceChange={handleAttendanceChange}
                        loading={loading}
                    />
                </div>

                {/* ── Submit bar ─────────────────────────────────────────── */}
                {!loading && students.length > 0 && (
                    <div className="flex items-center justify-between mt-4 bg-white border border-neutral-200 rounded-2xl px-5 py-4 shadow-sm">
                        <p className="text-xs text-neutral-500 font-medium">
                            Review attendance before submitting. Already-marked records will be skipped.
                        </p>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ml-4"
                        >
                            <CheckCircle2 size={15} strokeWidth={2.5} />
                            {submitting ? 'Submitting...' : 'Mark Attendance'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default TeacherAttendance
