import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import { Calendar, CheckCircle, Clock } from 'lucide-react'

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">Admin Overview</h2>
                <p className="text-text-secondary mt-1">Manage institutional operations and user approvals.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="User Approvals"
                    value="12"
                    description="Pending registration requests"
                    icon={Clock}
                />
                <StatCard
                    title="Active Classes"
                    value="48"
                    description="Ongoing across all departments"
                    icon={CheckCircle}
                />
                <StatCard
                    title="System Events"
                    value="5"
                    description="Upcoming academic milestones"
                    icon={Calendar}
                />

                <Card
                    className="lg:col-span-2"
                >
                    <Card.Header>
                        <Card.Title>Recent System Notifications</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <div className="space-y-1">
                            {[
                                { msg: 'System maintenance scheduled', time: '2h ago' },
                                { msg: 'New teacher application: John Doe', time: '5h ago' },
                                { msg: 'End of term reports generated', time: 'Yesterday' }
                            ].map((n, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-bg-subtle transition-colors px-2 -mx-2 rounded-md group">
                                    <span className="text-sm text-text-primary group-hover:text-primary transition-colors">{n.msg}</span>
                                    <span className="text-xs text-text-muted font-medium">{n.time}</span>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
