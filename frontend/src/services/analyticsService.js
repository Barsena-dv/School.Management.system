import api from './api'

export const fetchStudentAnalytics = async () => {
    const response = await api.get('/analytics/student')
    return response.data
}
