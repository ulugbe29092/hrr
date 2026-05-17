'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { ArrowLeft, Upload } from 'lucide-react';
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

export default function AddProductPage() {
  const t = useTranslations('products');
  const router = useRouter();
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let imageUrl = '';

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          buyPrice: parseFloat(data.buyPrice),
          sellPrice: parseFloat(data.sellPrice),
          image: imageUrl || undefined,
        }),
      });

      if (res.ok) {
        addToast('Mahsulot muvaffaqiyatli qo\'shildi', 'success');
        setTimeout(() => {
          addToast('Kirim/Chiqimga o\'tilmoqda...', 'info');
        }, 1500);
        setTimeout(() => router.push(`/${locale}/transactions/income`), 5000);
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
        <Link href={`/${locale}/products`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{t('addProduct')}</h1>
      </div>

      <div className="animate-fadeIn">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Rasm yuklash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('image')} (ixtiyoriy)
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                )}
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                    Rasm tanlash
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <Input
              label={t('productName')}
              placeholder="Masalan: Suv 0.5L"
              error={errors.name?.message}
              {...register('name')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('buyPrice') + ' (so\'m)'}
                type="number"
                placeholder="1000"
                error={errors.buyPrice?.message}
                {...register('buyPrice')}
              />
              <Input
                label={t('sellPrice') + ' (so\'m)'}
                type="number"
                placeholder="2000"
                error={errors.sellPrice?.message}
                {...register('sellPrice')}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" isLoading={isLoading}>
                Saqlash
              </Button>
              <Link href={`/${locale}/products`}>
                <Button type="button" variant="secondary">
                  Bekor qilish
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
