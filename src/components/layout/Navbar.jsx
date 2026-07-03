import React from 'react';
import { Search, Bell, Menu, GraduationCap } from 'lucide-react';
import { Avatar } from '../ui';

export default function Navbar({ onMenuClick, onSearchClick }) {
  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-border">
      <div className="px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between gap-4">

        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-secondary hover:text-text-main transition-colors rounded-xl hover:bg-secondary"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Search pill */}
          <button
            onClick={onSearchClick}
            className={[
              'hidden sm:flex items-center gap-2.5',
              'bg-white border border-[rgba(0,0,0,0.10)] rounded-full',
              'px-3.5 py-2 w-72',
              'text-[13px] text-text-secondary font-medium',
              'hover:border-primary/40 hover:shadow-focus-ring',
              'transition-all duration-200',
              'focus:outline-none',
            ].join(' ')}
            aria-label="Open search"
          >
            <Search size={15} className="text-text-secondary/70 shrink-0" />
            <span className="flex-1 text-left">Search anything...</span>
            <span className="text-[11px] font-semibold bg-secondary text-text-secondary/70 px-2 py-0.5 rounded-md border border-[rgba(0,0,0,0.06)]">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search icon */}
          <button
            className="sm:hidden p-2 text-text-secondary hover:text-text-main transition-colors rounded-xl hover:bg-secondary"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-text-secondary hover:text-text-main transition-colors rounded-xl hover:bg-secondary"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-primary rounded-full ring-2 ring-white" />
          </button>

          {/* Divider */}
          <div className="h-5 w-px bg-border hidden sm:block mx-1" />

          {/* Avatar */}
          <button
            className="flex items-center gap-2 rounded-xl p-0.5 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200"
            aria-label="User profile"
          >
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
              size="md"
              status="online"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
