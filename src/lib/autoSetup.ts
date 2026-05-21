import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

let setupCompleted = false;

export async function autoSetup() {
  if (setupCompleted) return;

  try {
    // Check if tables exist by trying to count users
    const userCount = await prisma.user.count();
    
    if (userCount > 0) {
      setupCompleted = true;
      return;
    }
  } catch (error) {
    // Tables don't exist, create them
    try {
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

      console.log('✅ Database tables created');
    } catch (tableError) {
      console.log('Tables might already exist:', tableError);
    }
  }

  // Create admin user if doesn't exist
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { login: 'ulugbek' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('ulugbek', 10);

      await prisma.user.create({
        data: {
          fullName: 'Ulugbek',
          login: 'ulugbek',
          password: hashedPassword,
          role: 'ADMIN',
          phone: '+998901234567',
          address: 'Toshkent, O\'zbekiston',
        },
      });

      console.log('✅ Admin user created');
    }

    setupCompleted = true;
  } catch (userError) {
    console.error('Error creating admin:', userError);
  }
}
