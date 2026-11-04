import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
  User,
  ChevronDown,
  FileText,
  CheckCircle2,
  Bell,
  LogOut,
  Activity,
  PlusCircle,
} from 'lucide-react';
import { getCurrentUser, logoutUser, type AuthUser } from '../../services/authService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync user state on route changes
  useEffect(() => {
    setUser(getCurrentUser());
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

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

  const profileImage = localStorage.getItem('findback-profile-image');
  const userInitial = (user?.fullName || 'U').trim().charAt(0).toUpperCase();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
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
              ASTU Lost &amp; Found
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

        {/* User Profile / Join ASTU Toggle */}
        <div className="hidden md:block">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex flex-col items-center justify-center rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-2.5 py-1 text-emerald-950 transition duration-200 hover:border-emerald-300 hover:bg-emerald-100/70"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white shadow-sm">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    userInitial
                  )}
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="max-w-[90px] truncate text-[11px] font-semibold leading-tight text-emerald-950">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 text-emerald-800 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150 z-50">
                  {/* User brief header */}
                  <div className="border-b border-gray-100 px-3.5 py-3">
                    <p className="truncate text-sm font-bold text-gray-900">{user.fullName}</p>
                    <p className="truncate text-xs font-medium text-emerald-700">
                      {user.studentId || user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    {/* Direct Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                    >
                      <User className="h-4 w-4 text-emerald-700" />
                      <span>My Profile</span>
                    </Link>

                    {/* My Activity Group */}
                    <div className="mt-2 border-t border-gray-100 pt-2">
                      <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-600" />
                        <span>My Activity</span>
                      </div>
                      <Link
                        to="/my-claims"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                        <span>My Claims</span>
                      </Link>
                      <Link
                        to="/my-reports"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-emerald-700" />
                        <span>My Reports</span>
                      </Link>
                    </div>

                    {/* Other Navs */}
                    <div className="mt-2 border-t border-gray-100 pt-2">
                      <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Other
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <Bell className="h-4 w-4 text-emerald-700" />
                        <span>Notifications</span>
                      </Link>
                      <Link
                        to="/report-item"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <PlusCircle className="h-4 w-4 text-emerald-700" />
                        <span>Report an Item</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="mt-2 border-t border-gray-100 pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/registration"
              className="rounded-full bg-emerald-900 px-7 py-3 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-emerald-950 hover:shadow-lg"
            >
              Join ASTU
            </Link>
          )}
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

      {/* Mobile Navigation Drawer & Backdrop Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 top-[80px] bg-black/35 backdrop-blur-[2px] transition-opacity duration-300 md:hidden z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Floating Dropdown Overlay Menu */}
          <nav className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-80px)] overflow-y-auto rounded-b-3xl border-b border-emerald-100/70 bg-white px-6 py-6 shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-emerald-50 font-bold text-emerald-950'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="mt-3 border-t border-gray-100 pt-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/70 p-2.5 border border-emerald-100">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white shadow-sm">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">{user.fullName}</p>
                      <p className="truncate text-xs font-medium text-emerald-700">{user.studentId || user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                  >
                    <User className="h-4 w-4 text-emerald-700" />
                    <span>My Profile</span>
                  </Link>

                  <div className="px-3.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-emerald-600" />
                    <span>My Activity</span>
                  </div>
                  <Link
                    to="/my-claims"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl pl-6 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>My Claims</span>
                  </Link>
                  <Link
                    to="/my-reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl pl-6 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-emerald-700" />
                    <span>My Reports</span>
                  </Link>

                  <div className="px-3.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Other
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                  >
                    <Bell className="h-4 w-4 text-emerald-700" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    to="/report-item"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-700" />
                    <span>Report an Item</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/registration"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-3 rounded-xl bg-emerald-900 px-5 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-emerald-950 transition-colors"
                >
                  Join ASTU
                </Link>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
      {/* Spacer to preserve document layout under fixed navbar */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}
