'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Upload, Save } from 'lucide-react';
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
  }, [session, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
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

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                <p className="text-xs text-gray-500 mt-1">JPG, PNG — max 5MB</p>
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
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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
      </motion.div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
