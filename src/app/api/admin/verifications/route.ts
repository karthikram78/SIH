import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';

export async function GET() {
  try {
    const workers = await prisma.providerProfile.findMany({
      include: {
        user: true,
        cooperative: true,
      },
    });

    const audits: any[] = [];
    workers.forEach((w) => {
      const formatted = formatWorker(w);
      formatted.documents.forEach((doc: any) => {
        audits.push({
          id: `audit-${doc.id}`,
          workerId: formatted.id,
          workerName: formatted.name,
          documentType: doc.type,
          action: doc.status === 'verified' ? 'approved' : doc.status === 'rejected' ? 'rejected' : 'more_info_requested',
          decidedBy: doc.verifiedBy || 'Platform Admin',
          decidedAt: doc.verifiedAt || doc.uploadedAt,
          notes: doc.notes || `Verification assessment for ${doc.name}`,
        });
      });
    });

    return NextResponse.json(audits);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
