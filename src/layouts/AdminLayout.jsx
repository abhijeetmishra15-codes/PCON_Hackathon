import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CommandPalette from '../components/layout/CommandPalette';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  FileText,
  Briefcase,
  Calendar,
  Megaphone,
  BarChart,
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const adminNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
    { icon: UserCheck, label: 'User Verification', to: '/admin/users/verification' },
    { icon: Users, label: 'User Management', to: '/admin/users/management' },
    { icon: Briefcase, label: 'Opportunities', to: '/admin/opportunities' },
    { icon: Calendar, label: 'Events', to: '/admin/events' },
    { icon: FileText, label: 'Reports', to: '/admin/reports' },
    { icon: Megaphone, label: 'Broadcast', to: '/admin/broadcast' },
    { icon: BarChart, label: 'Analytics', to: '/admin/analytics' },
  ];

  const adminBottomItems = [
    { icon: ArrowLeft, label: 'Exit Admin', to: '/dashboard' },
    { icon: Settings, label: 'Settings', to: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        customNavItems={adminNavItems}
        customBottomItems={adminBottomItems}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[240px] transition-all duration-300">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </div>
  );
}
