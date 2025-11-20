'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AuditLog, AuditLogAction } from '@/lib/types';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AuditLogTableProps {
  logs: AuditLog[];
  totalLogs: number;
}

const LOGS_PER_PAGE = 10;

const actionStyles: Record<AuditLogAction, string> = {
  CREATE_TASK: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  UPDATE_TASK: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  DELETE_TASK: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export function AuditLogTable({ logs, totalLogs }: AuditLogTableProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.ceil(totalLogs / LOGS_PER_PAGE);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 0 && page <= totalPages) {
      params.set('page', String(page));
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const renderChanges = (log: AuditLog) => {
    if (log.action === 'CREATE_TASK') {
        return <p><span className="font-medium text-foreground">Title:</span> {log.updatedContent.title}</p>;
    }
    if (log.action === 'DELETE_TASK') {
        return <p><span className="font-medium text-foreground">Deleted Title:</span> {log.updatedContent.deletedTitle}</p>;
    }
    if (log.action === 'UPDATE_TASK') {
        return (
            <ul className="space-y-1 font-code text-xs">
                {Object.entries(log.updatedContent).map(([key, value]) => (
                    <li key={key}>
                        <span className="font-semibold capitalize text-foreground">{key}:</span>
                        <div className="pl-2">
                            <p className="text-red-500">- {String(value.from)}</p>
                            <p className="text-green-500">+ {String(value.to)}</p>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
    return <pre className="font-code text-xs">{JSON.stringify(log.updatedContent, null, 2)}</pre>;
  }

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Action</TableHead>
              <TableHead className="w-[200px]">Timestamp</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline" className={cn("border-transparent", actionStyles[log.action])}>
                      {log.action.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(log.createdAt, 'PPp')}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Task ID: {log.taskId}</p>
                      <div>{renderChanges(log)}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center h-24">
                  No audit logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {totalPages > 1 && (
             <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                    >
                        Previous
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}
