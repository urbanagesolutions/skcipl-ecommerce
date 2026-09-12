'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, Menu, X, ExternalLink, ShieldCheck, ShoppingBag, Store, ChevronRight } from 'lucide-react';
import { CORPORATE_INFO } from '@/lib/data';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About SKCIPL', href: '/about' },
    { label: 'Platforms', href: '/platforms' },
    { label: 'Products', href: '/products' },
    { 
      label: 'GKS Mart', 
      href: '/gks-mart', 
      badge: 'gksmart.in',
      highlight: true
    },
    { label: 'Wholesale & B2B', href: '/b2b' },
    { label: 'Quality & FSSAI', href: '/quality' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-border-subtle">
      {/* Top Corporate Strip */}
      <div className="bg-[#1c2a38] text-white text-[11px] py-1.5 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-gray-300">
            <span className="hidden sm:inline-flex items-center gap-1">
              <ShieldCheck size={13} className="text-secondary" />
              <span>FSSAI Lic. No: <strong>{CORPORATE_INFO.fssai}</strong></span>
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">CIN: {CORPORATE_INFO.cin}</span>
            <span className="hidden lg:inline">|</span>
            <span className="text-gray-300">Tiruppur, Tamil Nadu</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href={`tel:${CORPORATE_INFO.phone}`} 
              className="flex items-center gap-1.5 hover:text-primary transition-colors text-white"
            >
              <Phone size={12} className="text-primary" />
              <span>{CORPORATE_INFO.phone}</span>
            </a>
            <span className="text-gray-500">|</span>
            <a 
              href={`mailto:${CORPORATE_INFO.email}`} 
              className="hidden sm:flex items-center gap-1.5 hover:text-primary transition-colors text-gray-300"
            >
              <Mail size={12} className="text-primary" />
              <span>{CORPORATE_INFO.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Corporate Header */}
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Company Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-serif font-black text-xl shadow-xs group-hover:bg-primary group-hover:text-white transition-all">
            SK
          </div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold tracking-tight text-on-surface leading-tight font-serif">
              Sabari Krishna Consumables
            </span>
            <span className="text-[10px] uppercase tracking-wider text-warm-gray font-semibold">
              India Private Limited • Est. Tiruppur
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[13px] font-semibold transition-all px-2.5 py-1.5 rounded-md flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-primary bg-primary-container/40' 
                    : link.highlight
                    ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface'
                }`}
              >
                {link.highlight && <Store size={14} className="text-emerald-600" />}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold tracking-wide">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20would%20like%20to%20inquire%20about%20your%20products%20and%20platforms.`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-bold bg-secondary hover:bg-secondary/90 text-white px-4 py-2 rounded-lg transition-all shadow-xs"
          >
            <span>WhatsApp Inquiry</span>
            <ExternalLink size={12} />
          </a>

          <Link
            href="/gks-mart"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold border border-primary text-primary hover:bg-primary hover:text-white px-3.5 py-2 rounded-lg transition-all"
          >
            <ShoppingBag size={13} />
            <span>GKS Mart</span>
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg text-on-surface hover:bg-surface transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-border-subtle px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="text-xs font-bold uppercase tracking-wider text-warm-gray px-3 py-1">
            Corporate Navigation
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                pathname === link.href 
                  ? 'bg-primary-container text-primary font-bold' 
                  : link.highlight
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-on-surface hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-2">
                {link.highlight && <Store size={16} className="text-emerald-600" />}
                <span>{link.label}</span>
              </div>
              {link.badge ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold">
                  {link.badge}
                </span>
              ) : (
                <ChevronRight size={16} className="text-warm-gray" />
              )}
            </Link>
          ))}

          <div className="pt-3 border-t border-border-subtle space-y-2">
            <a
              href="https://wa.me/919842228484?text=Hello%20Sabari%20Krishna%20Consumables%2C%20I%20would%20like%20to%20inquire%20about%20your%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-xs font-bold bg-secondary text-white py-2.5 rounded-lg"
            >
              <span>Instant WhatsApp Inquiry</span>
              <ExternalLink size={14} />
            </a>
            <div className="text-center text-[11px] text-warm-gray pt-1">
              FSSAI Lic: {CORPORATE_INFO.fssai} • Tiruppur, Tamil Nadu
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
