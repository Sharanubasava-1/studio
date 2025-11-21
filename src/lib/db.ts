// src/lib/db.ts
import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "tasks.db");

// Ensure /data exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Single SQLite connection
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    action TEXT NOT NULL,          -- 'Create Task' | 'Update Task' | 'Delete Task'
    task_id INTEGER,
    updated_content TEXT           -- JSON string or NULL
  );
`);

export type DBTask = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

// Get all tasks from SQLite
export async function getTasksFromDB(): Promise<DBTask[]> {
  const stmt = db.prepare(
    `SELECT id, title, description, created_at
     FROM tasks
     ORDER BY created_at DESC`
  );
  const rows = stmt.all() as DBTask[];
  return rows;
}

// Insert a new task into SQLite
export async function saveTaskToDB(
  title: string,
  description: string
): Promise<DBTask> {
  const created_at = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO tasks (title, description, created_at)
     VALUES (?, ?, ?)`
  );
  const result = stmt.run(title, description, created_at);
  const id = Number(result.lastInsertRowid);

  return { id, title, description, created_at };
}

// Insert an audit log row into SQLite
export async function saveLogToDB(
  action: string,
  taskId: number,
  updatedContent: Record<string, any> | null
): Promise<void> {
  const timestamp = new Date().toISOString();
  const stmt = db.prepare(
    `INSERT INTO audit_logs (timestamp, action, task_id, updated_content)
     VALUES (?, ?, ?, ?)`
  );

  stmt.run(
    timestamp,
    action,
    taskId,
    updatedContent ? JSON.stringify(updatedContent) : null
  );
}

// default export (if other code imports `db` directly)
export default db;
