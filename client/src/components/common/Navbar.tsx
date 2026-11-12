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
  Check,
  Trash2,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react';
import { getCurrentUser, logoutUser, getUserProfileImage, type AuthUser } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import NotificationDropdown from './NotificationDropdown';
import {
  getUnreadNotificationsCount,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
  type AppNotification,
} from '../../services/notificationService';

export default function Navbar() {
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUser());
  const [profileImage, setProfileImage] = useState<string | null>(() => getUserProfileImage(getCurrentUser()));
  const [unreadCount, setUnreadCount] = useState(() => getCurrentUser() ? getUnreadNotificationsCount() : 0);
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    getCurrentUser() ? getNotifications() : []
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
    setMobileNotifOpen(false);
    if (currentUser) {
      setUnreadCount(getUnreadNotificationsCount());
      setNotifications(getNotifications());
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
      setNotifications(getNotifications());
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
    setMobileNotifOpen(false);
    navigate('/login');
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = markNotificationAsRead(id);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = markAllNotificationsAsRead();
    setNotifications(updated);
    setUnreadCount(0);
  };

  const handleDeleteNotif = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const updated = deleteNotification(id);
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.isRead).length);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = clearAllNotifications();
    setNotifications(updated);
    setUnreadCount(0);
  };

  const handleNotificationClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
    setNotifDropdownOpen(false);
    setMobileMenuOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
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
  const isAdmin = user?.role ? String(user.role).trim().toLowerCase() === 'admin' : false;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200/60 dark:border-[#2A2D35]/60 bg-white/80 dark:bg-[#181A20]/80 backdrop-blur-[14px] shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-md transition duration-300 hover:rotate-3 hover:scale-105">
            <Search className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-400">
              FindBack
            </h1>
            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
              className={`transition-colors hover:text-emerald-800 dark:hover:text-emerald-400 ${
                isActive(link.path)
                  ? 'border-b-2 border-emerald-800 dark:border-emerald-400 pb-1 font-bold text-emerald-950 dark:text-emerald-300'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* User Profile / Join ASTU Toggle + Theme Switcher */}
        <div className="hidden md:flex md:items-center md:gap-2">
          {/* Theme Toggle (Light / Dark Mode) */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            {isDark ? (
              <Sun size={19} className="text-amber-400 animate-in spin-in-90 duration-300" />
            ) : (
              <Moon size={19} className="text-slate-600 animate-in spin-in-90 duration-300" />
            )}
          </button>

          {user ? (
            <>
              {/* Notification Bell Dropdown */}
              <NotificationDropdown role="student" />

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
                  <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-gray-100 dark:border-[#2A2D35] bg-white dark:bg-[#181A20] p-2 shadow-xl ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-150 z-50 text-gray-900 dark:text-gray-100">
                    {/* User brief header */}
                    <div className="border-b border-gray-100 dark:border-[#2A2D35] px-3.5 py-3">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        {user.studentId || user.email}
                      </p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                          <ShieldCheck className="h-3 w-3" /> Administrator
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      {/* Direct Profile Link */}
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                      >
                        <User className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                        <span>My Profile</span>
                      </Link>

                      {/* My Activity Group */}
                      <div className="mt-2 border-t border-gray-100 dark:border-[#2A2D35] pt-2">
                        <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>My Activity</span>
                        </div>
                        <Link
                          to="/my-claims"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>My Claims</span>
                        </Link>
                        <Link
                          to="/my-reports"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>My Reports</span>
                        </Link>
                      </div>

                      {/* Other Navs */}
                      <div className="mt-2 border-t border-gray-100 dark:border-[#2A2D35] pt-2">
                        <div className="px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                          Other
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            setNotifDropdownOpen(true);
                          }}
                          className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bell className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                            <span>Notifications</span>
                          </div>
                          {unreadCount > 0 && (
                            <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                              {unreadCount}
                            </span>
                          )}
                        </button>
                        <Link
                          to="/report-item"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                          <span>Report an Item</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="mt-2 border-t border-gray-100 dark:border-[#2A2D35] pt-1">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
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

        {/* Mobile: Theme Toggle + Notification Bell + Hamburger – visible only on mobile */}
        <div className="flex items-center gap-1.5 md:hidden">
          {/* Theme Toggle Button for Mobile */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] active:scale-90 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            {isDark ? (
              <Sun size={19} className="text-amber-400" />
            ) : (
              <Moon size={19} className="text-slate-600" />
            )}
          </button>

          {user && (
            <NotificationDropdown role="student" />
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setNotifDropdownOpen(false);
            }}
            className="rounded-lg p-2 text-emerald-900 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-[#2A2D35]"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
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
          <nav className="absolute left-0 right-0 top-full z-50 max-h-[calc(100vh-80px)] overflow-y-auto rounded-b-3xl border-b border-emerald-100/70 dark:border-[#2A2D35] bg-white dark:bg-[#181A20] px-6 py-6 shadow-2xl transition-all duration-300 ease-out animate-in slide-in-from-top-4 fade-in md:hidden text-gray-900 dark:text-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-950 dark:text-emerald-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2D35] hover:text-emerald-900 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {user ? (
                <div className="mt-3 border-t border-gray-100 dark:border-[#2A2D35] pt-3 flex flex-col gap-2">
                  {/* User info card */}
                  <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 p-2.5 border border-emerald-100 dark:border-emerald-900/60">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-emerald-800 text-xs font-bold text-white shadow-sm">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        userInitial
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{user.fullName}</p>
                      <p className="truncate text-xs font-medium text-emerald-700 dark:text-emerald-400">{user.studentId || user.email}</p>
                      {isAdmin && (
                        <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-200/70 dark:bg-emerald-900/80 px-2 py-0.2 text-[9px] font-bold text-emerald-900 dark:text-emerald-200">
                          <ShieldCheck className="h-3 w-3" /> Administrator
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-950 dark:hover:text-emerald-400 transition-colors"
                  >
                    <User className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>My Profile</span>
                  </Link>

                  <div className="px-3.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>My Activity</span>
                  </div>
                  <Link
                    to="/my-claims"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl pl-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-950 dark:hover:text-emerald-400 transition-colors"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>My Claims</span>
                  </Link>
                  <Link
                    to="/my-reports"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl pl-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-950 dark:hover:text-emerald-400 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>My Reports</span>
                  </Link>

                  <div className="px-3.5 pt-2 text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    Other
                  </div>
                  <Link
                    to="/report-item"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-[#2A2D35] hover:text-emerald-950 dark:hover:text-emerald-400 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Report an Item</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
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
