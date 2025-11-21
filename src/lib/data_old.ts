import type { Task, AuditLog, AuditLogAction } from './types';
import { initializeDatabase, getTasksFromDB, saveTaskToDB, updateTaskInDB, deleteTaskFromDB, saveLogToDB } from './db';

// Initialize database on first import
initializeDatabase().catch(console.error);


// --- Task Functions ---

export const getTasks = async ({ page = 1, limit = 5, query = '' }: { page?: number; limit?: number; query?: string }) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  const lowercasedQuery = query.toLowerCase();
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(lowercasedQuery) ||
    task.description.toLowerCase().includes(lowercasedQuery)
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const totalTasks = filteredTasks.length;
  const paginatedTasks = filteredTasks.slice((page - 1) * limit, page * limit);

  return { tasks: paginatedTasks, totalTasks };
};

export const getTaskById = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return tasks.find(task => task.id === id);
};

export const createTask = async (data: { title: string; description: string }) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newTask: Task = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.unshift(newTask);
  createAuditLog('CREATE_TASK', newTask.id, { title: newTask.title, description: newTask.description });
  return newTask;
};

export const updateTask = async (id: string, data: Partial<{ title: string; description: string }>) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) return null;

  const originalTask = { ...tasks[taskIndex] };
  const updatedTask = { ...originalTask, ...data, updatedAt: new Date() };
  tasks[taskIndex] = updatedTask;

  const changes: Record<string, any> = {};
  if (data.title && data.title !== originalTask.title) changes.title = { from: originalTask.title, to: data.title };
  if (data.description && data.description !== originalTask.description) changes.description = { from: originalTask.description, to: data.description };
  
  if (Object.keys(changes).length > 0) {
    createAuditLog('UPDATE_TASK', id, changes);
  }
  
  return updatedTask;
};

export const deleteTask = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex > -1) {
    const deletedTask = tasks[taskIndex];
    tasks = tasks.filter(task => task.id !== id);
    createAuditLog('DELETE_TASK', id, { deletedTitle: deletedTask.title });
    return true;
  }
  return false;
};

// --- Audit Log Functions ---

const createAuditLog = (action: AuditLogAction, taskId: string, updatedContent: Record<string, any>) => {
  const log: AuditLog = {
    id: crypto.randomUUID(),
    action,
    taskId,
    updatedContent,
    createdAt: new Date(),
  };
  auditLogs.unshift(log);
};

export const getAuditLogs = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const totalLogs = auditLogs.length;
    const paginatedLogs = auditLogs.slice((page - 1) * limit, page * limit);
    return { logs: paginatedLogs, totalLogs };
};
