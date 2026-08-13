'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ShoppingCart, User, Search, Loader2 } from 'lucide-react';
import { Input } from './ui/Input';
import { useCart } from '@/context/CartContext';

interface HeaderProps {
  categories: Category[];
}

export const Header: React.FC<HeaderProps> = ({ categories }) => {
  const router = useRouter();
  const activeCategories = categories.filter(c => c.is_active);
  const { cartCount, syncing } = useCart();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-subtle bg-white/80 backdrop-blur-md shadow-elevation-1">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary">
            Sabari Krishna
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className="text-body-sm font-semibold text-on-surface hover:text-primary transition-colors">
            Home
          </Link>
          {activeCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="text-body-sm font-semibold text-on-surface hover:text-primary transition-colors"
            >
              {category.name}
            </Link>
          ))}
          <Link href="/b2b" className="text-body-sm font-semibold text-on-surface hover:text-primary transition-colors">
            Wholesale
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 hidden md:block">
          <Input
            roundedSize="full"
            placeholder="Search for ghee, oils, groceries..."
            icon={<Search size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 text-on-surface hover:text-primary transition-colors flex items-center">
            {syncing ? (
              <Loader2 size={22} className="animate-spin text-primary" />
            ) : (
              <ShoppingCart size={22} />
            )}
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center transition-all ${syncing ? 'bg-primary scale-110' : ''}`}>
                {cartCount}
              </span>
            )}
          </Link>

          <Link href="/account" className="p-2 text-on-surface hover:text-primary transition-colors">
            <User size={22} />
          </Link>

          <Link href="/admin" className="hidden sm:inline-block text-body-sm font-bold bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-95 transition-all">
            Admin Portal
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
