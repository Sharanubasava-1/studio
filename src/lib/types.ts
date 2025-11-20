export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AuditLogAction = 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK';

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  taskId: string;
  updatedContent: Record<string, any>;
  createdAt: Date;
}
