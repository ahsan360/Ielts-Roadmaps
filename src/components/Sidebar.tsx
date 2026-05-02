"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarSections } from "@/lib/sidebar";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-brand-600 p-2 text-white shadow-lg md:hidden"
        aria-label="Open menu"
      >
        ☰
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-slate-50 shadow-lg transition-transform md:relative md:translate-x-0 md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <h2 className="text-lg font-semibold text-slate-900">IELTS Vocab</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-700 md:hidden"
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 space-y-6 p-4">
            {sidebarSections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.links.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-brand-600 text-white"
                              : "text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {link.emoji && <span aria-hidden>{link.emoji}</span>}
                          <span className="truncate">{link.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
        />
      )}
    </>
  );
}
