import api from "./api"; // tumhara axios instance

export const getStudentDashboard = async () => {
  const response = await api.get("/dashboard/student");
  return response.data;
};