import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Lost Items', path: '/lost-items' },
    { name: 'Found Items', path: '/found-items' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md transition duration-300 hover:rotate-3 hover:scale-105">
            <Search className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950">
              FindBack
            </h1>
            <p className="text-xs font-medium text-gray-600">
              ASTU Lost & Found
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors hover:text-emerald-800 ${
                isActive(link.path)
                  ? 'border-b-2 border-emerald-800 pb-1 font-bold text-emerald-950'
                  : 'text-gray-700'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Join ASTU Button */}
        <div className="hidden md:block">
          <Link
            to="/registration"
            className="rounded-full bg-emerald-900 px-7 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-lg"
          >
            Join ASTU
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-emerald-900 hover:bg-emerald-50 md:hidden"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className="flex flex-col gap-4 border-t border-gray-100 bg-white px-6 py-5 text-sm font-medium md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={
                isActive(link.path)
                  ? 'font-bold text-emerald-900'
                  : 'text-gray-700 hover:text-emerald-800'
              }
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/registration"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg bg-emerald-900 px-5 py-3 text-center font-bold text-white"
          >
            Join ASTU
          </Link>
        </nav>
      )}
    </header>
  );
}
