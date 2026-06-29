export type ColumnId = 'new' | 'progress' | 'done';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CardLabel {
  id: string;
  name: string;
  color: string;
}

export type Department = 'humas' | 'jaringan';
export type ActiveDepartmentType = Department | 'all';

export interface Card {
  id: string;
  title: string;
  description: string;
  documentLink: string;
  requestDate: string | null;
  pic: string;
  columnId: ColumnId;
  department: Department;
  position: number;
  labels: CardLabel[];
  checklist: ChecklistItem[];
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export const COLUMNS: Column[] = [
  { id: 'new', title: 'New' },
  { id: 'progress', title: 'Progress' },
  { id: 'done', title: 'Selesai' },
];

export const AVAILABLE_LABELS: CardLabel[] = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#6366f1' },
  { id: 'l3', name: 'Enhancement', color: '#8b5cf6' },
  { id: 'l4', name: 'Documentation', color: '#06b6d4' },
  { id: 'l5', name: 'Design', color: '#ec4899' },
  { id: 'l6', name: 'Urgent', color: '#f59e0b' },
  { id: 'l7', name: 'Backend', color: '#10b981' },
  { id: 'l8', name: 'Frontend', color: '#3b82f6' },
];
