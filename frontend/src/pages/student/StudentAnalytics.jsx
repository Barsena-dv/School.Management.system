import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, Activity, BookOpen } from 'lucide-react'
import { fetchStudentAnalytics } from '../../services/analyticsService'
import StatsCard from './components/StatsCard'
import SubjectPieChart from './components/SubjectPieChart'
import Spinner from '../../components/ui/Spinner'
import EmptyState from '../../components/ui/EmptyState'

const StudentAnalytics = () => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true)
                const res = await fetchStudentAnalytics()
                setData(res.data)
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analytics')
            } finally {
                setLoading(false)
            }
        }
        loadAnalytics()
    }, [])

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-danger-subtle text-danger p-4 rounded-lg font-medium shadow-sm">Error: {error}</div>
            </div>
        )
    }

    if (!data) {
        return <EmptyState title="No Analytics Data" description="We couldn't find any analytics data for your account." />
    }

    const {
        overallPercentage,
        attendancePercentage,
        strongSubjects,
        weakSubjects,
        subjectAverages
    } = data

    // Determine Best and Weakest Subject globally simply based on avg array
    const sortedSubjects = [...subjectAverages].sort((a, b) => b.average - a.average)
    const bestSubject = sortedSubjects.length > 0 ? sortedSubjects[0] : null
    const weakestSubject = sortedSubjects.length > 0 ? sortedSubjects[sortedSubjects.length - 1] : null

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Performance Analytics</h1>
                <p className="text-text-secondary mt-2 text-sm md:text-base">
                    Track your overall academic standing, attendance records, and subject-wise metrics.
                </p>
            </div>

            {/* Stats Cards Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Overall Percentage"
                    value={`${overallPercentage}%`}
                    icon={Activity}
                    description="Across all assessments"
                />
                <StatsCard
                    title="Attendance"
                    value={`${attendancePercentage}%`}
                    icon={CheckCircle}
                    description="Classes attended"
                />
                <StatsCard
                    title="Strong Subjects"
                    value={strongSubjects.length}
                    icon={BookOpen}
                    description="Subject averages > 75%"
                />
                <StatsCard
                    title="Weak Subjects"
                    value={weakSubjects.length}
                    icon={AlertTriangle}
                    description="Subject averages < 40%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subject Distribution Chart */}
                <div className="bg-bg-primary p-6 rounded-xl shadow-sm border border-border-light lg:col-span-1">
                    <h2 className="text-lg font-semibold text-text-primary mb-6">Subject Averages</h2>
                    <SubjectPieChart data={subjectAverages} />
                </div>

                {/* Sub-Averages Table & Insights */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Insights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-success-subtle/50 p-6 rounded-xl shadow-sm border border-success/20 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-success">Top Performing Subject</p>
                                <p className="text-xl font-bold text-green-900 mt-1">
                                    {bestSubject ? bestSubject.subjectName : 'N/A'}
                                </p>
                            </div>
                            <div className="text-success font-semibold bg-green-100 px-3 py-1 rounded-full text-sm">
                                {bestSubject ? `${bestSubject.average}%` : '-'}
                            </div>
                        </div>

                        <div className="bg-danger-subtle/50 p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-danger">Needs Improvement</p>
                                <p className="text-xl font-bold text-red-900 mt-1">
                                    {weakestSubject ? weakestSubject.subjectName : 'N/A'}
                                </p>
                            </div>
                            <div className="text-danger font-semibold bg-red-100 px-3 py-1 rounded-full text-sm">
                                {weakestSubject ? `${weakestSubject.average}%` : '-'}
                            </div>
                        </div>
                    </div>

                    {/* Detailed Data Table */}
                    <div className="bg-bg-primary rounded-xl shadow-sm border border-border-light overflow-hidden">
                        <div className="px-6 py-4 border-b border-border-light">
                            <h2 className="text-lg font-semibold text-text-primary">Subject Details</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-bg-secondary text-text-secondary uppercase">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 font-medium">Subject Name</th>
                                        <th scope="col" className="px-6 py-3 font-medium">Average %</th>
                                        <th scope="col" className="px-6 py-3 font-medium text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjectAverages.length > 0 ? (
                                        subjectAverages.map((subject, idx) => {
                                            const isStrong = subject.average > 75
                                            const isWeak = subject.average < 40
                                            const status = isStrong ? 'Strong' : isWeak ? 'Weak' : 'Normal'
                                            const statusColors = isStrong
                                                ? 'bg-green-100 text-success'
                                                : isWeak
                                                    ? 'bg-red-100 text-danger'
                                                    : 'bg-gray-100 text-gray-700'
                                            return (
                                                <tr key={idx} className="border-b border-border-light hover:bg-bg-secondary/50">
                                                    <td className="px-6 py-4 font-medium text-text-primary">{subject.subjectName}</td>
                                                    <td className="px-6 py-4 font-semibold text-text-primary">{subject.average}%</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors}`}>
                                                            {status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-8 text-center text-text-secondary">
                                                No subject records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentAnalytics
