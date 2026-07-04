import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import CommandPalette from '../components/layout/CommandPalette';

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-radial-accent" style={{ background: 'linear-gradient(160deg, #FAFAF8 0%, #F8F6F2 45%, #FAFAF8 100%)' }}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-[244px] transition-all duration-300">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          onSearchClick={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-5 sm:p-8 lg:p-10 overflow-x-hidden">
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
