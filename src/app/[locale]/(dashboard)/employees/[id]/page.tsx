'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { getRoleName, formatDate, formatDateTime } from '@/lib/utils';

interface Employee {
  id: number;
  fullName: string;
  login: string;
  role: string;
  phone?: string;
  address?: string;
  avatar?: string;
  createdAt: string;
  attendances: Array<{
    id: number;
    date: string;
    arrivedAt: string;
    leftAt?: string;
    note?: string;
  }>;
  transactions: Array<{
    id: number;
    type: string;
    quantity: number;
    createdAt: string;
    product: { name: string };
  }>;
}

export default function EmployeeDetailPage() {
  const { locale, id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((r) => r.json())
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!employee) return <p className="text-gray-600">Xodim topilmadi</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/${locale}/employees`}>
          <Button variant="ghost" size="sm"><ArrowLeft size={20} /></Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{employee.fullName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="flex flex-col items-center text-center gap-4">
              {employee.avatar ? (
                <img src={employee.avatar} alt={employee.fullName} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl">
                  {employee.fullName[0]}
                </div>
              )}
              <div>
                <h2 className="text-xl font-bold text-gray-900">{employee.fullName}</h2>
                <Badge variant="info" className="mt-1">{getRoleName(employee.role)}</Badge>
              </div>
              <div className="w-full text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Login:</span>
                  <span className="font-medium">{employee.login}</span>
                </div>
                {employee.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Telefon:</span>
                    <span className="font-medium">{employee.phone}</span>
                  </div>
                )}
                {employee.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Manzil:</span>
                    <span className="font-medium">{employee.address}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Qo'shilgan:</span>
                  <span className="font-medium">{formatDate(employee.createdAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <p className="text-sm text-gray-500">Jami tranzaksiyalar</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{employee.transactions.length}</p>
            </Card>
            <Card>
              <p className="text-sm text-gray-500">Davomat kunlari</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{employee.attendances.length}</p>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Attendance */}
      <Card title="Davomat tarixi">
        <Table>
          <Thead>
            <Tr>
              <Th>Sana</Th>
              <Th>Keldi</Th>
              <Th>Ketdi</Th>
              <Th>Ish soati</Th>
              <Th>Izoh</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employee.attendances.length === 0 ? (
              <Tr><Td colSpan={5} className="text-center text-gray-500 py-6">Ma'lumot yo'q</Td></Tr>
            ) : (
              employee.attendances.map((att) => {
                const hours = att.leftAt
                  ? ((new Date(att.leftAt).getTime() - new Date(att.arrivedAt).getTime()) / 3600000).toFixed(1)
                  : null;
                return (
                  <Tr key={att.id}>
                    <Td>{formatDate(att.date)}</Td>
                    <Td>{formatDateTime(att.arrivedAt)}</Td>
                    <Td>{att.leftAt ? formatDateTime(att.leftAt) : <Badge variant="warning">Hali ketmagan</Badge>}</Td>
                    <Td>{hours ? `${hours} soat` : '—'}</Td>
                    <Td className="text-gray-500">{att.note || '—'}</Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Card>

      {/* Transactions */}
      <Card title="Tranzaksiyalar tarixi">
        <Table>
          <Thead>
            <Tr>
              <Th>Mahsulot</Th>
              <Th>Turi</Th>
              <Th>Miqdor</Th>
              <Th>Sana</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employee.transactions.length === 0 ? (
              <Tr><Td colSpan={4} className="text-center text-gray-500 py-6">Ma'lumot yo'q</Td></Tr>
            ) : (
              employee.transactions.map((tx) => (
                <Tr key={tx.id}>
                  <Td className="font-medium">{tx.product.name}</Td>
                  <Td>
                    <Badge variant={tx.type === 'KIRIM' ? 'success' : 'warning'}>{tx.type}</Badge>
                  </Td>
                  <Td>{tx.quantity} ta</Td>
                  <Td className="text-gray-500">{formatDateTime(tx.createdAt)}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
