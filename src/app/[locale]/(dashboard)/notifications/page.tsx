'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Bell, Plus, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  creator: { fullName: string };
}

export default function NotificationsPage() {
  const t = useTranslations();
  const { locale } = useParams();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) setNotifications(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = async (id: number) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900">{t('nav.notifications')}</h1>
          {unreadCount > 0 && (
            <Badge variant="danger">{unreadCount} yangi</Badge>
          )}
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button variant="secondary" className="flex items-center gap-2" onClick={markAllRead}>
              <CheckCheck size={18} /> Barchasini o'qildi deb belgilash
            </Button>
          )}
          {isAdmin && (
            <Link href={`/${locale}/admin/notifications/add`}>
              <Button className="flex items-center gap-2">
                <Plus size={18} /> Bildirishnoma yozish
              </Button>
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Bell size={48} className="mb-4 opacity-30" />
          <p className="text-lg">Bildirishnoma yo'q</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                className={`p-5 rounded-lg border cursor-pointer transition-colors ${
                  notif.isRead
                    ? 'bg-white border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => !notif.isRead && markRead(notif.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-gray-700 text-sm">{notif.body}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{notif.creator.fullName}</span>
                      <span>•</span>
                      <span>{formatDateTime(notif.createdAt)}</span>
                    </div>
                  </div>
                  {notif.isRead && (
                    <Badge variant="default">O'qildi</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
