import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DashboardCard from '@/components/ui/DashboardCard'
import EmptyState from '@/components/ui/EmptyState'
import Input from '@/components/ui/Input'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { Calendar, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const AdminEvents = () => {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [showModal, setShowModal] = useState(false)
    
    const [form, setForm] = useState({
        title: '',
        description: '',
        eventDate: '',
        registrationDeadline: '',
    })

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

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(p => ({ ...p, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title || !form.description || !form.eventDate || !form.registrationDeadline) {
            showError("Please fill out all fields")
            return
        }

        setCreating(true)
        try {
            await api.post('/events', form)
            showSuccess("Event created successfully")
            setShowModal(false)
            setForm({ title: '', description: '', eventDate: '', registrationDeadline: '' })
            fetchEvents()
        } catch (error) {
            showError(error.response?.data?.message || "Failed to create event")
        } finally {
            setCreating(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
            <div className="flex justify-between items-center border-b border-border pb-6">
                <div>
                    <h1 className="text-xl font-bold font-heading text-text-primary tracking-tight">Event Management</h1>
                    <p className="text-text-secondary mt-1 font-medium">Create and manage upcoming campus events</p>
                </div>
                <Button variant="primary" size="md" onClick={() => setShowModal(true)}>
                    <Plus size={16} className="mr-2" /> Create Event
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center min-h-[300px] items-center">
                    <Spinner size="lg" />
                </div>
            ) : events.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No Events Found"
                    description="Get started by creating your first campus event."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => {
                        const eventDate = new Date(event.eventDate)
                        return (
                            <DashboardCard key={event._id} padding={false} className="overflow-hidden flex flex-col group">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 bg-bg-subtle text-text-secondary rounded-lg flex flex-col items-center justify-center font-bold shadow-inner border border-border">
                                            <span className="text-[10px] uppercase leading-none mb-1">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                            <span className="text-lg leading-none">{eventDate.getDate()}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1">{event.title}</h3>
                                    <p className="text-sm text-text-secondary line-clamp-3 mb-4">{event.description}</p>
                                    <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-xs text-text-muted font-semibold">
                                        <span>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </DashboardCard>
                        )
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-surface rounded-lg p-6 w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-bg-subtle flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                        >
                            <X size={16} />
                        </button>
                        <SectionHeader title="Create New Event" />
                        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                            <Input
                                label="Event Title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="e.g. Annual Science Fair"
                                required
                            />
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-text-muted ml-1 uppercase tracking-wider">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full bg-bg-subtle border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all font-medium text-text-primary placeholder:text-text-muted min-h-[100px]"
                                    placeholder="Provide event details..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Event Date"
                                    type="date"
                                    name="eventDate"
                                    value={form.eventDate}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Registration Deadline"
                                    type="date"
                                    name="registrationDeadline"
                                    value={form.registrationDeadline}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full mt-4"
                                loading={creating}
                            >
                                {creating ? 'Creating...' : 'Create Event'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminEvents
