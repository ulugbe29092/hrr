'use client';

import { useEffect, useState } from 'react';
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
  role: z.enum(['ADMIN', 'BOSHLIQ', 'SOTUVCHI', 'OMBORCHI']),
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

export default function EditUserPage() {
  const router = useRouter();
  const { locale, id } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then((data) => reset({
        fullName: data.fullName,
        role: data.role,
        phone: data.phone || '',
        address: data.address || '',
      }))
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast('Foydalanuvchi yangilandi', 'success');
        setTimeout(() => router.push(`/${locale}/admin/users`), 1500);
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/admin/users`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Foydalanuvchini tahrirlash</h1>
      </div>

      <div className="animate-fadeIn">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="To'liq ism" error={errors.fullName?.message} {...register('fullName')} />
            <Select label="Rol" options={roleOptions} error={errors.role?.message} {...register('role')} />
            <Input label="Telefon raqam" placeholder="+998901234567" {...register('phone')} />
            <Input label="Manzil" placeholder="Toshkent, O'zbekiston" {...register('address')} />
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
