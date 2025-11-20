import { getAuditLogs } from '@/lib/data';
import { AuditLogTable } from './components/audit-log-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 0;

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const { logs, totalLogs } = await getAuditLogs({ page: currentPage, limit: 10 });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Audit Log</CardTitle>
          <CardDescription>
            A record of all create, update, and delete actions on tasks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogTable logs={logs} totalLogs={totalLogs} />
        </CardContent>
      </Card>
    </main>
  );
}
