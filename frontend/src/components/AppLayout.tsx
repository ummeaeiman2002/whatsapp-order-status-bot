'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/src/types';

const navItems: NavItem[] = [
  { label: 'Chat', href: '/chat', icon: '💬' },
  { label: 'Orders', href: '/orders', icon: '📦' },
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Notifications', href: '/notifications', icon: '🔔' },
];

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
        isActive
          ? 'bg-[#f0f2f5] text-[#075e54] font-semibold border-l-3 border-[#075e54]'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span className="text-lg">{item.icon}</span>
      <span>{item.label}</span>
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-[#efeae2]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <header className="bg-[#075e54] text-white px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white font-bold text-base shrink-0">
            O
          </div>
          <h1 className="text-base font-semibold truncate">Order Status Bot</h1>
        </header>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-400">
          SDD Agent System
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
