"use client";

import Link from "next/link";
import {
  HeartOutlined,
  GithubOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function AppFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-white font-bold text-xl">DisasterMgmt</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Empowering communities through coordinated disaster response, volunteer management, and transparent fund tracking.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                <GithubOutlined />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                <MailOutlined />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="list-none p-0 m-0 space-y-3">
              {[
                { href: "/crisis", label: "Active Crises" },
                { href: "/donation", label: "Make a Donation" },
                { href: "/volunteer", label: "Volunteer Network" },
                { href: "/inventory", label: "Relief Inventory" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get Involved</h4>
            <ul className="list-none p-0 m-0 space-y-3">
              {[
                { href: "/register", label: "Register as Volunteer" },
                { href: "/donation", label: "Donate Funds" },
                { href: "/crisis", label: "Report a Crisis" },
                { href: "/admin", label: "Admin Portal" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors text-sm no-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="list-none p-0 m-0 space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <EnvironmentOutlined className="text-blue-400" /> Emergency Operations Center
              </li>
              <li className="flex items-center gap-2">
                <PhoneOutlined className="text-blue-400" /> +1 (555) 911-0000
              </li>
              <li className="flex items-center gap-2">
                <MailOutlined className="text-blue-400" /> help@disastermgmt.org
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm m-0">
            &copy; {new Date().getFullYear()} Disaster Management System. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm m-0 flex items-center gap-1">
            Built with <HeartOutlined className="text-red-400" /> for humanitarian aid
          </p>
        </div>
      </div>
    </footer>
  );
}
