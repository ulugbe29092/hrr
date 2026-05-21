'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogOut, Bell, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { getRoleName } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  type: string;
}

export default function Header({ locale }: { locale: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatEnabled, setChatEnabled] = useState(true);

  useEffect(() => {
    fetchNotifications();
    
    // Chat holatini localStorage dan yuklash
    const savedChatState = localStorage.getItem('chatEnabled');
    if (savedChatState !== null) {
      setChatEnabled(savedChatState === 'true');
    }
  }, []);

  useEffect(() => {
    if (showNotifications && notifications.some(n => !n.isRead)) {
      fetch('/api/notifications/read-all', { method: 'PATCH' })
        .then(() => fetchNotifications())
        .catch(() => {});
    }
  }, [showNotifications]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications?type=system');
      if (res.ok) {
        const data = await res.json();
        // Faqat tizim bildirishnomalarini ko'rsatish (mahsulot qoldig'i)
        const systemNotifs = data.filter((n: Notification) => n.type === 'SYSTEM');
        setNotifications(systemNotifs.slice(0, 5)); // Faqat 5 tasi
        setUnreadCount(systemNotifs.filter((n: Notification) => !n.isRead).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push(`/${locale}/login`);
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">HR</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">HR Tizimi</h1>
              <p className="text-xs text-gray-500">Boshqaruv Paneli</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Chat Button - faqat chatEnabled bo'lsa ko'rinadi */}
          {chatEnabled && (
            <Link href={`/${locale}/messages`}>
              <button 
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Xabarlar"
              >
                <Send size={22} />
              </button>
            </Link>
          )}

          {/* Notifications Icon - faqat tizim bildirishnomalari */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Bildirishnomalar"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 animate-scaleIn max-h-[500px] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <h3 className="font-semibold text-gray-900 text-lg">Bildirishnomalar</h3>
                  <p className="text-xs text-gray-500 mt-1">Tizim xabarlari</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Bildirishnoma yo'q</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (!notif.isRead) markAsRead(notif.id);
                        }}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notif.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.isRead && (
                            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-gray-900 mb-1">{notif.title}</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{notif.body}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notif.createdAt).toLocaleString('uz-UZ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Chiqish
          </Button>
        </div>
      </div>

      {/* Click outside to close */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
}
