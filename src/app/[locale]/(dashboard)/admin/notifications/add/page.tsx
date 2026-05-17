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
import Card from '@/components/ui/Card';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

const schema = z.object({
  title: z.string().min(1, 'Sarlavha kiritilishi shart'),
  body: z.string().min(1, 'Matn kiritilishi shart'),
});

type FormData = z.infer<typeof schema>;

export default function AddNotificationPage() {
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
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        addToast('Bildirishnoma muvaffaqiyatli yuborildi', 'success');
        setTimeout(() => router.push(`/${locale}/notifications`), 1500);
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/notifications`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Bildirishnoma yozish</h1>
      </div>

      <div className="animate-fadeIn">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Sarlavha"
              placeholder="Muhim xabar"
              error={errors.title?.message}
              {...register('title')}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matn</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={5}
                placeholder="Bildirishnoma matni..."
                {...register('body')}
              />
              {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isLoading}>Yuborish</Button>
              <Link href={`/${locale}/notifications`}>
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
