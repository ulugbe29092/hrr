'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { Eye, EyeOff, Lock, User, LogIn, Store } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'uz';
  
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-32 -translate-y-32 opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-50 rounded-full translate-x-48 translate-y-48 opacity-50"></div>
        
        <div className="relative z-10 w-full max-w-md animate-fade-in">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-xl transform hover:scale-105 transition-all duration-300 hover:rotate-3">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Do'kon Tizimi</h1>
            <p className="text-gray-600 text-lg">Professional Boshqaruv Tizimi</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Login
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-200 group-focus-within:text-blue-600">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="ulugbek"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Parol
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-200">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-14 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-5 py-4 rounded-2xl animate-shake">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-red-500">⚠</span>
                  {error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                  <span className="relative z-10">Yuklanmoqda...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-6 w-6 relative z-10" />
                  <span className="relative z-10">Kirish</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2024 Do'kon Tizimi
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white opacity-10 rounded-full animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white opacity-5 rounded-full animate-pulse-slow"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white text-center max-w-lg animate-fade-in-delayed">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white bg-opacity-20 backdrop-blur-lg rounded-full mb-6 animate-bounce-slow">
              <Store className="w-16 h-16" />
            </div>
          </div>
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Do'kon Tizimi
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Professional do'kon boshqaruv tizimi. Mahsulotlar, sotuvlar, xodimlar va hisobotlarni oson boshqaring.
          </p>
          <div className="flex items-center justify-center gap-8 text-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm">Xavfsiz</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">24/7</div>
              <div className="text-sm">Ishlaydi</div>
            </div>
            <div className="w-px h-12 bg-blue-400"></div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">∞</div>
              <div className="text-sm">Imkoniyatlar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
