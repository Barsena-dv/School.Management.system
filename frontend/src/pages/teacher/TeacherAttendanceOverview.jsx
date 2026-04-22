import DashboardCard from '@/components/ui/DashboardCard'
import SectionHeader from '@/components/ui/SectionHeader'
import Spinner from '@/components/ui/Spinner'
import api from '@/services/api'
import { showError } from '@/utils/toast'
import { BookOpen, ChevronRight, ClipboardList } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TeacherAttendanceOverview = () => {
    const navigate = useNavigate()
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await api.get('/subjects')
                if (res.data.success) {
                    setSubjects(res.data.data?.subjects || [])
                }
            } catch {
                showError('Failed to load subjects')
            } finally {
                setLoading(false)
            }
        }
        fetchSubjects()
    }, [])

    return (
        <div className="max-w-5xl mx-auto py-6 px-4">
            <SectionHeader 
                title="Take Attendance" 
                description="Select a subject class to view and mark attendance" 
            />

            {loading ? (
                <div className="flex justify-center min-h-[300px] items-center">
                    <Spinner size="lg" />
                </div>
            ) : subjects.length === 0 ? (
                <div className="surface shadow-sm rounded-lg p-12 text-center border border-border mt-8">
                    <div className="w-16 h-16 bg-bg-subtle rounded-full flex items-center justify-center mx-auto mb-4 text-text-muted">
                        <ClipboardList size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-text-primary">No Subjects Assigned</h3>
                    <p className="text-sm text-text-secondary mt-2">You must be assigned to a subject before you can take attendance.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {subjects.map(subject => (
                        <button 
                            key={subject._id}
                            onClick={() => navigate(`/teacher/subjects/${subject._id}/attendance`)}
                            className="bg-surface hover:bg-bg-subtle transition-colors p-5 rounded-lg border border-border shadow-sm flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary-subtle text-primary rounded-xl flex flex-col items-center justify-center">
                                    <BookOpen size={18} />
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-text-primary group-hover:text-primary transition-colors">{subject.name}</h4>
                                    <p className="text-xs font-semibold text-text-muted mt-0.5 uppercase tracking-wider">
                                        {subject.class ? `Grade ${subject.class.grade}${subject.class.section ? `-${subject.class.section}` : ''}` : 'No Class'}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={18} className="text-text-muted/40 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TeacherAttendanceOverview
