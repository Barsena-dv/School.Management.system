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
        try {
            const [assignRes, subRes] = await Promise.all([
                api.get('/assignments'),
                api.get('/submissions/my')
            ])

            if (assignRes.data.success) {
                setAssignments(assignRes.data.data?.assignments || [])
            }
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
            showError("Failed to load academic data")
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
            <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8">
                <div className="h-20 bg-neutral-50 rounded-3xl animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-neutral-50 rounded-3xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Academic Tasks</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Manage your assignments and track submission progress.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:text-neutral-900 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find a task..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {filteredAssignments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                className="hover:shadow-lg transition-all duration-300 group flex flex-col h-full bg-white border-neutral-200"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-neutral-50 rounded-2xl group-hover:bg-neutral-100 transition-colors">
                                            <FileText className="w-5 h-5 text-neutral-600" />
                                        </div>
                                        <StatusBadge status={statusLabel} />
                                    </div>

                                    <h3 className="text-lg font-bold text-neutral-900 leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">
                                        {assignment.title}
                                    </h3>
                                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-4">
                                        {assignment.subject?.name}
                                    </p>

                                    <p className="text-sm text-neutral-600 line-clamp-2 font-medium leading-relaxed mb-6">
                                        {assignment.description}
                                    </p>

                                    <div className="flex items-center gap-4 py-3 px-4 bg-neutral-50 rounded-2xl border border-neutral-100/50">
                                        <div className="flex items-center text-xs font-bold text-neutral-500">
                                            <Calendar className="w-3.5 h-3.5 mr-2" />
                                            {deadlineDate.toLocaleDateString()}
                                        </div>
                                        <div className={clsx(
                                            "flex items-center text-[10px] font-black uppercase tracking-wider",
                                            isExpired ? "text-red-500" : isUrgent ? "text-red-600 animate-pulse" : "text-amber-600"
                                        )}>
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            {isExpired ? "Closed" : isUrgent ? "Due Soon" : "Active"}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-neutral-50/30 border-t border-neutral-100 flex items-center justify-between mt-auto">
                                    {submission?.status === "graded" ? (
                                        <div className="flex items-center gap-2">
                                            <GraduationCap className="w-4 h-4 text-neutral-400" />
                                            <span className="text-sm font-black text-neutral-900">Result: {submission.grade}</span>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                            {statusLabel === "Submitted" ? "Review Pending" : isExpired ? "Expired" : "Ready for Submission"}
                                        </div>
                                    )}

                                    {statusLabel === "Not Submitted" && !isExpired && (
                                        <button
                                            onClick={() => {
                                                setSelectedAssignment(assignment)
                                                setIsModalOpen(true)
                                            }}
                                            className="flex items-center gap-2 text-xs font-black text-neutral-900 hover:text-neutral-600 transition-colors uppercase tracking-widest group/btn"
                                        >
                                            Upload <Upload size={14} strokeWidth={3} className="group-hover/btn:-translate-y-0.5 transition-transform" />
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
