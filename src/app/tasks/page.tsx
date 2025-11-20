import { Suspense } from 'react';
import { getTasks } from '@/lib/data';
import TasksPageClient from './components/tasks-page-client';
import { Skeleton } from '@/components/ui/skeleton';

export const revalidate = 0;

export default async function TasksPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const { tasks, totalTasks } = await getTasks({ query, page: currentPage, limit: 5 });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Tasks</h1>
      </div>
      <Suspense fallback={<TasksSkeleton />}>
        <TasksPageClient tasks={tasks} totalTasks={totalTasks} />
      </Suspense>
    </main>
  );
}

function TasksSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center p-4 border-b">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-20 ml-4" />
          </div>
        ))}
      </div>
       <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
    </div>
  );
}
