import { clsx } from 'clsx'
import { Hash, UserCheck, UserX } from 'lucide-react'

// ── Skeleton row ───────────────────────────────────────────────────────────
const SkeletonRow = () => (
    <tr>
        <td className="px-5 py-4"><div className="h-4 w-16 bg-neutral-100 rounded-full animate-pulse" /></td>
        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-xl bg-neutral-100 animate-pulse" /><div className="h-4 w-28 bg-neutral-100 rounded-full animate-pulse" /></div></td>
        <td className="px-5 py-4"><div className="h-8 w-24 bg-neutral-100 rounded-xl animate-pulse" /></td>
        <td className="px-5 py-4"><div className="h-8 w-24 bg-neutral-100 rounded-xl animate-pulse" /></td>
    </tr>
)

// ── Status radio button ────────────────────────────────────────────────────
const StatusToggle = ({ studentId, value, onChange }) => {
    const options = [
        { label: 'Present', value: 'present', icon: UserCheck, active: 'bg-green-500 text-white border-green-500', inactive: 'bg-white text-neutral-500 border-neutral-200 hover:border-green-300 hover:text-green-600' },
        { label: 'Absent', value: 'absent', icon: UserX, active: 'bg-red-500 text-white border-red-500', inactive: 'bg-white text-neutral-500 border-neutral-200 hover:border-red-300 hover:text-red-500' },
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
                <thead className="bg-neutral-50/80 border-b border-neutral-100">
                    <tr>
                        {['Roll No.', 'Student Name', 'Present', 'Absent'].map(h => (
                            <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em]">{h}</th>
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
                <div className="w-14 h-14 bg-neutral-50 rounded-3xl flex items-center justify-center mb-3 border border-neutral-100">
                    <UserCheck className="w-6 h-6 text-neutral-300" />
                </div>
                <p className="text-sm font-bold text-neutral-900">No students enrolled</p>
                <p className="text-xs text-neutral-400 font-medium mt-1">Students enrolled in this subject will appear here.</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-neutral-50/80 border-b border-neutral-100">
                    <tr>
                        {['Roll No.', 'Student Name', 'Present', 'Absent'].map(h => (
                            <th key={h} className="px-5 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] whitespace-nowrap">{h}</th>
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
                                    status === 'present' ? 'bg-green-50/40' : status === 'absent' ? 'bg-red-50/30' : 'hover:bg-neutral-50/60'
                                )}
                            >
                                {/* Roll number */}
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-1.5">
                                        <Hash size={12} className="text-neutral-300" />
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
                                                    'bg-neutral-100 text-neutral-600 border-neutral-100 group-hover:bg-white'
                                        )}>
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-bold text-neutral-900 whitespace-nowrap">{student.name}</span>
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
                                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-green-300 hover:text-green-600'
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
                                                : 'bg-white text-neutral-500 border-neutral-200 hover:border-red-300 hover:text-red-500'
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
