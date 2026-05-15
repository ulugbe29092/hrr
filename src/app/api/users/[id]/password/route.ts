import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Faqat o'zi yoki admin parolni o'zgartira oladi
  const isAdmin = session.user.role === 'ADMIN';
  const isSelf = session.user.id === params.id;
  if (!isAdmin && !isSelf) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { currentPassword, newPassword } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: parseInt(params.id) } });
  if (!user) return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });

  // O'zi o'zgartirsa joriy parolni tekshirish
  if (isSelf && !isAdmin) {
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return NextResponse.json({ error: 'Joriy parol noto\'g\'ri' }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: parseInt(params.id) }, data: { password: hashed } });

  return NextResponse.json({ success: true });
}
