import type { Metadata } from 'next';
import Header from '../components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tailspin Shelter',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen m-0 h-full w-full bg-slate-900 font-sans text-white">
        <Header />
        <main className="container mx-auto h-full max-w-7xl py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
