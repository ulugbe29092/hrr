'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from '@/hooks/useTranslations';
import { Upload, Save, MessageSquare, MessageSquareOff, Palette } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { getRoleName } from '@/lib/utils';

const schema = z.object({
  fullName: z.string().min(1, 'Ism kiritilishi shart'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Joriy parol kiritilishi shart'),
    newPassword: z.string().min(6, 'Yangi parol kamida 6 ta belgi bo\'lishi kerak'),
    confirmPassword: z.string().min(1, 'Parolni tasdiqlang'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Parollar mos kelmadi',
    path: ['confirmPassword'],
  });

type ProfileForm = z.infer<typeof schema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const t = useTranslations();
  const { data: session, update } = useSession();
  const { toasts, addToast, removeToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [chatEnabled, setChatEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('light');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
  });

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/users/${session.user.id}`)
        .then((r) => r.json())
        .then((data) => {
          reset({ fullName: data.fullName, phone: data.phone || '', address: data.address || '' });
          if (data.avatar) setAvatarPreview(data.avatar);
        });
    }
    
    // Chat holatini localStorage dan yuklash
    const savedChatState = localStorage.getItem('chatEnabled');
    if (savedChatState !== null) {
      setChatEnabled(savedChatState === 'true');
    }

    // Tema holatini localStorage dan yuklash
    const savedTheme = localStorage.getItem('appTheme') as any;
    if (savedTheme) {
      setSelectedTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, [session, reset]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    // Eski tema klasslarini olib tashlash
    root.classList.remove('theme-light', 'theme-blue', 'theme-green', 'theme-purple', 'theme-dark', 'theme-red', 'theme-orange', 'theme-yellow', 'theme-teal', 'theme-sky', 'theme-indigo', 'theme-pink', 'theme-rose', 'theme-gray', 'theme-zinc');
    
    // Yangi tema klassini qo'shish
    root.classList.add(`theme-${theme}`);

    // CSS o'zgaruvchilarini o'rnatish
    const themes: Record<string, Record<string, string>> = {
      light: { '--color-primary': '59 130 246', '--color-primary-dark': '37 99 235', '--color-bg': '255 255 255', '--color-bg-secondary': '249 250 251', '--color-text': '17 24 39', '--color-border': '229 231 235' },
      blue: { '--color-primary': '37 99 235', '--color-primary-dark': '29 78 216', '--color-bg': '239 246 255', '--color-bg-secondary': '219 234 254', '--color-text': '17 24 39', '--color-border': '191 219 254' },
      green: { '--color-primary': '34 197 94', '--color-primary-dark': '22 163 74', '--color-bg': '240 253 244', '--color-bg-secondary': '220 252 231', '--color-text': '17 24 39', '--color-border': '187 247 208' },
      purple: { '--color-primary': '168 85 247', '--color-primary-dark': '147 51 234', '--color-bg': '250 245 255', '--color-bg-secondary': '243 232 255', '--color-text': '17 24 39', '--color-border': '233 213 255' },
      dark: { '--color-primary': '96 165 250', '--color-primary-dark': '59 130 246', '--color-bg': '17 24 39', '--color-bg-secondary': '31 41 55', '--color-text': '243 244 246', '--color-border': '55 65 81' },
      red: { '--color-primary': '239 68 68', '--color-primary-dark': '220 38 38', '--color-bg': '254 242 242', '--color-bg-secondary': '254 226 226', '--color-text': '17 24 39', '--color-border': '254 202 202' },
      orange: { '--color-primary': '249 115 22', '--color-primary-dark': '234 88 12', '--color-bg': '255 247 237', '--color-bg-secondary': '254 237 213', '--color-text': '17 24 39', '--color-border': '254 215 170' },
      yellow: { '--color-primary': '234 179 8', '--color-primary-dark': '202 138 4', '--color-bg': '254 252 232', '--color-bg-secondary': '254 249 195', '--color-text': '17 24 39', '--color-border': '254 240 138' },
      teal: { '--color-primary': '20 184 166', '--color-primary-dark': '15 118 110', '--color-bg': '240 253 250', '--color-bg-secondary': '204 251 241', '--color-text': '17 24 39', '--color-border': '153 246 228' },
      sky: { '--color-primary': '14 165 233', '--color-primary-dark': '2 132 199', '--color-bg': '240 249 255', '--color-bg-secondary': '224 242 254', '--color-text': '17 24 39', '--color-border': '186 230 253' },
      indigo: { '--color-primary': '99 102 241', '--color-primary-dark': '79 70 229', '--color-bg': '238 242 255', '--color-bg-secondary': '224 231 255', '--color-text': '17 24 39', '--color-border': '199 210 254' },
      pink: { '--color-primary': '236 72 153', '--color-primary-dark': '219 39 119', '--color-bg': '253 242 248', '--color-bg-secondary': '252 231 243', '--color-text': '17 24 39', '--color-border': '251 207 232' },
      rose: { '--color-primary': '244 63 94', '--color-primary-dark': '225 29 72', '--color-bg': '255 241 242', '--color-bg-secondary': '255 228 230', '--color-text': '17 24 39', '--color-border': '254 205 211' },
      gray: { '--color-primary': '107 114 128', '--color-primary-dark': '75 85 99', '--color-bg': '249 250 251', '--color-bg-secondary': '243 244 246', '--color-text': '17 24 39', '--color-border': '229 231 235' },
      zinc: { '--color-primary': '113 113 122', '--color-primary-dark': '82 82 91', '--color-bg': '250 250 250', '--color-bg-secondary': '244 244 245', '--color-text': '17 24 39', '--color-border': '228 228 231' },
    };

    const colors = themes[theme] || themes.light;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  const changeTheme = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem('appTheme', theme);
    applyTheme(theme);
    addToast(`${getThemeName(theme)} temasi qo'llandi`, 'success');
  };

  const getThemeName = (theme: string) => {
    const names: Record<string, string> = {
      light: 'Yorug\'', blue: 'Moviy', green: 'Yashil', purple: 'Binafsha', dark: 'Qorong\'u',
      red: 'Qizil', orange: 'To\'q sariq', yellow: 'Sariq', teal: 'Ko\'k-yashil',
      sky: 'Osmon', indigo: 'Nil', pink: 'Pushti', rose: 'Atirgul', gray: 'Kulrang', zinc: 'Kumush',
    };
    return names[theme] || 'Yorug\'';
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 20MB limit
      if (file.size > 20 * 1024 * 1024) {
        addToast('Rasm hajmi 20MB dan oshmasligi kerak', 'error');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const toggleChat = () => {
    const newState = !chatEnabled;
    setChatEnabled(newState);
    localStorage.setItem('chatEnabled', String(newState));
    addToast(
      newState ? 'Chat yoqildi' : 'Chat o\'chirildi',
      'success'
    );
  };

  const onSaveProfile = async (data: ProfileForm) => {
    setSaving(true);
    try {
      let avatarUrl = avatarPreview;

      if (avatarFile) {
        const formData = new FormData();
        formData.append('file', avatarFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          avatarUrl = url;
        } else {
          const error = await uploadRes.json();
          addToast('Rasm yuklashda xatolik: ' + (error.error || ''), 'error');
          setSaving(false);
          return;
        }
      }

      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, avatar: avatarUrl }),
      });

      if (res.ok) {
        addToast('Profil muvaffaqiyatli yangilandi', 'success');
        await update();
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data: PasswordForm) => {
    setSavingPwd(true);
    try {
      const res = await fetch(`/api/users/${session?.user?.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (res.ok) {
        addToast('Parol muvaffaqiyatli o\'zgartirildi', 'success');
        resetPwd();
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900">{t('nav.profile')}</h1>

      {/* Theme Settings */}
      <div className="animate-fadeIn">
        <Card title="Tema sozlamalari">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Sayt rangini tanlang</h3>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {/* Yorug' */}
              <button onClick={() => changeTheme('light')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'light' ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-white to-gray-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 mb-1"></div>
                  <span className="text-[10px] font-medium text-gray-700">Yorug'</span>
                </div>
                {selectedTheme === 'light' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Moviy */}
              <button onClick={() => changeTheme('blue')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'blue' ? 'border-blue-600 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-blue-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-blue-700">Moviy</span>
                </div>
                {selectedTheme === 'blue' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Yashil */}
              <button onClick={() => changeTheme('green')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'green' ? 'border-green-600 shadow-lg ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-green-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-green-700">Yashil</span>
                </div>
                {selectedTheme === 'green' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Binafsha */}
              <button onClick={() => changeTheme('purple')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'purple' ? 'border-purple-600 shadow-lg ring-2 ring-purple-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-purple-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-purple-700">Binafsha</span>
                </div>
                {selectedTheme === 'purple' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Qorong'u */}
              <button onClick={() => changeTheme('dark')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'dark' ? 'border-gray-700 shadow-lg ring-2 ring-gray-400' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gray-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-gray-200">Qorong'u</span>
                </div>
                {selectedTheme === 'dark' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Qizil */}
              <button onClick={() => changeTheme('red')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'red' ? 'border-red-600 shadow-lg ring-2 ring-red-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-red-50 to-red-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-red-700">Qizil</span>
                </div>
                {selectedTheme === 'red' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* To'q sariq */}
              <button onClick={() => changeTheme('orange')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'orange' ? 'border-orange-600 shadow-lg ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-orange-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-orange-700">To'q sariq</span>
                </div>
                {selectedTheme === 'orange' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Sariq */}
              <button onClick={() => changeTheme('yellow')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'yellow' ? 'border-yellow-600 shadow-lg ring-2 ring-yellow-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-yellow-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-yellow-700">Sariq</span>
                </div>
                {selectedTheme === 'yellow' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Ko'k-yashil */}
              <button onClick={() => changeTheme('teal')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'teal' ? 'border-teal-600 shadow-lg ring-2 ring-teal-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-teal-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-teal-700">Ko'k-yashil</span>
                </div>
                {selectedTheme === 'teal' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-teal-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Osmon */}
              <button onClick={() => changeTheme('sky')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'sky' ? 'border-sky-600 shadow-lg ring-2 ring-sky-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-sky-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-sky-700">Osmon</span>
                </div>
                {selectedTheme === 'sky' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-sky-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Nil */}
              <button onClick={() => changeTheme('indigo')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'indigo' ? 'border-indigo-600 shadow-lg ring-2 ring-indigo-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-indigo-700">Nil</span>
                </div>
                {selectedTheme === 'indigo' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Pushti */}
              <button onClick={() => changeTheme('pink')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'pink' ? 'border-pink-600 shadow-lg ring-2 ring-pink-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-pink-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-pink-700">Pushti</span>
                </div>
                {selectedTheme === 'pink' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Atirgul */}
              <button onClick={() => changeTheme('rose')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'rose' ? 'border-rose-600 shadow-lg ring-2 ring-rose-200' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-rose-50 to-rose-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-rose-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-rose-700">Atirgul</span>
                </div>
                {selectedTheme === 'rose' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Kulrang */}
              <button onClick={() => changeTheme('gray')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'gray' ? 'border-gray-600 shadow-lg ring-2 ring-gray-300' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-gray-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-gray-700">Kulrang</span>
                </div>
                {selectedTheme === 'gray' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>

              {/* Kumush */}
              <button onClick={() => changeTheme('zinc')} className={`group relative h-20 rounded-xl border-2 transition-all duration-300 ${selectedTheme === 'zinc' ? 'border-zinc-600 shadow-lg ring-2 ring-zinc-300' : 'border-gray-200 hover:border-gray-300'}`}>
                <div className="h-full rounded-lg bg-gradient-to-br from-zinc-50 to-zinc-100 p-2 flex flex-col items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-zinc-600 mb-1"></div>
                  <span className="text-[10px] font-medium text-zinc-700">Kumush</span>
                </div>
                {selectedTheme === 'zinc' && <div className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-600 rounded-full flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Tanlangan tema: <span className="font-semibold">{getThemeName(selectedTheme)}</span>
            </p>
          </div>
        </Card>
      </div>

      {/* Chat Settings */}
      <div className="animate-fadeIn" style={{ animationDelay: '50ms' }}>
        <Card title="Chat sozlamalari">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Xabarlar (Chat)</h3>
              <p className="text-sm text-gray-600">
                Chatni butunlay yoqish yoki o'chirish
              </p>
            </div>
            <button
              onClick={toggleChat}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                chatEnabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-flex h-10 w-10 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
                  chatEnabled ? 'translate-x-12' : 'translate-x-1'
                }`}
              >
                {chatEnabled ? (
                  <MessageSquare size={20} className="text-green-600" />
                ) : (
                  <MessageSquareOff size={20} className="text-gray-600" />
                )}
              </span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {chatEnabled
              ? '✅ Chat faol - xabarlar yuborish va qabul qilish mumkin'
              : '❌ Chat o\'chirilgan - xabarlar ko\'rinmaydi'}
          </p>
        </Card>
      </div>

      {/* Profile Info */}
      <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <Card title="Shaxsiy ma'lumotlar">
          <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary-200" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-2xl">
                  {session?.user?.name?.[0] ?? '?'}
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <span className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    <Upload size={16} /> Rasm o'zgartirish
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG — max 20MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Rol</p>
                <p className="font-medium text-gray-900">
                  {session?.user?.role && getRoleName(session.user.role)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Login</p>
                <p className="font-medium text-gray-900">{session?.user?.email}</p>
              </div>
            </div>

            <Input label="To'liq ism" error={errors.fullName?.message} {...register('fullName')} />
            <Input label="Telefon raqam" placeholder="+998901234567" {...register('phone')} />
            <Input label="Manzil" placeholder="Toshkent, O'zbekiston" {...register('address')} />

            <Button type="submit" isLoading={saving} className="flex items-center gap-2">
              <Save size={18} /> Saqlash
            </Button>
          </form>
        </Card>
      </div>

      {/* Change Password */}
      <div className="animate-fadeIn" style={{ animationDelay: '150ms' }}>
        <Card title="Parolni o'zgartirish">
          <form onSubmit={handlePwd(onChangePassword)} className="space-y-4">
            <Input
              label="Joriy parol"
              type="password"
              error={pwdErrors.currentPassword?.message}
              {...regPwd('currentPassword')}
            />
            <Input
              label="Yangi parol"
              type="password"
              error={pwdErrors.newPassword?.message}
              {...regPwd('newPassword')}
            />
            <Input
              label="Yangi parolni tasdiqlang"
              type="password"
              error={pwdErrors.confirmPassword?.message}
              {...regPwd('confirmPassword')}
            />
            <Button type="submit" variant="secondary" isLoading={savingPwd}>
              Parolni o'zgartirish
            </Button>
          </form>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
