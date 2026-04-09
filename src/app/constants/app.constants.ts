export interface StatusOption {
  value: string;
  label: string;
  color: string;
}

export interface PriorityOption {
  value: string;
  label: string;
  color: string;
}

export interface ProjectColorOption {
  value: string;
  hex: string;
  light: string;
}

export const STATUSES: StatusOption[] = [
  { value: 'todo', label: 'To Do', color: '#6b7280' },
  { value: 'inprogress', label: 'In Progress', color: '#3b82f6' },
  { value: 'done', label: 'Done', color: '#22c55e' }
];

export const PRIORITIES: PriorityOption[] = [
  { value: 'low', label: 'Low', color: '#6b7280' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'urgent', label: 'Urgent', color: '#ef4444' }
];

export const PROJECT_COLORS: ProjectColorOption[] = [
  { value: 'blue', hex: '#3b82f6', light: '#dbeafe' },
  { value: 'green', hex: '#22c55e', light: '#dcfce7' },
  { value: 'purple', hex: '#a855f7', light: '#f3e8ff' },
  { value: 'orange', hex: '#f97316', light: '#ffedd5' },
  { value: 'red', hex: '#ef4444', light: '#fee2e2' },
  { value: 'pink', hex: '#ec4899', light: '#fce7f3' },
  { value: 'teal', hex: '#14b8a6', light: '#ccfbf1' }
];

export const STORAGE_KEYS = {
  projects: 'taskflow_projects',
  tasks: 'taskflow_tasks'
} as const;