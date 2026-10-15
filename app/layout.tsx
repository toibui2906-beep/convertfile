// app/layout.tsx
import Navbar from '@/components/Navbar'; // Hoặc đường dẫn tương đối tùy vào vị trí bạn lưu component
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        {/* Thanh bar di chuyển / cố định ở đầu trang */}
        <Navbar />

        {/* Nội dung các trang con */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}