import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import { BookMarked, ClipboardList, GraduationCap } from 'lucide-react'

const TeacherDashboard = () => {
    return (
        <div className="space-y-7">
            <div className="border-b border-border pb-5">
                <h2 className="text-xl font-bold tracking-tight text-text-primary font-heading">Teacher Portal</h2>
                <p className="text-text-muted mt-1 text-sm">Review your classes and student performance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard
                    title="Active Subjects"
                    value="4"
                    description="Sections under management"
                    icon={BookMarked}
                />
                <StatCard
                    title="Pending Marks"
                    value="28"
                    description="Submissions awaiting review"
                    icon={GraduationCap}
                />
                <StatCard
                    title="Class Attendance"
                    value="88%"
                    description="Average across all sections"
                    icon={ClipboardList}
                />

                <Card className="lg:col-span-2">
                    <Card.Header>
                        <Card.Title>Today's Schedule</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-4">
                            {[
                                { time: '09:00 AM', label: 'Physics - Section A (Room 402)' },
                                { time: '11:30 AM', label: 'Mathematics - Section B (Room 205)' },
                                { time: '02:00 PM', label: 'Student Consultation Hours' }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4 items-center group">
                                    <div className="w-16 text-[0.7rem] font-semibold text-text-muted group-hover:text-primary transition-colors font-heading">
                                        {s.time}
                                    </div>
                                    <div
                                        className="h-6 w-px transition-colors"
                                        style={{
                                            background: 'var(--border)',
                                        }}
                                    />
                                    <div className="flex-1 text-sm font-medium text-text-primary group-hover:translate-x-1 transition-transform">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default TeacherDashboard
