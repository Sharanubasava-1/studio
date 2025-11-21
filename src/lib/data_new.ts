import type { Task, AuditLog, AuditLogAction } from './types';
import { initializeDatabase, getTasksFromDB, saveTaskToDB, updateTaskInDB, deleteTaskFromDB, saveLogToDB } from './db';

// Initialize database on first import
initializeDatabase().catch(console.error);

// --- Task Functions ---

export const getTasks = async ({ page = 1, limit = 5, query = '' }: { page?: number; limit?: number; query?: string }) => {
  const allTasks = await getTasksFromDB();
  const lowercasedQuery = query.toLowerCase();
  const filteredTasks = allTasks.filter(task =>
    task.title.toLowerCase().includes(lowercasedQuery) ||
    task.description.toLowerCase().includes(lowercasedQuery)
  ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalTasks = filteredTasks.length;
  const paginatedTasks = filteredTasks.slice((page - 1) * limit, page * limit);

  return { tasks: paginatedTasks.map(task => ({
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.created_at)
  })), totalTasks };
};

export const getTaskById = async (id: string) => {
  const tasks = await getTasksFromDB();
  const task = tasks.find(t => t.id === parseInt(id));
  if (!task) return null;
  return {
    id: task.id.toString(),
    title: task.title,
    description: task.description,
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.created_at)
  };
};

export const createTask = async (data: { title: string; description: string }) => {
  const newTask = await saveTaskToDB(data.title, data.description);
  await saveLogToDB('CREATE_TASK', newTask.id, { title: newTask.title, description: newTask.description });
  return {
    id: newTask.id.toString(),
    title: newTask.title,
    description: newTask.description,
    createdAt: new Date(newTask.created_at),
    updatedAt: new Date(newTask.created_at)
  };
};

export const updateTask = async (id: string, data: Partial<{ title: string; description: string }>) => {
  const taskId = parseInt(id);
  const existingTasks = await getTasksFromDB();
  const existingTask = existingTasks.find(t => t.id === taskId);
  if (!existingTask) return null;

  const updatedTask = await updateTaskInDB(taskId, data.title || existingTask.title, data.description || existingTask.description);
  if (!updatedTask) return null;

  const changes: Record<string, any> = {};
  if (data.title && data.title !== existingTask.title) changes.title = { from: existingTask.title, to: data.title };
  if (data.description && data.description !== existingTask.description) changes.description = { from: existingTask.description, to: data.description };

  if (Object.keys(changes).length > 0) {
    await saveLogToDB('UPDATE_TASK', taskId, changes);
  }

  return {
    id: updatedTask.id.toString(),
    title: updatedTask.title,
    description: updatedTask.description,
    createdAt: new Date(updatedTask.created_at),
    updatedAt: new Date(updatedTask.created_at)
  };
};

export const deleteTask = async (id: string) => {
  const taskId = parseInt(id);
  const existingTasks = await getTasksFromDB();
  const existingTask = existingTasks.find(t => t.id === taskId);
  if (!existingTask) return false;

  const deleted = await deleteTaskFromDB(taskId);
  if (deleted) {
    await saveLogToDB('DELETE_TASK', taskId, { deletedTitle: existingTask.title });
  }
  return deleted;
};

// --- Audit Log Functions ---

export const getAuditLogs = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
  // For now, return empty logs since audit logs are handled differently
  // You might want to implement a separate audit logs API
  return { logs: [], totalLogs: 0 };
};
