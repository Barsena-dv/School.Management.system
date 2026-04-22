import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'

const StudentEvents = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState({})

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events')
            if (res.data.success) {
                setEvents(res.data.data.events || [])
            }
        } catch (error) {
            showError("Failed to fetch events")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleApply = async (id) => {
        setApplying(prev => ({ ...prev, [id]: true }))
        try {
            await api.post(`/events/${id}/apply`)
            showSuccess("Successfully applied for event!")
            fetchEvents()
        } catch (error) {
            showError(error.response?.data?.message || "Failed to apply for event")
        } finally {
            setApplying(prev => ({ ...prev, [id]: false }))
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        )
    }

    const today = new Date()

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
            <div className="border-b border-border pb-5">
                <h1 className="text-xl font-bold text-text-primary tracking-tight font-heading">Campus Events</h1>
                <p className="text-text-muted mt-1 text-sm">Browse and register for upcoming activities and seminars</p>
            </div>

            {events.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No Upcoming Events"
                    description="There are currently no events scheduled. Please check back later."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => {
                        const eventDate = new Date(event.eventDate)
                        const deadline = new Date(event.registrationDeadline)
                        const isPast = eventDate < today
                        const isDeadlinePassed = deadline < today

                        return (
                            <div key={event._id} className="bg-surface rounded-lg border border-border overflow-hidden flex flex-col hover:border-primary/30 hover:shadow-md transition-all group">
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div
                                            className="w-11 h-11 rounded-lg flex flex-col items-center justify-center font-bold"
                                            style={{
                                                background: 'var(--primary-subtle)',
                                                color: 'var(--primary)',
                                            }}
                                        >
                                            <span className="text-[9px] uppercase leading-none mb-0.5 font-heading">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-base leading-none font-heading">{eventDate.getDate()}</span>
                                        </div>
                                        <Badge variant={isPast ? 'default' : 'info'}>
                                            {isPast ? 'Ended' : 'Upcoming'}
                                        </Badge>
                                    </div>
                                    <h3 className="text-sm font-bold text-text-primary font-heading tracking-tight mb-1.5 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary line-clamp-3 mb-4">
                                        {event.description}
                                    </p>

                                    <div className="space-y-2 mt-auto pt-3 border-t border-border">
                                        <div className="flex items-center text-xs font-medium text-text-muted">
                                            <Clock size={13} className="mr-2" />
                                            Deadline: {deadline.toLocaleDateString()}
                                        </div>
                                        {event.targetClass && (
                                            <div className="flex items-center text-xs font-medium text-text-muted">
                                                <MapPin size={13} className="mr-2" />
                                                Target Class ID: {event.targetClass}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="p-4 bg-bg-subtle/30 border-t border-border mt-auto">
                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="w-full"
                                        disabled={isPast || isDeadlinePassed || applying[event._id]}
                                        loading={applying[event._id]}
                                        onClick={() => handleApply(event._id)}
                                    >
                                        {isPast ? 'Event Ended' : isDeadlinePassed ? 'Registration Closed' : 'Apply Now'}
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default StudentEvents
