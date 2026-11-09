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
  ArrowRight,
} from 'lucide-react';
import { getCurrentUser, logoutUser, getUserProfileImage, type AuthUser } from '../../services/authService';
import {
  getUnreadNotificationsCount,
  getNotifications,
  markAllNotificationsAsRead,
  type AppNotification,
} from '../../services/notificationService';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [profileImage, setProfileImage] = useState<string | null>(() => getUserProfileImage(getCurrentUser()));
  const [unreadCount, setUnreadCount] = useState(() => getCurrentUser() ? getUnreadNotificationsCount() : 0);
  const [recentNotifs, setRecentNotifs] = useState<AppNotification[]>(() =>
    getCurrentUser() ? getNotifications().slice(0, 5) : []
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Sync user state and profile image on route changes
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setProfileImage(getUserProfileImage(currentUser));
    setDropdownOpen(false);
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
    if (currentUser) {
      setUnreadCount(getUnreadNotificationsCount());
      setRecentNotifs(getNotifications().slice(0, 5));
    }
  }, [location.pathname]);

  // Listen for account-specific profile picture changes
  useEffect(() => {
    const handleProfileUpdate = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setProfileImage(getUserProfileImage(currentUser));
    };
    window.addEventListener('profile_image_updated', handleProfileUpdate);
    return () => window.removeEventListener('profile_image_updated', handleProfileUpdate);
  }, []);

  // Listen for notification updates
  useEffect(() => {
    const handler = () => {
      setUnreadCount(getUnreadNotificationsCount());
      setRecentNotifs(getNotifications().slice(0, 5));
    };
    window.addEventListener('notifications_updated', handler);
    return () => window.removeEventListener('notifications_updated', handler);
  }, []);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close notif dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setDropdownOpen(false);
    setNotifDropdownOpen(false);
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
        <div className="hidden md:flex md:items-center md:gap-2">
          {user ? (
            <>
              {/* Notification Bell */}
              <div className="relative" ref={notifDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setDropdownOpen(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition-colors hover:text-emerald-800"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 bell-hover" />
                  {unreadCount > 0 && (
                    <span
                      style={{ minWidth: '18px', height: '18px' }}
                      className="absolute -right-1.5 -top-1.5 flex items-center justify-center rounded-full bg-red-500 ring-2 ring-white px-1 text-[10px] font-bold leading-none text-white shadow"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-80 origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-emerald-700" />
                        <span className="text-sm font-bold text-gray-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            markAllNotificationsAsRead();
                            setUnreadCount(0);
                            setRecentNotifs(getNotifications().slice(0, 5));
                          }}
                          className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-900"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Notification items */}
                    <div className="max-h-72 overflow-y-auto py-1">
                      {recentNotifs.length === 0 ? (
                        <p className="py-6 text-center text-xs text-gray-400">No notifications yet</p>
                      ) : (
                        recentNotifs.map((notif) => (
                          <Link
                            key={notif.id}
                            to={notif.link}
                            onClick={() => setNotifDropdownOpen(false)}
                            className={`flex items-start gap-3 px-4 py-2.5 text-xs transition hover:bg-gray-50 ${
                              !notif.isRead ? 'bg-emerald-50/60' : ''
                            }`}
                          >
                            {!notif.isRead && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                            )}
                            {notif.isRead && (
                              <span className="mt-1.5 h-2 w-2 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className={`font-semibold ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                {notif.title}
                              </p>
                              <p className="mt-0.5 text-gray-500 line-clamp-2">{notif.message}</p>
                              <p className="mt-1 text-[10px] text-gray-400">
                                {notif.date} · {notif.time}
                              </p>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-4 py-2.5">
                      <Link
                        to="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        View all notifications <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar Button + Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center justify-center rounded-full p-0 transition-opacity hover:opacity-90 focus:outline-none"
                  aria-label="User profile menu"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white shadow-sm">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      userInitial
                    )}
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
            </>
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
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{user.fullName}</p>
                      <p className="truncate text-xs font-medium text-emerald-700">{user.studentId || user.email}</p>
                    </div>
                    {/* Mobile notification badge */}
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Link>
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
