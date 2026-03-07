export type Task = {
  id: number;
  label: string;
  context: string; 
  completed: boolean;
  startDate?: string; // <--- Field Baru
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
};