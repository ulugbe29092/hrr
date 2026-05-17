import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const messageId = parseInt(params.id);
  const userId = session.user.id;

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return NextResponse.json({ error: 'Xabar topilmadi' }, { status: 404 });
  }

  // Agar o'z xabari bo'lsa, seen qo'shmaslik
  if (message.createdBy === parseInt(userId)) {
    return NextResponse.json({ success: true });
  }

  // SeenBy ga qo'shish
  const seenByIds = message.seenBy ? message.seenBy.split(',').filter(Boolean) : [];
  
  if (!seenByIds.includes(userId)) {
    seenByIds.push(userId);
    
    await prisma.message.update({
      where: { id: messageId },
      data: { seenBy: seenByIds.join(',') },
    });
  }

  return NextResponse.json({ success: true });
}
