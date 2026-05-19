import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, InboxIcon, CalendarDaysIcon, UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

interface GlassSidebarProps {
  user?: {
    name: string;
    email: string;
  };
}

const GlassSidebar: React.FC<GlassSidebarProps> = ({ user }) => {
  const pathname = usePathname();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Tasks', href: '/tasks', icon: InboxIcon },
    { name: 'Calendar', href: '/calendar', icon: CalendarDaysIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <aside className="glass-card w-64 h-full backdrop-blur-md border border-white/18 rounded-2xl shadow-lg p-4 sticky top-4">
      {user && (
        <div className="mb-8 p-4 glass-card backdrop-blur-sm rounded-xl">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
        </div>
      )}

      <nav>
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white/30 text-white shadow-inner'
                      : 'hover:bg-white/20 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default GlassSidebar;