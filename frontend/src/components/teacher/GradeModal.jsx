import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { X } from 'lucide-react'
import { useState } from 'react'

const GradeModal = ({ isOpen, onClose, submission, maxMarks, onGraded }) => {
    const [grade, setGrade] = useState(submission?.grade ?? '')
    const [feedback, setFeedback] = useState(submission?.feedback ?? '')
    const [loading, setLoading] = useState(false)

    if (!isOpen || !submission) return null

    const handleSubmit = async (e) => {
        e.preventDefault()

        const numGrade = Number(grade)
        if (isNaN(numGrade) || numGrade < 0) {
            showError('Grade must be a non-negative number')
            return
        }
        if (maxMarks && numGrade > maxMarks) {
            showError(`Grade cannot exceed maximum marks (${maxMarks})`)
            return
        }

        setLoading(true)
        try {
            await api.put(`/submissions/${submission._id}/grade`, {
                grade: numGrade,
                feedback,
            })
            showSuccess('Submission graded successfully!')
            onGraded()
            onClose()
        } catch (err) {
            showError(err.response?.data?.message || 'Failed to grade submission')
        } finally {
            setLoading(false)
        }
    }

    const studentName = submission.student?.user?.name || 'Student'
    const isUpdate = submission.status === 'graded'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900">
                            {isUpdate ? 'Update Grade' : 'Grade Submission'}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium mt-0.5">{studentName}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Grade input */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                            Grade {maxMarks ? `(out of ${maxMarks})` : ''}
                        </label>
                        <input
                            type="number"
                            min={0}
                            max={maxMarks || undefined}
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            required
                            placeholder={`e.g. ${maxMarks ? Math.round(maxMarks * 0.8) : 80}`}
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all"
                        />
                    </div>

                    {/* Feedback textarea */}
                    <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">
                            Feedback <span className="text-neutral-400 normal-case font-medium">(optional)</span>
                        </label>
                        <textarea
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Leave constructive feedback for the student..."
                            className="w-full px-4 py-3 border border-neutral-200 rounded-2xl text-sm font-medium text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-all resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-neutral-200 text-sm font-bold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-sm font-bold text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isUpdate ? 'Update Grade' : 'Confirm Grade'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default GradeModal
