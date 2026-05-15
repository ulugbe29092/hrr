'use client';

import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from '@/hooks/useTranslations';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Globe } from 'lucide-react';
import Button from '@/components/ui/Button';
import { getRoleName } from '@/lib/utils';

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${locale}/login`);
  };

  const changeLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {t('welcome')}, {session?.user?.name}
          </h1>
          <p className="text-sm text-gray-600">
            {session?.user?.role && getRoleName(session.user.role)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center gap-2">
            <Globe size={20} className="text-gray-600" />
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="uz">O'zbekcha</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>

          {/* User Avatar */}
          {session?.user?.avatar && (
            <img
              src={session.user.avatar}
              alt={session.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            {t('logout')}
          </Button>
        </div>
      </div>
    </header>
  );
}
