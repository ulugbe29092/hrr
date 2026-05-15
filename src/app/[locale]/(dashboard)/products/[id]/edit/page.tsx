'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
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
  name: z.string().min(1, 'Mahsulot nomi kiritilishi shart'),
  buyPrice: z.string().min(1, 'Kelish narxi kiritilishi shart'),
  sellPrice: z.string().min(1, 'Sotish narxi kiritilishi shart'),
});

type FormData = z.infer<typeof schema>;

export default function EditProductPage() {
  const t = useTranslations('products');
  const router = useRouter();
  const { locale, id } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name,
          buyPrice: String(data.buyPrice),
          sellPrice: String(data.sellPrice),
        });
      })
      .finally(() => setFetching(false));
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          buyPrice: parseFloat(data.buyPrice),
          sellPrice: parseFloat(data.sellPrice),
        }),
      });

      if (res.ok) {
        addToast('Mahsulot muvaffaqiyatli yangilandi', 'success');
        setTimeout(() => router.push(`/${locale}/products`), 1500);
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
        <Link href={`/${locale}/products`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Mahsulotni tahrirlash</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label={t('productName')}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('buyPrice') + ' (so\'m)'}
                type="number"
                error={errors.buyPrice?.message}
                {...register('buyPrice')}
              />
              <Input
                label={t('sellPrice') + ' (so\'m)'}
                type="number"
                error={errors.sellPrice?.message}
                {...register('sellPrice')}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isLoading}>Saqlash</Button>
              <Link href={`/${locale}/products`}>
                <Button type="button" variant="secondary">Bekor qilish</Button>
              </Link>
            </div>
          </form>
        </Card>
      </motion.div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
