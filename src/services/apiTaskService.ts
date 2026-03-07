import apiClient from '../lib/axios';
import type { Task } from '../types/task.types';

// Tipe Data Backend
type BackEndTask = {
  id: number;
  title: string;
  context: string;
  priority: 'low' | 'medium' | 'high';
  start_date?: string;
  task_date: string;
  completed: boolean;
  user_id: number;
};

// Payload Create Task
export type NewTaskData = {
  title: string;
  context: string;
  start_date?: string;
  task_date: string;
  priority: 'low' | 'medium' | 'high';
};

// Payload Update Task
type UpdateTaskPayload = {
  title?: string;
  context?: string;
  start_date?: string;
  task_date?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
};

// Query Params
export type TaskQueryParams = {
  date?: string;
  priority?: 'low' | 'medium' | 'high';
};

// Translate Backend -> Frontend
const translateToFrontEnd = (beTask: BackEndTask): Task => {
  return {
    id: beTask.id,
    label: beTask.title,
    context: beTask.context,
    completed: beTask.completed,
    startDate: beTask.start_date,
    dueDate: beTask.task_date,
    priority: beTask.priority,
  };
};

// === HELPER FORMATTER (WIB +07:00) ===
const toBackendFormat = (dateStr: string | undefined, isEndOfDay: boolean = false): string | undefined => {
  if (!dateStr) return undefined;

  // Offset Indonesia (WIB)
  const TIMEZONE_OFFSET = '+07:00'; 

  // Kasus 1: Input "2025-11-25" (Tanpa jam) -> Tambah jam default + Offset WIB
  // Start: 09:00 WIB, End: 23:59 WIB
  if (!dateStr.includes('T')) {
    const timePart = isEndOfDay ? '23:59:00' : '09:00:00';
    return `${dateStr}T${timePart}${TIMEZONE_OFFSET}`;
  }

  // Kasus 2: Input "2025-11-25T14:30" (Dari datetime-local) -> Tambah detik + Offset WIB
  // Hasil: "2025-11-25T14:30:00+07:00"
  if (dateStr.length === 16) {
    return `${dateStr}:00${TIMEZONE_OFFSET}`;
  }

  // Kasus 3: Input sudah punya format lengkap tapi tanpa timezone (jarang terjadi di html input)
  // Kita paksa tambah offset jika belum ada 'Z' atau '+'
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
     return `${dateStr}${TIMEZONE_OFFSET}`;
  }

  return dateStr;
};

// === READ ===
export const getTasks = async (params?: TaskQueryParams): Promise<Task[]> => {
  const response = await apiClient.get('/student/tasks', { params });
  const apiData = (response.data.data || []) as BackEndTask[];
  return apiData.map(translateToFrontEnd);
};

export const createTask = async (data: NewTaskData): Promise<Task> => {
  const payload = { 
    ...data, 
    task_date: toBackendFormat(data.task_date, true)!, 
    start_date: toBackendFormat(data.start_date, false) 
  };
  
  const response = await apiClient.post('/student/tasks', payload);
  const responseData = response.data.data ? (Array.isArray(response.data.data) ? response.data.data[0] : response.data.data) : response.data;
  return translateToFrontEnd(responseData);
};

export const updateTask = async (taskId: number, data: UpdateTaskPayload): Promise<Task> => {
  const payload = {
    ...data,
    ...(data.task_date && { task_date: toBackendFormat(data.task_date, true) }),
    ...(data.start_date && { start_date: toBackendFormat(data.start_date, false) }),
  };

  const response = await apiClient.put(`/student/tasks/${taskId}`, payload);
  const responseData = response.data.data ? response.data.data : response.data;
  return translateToFrontEnd(responseData);
};

export const deleteTask = async (taskId: number): Promise<void> => {
  await apiClient.delete(`/student/tasks/${taskId}`);
};