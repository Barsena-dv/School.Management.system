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
                <div className="h-4 bg-bg-subtle rounded-full animate-pulse" style={{ width: `${60 + i * 8}%` }} />
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2.5 rounded-lg border border-border hover:bg-bg-subtle transition-colors text-text-muted hover:text-text-primary"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold font-heading text-text-primary tracking-tight">
                            Assignment Submissions
                        </h1>
                        <p className="text-sm text-text-muted font-medium mt-0.5">
                            Review and grade student work
                        </p>
                    </div>
                </div>

                {/* Stats pills */}
                {!loading && (
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg shadow-sm text-sm">
                            <Users size={15} className="text-text-muted" />
                            <span className="font-bold text-text-primary">{submissions.length}</span>
                            <span className="text-text-muted font-medium">Total</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-success-subtle border border-success/20 rounded-lg shadow-sm text-sm">
                            <GraduationCap size={15} className="text-success" />
                            <span className="font-bold text-success">{gradedCount}</span>
                            <span className="text-success font-medium">Graded</span>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Table card ────────────────────────────────────────────── */}
            <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
                {loading ? (
                    <table className="w-full text-left">
                        <thead className="bg-bg-subtle/50 border-b border-border">
                            <tr>
                                {['Student', 'Email', 'File', 'Submitted At', 'Status', 'Grade', 'Action'].map(h => (
                                    <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </tbody>
                    </table>
                ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-bg-subtle rounded-lg flex items-center justify-center mb-4 border border-border">
                            <GraduationCap className="w-7 h-7 text-text-muted/40" />
                        </div>
                        <h3 className="text-base font-bold text-text-primary">No submissions yet</h3>
                        <p className="text-sm text-text-muted font-medium mt-1 max-w-xs">
                            Students haven't submitted their work for this assignment yet.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-subtle/50 border-b border-border">
                                <tr>
                                    {['Student', 'Email', 'Download', 'Submitted At', 'Status', 'Grade', 'Action'].map(h => (
                                        <th key={h} className="px-5 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {submissions.map((sub) => {
                                    const studentName = sub.student?.user?.name || '—'
                                    const studentEmail = sub.student?.user?.email || '—'
                                    const submittedAt = new Date(sub.submittedAt).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })
                                    const statusLabel = sub.status === 'graded' ? 'Graded' : 'Submitted'

                                    return (
                                        <tr key={sub._id} className="hover:bg-bg-subtle/30 transition-colors group">
                                            {/* Student Name */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-bg-subtle flex items-center justify-center text-text-muted text-xs font-bold flex-shrink-0 group-hover:bg-surface transition-colors border border-border">
                                                        {studentName.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm font-bold text-text-primary whitespace-nowrap">{studentName}</span>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4">
                                                <span className="text-sm text-text-muted font-medium">{studentEmail}</span>
                                            </td>

                                            {/* Download */}
                                            <td className="px-5 py-4">
                                                {sub.fileUrl ? (
                                                    <a
                                                        href={sub.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-text-primary bg-bg-subtle hover:bg-neutral-200 px-3 py-1.5 rounded-xl transition-colors"
                                                    >
                                                        <Download size={13} strokeWidth={2.5} />
                                                        File
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-text-muted font-medium">No file</span>
                                                )}
                                            </td>

                                            {/* Submitted At */}
                                            <td className="px-5 py-4">
                                                <span className="text-xs text-text-muted font-medium whitespace-nowrap">{submittedAt}</span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={statusLabel} />
                                            </td>

                                            {/* Grade */}
                                            <td className="px-5 py-4">
                                                {sub.status === 'graded' ? (
                                                    <span className="text-sm font-bold text-text-primary">
                                                        {sub.grade}
                                                        {sub.assignment?.maxMarks && (
                                                            <span className="text-xs text-text-muted font-medium ml-1">/ {sub.assignment.maxMarks}</span>
                                                        )}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-text-muted font-medium">—</span>
                                                )}
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() => openGradeModal(sub)}
                                                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${sub.status === 'graded'
                                                            ? 'bg-bg-subtle text-text-secondary hover:bg-neutral-200'
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
