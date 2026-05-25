"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiFileText, FiGlobe, FiSearch, FiMessageCircle, FiHome, FiZap } from "react-icons/fi";

const navItems = [
  { href: "/", label: "Home", icon: FiHome },
  { href: "/summarize", label: "Summarizer", icon: FiFileText },
  { href: "/translate", label: "Translator", icon: FiGlobe },
  { href: "/extract", label: "Extractor", icon: FiSearch },
  { href: "/qa", label: "Doc Q&A", icon: FiMessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col z-50">
      <div className="p-6 border-b border-[var(--border-color)]">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#06b6d4] flex items-center justify-center">
            <FiFileText className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
              MiMo Smart Doc
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              AI Document Analyzer
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 no-underline ${
                isActive
                  ? "bg-gradient-to-r from-[#0ea5e9]/20 to-[#06b6d4]/10 text-[var(--accent-secondary)] border border-[var(--accent-primary)]/30"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              }`}
            >
              <item.icon className="text-lg" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FiZap className="text-[var(--accent-secondary)] text-sm" />
            <p className="text-xs text-[var(--text-secondary)]">Powered by</p>
          </div>
          <p className="text-sm font-semibold gradient-text">Xiaomi MiMo V2.5</p>
        </div>
      </div>
    </aside>
  );
}
