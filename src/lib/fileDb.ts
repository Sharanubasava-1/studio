// src/lib/fileDb.ts
import { initializeDatabase, getTasksFromDB, saveTaskToDB, updateTaskInDB, deleteTaskFromDB, getLogsFromDB, saveLogToDB } from './db';

export type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
};

export type LogEntry = {
  id: number;
  timestamp: string;
  action: "Create Task" | "Update Task" | "Delete Task";
  taskId: number | null;
  updatedContent: Record<string, any> | null;
};

// Initialize database on first import
initializeDatabase().catch(console.error);

export async function getTasks(): Promise<Task[]> {
  const tasks = await getTasksFromDB();
  return tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    createdAt: task.created_at
  }));
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  // This function is kept for compatibility but not used in MySQL version
  // Tasks are saved individually via saveTaskToDB
}

export async function getLogs(): Promise<LogEntry[]> {
  const logs = await getLogsFromDB();
  return logs.map(log => ({
    id: log.id,
    timestamp: log.timestamp,
    action: log.action,
    taskId: log.task_id,
    updatedContent: log.updated_content ? JSON.parse(log.updated_content) : null
  }));
}

export async function saveLogs(logs: LogEntry[]): Promise<void> {
  // This function is kept for compatibility but not used in MySQL version
  // Logs are saved individually via saveLogToDB
}
