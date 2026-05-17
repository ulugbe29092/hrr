'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

const schema = z.object({
  fullName: z.string().min(1, 'To\'liq ism kiritilishi shart'),
  login: z.string().min(3, 'Login kamida 3 ta belgi bo\'lishi kerak'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi bo\'lishi kerak'),
  role: z.enum(['ADMIN', 'BOSHLIQ', 'SOTUVCHI', 'OMBORCHI'], {
    errorMap: () => ({ message: 'Rol tanlanishi shart' }),
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const roleOptions = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'BOSHLIQ', label: 'Boshliq' },
  { value: 'SOTUVCHI', label: 'Sotuvchi' },
  { value: 'OMBORCHI', label: 'Omborchi' },
];

export default function AddUserPage() {
  const router = useRouter();
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast('Foydalanuvchi muvaffaqiyatli qo\'shildi', 'success');
        setTimeout(() => router.push(`/${locale}/admin/users`), 1500);
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } catch {
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/users`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Yangi foydalanuvchi qo'shish</h1>
      </div>

      <div className="animate-fadeIn">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="To'liq ism"
              placeholder="Abdullayev Abdulla"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Login"
                placeholder="abdulla01"
                error={errors.login?.message}
                {...register('login')}
              />
              <Input
                label="Parol"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Select
              label="Rol"
              options={roleOptions}
              placeholder="Rol tanlang..."
              error={errors.role?.message}
              {...register('role')}
            />

            <Input
              label="Telefon raqam (ixtiyoriy)"
              placeholder="+998901234567"
              {...register('phone')}
            />

            <Input
              label="Manzil (ixtiyoriy)"
              placeholder="Toshkent, O'zbekiston"
              {...register('address')}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isLoading}>Saqlash</Button>
              <Link href={`/${locale}/admin/users`}>
                <Button type="button" variant="secondary">Bekor qilish</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
