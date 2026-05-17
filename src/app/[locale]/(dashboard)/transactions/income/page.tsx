'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
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
  productId: z.string().min(1, 'Mahsulot tanlanishi shart'),
  quantity: z.string().min(1, 'Miqdor kiritilishi shart'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function IncomePage() {
  const t = useTranslations('transactions');
  const router = useRouter();
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<{ value: string; label: string }[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) =>
        setProducts(data.map((p: any) => ({ value: String(p.id), label: p.name })))
      );
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: data.productId,
          type: 'KIRIM',
          quantity: parseInt(data.quantity),
          note: data.note || undefined,
        }),
      });

      if (res.ok) {
        addToast('Kirim muvaffaqiyatli qo\'shildi', 'success');
        reset();
        setTimeout(() => router.push(`/${locale}/transactions`), 1500);
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
        <Link href={`/${locale}/transactions`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t('addIncome')}</h1>
      </div>

      <div className="animate-fadeIn">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Select
              label={t('product')}
              options={products}
              placeholder="Mahsulot tanlang..."
              error={errors.productId?.message}
              {...register('productId')}
            />

            <Input
              label={t('quantity') + ' (ta)'}
              type="number"
              min="1"
              placeholder="20"
              error={errors.quantity?.message}
              {...register('quantity')}
            />

            <Input
              label={t('note') + ' (ixtiyoriy)'}
              placeholder="Izoh..."
              {...register('note')}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isLoading} variant="secondary">
                Kirim qo'shish
              </Button>
              <Link href={`/${locale}/transactions`}>
                <Button type="button" variant="ghost">Bekor qilish</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
