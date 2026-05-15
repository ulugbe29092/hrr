'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, ArrowDownUp, Users,
  Calendar, FileText, Bell, User, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: number;
}

export default function Sidebar({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setUnreadCount(data.filter((n) => !n.isRead).length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems: NavItem[] = [
    {
      href: `/${locale}/dashboard`,
      label: t('dashboard'),
      icon: <LayoutDashboard size={20} />,
    },
    {
      href: `/${locale}/products`,
      label: t('products'),
      icon: <Package size={20} />,
    },
    {
      href: `/${locale}/transactions`,
      label: t('transactions'),
      icon: <ArrowDownUp size={20} />,
    },
    {
      href: `/${locale}/employees`,
      label: t('employees'),
      icon: <Users size={20} />,
      roles: ['ADMIN', 'BOSHLIQ'],
    },
    {
      href: `/${locale}/attendance`,
      label: t('attendance'),
      icon: <Calendar size={20} />,
      roles: ['ADMIN', 'BOSHLIQ'],
    },
    {
      href: `/${locale}/reports`,
      label: t('reports'),
      icon: <FileText size={20} />,
      roles: ['ADMIN', 'BOSHLIQ'],
    },
    {
      href: `/${locale}/notifications`,
      label: t('notifications'),
      icon: <Bell size={20} />,
      badge: unreadCount,
    },
    {
      href: `/${locale}/profile`,
      label: t('profile'),
      icon: <User size={20} />,
    },
    {
      href: `/${locale}/admin/users`,
      label: t('admin'),
      icon: <Settings size={20} />,
      roles: ['ADMIN'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(session?.user?.role || '');
  });

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 4L21 9V21L12 26L3 21V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9L12 14L21 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14V26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Do'kon Tizimi</h2>
            <p className="text-xs text-gray-500">Boshqaruv paneli</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== `/${locale}/dashboard` && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600')}>
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {session?.user && (
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            {session.user.avatar ? (
              <img src={session.user.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                {session.user.name?.[0] ?? '?'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{session.user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
