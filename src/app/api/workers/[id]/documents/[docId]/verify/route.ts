import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { formatWorker } from '@/lib/formatters';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; docId: string } }
) {
  try {
    const body = await req.json();
    const { status, notes, verifiedBy = 'Platform Admin' } = body;

    const worker = await prisma.providerProfile.findUnique({
      where: { id: params.id },
    });

    if (!worker) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    let docs: any[] = [];
    try {
      docs = worker.documents ? JSON.parse(worker.documents) : [];
    } catch {
      docs = [];
    }

    let found = false;
    const updatedDocs = docs.map((d) => {
      if (d.id === params.docId) {
        found = true;
        return {
          ...d,
          status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
          verifiedBy,
          notes: notes || d.notes,
        };
      }
      return d;
    });

    if (!found) {
      updatedDocs.push({
        id: params.docId,
        type: 'identity',
        name: 'Verification Document',
        fileUrl: '/docs/sample.pdf',
        status,
        uploadedAt: new Date().toISOString(),
        verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        verifiedBy,
        notes,
      });
    }

    const identityDoc = updatedDocs.find((d) => d.type === 'identity');
    const skillDoc = updatedDocs.find((d) => d.type === 'skill_certificate');
    const shopDoc = updatedDocs.find((d) => d.type === 'shop_proof');

    const newVerifications = {
      identity: identityDoc ? identityDoc.status : 'pending',
      skill: skillDoc ? skillDoc.status : 'pending',
      shop: shopDoc ? shopDoc.status : 'pending',
      mobile: 'verified',
    };

    const isOverallVerified =
      newVerifications.identity === 'verified' &&
      newVerifications.skill === 'verified' &&
      newVerifications.mobile === 'verified';

    const updated = await prisma.providerProfile.update({
      where: { id: params.id },
      data: {
        documents: JSON.stringify(updatedDocs),
        verifications: JSON.stringify(newVerifications),
        verified: isOverallVerified,
        isOverallVerified,
      },
      include: {
        user: true,
        cooperative: true,
      },
    });

    return NextResponse.json(formatWorker(updated));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
