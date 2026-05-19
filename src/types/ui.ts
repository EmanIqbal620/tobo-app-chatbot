// UI State Entities

export interface ThemeState {
  theme: 'light' | 'dark';
  updatedAt: string;
}

export interface UserPreferences {
  userId: string;
  theme?: 'light' | 'dark';
  taskView?: 'list' | 'grid' | 'kanban';
  notificationsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskViewState {
  userId: string;
  filter?: 'all' | 'active' | 'completed';
  sort?: 'dateCreated' | 'dueDate' | 'priority' | 'title';
  searchTerm?: string;
  lastViewed: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-right' | 'bottom-right' | 'top-center' | 'bottom-center';
  createdAt: string;
}

export interface LoadingState {
  id: string;
  type: 'apiCall' | 'component' | 'page';
  isActive: boolean;
  message?: string;
  progress?: number;
  createdAt: string;
}

// Component Props

export interface TaskCardProps {
  task: any; // Using any temporarily, will be replaced with actual Task type
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showPriorityIndicator?: boolean;
  showDueDate?: boolean;
}

export interface TaskFilterBarProps {
  currentFilter: string;
  currentSort: string;
  searchTerm?: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (searchTerm: string) => void;
}

export interface ThemeToggleProps {
  currentTheme: 'light' | 'dark';
  onToggle: () => void;
  showLabel?: boolean;
}

export interface SkeletonLoaderProps {
  type: 'card' | 'text' | 'avatar' | 'image' | 'button' | 'input' | 'list-item';
  width?: string | number;
  height?: string | number;
  count?: number;
}

// UI Enums
export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark'
}

export enum NotificationTypeEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export enum TaskFilterEnum {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

export enum TaskSortEnum {
  DATE_CREATED = 'dateCreated',
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority',
  TITLE = 'title'
}