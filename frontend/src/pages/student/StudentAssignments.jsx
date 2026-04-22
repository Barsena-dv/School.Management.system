import StatusBadge from '@/components/common/StatusBadge'
import SubmissionModal from '@/components/student/SubmissionModal'
import DashboardCard from '@/components/ui/DashboardCard'
import EmptyState from '@/components/ui/EmptyState'
import api from '@/services/api'
import { getStudentDashboard } from '@/services/dashboardService'
import { showError } from '@/utils/toast'
import { clsx } from 'clsx'
import {
    Calendar,
    Clock,
    FileText,
    GraduationCap,
    Search,
    Upload
} from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentAssignments = () => {
    const [assignments, setAssignments] = useState([])
    const [submissionMap, setSubmissionMap] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchData = async () => {
        setLoading(true)
        try {
            const assignRes = await api.get('/assignments')
            if (assignRes.data.success) {
                setAssignments(assignRes.data.data?.assignments || [])
            }
        } catch (error) {
            showError("Failed to load assignments")
        }

        try {
            const subRes = await api.get('/submissions/my')
            if (subRes.data.success) {
                const subs = subRes.data.data?.submissions || []
                const map = {}
                subs.forEach(s => {
                    if (s.assignment?._id) {
                        map[s.assignment._id] = s
                    }
                })
                setSubmissionMap(map)
            }
        } catch (error) {
            console.warn("Could not load submission statuses:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUploadSuccess = async () => {
        await fetchData()
        // Proactively refetch dashboard data to update summary counts
        try {
            await getStudentDashboard()
        } catch (e) {
            console.error("Failed to sync dashboard", e)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const getStatusLabel = (assignmentId) => {
        const submission = submissionMap[assignmentId]
        if (!submission) return "Not Submitted"
        if (submission.status === "graded") return "Graded"
        return "Submitted"
    }

    const filteredAssignments = assignments.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">
                <div className="h-16 bg-bg-subtle rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-56 bg-bg-subtle rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-xl font-bold text-text-primary tracking-tight font-heading">Academic Tasks</h1>
                    <p className="text-text-muted mt-1 text-sm">Manage your assignments and track submission progress.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Find a task..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:shadow-glow transition-all w-full md:w-56"
                    />
                </div>
            </div>

            {filteredAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAssignments.map((assignment) => {
                        const submission = submissionMap[assignment._id]
                        const statusLabel = getStatusLabel(assignment._id)
                        const deadlineDate = new Date(assignment.deadline)
                        const isExpired = deadlineDate < new Date()
                        const daysUntil = Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
                        const isUrgent = daysUntil <= 2 && daysUntil >= 0

                        return (
                            <DashboardCard
                                key={assignment._id}
                                padding={false}
                                className="flex flex-col h-full group"
                            >
                                <div className="p-5 flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 bg-primary-subtle rounded-lg group-hover:bg-primary/10 transition-colors">
                                            <FileText className="w-4 h-4 text-primary" />
                                        </div>
                                        <StatusBadge status={statusLabel} />
                                    </div>

                                    <h3 className="text-sm font-bold text-text-primary font-heading leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {assignment.title}
                                    </h3>
                                    <p className="text-[10px] text-text-muted font-semibold uppercase tracking-widest mb-3 font-heading">
                                        {assignment.subject?.name}
                                    </p>

                                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed mb-4">
                                        {assignment.description}
                                    </p>

                                    <div className="flex items-center gap-4 py-2.5 px-3 bg-bg-subtle rounded-md border border-border">
                                        <div className="flex items-center text-xs font-medium text-text-muted">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                            {deadlineDate.toLocaleDateString()}
                                        </div>
                                        <div className={clsx(
                                            "flex items-center text-[10px] font-bold uppercase tracking-wider font-heading",
                                            isExpired ? "text-danger" : isUrgent ? "text-danger animate-pulse" : "text-warning"
                                        )}>
                                            <Clock className="w-3 h-3 mr-1" />
                                            {isExpired ? "Closed" : isUrgent ? "Due Soon" : "Active"}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-5 py-3.5 bg-bg-subtle/30 border-t border-border flex items-center justify-between mt-auto">
                                    {submission?.status === "graded" ? (
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-text-muted" />
                                            <span className="text-sm font-bold text-text-primary font-heading">Result: {submission.grade}</span>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-semibold text-text-muted uppercase tracking-widest font-heading">
                                            {statusLabel === "Submitted" ? "Review Pending" : isExpired ? "Expired" : "Ready for Submission"}
                                        </div>
                                    )}

                                    {statusLabel === "Not Submitted" && !isExpired && (
                                        <button
                                            onClick={() => {
                                                setSelectedAssignment(assignment)
                                                setIsModalOpen(true)
                                            }}
                                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors uppercase tracking-widest group/btn font-heading"
                                        >
                                            Upload <Upload size={13} strokeWidth={2.5} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </DashboardCard>
                        )
                    })}
                </div>
            ) : (
                <EmptyState
                    title={searchQuery ? "No matches found" : "No assignments available"}
                    description={searchQuery ? "Try adjusting your search criteria." : "You're all caught up! Enjoy your free time or review your notes."}
                    icon={GraduationCap}
                />
            )}

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedAssignment(null)
                }}
                assignment={selectedAssignment}
                onUploadSuccess={handleUploadSuccess}
            />
        </div>
    )
}

export default StudentAssignments
