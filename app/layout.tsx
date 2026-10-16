// app/layout.tsx
import React, { Suspense } from 'react';
import Navbar from '@/components/Navbar'; // Hoặc đường dẫn tương đối tùy vào vị trí bạn lưu component
import { Be_Vietnam_Pro, Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'vietnamese'],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Bọc Navbar trong Suspense để xử lý client hook dynamic */}
        <Suspense
          fallback={React.createElement('div', {
            className: 'h-16 bg-white border-b border-gray-200',
          })}
        >
          <Navbar />
        </Suspense>

        {/* Nội dung các trang con */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}