import apiClient from '../lib/axios';

export type StudentStats = {
  total_study_hours: string;
  tasks_completed: number;
  quizzes_taken: number;
  most_productive_day: string;
};

export const getStudentStats = async (filter: 'day' | 'week' | 'month' | 'year'): Promise<StudentStats> => {
  const response = await apiClient.get('/student/stats', {
    params: { filter }
  });
  return response.data.data;
};