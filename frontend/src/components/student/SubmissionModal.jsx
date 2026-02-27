import Button from '@/components/ui/Button'
import api from '@/services/api'
import { showError, showSuccess } from '@/utils/toast'
import { AlertCircle, FileText, Upload, X } from 'lucide-react'
import { useState } from 'react'

const SubmissionModal = ({ isOpen, onClose, assignment, onUploadSuccess }) => {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    if (!isOpen || !assignment) return null

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        // Validate file type
        const allowedExtensions = ['pdf', 'doc', 'docx']
        const extension = selectedFile.name.split('.').pop().toLowerCase()

        if (!allowedExtensions.includes(extension)) {
            showError("Invalid file type. Please upload PDF, DOC, or DOCX.")
            e.target.value = null
            setFile(null)
            return
        }

        setFile(selectedFile)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append("assignmentId", assignment._id)
        formData.append("file", file)

        try {
            const response = await api.post('/submissions', formData, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            if (response.data.success) {
                showSuccess("Assignment submitted successfully!")
                onUploadSuccess()
                onClose()
            }
        } catch (error) {
            showError(error.response?.data?.message || "Failed to submit assignment")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                    <h3 className="text-lg font-bold text-neutral-900">Upload Submission</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-100 rounded-xl transition-colors text-neutral-400 hover:text-neutral-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Assignment</p>
                        <h4 className="text-base font-bold text-neutral-900 leading-tight">{assignment.title}</h4>
                        <p className="text-xs text-neutral-500 mt-1 font-medium">{assignment.subject?.name}</p>
                    </div>

                    {/* Dropzone Area */}
                    <div className="relative group">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`
                            border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all
                            ${file ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 group-hover:border-neutral-400 bg-white'}
                        `}>
                            <div className={`
                                p-3 rounded-2xl mb-4 transition-colors
                                ${file ? 'bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-400 group-hover:bg-neutral-100'}
                            `}>
                                {file ? <FileText size={24} /> : <Upload size={24} />}
                            </div>

                            {file ? (
                                <div className="text-center">
                                    <p className="text-sm font-bold text-neutral-900 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm font-bold text-neutral-900">Click or drag file to upload</p>
                                    <p className="text-xs text-neutral-400 mt-1 font-medium">PDF, DOC, DOCX up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100/50">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-[11px] text-amber-700 font-medium leading-relaxed">
                            Once submitted, you cannot modify your response. Please ensure all details are correct before uploading.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            className="flex-1 rounded-2xl py-3 font-bold text-sm"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 rounded-2xl py-3 font-bold text-sm bg-neutral-900 hover:bg-neutral-800"
                            disabled={!file || loading}
                        >
                            {loading ? 'Submitting...' : 'Confirm Upload'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SubmissionModal
