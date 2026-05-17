'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Plus, Search, Edit, Eye, Upload, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  image?: string;
  buyPrice: number;
  sellPrice: number;
  income: number;
  expense: number;
  balance: number;
  profit: number;
}

const schema = z.object({
  name: z.string().min(1, 'Mahsulot nomi kiritilishi shart'),
  buyPrice: z.string().min(1, 'Kelish narxi kiritilishi shart'),
  sellPrice: z.string().min(1, 'Sotish narxi kiritilishi shart'),
});

type FormData = z.infer<typeof schema>;

export default function ProductsPage() {
  const t = useTranslations('products');
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
        addToast('Mahsulot o\'chirildi', 'success');
      } else {
        addToast('Xatolik yuz berdi', 'error');
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
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
        setShowAddModal(false);
        reset();
        setImageFile(null);
        setImagePreview('');
        fetchProducts();
        
        // Redirect to transactions after 5 seconds
        setTimeout(() => {
          addToast('Kirim/Chiqimga o\'tilmoqda...', 'info');
        }, 1500);
        setTimeout(() => {
          window.location.href = `/${locale}/transactions/income`;
        }, 5000);
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } catch {
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <Button className="flex items-center gap-2" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          {t('addProduct')}
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <Input
          placeholder={`${t('productName')} bo'yicha qidirish...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
        </div>
      ) : (
        <div className="animate-fadeIn">
          <Table>
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>Rasm</Th>
                <Th>{t('productName')}</Th>
                <Th>{t('buyPrice')}</Th>
                <Th>{t('sellPrice')}</Th>
                <Th>{t('totalIncome')}</Th>
                <Th>{t('totalExpense')}</Th>
                <Th>{t('balance')}</Th>
                <Th>{t('profit')}</Th>
                <Th>Amallar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={10} className="text-center text-gray-500 py-8">
                    Mahsulot topilmadi
                  </Td>
                </Tr>
              ) : (
                filtered.map((product, i) => (
                  <Tr key={product.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs font-medium border border-gray-200">
                          {product.name[0]}
                        </div>
                      )}
                    </Td>
                    <Td className="font-medium">{product.name}</Td>
                    <Td>{formatCurrency(product.buyPrice)}</Td>
                    <Td>{formatCurrency(product.sellPrice)}</Td>
                    <Td>
                      <Badge variant="info">{product.income} ta</Badge>
                    </Td>
                    <Td>
                      <Badge variant="warning">{product.expense} ta</Badge>
                    </Td>
                    <Td>
                      <Badge variant={product.balance < 5 ? 'danger' : 'success'}>
                        {product.balance} ta
                      </Badge>
                    </Td>
                    <Td className="font-semibold text-green-700">
                      {formatCurrency(product.profit)}
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/products/${product.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} />
                          </Button>
                        </Link>
                        <Link href={`/${locale}/products/${product.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit size={16} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={t('addProduct')} size="lg">
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
            <Button type="submit" isLoading={isSubmitting}>
              Saqlash
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Mahsulotni o'chirish">
        <p className="text-gray-700 mb-6">Haqiqatan ham bu mahsulotni o'chirmoqchimisiz?</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Bekor qilish</Button>
          <Button variant="danger" isLoading={deleting} onClick={handleDelete}>O'chirish</Button>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
