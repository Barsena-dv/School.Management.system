import StatusBadge from '@/components/common/StatusBadge'
import GradeModal from '@/components/teacher/GradeModal'
import api from '@/services/api'
import { showError } from '@/utils/toast'
import {
    ArrowLeft,
    Download,
    GraduationCap,
    Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ── Loading skeleton row ───────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <td key={i} className="px-5 py-4">
                <div className="h-4 bg-neutral-100 rounded-full animate-pulse" style={{ width: `${60 + i * 8}%` }} />
            </td>
        ))}
    </tr>
)

// ── Main page ──────────────────────────────────────────────────────────────
const TeacherSubmissions = () => {
    const { assignmentId } = useParams()
    const navigate = useNavigate()

    const [submissions, setSubmissions] = useState([])
    const [assignment, setAssignment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const fetchSubmissions = async () => {
        try {
            const res = await api.get(`/submissions/assignment/${assignmentId}`)
            if (res.data.success) {
                setSubmissions(res.data.data?.submissions || [])
                // Derive assignment metadata from first submission if available
                if (res.data.data?.submissions?.[0]?.assignment) {
                    setAssignment(res.data.data.submissions[0].assignment)
                }
            }
        } catch (err) {
            showError('Failed to load submissions')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubmissions()
    }, [assignmentId])

    const openGradeModal = (submission) => {
        setSelectedSubmission(submission)
        setIsModalOpen(true)
    }

    const handleGraded = () => {
        setIsModalOpen(false)
        setSelectedSubmission(null)
        fetchSubmissions()
    }

    const gradedCount = submissions.filter(s => s.status === 'graded').length

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">

            {/* ── Header ────────────────────────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-2xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-neutral-500 hover:text-neutral-900"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                            Assignment Submissions
                        </h1>
                        <p className="text-sm text-neutral-500 font-medium mt-0.5">
                            Review and grade student work
                        </p>
                    </div>
                </div>

                {/* Stats pills */}
                {!loading && (
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200 rounded-2xl shadow-sm text-sm">
                            <Users size={15} className="text-neutral-400" />
                            <span className="font-bold text-neutral-900">{submissions.length}</span>
                            <span className="text-neutral-500 font-medium">Total</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-100 rounded-2xl shadow-sm text-sm">
                            <GraduationCap size={15} className="text-green-600" />
                            <span className="font-bold text-green-700">{gradedCount}</span>
                            <span className="text-green-600 font-medium">Graded</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Table card ────────────────────────────────────────────── */}
            <div className="bg-white border border-neutral-200 rounded-3xl shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/80 border-b border-neutral-100">
                            <tr>
                                {['Student', 'Email', 'File', 'Submitted At', 'Status', 'Grade', 'Action'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-neutral-50 rounded-3xl flex items-center justify-center mb-4 border border-neutral-100">
                            <GraduationCap className="w-7 h-7 text-neutral-300" />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900">No submissions yet</h3>
                        <p className="text-sm text-neutral-500 font-medium mt-1 max-w-xs">
                            Students haven't submitted their work for this assignment yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-neutral-50/80 border-b border-neutral-100">
                                <tr>
                                    {['Student', 'Email', 'Download', 'Submitted At', 'Status', 'Grade', 'Action'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {submissions.map((sub) => {
                                    const studentName = sub.student?.user?.name || '—'
                                    const studentEmail = sub.student?.user?.email || '—'
                                    const submittedAt = new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })
                                    const statusLabel = sub.status === 'graded' ? 'Graded' : 'Submitted'

                                    return (
                                        <tr key={sub._id} className="hover:bg-neutral-50/60 transition-colors group">
                                            {/* Student Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs font-black flex-shrink-0 group-hover:bg-white transition-colors border border-neutral-100">
                                                        {studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">{studentName}</span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-neutral-500 font-medium">{studentEmail}</span>
                                            </td>

                                            {/* Download */}
                                            <td className="px-5 py-4">
                                                {sub.fileUrl ? (
                                                    <a
                                                        href={sub.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition-colors"
                                                    >
                                                        <Download size={13} strokeWidth={2.5} />
                                                        File
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-neutral-400 font-medium">No file</span>
                                                )}
                                            </td>

                                            {/* Submitted At */}
                                            <td className="px-5 py-4">
                                                <span className="text-xs text-neutral-500 font-medium whitespace-nowrap">{submittedAt}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={statusLabel} />
                                            </td>

                                            {/* Grade */}
                                            <td className="px-5 py-4">
                                                {sub.status === 'graded' ? (
                                                    <span className="text-sm font-black text-neutral-900">
                                                        {sub.grade}
                                                        {sub.assignment?.maxMarks && (
                                                            <span className="text-xs text-neutral-400 font-medium ml-1">/ {sub.assignment.maxMarks}</span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-neutral-400 font-medium">—</span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => openGradeModal(sub)}
                                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${sub.status === 'graded'
                                                            ? 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                                                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                                                        }`}
                                                >
                                                    {sub.status === 'graded' ? 'Update Grade' : 'Grade'}
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

            {/* ── Grade Modal ───────────────────────────────────────────── */}
            <GradeModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedSubmission(null)
                }}
                submission={selectedSubmission}
                maxMarks={selectedSubmission?.assignment?.maxMarks}
                onGraded={handleGraded}
            />
        </div>
    )
}

export default TeacherSubmissions
