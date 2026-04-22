import Badge from '@/components/ui/Badge'
import DashboardCard from '@/components/ui/DashboardCard'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError } from '@/utils/toast'
import { FileText, GraduationCap } from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentMarks = () => {
    const [marks, setMarks] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMarks = async () => {
        try {
            const res = await api.get('/marks/me')
            if (res.data.success) {
                setMarks(res.data.data.marks || [])
            }
        } catch (error) {
            showError("Failed to fetch academic marks")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMarks()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    const processedMarks = marks.map(mark => {
        const percentage = mark.assessment ? Math.round((mark.marksObtained / mark.assessment.maxMarks) * 100) : 0
        return { ...mark, percentage, isPassing: percentage >= 40 }
    })

    const averageScore = processedMarks.length > 0
        ? Math.round(processedMarks.reduce((acc, curr) => acc + curr.percentage, 0) / processedMarks.length)
        : 0

    const passingRate = processedMarks.length > 0
        ? Math.round((processedMarks.filter(m => m.isPassing).length / processedMarks.length) * 100)
        : 0

    const statItems = [
        { label: 'Average Score', value: `${averageScore}%`, color: 'var(--primary)' },
        { label: 'Assessments', value: processedMarks.length, color: 'var(--text-primary)' },
        { label: 'Passing Rate', value: `${passingRate}%`, color: 'var(--success)' },
    ]

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
            <div className="border-b border-border pb-5">
                <h1 className="text-xl font-bold text-text-primary tracking-tight font-heading">Academic Results</h1>
                <p className="text-text-muted mt-1 text-sm">Review your assessment marks and overall academic performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statItems.map(({ label, value, color }) => (
                    <DashboardCard key={label} padding={false}>
                        <div className="p-5 text-center">
                            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2 block font-heading">{label}</span>
                            <div className="text-4xl font-bold font-heading" style={{ color }}>{value}</div>
                        </div>
                    </DashboardCard>
                ))}
            </div>

            <SectionHeader title="Assessment Log" description="Detailed breakdown of your graded assignments and exams" />

            <DashboardCard padding={false} className="overflow-hidden">
                {processedMarks.length === 0 ? (
                    <div className="p-10">
                        <EmptyState icon={GraduationCap} title="No Marks Yet" description="You haven't received any grades for your assessments yet." />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-subtle/50 border-b border-border">
                                <tr>
                                    {['Assessment', 'Subject', 'Score', 'Progress'].map(h => (
                                        <th key={h} className={`px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest font-heading ${h === 'Score' ? 'text-right' : h === 'Progress' ? 'text-center' : ''}`}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {processedMarks.map(mark => (
                                    <tr key={mark._id} className="hover:bg-bg-subtle/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center text-sm font-medium text-text-primary">
                                                <div className="w-7 h-7 rounded-md bg-primary-subtle mr-3 flex-shrink-0 flex items-center justify-center text-primary">
                                                    <FileText size={13} />
                                                </div>
                                                {mark.assessment?.title || 'Unknown Assessment'}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs font-medium text-text-muted bg-bg-subtle px-2 py-1 rounded-md">
                                                {mark.assessment?.subject?.name || 'Various'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <span className="text-sm font-bold text-text-primary font-heading">
                                                {mark.marksObtained} <span className="text-text-muted font-medium text-xs">/ {mark.assessment?.maxMarks}</span>
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-center gap-2.5">
                                                <div className="w-20 h-2 bg-bg-subtle rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${Math.min(mark.percentage, 100)}%`,
                                                            background: mark.isPassing ? 'var(--success)' : 'var(--danger)',
                                                            boxShadow: mark.isPassing
                                                                ? '0 0 6px rgba(16,185,129,0.4)'
                                                                : '0 0 6px rgba(239,68,68,0.4)',
                                                        }}
                                                    />
                                                </div>
                                                <Badge variant={mark.isPassing ? 'success' : 'danger'}>
                                                    {mark.percentage}%
                                                </Badge>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </DashboardCard>
        </div>
    )
}

export default StudentMarks
