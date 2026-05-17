'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    
    // Eski tema klasslarini olib tashlash
    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple');
    
    // Yangi tema klassini qo'shish
    root.classList.add(`theme-${theme}`);

    // CSS o'zgaruvchilarini o'rnatish
    const themes = {
      light: {
        '--primary-50': '240 249 255',
        '--primary-100': '224 242 254',
        '--primary-200': '186 230 253',
        '--primary-300': '125 211 252',
        '--primary-400': '56 189 248',
        '--primary-500': '14 165 233',
        '--primary-600': '2 132 199',
        '--primary-700': '3 105 161',
        '--primary-800': '7 89 133',
        '--primary-900': '12 74 110',
        '--bg-primary': '255 255 255',
        '--bg-secondary': '249 250 251',
        '--text-primary': '17 24 39',
        '--text-secondary': '107 114 128',
      },
      dark: {
        '--primary-50': '30 41 59',
        '--primary-100': '51 65 85',
        '--primary-200': '71 85 105',
        '--primary-300': '100 116 139',
        '--primary-400': '148 163 184',
        '--primary-500': '203 213 225',
        '--primary-600': '226 232 240',
        '--primary-700': '241 245 249',
        '--primary-800': '248 250 252',
        '--primary-900': '255 255 255',
        '--bg-primary': '15 23 42',
        '--bg-secondary': '30 41 59',
        '--text-primary': '248 250 252',
        '--text-secondary': '203 213 225',
      },
      blue: {
        '--primary-50': '239 246 255',
        '--primary-100': '219 234 254',
        '--primary-200': '191 219 254',
        '--primary-300': '147 197 253',
        '--primary-400': '96 165 250',
        '--primary-500': '59 130 246',
        '--primary-600': '37 99 235',
        '--primary-700': '29 78 216',
        '--primary-800': '30 64 175',
        '--primary-900': '30 58 138',
        '--bg-primary': '255 255 255',
        '--bg-secondary': '239 246 255',
        '--text-primary': '17 24 39',
        '--text-secondary': '107 114 128',
      },
      green: {
        '--primary-50': '240 253 244',
        '--primary-100': '220 252 231',
        '--primary-200': '187 247 208',
        '--primary-300': '134 239 172',
        '--primary-400': '74 222 128',
        '--primary-500': '34 197 94',
        '--primary-600': '22 163 74',
        '--primary-700': '21 128 61',
        '--primary-800': '22 101 52',
        '--primary-900': '20 83 45',
        '--bg-primary': '255 255 255',
        '--bg-secondary': '240 253 244',
        '--text-primary': '17 24 39',
        '--text-secondary': '107 114 128',
      },
      purple: {
        '--primary-50': '250 245 255',
        '--primary-100': '243 232 255',
        '--primary-200': '233 213 255',
        '--primary-300': '216 180 254',
        '--primary-400': '192 132 252',
        '--primary-500': '168 85 247',
        '--primary-600': '147 51 234',
        '--primary-700': '126 34 206',
        '--primary-800': '107 33 168',
        '--primary-900': '88 28 135',
        '--bg-primary': '255 255 255',
        '--bg-secondary': '250 245 255',
        '--text-primary': '17 24 39',
        '--text-secondary': '107 114 128',
      },
    };

    const colors = themes[theme];
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
