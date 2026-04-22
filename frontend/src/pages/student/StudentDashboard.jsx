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
                <p className="text-sm text-text-muted mt-4 animate-pulse uppercase tracking-widest font-semibold font-heading">
                    Loading Dashboard
                </p>
            </div>
        )
    }

    const { profile, attendance, upcomingAssessments, recentMarks, summary } = stats || {}

    return (
        <div className="max-w-7xl mx-auto space-y-8 py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight font-heading">
                        Student Hub
                    </h1>
                    <p className="text-text-muted mt-1 text-sm">
                        Welcome back, <span className="text-text-primary font-semibold">{profile?.name || 'Explorer'}</span>
                    </p>
                </div>
                <button
                    className="relative p-2.5 rounded-lg border border-border bg-surface hover:border-primary/30 transition-all group"
                >
                    <Bell className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                    {(summary?.unreadNotificationsCount || 0) > 0 && (
                        <span
                            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                            style={{ background: 'var(--danger)', boxShadow: '0 0 6px rgba(239,68,68,0.4)' }}
                        >
                            {summary.unreadNotificationsCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Top Row: Profile & Attendance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Profile Card */}
                <DashboardCard title="Student Profile" icon={User} className="h-full">
                    <div className="flex items-center gap-4 mt-3">
                        <div
                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg font-heading"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                                boxShadow: '0 0 12px var(--primary-glow)',
                            }}
                        >
                            {profile?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <p className="text-base font-bold text-text-primary font-heading">{profile?.name}</p>
                            <p className="text-sm text-text-muted">{profile?.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="navy">{profile?.className || 'No Class'}</Badge>
                                <Badge variant="info">ID: {profile?.rollNumber || 'N/A'}</Badge>
                            </div>
                        </div>
                    </div>
                </DashboardCard>

                {/* Attendance Card */}
                <DashboardCard title="Attendance Health" icon={TrendingUp} className="h-full">
                    <div className="mt-3 text-center py-2">
                        <div className="text-4xl font-bold text-text-primary tracking-tighter font-heading">
                            {attendance?.percentage || 0}<span className="text-xl text-text-muted ml-0.5">%</span>
                        </div>
                        <div className="mt-4 w-full h-2.5 bg-bg-subtle rounded-full overflow-hidden">
                            <div
                                className={clsx(
                                    "h-full rounded-full transition-all duration-1000 ease-out",
                                    attendance?.status === 'Excellent' ? 'bg-success' :
                                        attendance?.status === 'Warning' ? 'bg-warning' : 'bg-danger'
                                )}
                                style={{
                                    width: `${attendance?.percentage || 0}%`,
                                    boxShadow: attendance?.status === 'Excellent'
                                        ? '0 0 8px rgba(16,185,129,0.4)'
                                        : attendance?.status === 'Warning'
                                            ? '0 0 8px rgba(245,158,11,0.4)'
                                            : '0 0 8px rgba(239,68,68,0.4)',
                                }}
                            />
                        </div>
                        <p className="text-xs text-text-muted mt-3 font-medium uppercase tracking-widest font-heading">
                            Status: <span className={clsx(
                                'font-bold',
                                attendance?.status === 'Excellent' ? 'text-success' :
                                    attendance?.status === 'Warning' ? 'text-warning' : 'text-danger'
                            )}>{attendance?.status || 'Unknown'}</span>
                        </p>
                    </div>
                </DashboardCard>
            </div>

            {/* Second Row: Upcoming Assessments */}
            <div className="space-y-1">
                <SectionHeader
                    title="Upcoming Assessments"
                    description="Tests and deadlines for the next 7 days"
                />
                {upcomingAssessments?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingAssessments.map((assessment, idx) => (
                            <div
                                key={idx}
                                className="bg-surface p-5 rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="p-2 bg-primary-subtle rounded-lg group-hover:bg-primary/10 transition-colors">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <Badge variant="warning">{assessment.daysLeft}d left</Badge>
                                </div>
                                <h4 className="font-bold text-text-primary font-heading leading-snug text-sm">{assessment.title}</h4>
                                <p className="text-[11px] text-text-muted font-semibold uppercase tracking-widest mt-1 mb-3">{assessment.subject}</p>
                                <div className="flex items-center text-xs text-text-secondary bg-bg-subtle p-2.5 rounded-md border border-border">
                                    <Clock className="w-3.5 h-3.5 mr-2 text-text-muted" />
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

            {/* Third Row: Recent Marks */}
            <div className="space-y-1">
                <SectionHeader
                    title="Recent Academic Performance"
                    description="Latest results from your graded assessments"
                />
                <DashboardCard padding={false} className="overflow-hidden">
                    {recentMarks?.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-bg-subtle/50 border-b border-border">
                                    <tr>
                                        {['Assessment', 'Subject', 'Score', 'Result'].map(h => (
                                            <th key={h} className="px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest font-heading">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {recentMarks.map((mark, idx) => (
                                        <tr key={idx} className="hover:bg-bg-subtle/30 transition-colors group">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center">
                                                    <div className="w-7 h-7 rounded-md bg-primary-subtle mr-3 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                                                        <FileText size={13} />
                                                    </div>
                                                    <span className="text-sm font-semibold text-text-primary">{mark.assessmentTitle}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs font-medium text-text-muted">{mark.subject}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="text-sm font-bold text-text-primary font-heading">{mark.percentage}%</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <Badge variant={mark.result === 'Pass' ? 'success' : 'danger'}>
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
