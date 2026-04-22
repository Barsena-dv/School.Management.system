import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { clsx } from 'clsx'
import { Bell, BookOpen, Calendar, Check, CheckCircle2, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications')
            if (res.data.success) {
                setNotifications(res.data.data.notifications || [])
            }
        } catch (error) {
            showError("Failed to fetch notifications")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotifications()
    }, [])

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`)
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
            showSuccess("Marked as read")
        } catch (error) {
            showError("Failed to update notification")
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    const typeConfig = {
        assignment: { icon: BookOpen, bg: 'var(--primary-subtle)', color: 'var(--primary)' },
        assessment: { icon: Star, bg: 'var(--warning-subtle)', color: 'var(--warning)' },
        grade: { icon: CheckCircle2, bg: 'var(--success-subtle)', color: 'var(--success)' },
        event: { icon: Calendar, bg: 'var(--accent-subtle)', color: 'var(--accent)' },
        approval: { icon: Bell, bg: 'var(--danger-subtle)', color: 'var(--danger)' }
    }

    return (
        <div className="max-w-5xl mx-auto py-6 px-4 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                    <h1 className="text-xl font-bold text-text-primary tracking-tight font-heading">Notifications</h1>
                    <p className="text-text-muted mt-1 text-sm">Stay updated with your latest alerts and academic announcements</p>
                </div>
                {unreadCount > 0 && (
                    <Badge variant="info">{unreadCount} Unread</Badge>
                )}
            </div>

            <div className="bg-surface rounded-lg border border-border overflow-hidden">
                {notifications.length === 0 ? (
                    <div className="py-12">
                        <EmptyState icon={Bell} title="No Notifications" description="You're all caught up! You have no alerts currently." />
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {notifications.map(notification => {
                            const conf = typeConfig[notification.type] || typeConfig.approval
                            const Icon = conf.icon
                            return (
                                <div
                                    key={notification._id}
                                    className={clsx(
                                        "group p-4 flex items-start gap-3.5 transition-colors hover:bg-bg-subtle/30",
                                        !notification.read ? "bg-primary-subtle/30" : "opacity-70"
                                    )}
                                >
                                    <div
                                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ background: conf.bg, color: conf.color }}
                                    >
                                        <Icon size={16} strokeWidth={2} />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className={clsx("text-sm font-semibold truncate font-heading", !notification.read ? "text-text-primary" : "text-text-secondary")}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-[10px] font-medium text-text-muted whitespace-nowrap font-heading">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-muted mt-0.5">{notification.message}</p>
                                    </div>
                                    {!notification.read ? (
                                        <button
                                            onClick={() => handleMarkAsRead(notification._id)}
                                            className="w-7 h-7 rounded-md border border-border flex items-center justify-center text-text-muted hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0"
                                            title="Mark as read"
                                        >
                                            <Check size={13} strokeWidth={2.5} />
                                        </button>
                                    ) : (
                                        <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ color: 'var(--success)' }}>
                                            <CheckCircle2 size={15} strokeWidth={2} />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentNotifications
