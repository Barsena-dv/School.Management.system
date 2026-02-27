import Badge from '@/components/ui/Badge'
import DashboardCard from '@/components/ui/DashboardCard'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import { getStudentDashboard } from '@/services/dashboardService'
import { showError } from '@/utils/toast'
import { clsx } from 'clsx'
import {
    Bell,
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    GraduationCap,
    TrendingUp,
    User
} from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await getStudentDashboard()
                if (response.success) {
                    setStats(response.data)
                }
            } catch (error) {
                showError("Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
                <p className="text-sm text-neutral-500 mt-4 animate-pulse uppercase tracking-widest font-semibold">
                    Preparing Academic Portal
                </p>
            </div>
        )
    }

    const { profile, attendance, upcomingAssessments, recentMarks, summary } = stats || {}

    return (
        <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 sm:px-6 lg:px-8">
            {/* Header with Notification Badge */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Student Hub</h1>
                    <p className="text-neutral-500 mt-1 font-medium">Welcome back, {profile?.name || 'Explorer'}.</p>
                </div>
                <div className="relative p-2.5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:bg-neutral-50 transition-colors cursor-pointer group">
                    <Bell className="w-6 h-6 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
                    {(summary?.unreadNotificationsCount || 0) > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                            {summary.unreadNotificationsCount}
                        </span>
                    )}
                </div>
            </div>

            {/* Top Row: Profile & Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Card */}
                <DashboardCard
                    title="Student Profile"
                    icon={User}
                    className="h-full"
                >
                    <div className="flex items-center gap-5 mt-2">
                        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-bold text-xl shadow-inner">
                            {profile?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-neutral-900 leading-tight">{profile?.name}</p>
                            <p className="text-sm text-neutral-500 font-medium">{profile?.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="navy" className="rounded-lg shadow-sm">
                                    {profile?.className || 'No Class'}
                                </Badge>
                                <Badge variant="info" className="rounded-lg shadow-sm">
                                    ID: {profile?.rollNumber || 'N/A'}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DashboardCard>

                {/* Attendance Card */}
                <DashboardCard
                    title="Attendance Health"
                    icon={TrendingUp}
                    className="h-full"
                >
                    <div className="mt-2 text-center py-2">
                        <div className="text-5xl font-black text-neutral-900 tracking-tighter">
                            {attendance?.percentage || 0}<span className="text-2xl text-neutral-400 ml-1">%</span>
                        </div>
                        <div className="mt-4 w-full h-3 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200 shadow-inner">
                            <div
                                className={clsx(
                                    "h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                    attendance?.status === 'Excellent' ? 'bg-green-600' :
                                        attendance?.status === 'Warning' ? 'bg-amber-500' : 'bg-red-600'
                                )}
                                style={{ width: `${attendance?.percentage || 0}%` }}
                            />
                        </div>
                        <p className="text-xs text-neutral-500 mt-3 font-semibold uppercase tracking-widest">
                            Attendance Status: <span className={clsx(
                                attendance?.status === 'Excellent' ? 'text-green-600' :
                                    attendance?.status === 'Warning' ? 'text-amber-600' : 'text-red-600'
                            )}>{attendance?.status || 'Unknown'}</span>
                        </p>
                    </div>
                </DashboardCard>
            </div>

            {/* Second Row: Upcoming Assessments */}
            <div className="space-y-4">
                <SectionHeader
                    title="Upcoming Assessments"
                    description="Tests and deadlines for the next 7 days"
                />
                <div className="grid grid-cols-1 gap-4">
                    {upcomingAssessments?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingAssessments.map((assessment, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-neutral-50 rounded-xl group-hover:bg-neutral-100 transition-colors">
                                            <Calendar className="w-5 h-5 text-neutral-600" />
                                        </div>
                                        <Badge variant="warning" className="rounded-lg">{assessment.daysLeft}d left</Badge>
                                    </div>
                                    <h4 className="font-bold text-neutral-900 leading-snug">{assessment.title}</h4>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest mt-1 mb-4">{assessment.subject}</p>
                                    <div className="flex items-center text-xs text-neutral-600 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                                        <Clock className="w-3.5 h-3.5 mr-2" />
                                        <span className="font-medium">{new Date(assessment.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No upcoming assessments"
                            description="You're all caught up! Take this time to review previous lessons."
                            icon={CheckCircle2}
                        />
                    )}
                </div>
            </div>

            {/* Third Row: Recent Marks */}
            <div className="space-y-4">
                <SectionHeader
                    title="Recent Academic Performance"
                    description="Latest results from your graded assessments"
                />
                <DashboardCard padding={false} className="overflow-hidden">
                    {recentMarks?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50/50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Assessment</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Subject</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Score</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {recentMarks.map((mark, idx) => (
                                        <tr key={idx} className="hover:bg-neutral-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 mr-3 flex items-center justify-center text-neutral-500 group-hover:bg-white transition-colors">
                                                        <FileText size={14} />
                                                    </div>
                                                    <span className="text-sm font-bold text-neutral-900">{mark.assessmentTitle}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-semibold text-neutral-500 tracking-tight">{mark.subject}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-neutral-900">{mark.percentage}%</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge
                                                    variant={mark.result === 'Pass' ? 'success' : 'danger'}
                                                    className="rounded-lg px-3 py-1 font-bold tracking-tight shadow-sm"
                                                >
                                                    {mark.result}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8">
                            <EmptyState
                                title="No marks available"
                                description="Your assessment results will appear here once graded by teachers."
                                icon={GraduationCap}
                            />
                        </div>
                    )}
                </DashboardCard>
            </div>
        </div>
    )
}

export default StudentDashboard
