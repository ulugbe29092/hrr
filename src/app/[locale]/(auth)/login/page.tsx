'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'uz';
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        login,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(t('loginError'));
      } else {
        router.push(`/${locale}/dashboard`);
      }
    } catch (err) {
      setError(tCommon('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12L16 6L28 12V28L16 34L4 28V12Z" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L16 18L28 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 18V34" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Do'kon Tizimi</h1>
          <p className="text-gray-600 mt-2">{t('welcome')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('username')}
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="admin"
            required
            autoFocus
          />

          <Input
            label={t('password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            {t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}
