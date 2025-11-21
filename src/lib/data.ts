// src/lib/data.ts
import db from "./db";
import type { Task, AuditLog, AuditLogAction } from "./types";

export type GetTasksParams = {
  query: string;
  page: number;
  limit: number;
};

export type GetAuditLogsParams = {
  page: number;
  limit: number;
};

type AuditLogRow = {
  id: number;
  timestamp: string;
  action: string;
  task_id: number | null;
  updated_content: string | null;
};

function sanitize(str: string) {
  return str.replace(/</g, "").replace(/>/g, "");
}

// ---------- TASKS ----------

export async function getTasks({
  query,
  page,
  limit,
}: GetTasksParams): Promise<{ tasks: Task[]; totalTasks: number }> {
  const offset = (page - 1) * limit;
  const like = `%${query}%`;
  const hasQuery = query.trim().length > 0;

  const countStmt = hasQuery
    ? db.prepare(
        `SELECT COUNT(*) as total FROM tasks
         WHERE title LIKE ? OR description LIKE ?`
      )
    : db.prepare(`SELECT COUNT(*) as total FROM tasks`);

  const listStmt = hasQuery
    ? db.prepare(
        `SELECT id, title, description, created_at
         FROM tasks
         WHERE title LIKE ? OR description LIKE ?
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      )
    : db.prepare(
        `SELECT id, title, description, created_at
         FROM tasks
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`
      );

  const countRow = hasQuery
    ? (countStmt.get(like, like) as { total: number })
    : (countStmt.get() as { total: number });

  const rows = hasQuery
    ? listStmt.all(like, like, limit, offset)
    : listStmt.all(limit, offset);

  const tasks: Task[] = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    createdAt: new Date(row.created_at),
  }));

  return { tasks, totalTasks: countRow.total ?? 0 };
}

export async function createTask(input: {
  title: string;
  description: string;
}): Promise<Task> {
  let { title, description } = input;

  if (typeof title !== "string" || typeof description !== "string") {
    throw new Error("Invalid input types.");
  }

  title = sanitize(title.trim());
  description = sanitize(description.trim());

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }
  if (title.length > 100) {
    throw new Error("Title must be at most 100 characters.");
  }
  if (description.length > 500) {
    throw new Error("Description must be at most 500 characters.");
  }

  const createdAtISO = new Date().toISOString();

  const insert = db.prepare(
    `INSERT INTO tasks (title, description, created_at)
     VALUES (?, ?, ?)`
  );
  const result = insert.run(title, description, createdAtISO);
  const id = Number(result.lastInsertRowid);

  const task: Task = {
    id,
    title,
    description,
    createdAt: new Date(createdAtISO),
  };

  await logAction("Create Task", id, {
    id,
    title,
    description,
    createdAt: createdAtISO,
  });

  return task;
}

export async function updateTask(
  id: number,
  input: { title: string; description: string }
): Promise<Task> {
  const select = db.prepare(
    `SELECT id, title, description, created_at FROM tasks WHERE id = ?`
  );
  const existing = select.get(id) as any;

  if (!existing) {
    throw new Error("Task not found.");
  }

  let { title, description } = input;

  if (typeof title !== "string" || typeof description !== "string") {
    throw new Error("Invalid input types.");
  }

  title = sanitize(title.trim());
  description = sanitize(description.trim());

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }
  if (title.length > 100) {
    throw new Error("Title must be at most 100 characters.");
  }
  if (description.length > 500) {
    throw new Error("Description must be at most 500 characters.");
  }

  const updateStmt = db.prepare(
    `UPDATE tasks SET title = ?, description = ? WHERE id = ?`
  );
  updateStmt.run(title, description, id);

  const updated: Task = {
    id,
    title,
    description,
    createdAt: new Date(existing.created_at),
  };

  const changed: Record<string, any> = {};
  if (title !== existing.title) changed.title = title;
  if (description !== existing.description) changed.description = description;

  await logAction("Update Task", id, changed);

  return updated;
}

export async function deleteTask(id: number): Promise<void> {
  const select = db.prepare(`SELECT id FROM tasks WHERE id = ?`);
  const existing = select.get(id);

  if (!existing) {
    throw new Error("Task not found.");
  }

  const del = db.prepare(`DELETE FROM tasks WHERE id = ?`);
  del.run(id);

  await logAction("Delete Task", id, null);
}

// ---------- AUDIT LOGS ----------

export async function getAuditLogs({
  page,
  limit,
}: GetAuditLogsParams): Promise<{ logs: AuditLog[]; totalLogs: number }> {
  const offset = (page - 1) * limit;

  const countStmt = db.prepare(
    `SELECT COUNT(*) as total FROM audit_logs`
  );
  const listStmt = db.prepare(
    `SELECT id, timestamp, action, task_id, updated_content
     FROM audit_logs
     ORDER BY timestamp DESC
     LIMIT ? OFFSET ?`
  );

  const countRow = countStmt.get() as { total: number };
  const rows = listStmt.all(limit, offset) as AuditLogRow[];

  const logs: AuditLog[] = rows.map((row) => ({
    id: String(row.id),
    action: row.action as AuditLogAction,
    taskId: String(row.task_id ?? ""),
    updatedContent: row.updated_content
      ? (JSON.parse(row.updated_content) as Record<string, any>)
      : {},
    // 🔥 this is what your UI uses with `format(log.createdAt, 'PPp')`
    createdAt: new Date(row.timestamp),
  }));

  return { logs, totalLogs: countRow.total ?? 0 };
}

// ---------- helper to insert log entries ----------

async function logAction(
  action: "Create Task" | "Update Task" | "Delete Task",
  taskId: number | null,
  updatedContent: Record<string, any> | null
) {
  const insert = db.prepare(
    `INSERT INTO audit_logs (timestamp, action, task_id, updated_content)
     VALUES (?, ?, ?, ?)`
  );

  const timestamp = new Date().toISOString();
  const content =
    updatedContent === null ? null : JSON.stringify(updatedContent);

  insert.run(timestamp, action, taskId, content);
}
