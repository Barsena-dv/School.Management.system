import Badge from '@/components/ui/Badge'
import DashboardCard from '@/components/ui/DashboardCard'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError } from '@/utils/toast'
import { CalendarCheck, CalendarRange } from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentAttendance = () => {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAttendance = async () => {
        try {
            const res = await api.get('/attendance')
            if (res.data.success) {
                setRecords(res.data.data.attendance || [])
            }
        } catch (error) {
            showError("Failed to fetch attendance records")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAttendance()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    const totalRecords = records.length
    const presentRecords = records.filter(r => r.status === 'present').length
    const absentRecords = records.filter(r => r.status === 'absent').length
    const lateRecords = records.filter(r => r.status === 'late').length
    const overallPercentage = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0

    const statItems = [
        { label: 'Overall %', value: `${overallPercentage}%`, color: 'var(--primary)' },
        { label: 'Present', value: presentRecords, color: 'var(--success)' },
        { label: 'Absent', value: absentRecords, color: 'var(--danger)' },
        { label: 'Late', value: lateRecords, color: 'var(--warning)' },
    ]

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
            <div className="border-b border-border pb-5">
                <h1 className="text-xl font-bold text-text-primary tracking-tight font-heading">Attendance Record</h1>
                <p className="text-text-muted mt-1 text-sm">Review your historical attendance across all subjects</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statItems.map(({ label, value, color }) => (
                    <DashboardCard key={label} padding={false}>
                        <div className="p-4 text-center">
                            <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest mb-2 block font-heading">{label}</span>
                            <div className="text-3xl font-bold font-heading" style={{ color }}>{value}</div>
                        </div>
                    </DashboardCard>
                ))}
            </div>

            <SectionHeader title="Detailed Log" description="Showing recent attendance markings" />

            <DashboardCard padding={false} className="overflow-hidden">
                {records.length === 0 ? (
                    <div className="p-10">
                        <EmptyState
                            icon={CalendarRange}
                            title="No Attendance Data"
                            description="No attendance records have been marked for your subjects yet."
                        />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-bg-subtle/50 border-b border-border">
                                <tr>
                                    {['Date', 'Subject', 'Status'].map(h => (
                                        <th key={h} className="px-5 py-3 text-[10px] font-bold text-text-muted uppercase tracking-widest font-heading">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {records.map(record => (
                                    <tr key={record._id} className="hover:bg-bg-subtle/30 transition-colors">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center text-sm font-medium text-text-primary whitespace-nowrap">
                                                <CalendarCheck size={15} className="text-text-muted mr-2.5" />
                                                {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-text-secondary">
                                            {record.subject?.name || 'Unknown Subject'}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <Badge
                                                variant={record.status === 'present' ? 'success' : record.status === 'absent' ? 'danger' : 'warning'}
                                            >
                                                {record.status}
                                            </Badge>
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

export default StudentAttendance
