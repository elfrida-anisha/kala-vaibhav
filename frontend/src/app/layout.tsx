import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BuyerAssistantDrawer from '@/components/BuyerAssistantDrawer';

export const metadata: Metadata = {
  title: 'Kala Vaibhav — Heritage Indian Artisan Marketplace',
  description:
    'Speak to sell. Buy what exists. Commission what you imagine. Discover the story behind every craft.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#FAF7F0] text-[#272522] min-h-screen flex flex-col font-sans antialiased selection:bg-[#C5A56A]/30">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BuyerAssistantDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
