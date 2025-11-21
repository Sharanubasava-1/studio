// src/lib/apiClient.ts

const DEFAULT_BASIC_AUTH = "Basic YWRtaW46cGFzc3dvcmQxMjM="; 
// = base64("admin:password123")

// Used on the client to build a Basic header from username/password
export function buildAuthHeader(username: string, password: string) {
  if (typeof window !== "undefined" && typeof btoa !== "undefined") {
    return "Basic " + btoa(`${username}:${password}`);
  }

  // Fallback for server-side usage – only supports the default credentials
  if (username === "admin" && password === "password123") {
    return DEFAULT_BASIC_AUTH;
  }

  return DEFAULT_BASIC_AUTH;
}

// Read auth header from localStorage (or fall back to default)
export function getAuthHeader(): string {
  if (typeof window === "undefined") {
    // server-side
    return DEFAULT_BASIC_AUTH;
  }

  const stored = window.localStorage.getItem("authHeader");
  return stored || DEFAULT_BASIC_AUTH;
}

// ---------- Example helpers for calling your API routes ----------

export async function apiGetTasks(page = 1, search = "") {
  const params = new URLSearchParams({
    page: String(page),
    limit: "5",
    search,
  });

  const res = await fetch(`/api/tasks?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch tasks");
  }
  return data;
}

export async function apiCreateTask(payload: { title: string; description: string }) {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create task");
  }
  return data;
}

export async function apiUpdateTask(
  id: number,
  payload: { title: string; description: string }
) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to update task");
  }
  return data;
}

export async function apiDeleteTask(id: number) {
  const res = await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: getAuthHeader(),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to delete task");
  }
  return data;
}

export async function apiGetLogs(page = 1) {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
  });

  const res = await fetch(`/api/logs?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch logs");
  }
  return data;
}