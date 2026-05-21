import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // First, try to run migrations using raw SQL
    try {
      // Create tables if they don't exist
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" SERIAL PRIMARY KEY,
          "fullName" TEXT NOT NULL,
          "login" TEXT UNIQUE NOT NULL,
          "password" TEXT NOT NULL,
          "role" TEXT NOT NULL,
          "phone" TEXT,
          "address" TEXT,
          "avatar" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "sessions" (
          "id" SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "logoutAt" TIMESTAMP(3),
          "ipAddress" TEXT,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "attendance" (
          "id" SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL,
          "date" TIMESTAMP(3) NOT NULL,
          "arrivedAt" TIMESTAMP(3) NOT NULL,
          "leftAt" TIMESTAMP(3),
          "note" TEXT,
          "createdBy" INTEGER NOT NULL,
          FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
          FOREIGN KEY ("createdBy") REFERENCES "users"("id")
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "products" (
          "id" SERIAL PRIMARY KEY,
          "name" TEXT UNIQUE NOT NULL,
          "image" TEXT,
          "buyPrice" DOUBLE PRECISION NOT NULL,
          "sellPrice" DOUBLE PRECISION NOT NULL,
          "createdBy" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("createdBy") REFERENCES "users"("id")
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "transactions" (
          "id" SERIAL PRIMARY KEY,
          "productId" INTEGER NOT NULL,
          "type" TEXT NOT NULL,
          "quantity" INTEGER NOT NULL,
          "note" TEXT,
          "createdBy" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE,
          FOREIGN KEY ("createdBy") REFERENCES "users"("id")
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "notifications" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "body" TEXT NOT NULL,
          "type" TEXT NOT NULL DEFAULT 'SYSTEM',
          "image" TEXT,
          "file" TEXT,
          "fileName" TEXT,
          "createdBy" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "isRead" BOOLEAN NOT NULL DEFAULT false,
          FOREIGN KEY ("createdBy") REFERENCES "users"("id")
        );
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "messages" (
          "id" SERIAL PRIMARY KEY,
          "body" TEXT NOT NULL,
          "image" TEXT,
          "file" TEXT,
          "fileName" TEXT,
          "replyTo" INTEGER,
          "seenBy" TEXT NOT NULL DEFAULT '',
          "createdBy" INTEGER NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY ("replyTo") REFERENCES "messages"("id"),
          FOREIGN KEY ("createdBy") REFERENCES "users"("id")
        );
      `);
    } catch (migrationError: any) {
      console.log('Migration error (might be okay if tables exist):', migrationError.message);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { login: 'ulugbek' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin foydalanuvchi allaqachon mavjud',
        user: {
          login: existingAdmin.login,
          fullName: existingAdmin.fullName,
          role: existingAdmin.role,
        },
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('ulugbek', 10);

    const admin = await prisma.user.create({
      data: {
        fullName: 'Ulugbek',
        login: 'ulugbek',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '+998901234567',
        address: 'Toshkent, O\'zbekiston',
      },
    });

    // Create demo products
    const products = [
      { name: 'Suv 0.5L', buyPrice: 1000, sellPrice: 2000 },
      { name: 'Coca Cola 1L', buyPrice: 5000, sellPrice: 8000 },
      { name: 'Pepsi 1L', buyPrice: 4500, sellPrice: 7500 },
      { name: 'Fanta 1L', buyPrice: 4500, sellPrice: 7500 },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: {
          ...product,
          createdBy: admin.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database yaratildi! Admin foydalanuvchi va demo mahsulotlar qo\'shildi!',
      user: {
        login: admin.login,
        fullName: admin.fullName,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        details: 'Database setup xatosi. DATABASE_URL tekshiring.',
      },
      { status: 500 }
    );
  }
}
