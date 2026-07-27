import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { 
  BrainCircuit, Search, Sun, Moon, Bell, Menu, X, LogOut, 
  User as UserIcon, Settings, ShieldAlert, Check, Calendar, ChevronDown, Lock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Navbar: React.FC = () => {
  const { 
    user, logout, theme, toggleTheme, notifications, markNotificationsRead, setCommandPaletteOpen 
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const activeLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-sm font-semibold px-3 py-2 rounded-lg transition-all ${
      isActive 
        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 font-bold" 
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white"
    }`;
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "warning":
        return <Lock className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-150/80 dark:border-gray-900 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-black tracking-wider text-gray-900 dark:text-white uppercase">
            <span className="p-1.5 rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center">
              <BrainCircuit className="w-5 h-5" />
            </span>
            <span>ResumeScreening</span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {!user ? (
            <>
              <Link to="/" className={activeLinkClass("/")}>Home</Link>
              <Link to="/jobs" className={activeLinkClass("/jobs")}>Jobs Feed</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={activeLinkClass("/dashboard")}>Dashboard</Link>
              
              {user.role === "student" && (
                <>
                  <Link to="/jobs" className={activeLinkClass("/jobs")}>Browse Jobs</Link>
                  <Link to="/profile" className={activeLinkClass("/profile")}>My Profile</Link>
                  <Link to="/applications" className={activeLinkClass("/applications")}>Applications</Link>
                </>
              )}
              
              {user.role === "recruiter" && (
                <>
                  <Link to="/jobs" className={activeLinkClass("/jobs")}>Manage Jobs</Link>
                  <Link to="/applications" className={activeLinkClass("/applications")}>Applicants</Link>
                </>
              )}
              
              {user.role === "admin" && (
                <>
                  <Link to="/jobs" className={activeLinkClass("/jobs")}>Job Board</Link>
                  <Link to="/admin/users" className={activeLinkClass("/admin/users")}>User Management</Link>
                  <Link to="/admin/logs" className={activeLinkClass("/admin/logs")}>Activity Feed</Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* Global Toolbar and Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Shortcut Trigger */}
          <button 
            id="navbar-search-shortcut"
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 border border-gray-200/60 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 text-gray-400 dark:text-gray-500 px-3 py-1.5 rounded-xl transition-all"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-xs font-semibold">Search or Switch Role...</span>
            <span className="text-[10px] bg-white dark:bg-gray-950 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-800 leading-none">Ctrl+K</span>
          </button>

          {/* Theme Switcher */}
          <button
            id="navbar-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle theme mode"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Authenticated User Actions */}
          {user ? (
            <>
              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  id="navbar-notifications-bell"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    if (!notificationsOpen && unreadCount > 0) {
                      markNotificationsRead();
                    }
                  }}
                  className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span id="unread-notifications-badge" className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl glass-panel border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl overflow-hidden pointer-events-auto"
                    >
                      <div className="p-4 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications Center</span>
                        {unreadCount > 0 && (
                          <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-900">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-gray-400 text-xs">
                            No notifications to display.
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className={`p-4 flex gap-3 text-left transition-colors ${notif.read ? "bg-transparent" : "bg-gray-50/50 dark:bg-gray-900/20"}`}>
                              <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-900 shrink-0 h-fit">
                                {getNotifIcon(notif.type)}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{notif.title}</p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{notif.message}</p>
                                <span className="text-[9px] text-gray-400 font-mono mt-1 block">
                                  {new Date(notif.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-150/60 dark:border-gray-900 text-center">
                        <button
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                        >
                          Dismiss Dropdown
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  id="navbar-profile-trigger"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-800 object-cover bg-emerald-100/50"
                  />
                  <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel border border-gray-200/85 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-xl overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-900/30 border-b border-gray-100 dark:border-gray-900 text-left">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{user.email}</p>
                        <span className="inline-block mt-2 text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-350">
                          {user.role}
                        </span>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5 text-left">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>My Dashboard</span>
                        </Link>
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            navigate("/settings");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white transition-colors w-full"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Security Settings</span>
                        </button>
                        <hr className="my-1 border-gray-100 dark:border-gray-900" />
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                            navigate("/");
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-950 dark:hover:text-white px-3 py-2 rounded-lg">
                Log In
              </Link>
              <Link to="/register" className="text-sm font-semibold text-white brand-gradient hover:brand-gradient-hover px-4 py-2 rounded-xl shadow-md shadow-emerald-500/10">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Burger Trigger */}
          <button
            id="navbar-mobile-burger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 md:hidden transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-950 bg-white dark:bg-gray-950 overflow-hidden text-left"
          >
            <div className="px-4 py-3 flex flex-col gap-1.5">
              {!user ? (
                <>
                  <Link to="/" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-350">Home</Link>
                  <Link to="/jobs" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-350">Jobs Feed</Link>
                  <hr className="border-gray-100 dark:border-gray-950 my-1" />
                  <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-350">Log In</Link>
                  <Link to="/register" className="px-3 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white text-center mt-1">Register</Link>
                </>
              ) : (
                <>
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Navigation</div>
                  <Link to="/dashboard" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Dashboard</Link>
                  
                  {user.role === "student" && (
                    <>
                      <Link to="/jobs" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Browse Jobs</Link>
                      <Link to="/profile" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">My Profile</Link>
                      <Link to="/applications" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">My Applications</Link>
                    </>
                  )}
                  
                  {user.role === "recruiter" && (
                    <>
                      <Link to="/jobs" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Manage Jobs</Link>
                      <Link to="/applications" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Applicants</Link>
                    </>
                  )}
                  
                  {user.role === "admin" && (
                    <>
                      <Link to="/jobs" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Job Board</Link>
                      <Link to="/admin/users" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">User Management</Link>
                      <Link to="/admin/logs" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Activity logs</Link>
                    </>
                  )}
                  
                  <hr className="border-gray-150/60 dark:border-gray-900 my-2" />
                  <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account</div>
                  <Link to="/settings" className="px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-750 dark:text-gray-200">Security Settings</Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
