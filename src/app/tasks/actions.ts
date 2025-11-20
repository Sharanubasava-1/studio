'use server';

import { revalidatePath } from 'next/cache';
import { createTask, updateTask, deleteTask } from '@/lib/data';
import { taskSchema } from '@/lib/schemas';
import type { TaskFormValues } from '@/lib/schemas';

export async function createTaskAction(values: TaskFormValues) {
  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }
  
  try {
    await createTask(validatedFields.data);
    revalidatePath('/tasks');
    revalidatePath('/audit-log');
    return { success: 'Task created successfully.' };
  } catch (error) {
    return { error: 'Failed to create task.' };
  }
}

export async function updateTaskAction(id: string, values: TaskFormValues) {
  const validatedFields = taskSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: 'Invalid input.',
    };
  }

  try {
    await updateTask(id, validatedFields.data);
    revalidatePath('/tasks');
    revalidatePath('/audit-log');
    return { success: 'Task updated successfully.' };
  } catch (error) {
    return { error: 'Failed to update task.' };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    await deleteTask(id);
    revalidatePath('/tasks');
    revalidatePath('/audit-log');
    return { success: 'Task deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete task.' };
  }
}
