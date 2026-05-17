import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 });
    }

    // Fayl hajmini tekshirish (20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fayl hajmi 20MB dan oshmasligi kerak' }, { status: 400 });
    }

    // Fayl nomini yaratish
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;
    
    // Uploads papkasini yaratish
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Faylni saqlash
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);
    
    // URL qaytarish
    const url = `/uploads/${fileName}`;
    
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Yuklashda xatolik yuz berdi' }, { status: 500 });
  }
}
