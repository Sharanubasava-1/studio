import { NextRequest, NextResponse } from "next/server";
import { getTasksFromDB, saveTaskToDB, saveLogToDB } from "@/lib/db";

export const runtime = "nodejs";

function sanitize(str: string) {
  return str.replace(/</g, "").replace(/>/g, "");
}

// GET /api/tasks?page=&limit=&search=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "5");
  const search = (searchParams.get("search") || "").toLowerCase();

  let tasks = await getTasksFromDB();

  if (search) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.description.toLowerCase().includes(search)
    );
  }

  const total = tasks.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = tasks
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(start, start + limit)
    .map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      createdAt: task.created_at
    }));

  return NextResponse.json({ data, page, limit, total, totalPages });
}

// POST /api/tasks
export async function POST(req: NextRequest) {
  const body = await req.json();
  let { title, description } = body as {
    title?: string;
    description?: string;
  };

  if (typeof title !== "string" || typeof description !== "string") {
    return NextResponse.json(
      { error: "Invalid input types." },
      { status: 400 }
    );
  }

  title = sanitize(title.trim());
  description = sanitize(description.trim());

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required." },
      { status: 400 }
    );
  }
  if (title.length > 100) {
    return NextResponse.json(
      { error: "Title must be at most 100 characters." },
      { status: 400 }
    );
  }
  if (description.length > 500) {
    return NextResponse.json(
      { error: "Description must be at most 500 characters." },
      { status: 400 }
    );
  }

  const newTask = await saveTaskToDB(title, description);

  await saveLogToDB("Create Task", newTask.id, { title: newTask.title, description: newTask.description });

  return NextResponse.json({
    id: newTask.id,
    title: newTask.title,
    description: newTask.description,
    createdAt: newTask.created_at
  }, { status: 201 });
}
