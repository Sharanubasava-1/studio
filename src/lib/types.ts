export interface Task {
  id: number;              // was string
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;        // make optional, since DB doesn’t store it
}

export type AuditLogAction = 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK';

export interface AuditLog {
  id: string;
  action: AuditLogAction;
  taskId: string;
  updatedContent: Record<string, any>;
  createdAt: Date;
}
