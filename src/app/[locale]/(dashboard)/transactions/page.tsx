'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { formatDateTime } from '@/lib/utils';

interface Transaction {
  id: number;
  type: 'KIRIM' | 'CHIQIM';
  quantity: number;
  note?: string;
  createdAt: string;
  product: { name: string; balance: number };
  creator: { fullName: string };
}

interface ProductOption {
  value: string;
  label: string;
  balance: number;
}

const schema = z.object({
  productId: z.string().min(1, 'Mahsulot tanlanishi shart'),
  quantity: z.string().min(1, 'Miqdor kiritilishi shart'),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function TransactionsPage() {
  const t = useTranslations('transactions');
  const { locale } = useParams();
  const { toasts, addToast, removeToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'KIRIM' | 'CHIQIM'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'KIRIM' | 'CHIQIM'>('KIRIM');
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [selectedBalance, setSelectedBalance] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const watchedProductId = watch('productId');

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (watchedProductId) {
      const p = products.find((p) => p.value === watchedProductId);
      setSelectedBalance(p?.balance ?? null);
    }
  }, [watchedProductId, products]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/transactions');
      if (res.ok) setTransactions(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      setProducts(
        data.map((p: any) => ({
          value: String(p.id),
          label: `${p.name} (qoldiq: ${p.balance} ta)`,
          balance: p.balance,
        }))
      );
      
      // Eng ko'p qoldig'i bo'lgan mahsulotni avtomatik tanlash
      if (data.length > 0) {
        const maxBalanceProduct = data.reduce((max: any, p: any) => 
          p.balance > max.balance ? p : max
        );
        setValue('productId', String(maxBalanceProduct.id));
      }
    }
  };

  const openModal = (type: 'KIRIM' | 'CHIQIM') => {
    setModalType(type);
    reset({ productId: '', quantity: '', note: '' });
    
    // Eng ko'p qoldig'i bo'lgan mahsulotni avtomatik tanlash
    if (products.length > 0) {
      const maxBalanceProduct = products.reduce((max, p) => 
        p.balance > max.balance ? p : max
      );
      setValue('productId', maxBalanceProduct.value);
    }
    
    setIsModalOpen(true);
  };

  const onSubmit = async (data: FormData) => {
    if (modalType === 'CHIQIM' && selectedBalance !== null && parseInt(data.quantity) > selectedBalance) {
      addToast(`Qoldiq yetarli emas. Mavjud: ${selectedBalance} ta`, 'error');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: data.productId,
          type: modalType,
          quantity: parseInt(data.quantity),
          note: data.note || undefined,
        }),
      });

      if (res.ok) {
        addToast(`${modalType} muvaffaqiyatli qo'shildi`, 'success');
        setIsModalOpen(false);
        fetchTransactions();
        fetchProducts();
      } else {
        const err = await res.json();
        addToast(err.error || 'Xatolik yuz berdi', 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = filter === 'ALL'
    ? transactions
    : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2" onClick={() => openModal('KIRIM')}>
            <Plus size={18} /> Kirim qo'shish
          </Button>
          <Button className="flex items-center gap-2" onClick={() => openModal('CHIQIM')}>
            <Plus size={18} /> Chiqim qo'shish
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'KIRIM', 'CHIQIM'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f === 'ALL' ? 'Barchasi' : f}
          </button>
        ))}
      </div>

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
                <Th>{t('product')}</Th>
                <Th>{t('type')}</Th>
                <Th>{t('quantity')}</Th>
                <Th>{t('note')}</Th>
                <Th>{t('createdBy')}</Th>
                <Th>{t('date')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={7} className="text-center text-gray-500 py-8">
                    Tranzaksiya topilmadi
                  </Td>
                </Tr>
              ) : (
                filtered.map((tx, i) => (
                  <Tr key={tx.id}>
                    <Td className="text-gray-500">{i + 1}</Td>
                    <Td className="font-medium">{tx.product.name}</Td>
                    <Td>
                      <Badge variant={tx.type === 'KIRIM' ? 'success' : 'warning'}>
                        {tx.type}
                      </Badge>
                    </Td>
                    <Td>{tx.quantity} ta</Td>
                    <Td className="text-gray-500">{tx.note || '—'}</Td>
                    <Td>{tx.creator.fullName}</Td>
                    <Td className="text-gray-500">{formatDateTime(tx.createdAt)}</Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </div>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'KIRIM' ? 'Kirim qo\'shish' : 'Chiqim qo\'shish'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Mahsulot"
            options={products.map((p) => ({ value: p.value, label: p.label }))}
            placeholder="Mahsulot tanlang..."
            error={errors.productId?.message}
            {...register('productId')}
          />

          {selectedBalance !== null && modalType === 'CHIQIM' && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedBalance < 5
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              ℹ️ Mavjud qoldiq: {selectedBalance} ta
            </div>
          )}

          <Input
            label="Miqdor (ta)"
            type="number"
            min="1"
            placeholder={modalType === 'KIRIM' ? '20' : '5'}
            error={errors.quantity?.message}
            {...register('quantity')}
          />

          <Input
            label="Izoh (ixtiyoriy)"
            placeholder="..."
            {...register('note')}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" isLoading={saving} variant={modalType === 'KIRIM' ? 'secondary' : 'primary'}>
              {modalType === 'KIRIM' ? 'Kirim qo\'shish' : 'Chiqim qo\'shish'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Bekor qilish
            </Button>
          </div>
        </form>
      </Modal>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
