import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canEdit = session.user.role === 'ADMIN' || session.user.role === 'BOSHLIQ';
  if (!canEdit) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { arrivedAt, leftAt, note } = await req.json();

  const record = await prisma.attendance.update({
    where: { id: parseInt(params.id) },
    data: {
      arrivedAt: arrivedAt ? new Date(arrivedAt) : undefined,
      leftAt: leftAt ? new Date(leftAt) : null,
      note,
    },
    include: { user: { select: { id: true, fullName: true } } },
  });

  return NextResponse.json(record);
}
