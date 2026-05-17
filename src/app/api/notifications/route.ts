import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type'); // system yoki user

  const where = type === 'system' ? { type: 'SYSTEM' } : {};

  const notifications = await prisma.notification.findMany({
    where,
    include: {
      creator: { select: { id: true, fullName: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: type === 'system' ? 5 : 100, // System uchun faqat 5 ta
  });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, body, type, image, file, fileName } = await req.json();

  if (!title && !body && !image && !file) {
    return NextResponse.json({ error: 'Xabar yoki fayl kiritilishi shart' }, { status: 400 });
  }

  const notification = await prisma.notification.create({
    data: {
      title: title || 'Bildirishnoma',
      body: body || '',
      type: type || 'SYSTEM',
      image: image || null,
      file: file || null,
      fileName: fileName || null,
      createdBy: parseInt(session.user.id),
    },
    include: { creator: { select: { id: true, fullName: true, avatar: true } } },
  });

  return NextResponse.json(notification, { status: 201 });
}
