import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, GraduationCap } from 'lucide-react';
import { Avatar } from '../ui';
import NotificationBell from '../notifications/NotificationBell';
import { useAuth } from '../../contexts/AuthContext';

export default function Navbar({ onMenuClick, onSearchClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <nav
      className="sticky top-0 z-40 w-full glass-panel"
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">

        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-text-secondary hover:text-text-main transition-all duration-150 rounded-[12px] hover:bg-[#F5F0E8] hover:scale-105"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Search pill */}
          <button
            onClick={onSearchClick}
            className={[
              'hidden sm:flex items-center gap-2.5',
              'bg-white border border-[rgba(0,0,0,0.08)] rounded-full',
              'px-4 py-2.5 w-72',
              'text-[13px] text-[#9CA3AF] font-medium',
              'shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(0,0,0,0.02)]',
              'hover:border-[rgba(245,158,11,0.30)] hover:shadow-[0_0_0_3px_rgba(245,158,11,0.08),0_1px_3px_rgba(0,0,0,0.04)]',
              'transition-all duration-[200ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              'focus:outline-none',
            ].join(' ')}
            aria-label="Open search"
          >
            <Search size={14} className="text-[#C4C9D4] shrink-0" />
            <span className="flex-1 text-left">Search anything...</span>
            <kbd className="text-[10px] font-bold bg-[#F5F0E8] text-[#9CA3AF] px-[7px] py-0.5 rounded-[7px] border border-[rgba(0,0,0,0.06)] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile search icon */}
          <button
            className="sm:hidden p-2 text-text-secondary hover:text-text-main transition-all duration-150 rounded-[12px] hover:bg-[#F5F0E8]"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <NotificationBell />

          {/* Divider */}
          <div className="h-5 w-px bg-[rgba(0,0,0,0.07)] hidden sm:block mx-0.5" />

          {/* Avatar */}
          <button
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2 rounded-[14px] p-1 ring-2 ring-transparent hover:ring-[rgba(245,158,11,0.22)] transition-all duration-200 hover:bg-[rgba(245,158,11,0.04)] group"
            aria-label="User profile"
          >
            <Avatar
              src={user?.user_metadata?.avatar_url || ''}
              size="md"
              status="online"
              className="group-hover:scale-105 transition-transform duration-200"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}
