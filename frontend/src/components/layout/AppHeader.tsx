"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  MenuOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import NotificationBell from "./NotificationBell";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/crisis", label: "Crises" },
  { href: "/donation", label: "Donations" },
  { href: "/volunteer", label: "Volunteers" },
];

export default function AppHeader() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 no-underline">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className={`font-bold text-xl hidden sm:block transition-colors ${scrolled ? "text-gray-900" : "text-white"}`}>
                DisasterMgmt
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all hover:bg-white/10 ${
                    scrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-3">
                  <NotificationBell />
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all ${
                        scrolled
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <DashboardOutlined /> Admin
                    </Link>
                  ) : (
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-all ${
                        scrolled
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <DashboardOutlined /> My Dashboard
                    </Link>
                  )}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${scrolled ? "bg-gray-100" : "bg-white/10"}`}>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <UserOutlined className="text-white text-xs" />
                    </div>
                    <span className={`text-sm font-medium ${scrolled ? "text-gray-700" : "text-white"}`}>
                      {user?.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-lg transition-all cursor-pointer border-0 ${
                      scrolled ? "text-gray-400 hover:text-red-500 hover:bg-red-50 bg-transparent" : "text-white/60 hover:text-white hover:bg-white/10 bg-transparent"
                    }`}
                  >
                    <LogoutOutlined />
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    href="/login"
                    className={`px-5 py-2 rounded-lg text-sm font-medium no-underline transition-all ${
                      scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/90 hover:text-white"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold no-underline bg-white text-blue-700 hover:bg-blue-50 transition-all shadow-lg shadow-white/25"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden p-2 rounded-lg border-0 cursor-pointer transition-colors bg-transparent ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {mobileOpen ? <CloseOutlined className="text-lg" /> : <MenuOutlined className="text-lg" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-2 p-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-3 text-lg font-medium text-gray-700 no-underline hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated ? (
                <div className="flex flex-col gap-3 w-full mt-4">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full text-center py-3 text-lg font-medium text-gray-600 no-underline border border-gray-200 rounded-xl">
                    Sign In
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full text-center py-3 text-lg font-semibold text-white no-underline bg-blue-600 rounded-xl">
                    Get Started
                  </Link>
                </div>
              ) : (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="mt-4 w-full py-3 text-lg font-medium text-red-500 bg-red-50 rounded-xl border-0 cursor-pointer">
                  Logout
                </button>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
