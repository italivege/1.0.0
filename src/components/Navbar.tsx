"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'SOLUTIONS', path: '/solutions' },
    { name: 'SERVICES', path: '/services' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-40 bg-[#030811]/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <span className="font-tech font-bold text-2xl tracking-wider text-white">
              italive<span className="neon-text">.ge</span>
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 font-tech text-sm tracking-wide">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path} 
                  className={`transition-colors ${pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-cyan-400'}`}>
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="hidden md:block">
            <button className="btn-neon text-xs">LOGIN / SIGN UP</button>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-cyan-400 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#030811] border-b border-cyan-500/20 font-tech">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.path ? 'text-cyan-400' : 'text-gray-300 hover:text-cyan-400'}`}>
                {link.name}
              </Link>
            ))}
            <button className="btn-neon mt-4 w-full text-center">LOGIN / SIGN UP</button>
          </div>
        </div>
      )}
    </nav>
  );
}