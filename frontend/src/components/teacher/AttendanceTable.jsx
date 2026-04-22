import { clsx } from 'clsx'
import { Hash, UserCheck, UserX } from 'lucide-react'

// ── Skeleton row ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        <td className="px-5 py-4"><div className="h-4 w-16 bg-bg-subtle rounded-full animate-pulse" /></td>
        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-bg-subtle animate-pulse" /><div className="h-4 w-28 bg-bg-subtle rounded-full animate-pulse" /></div></td>
        <td className="px-5 py-4"><div className="h-8 w-24 bg-bg-subtle rounded-xl animate-pulse" /></td>
        <td className="px-5 py-4"><div className="h-8 w-24 bg-bg-subtle rounded-xl animate-pulse" /></td>
    </tr>
)

// ── Status radio button ────────────────────────────────────────────────────
const StatusToggle = ({ studentId, value, onChange }) => {
    const options = [
        { label: 'Present', value: 'present', icon: UserCheck, active: 'bg-green-500 text-white border-green-500', inactive: 'bg-surface text-text-muted border-border hover:border-green-300 hover:text-green-600' },
        { label: 'Absent', value: 'absent', icon: UserX, active: 'bg-red-500 text-white border-red-500', inactive: 'bg-surface text-text-muted border-border hover:border-red-300 hover:text-red-500' },
    ]

    return (
        <div className="flex gap-2">
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(studentId, opt.value)}
                    className={clsx(
                        'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all',
                        value === opt.value ? opt.active : opt.inactive
                    )}
                >
                    <opt.icon size={13} strokeWidth={2.5} />
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

// ── Attendance table ───────────────────────────────────────────────────────
const AttendanceTable = ({ students, attendance, onAttendanceChange, loading }) => {
    if (loading) {
        return (
            <table className="w-full text-left">
                <thead className="bg-bg-subtle/80 border-b border-border">
                    <tr>
                        {['Roll No.', 'Student Name', 'Present', 'Absent'].map(h => (
                            <th key={h} className="px-5 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em]">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                    <SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow />
                </tbody>
            </table>
        )
    }

    if (students.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-14 h-14 bg-bg-subtle rounded-lg flex items-center justify-center mb-3 border border-border">
                    <UserCheck className="w-6 h-6 text-text-muted/40" />
                </div>
                <p className="text-sm font-bold text-text-primary">No students enrolled</p>
                <p className="text-xs text-text-muted font-medium mt-1">Students enrolled in this subject will appear here.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-bg-subtle/80 border-b border-border">
                    <tr>
                        {['Roll No.', 'Student Name', 'Present', 'Absent'].map(h => (
                            <th key={h} className="px-5 py-4 text-[10px] font-black text-text-muted uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                    {students.map((student, idx) => {
                        const status = attendance[student.studentId]
                        return (
                            <tr key={student.studentId || idx}
                                className={clsx(
                                    'transition-colors group',
                                    status === 'present' ? 'bg-green-50/40' : status === 'absent' ? 'bg-red-50/30' : 'hover:bg-bg-subtle/60'
                                )}
                            >
                                {/* Roll number */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Hash size={12} className="text-text-muted/40" />
                                        <span className="text-sm font-black text-neutral-700">{student.rollNumber}</span>
                                    </div>
                                </td>

                                {/* Name */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 border transition-colors',
                                            status === 'present' ? 'bg-green-100 text-green-700 border-green-100' :
                                                status === 'absent' ? 'bg-red-100 text-red-600 border-red-100' :
                                                    'bg-bg-subtle text-text-secondary border-border group-hover:bg-white'
                                        )}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-text-primary whitespace-nowrap">{student.name}</span>
                                    </div>
                                </td>

                                {/* Present radio */}
                                <td className="px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={() => onAttendanceChange(student.studentId, 'present')}
                                        className={clsx(
                                            'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all',
                                            status === 'present'
                                                ? 'bg-green-500 text-white border-green-500 shadow-sm'
                                                : 'bg-surface text-text-muted border-border hover:border-green-300 hover:text-green-600'
                                        )}
                                    >
                                        <UserCheck size={13} strokeWidth={2.5} />
                                        Present
                                    </button>
                                </td>

                                {/* Absent radio */}
                                <td className="px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={() => onAttendanceChange(student.studentId, 'absent')}
                                        className={clsx(
                                            'flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all',
                                            status === 'absent'
                                                ? 'bg-red-500 text-white border-red-500 shadow-sm'
                                                : 'bg-surface text-text-muted border-border hover:border-red-300 hover:text-red-500'
                                        )}
                                    >
                                        <UserX size={13} strokeWidth={2.5} />
                                        Absent
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AttendanceTable
