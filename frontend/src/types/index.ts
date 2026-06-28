export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  goal?: string;
  status: ProjectStatus;
  startDate?: string;
  dueDate?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  projectId?: number;
  projectTitle?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  completedAt?: string;
  overdue: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: number;
  projectId?: number;
  projectTitle?: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: number;
  projectId?: number;
  projectTitle?: string;
  title: string;
  content: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  todaysTasks: Task[];
  overdueTasks: Task[];
  projects: Project[];
  recentNotes: Note[];
  recentDocuments: DocumentItem[];
  aiRecommendations: string[];
}

export interface SearchResult {
  sourceType: string;
  sourceId: number;
  title: string;
  excerpt: string;
  score: number;
}

export interface SearchResponse {
  mode: string;
  results: SearchResult[];
}

export interface ChatResponse {
  answer: string;
  relatedRecords: SearchResult[];
  usedOpenAi: boolean;
}
