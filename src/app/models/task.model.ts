export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  completedAt: string | null;
}

export interface TaskFilter {
  status?: string;
  priority?: string;
  projectId?: string;
}

export const STATUSES: string[] = ['todo', 'inprogress', 'done'];

export const PRIORITIES: string[] = ['low', 'medium', 'high', 'urgent'];