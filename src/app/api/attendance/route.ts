import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const where: any = {};
  // Xodim faqat o'zining davomatini ko'radi
  if (session.user.role === 'SOTUVCHI' || session.user.role === 'OMBORCHI') {
    where.userId = parseInt(session.user.id);
  }

  const records = await prisma.attendance.findMany({
    where,
    include: {
      user: { select: { id: true, fullName: true } },
    },
    orderBy: { date: 'desc' },
    take: 100,
  });

  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const canEdit = session.user.role === 'ADMIN' || session.user.role === 'BOSHLIQ';
  if (!canEdit) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { userId, date, arrivedAt, leftAt, note } = await req.json();

  const record = await prisma.attendance.create({
    data: {
      userId: parseInt(userId),
      date: new Date(date),
      arrivedAt: new Date(arrivedAt),
      leftAt: leftAt ? new Date(leftAt) : undefined,
      note,
      createdBy: parseInt(session.user.id),
    },
    include: { user: { select: { id: true, fullName: true } } },
  });

  return NextResponse.json(record, { status: 201 });
}
