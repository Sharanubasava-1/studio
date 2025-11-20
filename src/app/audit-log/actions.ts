'use server';

import { getAuditLogs as getLogs } from '@/lib/data';

export async function getAuditLogs({ page, limit }: { page: number; limit: number }) {
  try {
    const result = await getLogs({ page, limit });
    return {
      logs: result.logs,
      totalLogs: result.totalLogs,
    };
  } catch (error) {
    return {
      error: 'Failed to fetch audit logs.',
      logs: [],
      totalLogs: 0,
    };
  }
}
