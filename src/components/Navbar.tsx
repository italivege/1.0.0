"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.solutions, path: '/solutions' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.contact, path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#030811]/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <span className="font-[var(--font-orbitron)] font-bold text-2xl tracking-wider text-white">
              italive<span className="neon-text">.ge</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 font-[var(--font-orbitron)] text-sm tracking-wide">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} 
                  className={`transition-colors uppercase ${pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-cyan-400'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Language Switcher & Action Button (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 font-[var(--font-orbitron)] text-sm">
              <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>EN</button>
              <span className="text-gray-700">|</span>
              <button onClick={() => setLang('ka')} className={lang === 'ka' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>GE</button>
            </div>
            <Link className="btn-neon text-xs inline-block text-center" href="/login">{t.nav.login}</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030811] border-b border-cyan-500/20 font-[var(--font-orbitron)]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium uppercase ${pathname === link.path ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}>
                {link.name}
              </Link>
            ))}
            <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-cyan-900/50">
               <button onClick={() => {setLang('en'); setIsMobileMenuOpen(false);}} className={lang === 'en' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>EN</button>
               <span className="text-gray-700">|</span>
               <button onClick={() => {setLang('ka'); setIsMobileMenuOpen(false);}} className={lang === 'ka' ? 'text-cyan-400' : 'text-gray-500 hover:text-white'}>GE</button>
            </div>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-neon mt-4 w-full text-center inline-block">{t.nav.login}</Link>
          </div>
        </div>
      )}
    </nav>
  );
}