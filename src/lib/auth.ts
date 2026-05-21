import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { autoSetup } from './autoSetup';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Auto setup database on first login attempt
        await autoSetup();

        if (!credentials?.login || !credentials?.password) {
          throw new Error('Login va parol kiritilishi shart');
        }

        const user = await prisma.user.findUnique({
          where: { login: credentials.login },
        });

        if (!user) {
          throw new Error('Login yoki parol noto\'g\'ri');
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Login yoki parol noto\'g\'ri');
        }

        // Session yaratish
        await prisma.session.create({
          data: {
            userId: user.id,
            loginAt: new Date(),
          },
        });

        return {
          id: user.id.toString(),
          name: user.fullName,
          email: user.login,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 kun
  },
  secret: process.env.NEXTAUTH_SECRET,
};
