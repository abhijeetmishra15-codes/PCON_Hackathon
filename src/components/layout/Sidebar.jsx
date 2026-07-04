import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Users,
  MessageSquare,
  Trophy,
  User,
  GraduationCap,
  ShieldCheck,
  LogOut,
  Building2,
  Calendar,
  MessageCircle,
  Map,
  Mic
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose, customNavItems, customBottomItems }) {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const defaultNavItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Search, label: 'Discover', to: '/discover' },
    { icon: Building2, label: 'Opportunities', to: '/opportunities' },
    { icon: Briefcase, label: 'Referrals', to: '/referrals' },
    { icon: Users, label: 'Network', to: '/network' },
    { icon: MessageCircle, label: 'Messages', to: '/chat' },
    { icon: Map, label: 'Career Roadmap', to: '/roadmap' },
    { icon: Mic, label: 'Interview Prep', to: '/interview' },
    { icon: Trophy, label: 'Leaderboard', to: '/leaderboard' },
    { icon: Calendar, label: 'Events', to: '/events' },
    { icon: Calendar, label: 'My Events', to: '/my-events' },
  ];

  // Add "My Opportunities" dynamically if user is an alumni
  const role = user?.user_metadata?.role;
  if (role === 'alumni') {
    const oppIndex = defaultNavItems.findIndex(i => i.to === '/opportunities');
    if (oppIndex !== -1) {
      defaultNavItems.splice(oppIndex + 1, 0, { icon: Briefcase, label: 'My Opportunities', to: '/my-opportunities' });
    }
  }

  const defaultBottomItems = [
    { icon: User, label: 'My profile', to: '/settings' },
  ];

  if (isAdmin) {
    defaultBottomItems.unshift({ icon: ShieldCheck, label: 'Admin Dashboard', to: '/admin' });
  }

  const activeNavItems = customNavItems || defaultNavItems;
  const activeBottomItems = customBottomItems || defaultBottomItems;

  const handleNavClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebarClasses = cn(
    'fixed inset-y-0 left-0 z-50 w-[244px] flex flex-col',
    'bg-white border-r border-[rgba(0,0,0,0.055)]',
    'shadow-[2px_0_32px_rgba(0,0,0,0.035)]',
    'transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] lg:translate-x-0',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-text-main/12 backdrop-blur-[6px] z-40 lg:hidden"
          style={{ transition: 'opacity 0.25s ease' }}
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="h-[64px] flex items-center px-5 border-b border-[rgba(0,0,0,0.04)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-[12px] bg-gradient-to-br from-[#FBBF24] to-[#FB923C] flex items-center justify-center shrink-0"
              style={{ boxShadow: '0 2px 10px rgba(245,158,11,0.38), 0 1px 3px rgba(0,0,0,0.10)' }}>
              <GraduationCap size={17} className="text-white" />
            </div>
            <span className="font-bold text-[16px] tracking-[-0.025em] text-text-main">
              AlumniConnect
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-[2px]">
          {activeNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-[9px] rounded-[13px] text-[13px] font-medium',
                'transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] group relative',
                isActive
                  ? [
                    'bg-gradient-to-r from-primary/[0.10] to-primary/[0.05] text-primary',
                    'shadow-[inset_0_1px_0_rgba(245,158,11,0.10)]',
                    'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
                    'before:w-[3px] before:h-[17px] before:rounded-r-full before:bg-primary',
                    'before:shadow-[0_0_8px_rgba(245,158,11,0.30)]',
                  ].join(' ')
                  : 'text-[#5A6474] hover:bg-[#F5F0E8]/80 hover:text-[#111827]'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    className={cn(
                      'shrink-0 transition-all duration-[180ms]',
                      isActive
                        ? 'text-primary scale-[1.05]'
                        : 'text-[#8B95A5] group-hover:text-[#111827] group-hover:scale-[1.10]'
                    )}
                  />
                  <span className={cn(
                    'truncate transition-colors duration-150',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="px-2.5 pb-5 pt-3 space-y-[2px]"
          style={{ borderTop: '1px solid rgba(0,0,0,0.045)' }}>
          {activeBottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-[9px] rounded-[13px] text-[13px] font-medium',
                'transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] group',
                isActive
                  ? 'bg-gradient-to-r from-primary/[0.10] to-primary/[0.05] text-primary font-semibold'
                  : 'text-[#5A6474] hover:bg-[#F5F0E8]/80 hover:text-[#111827]'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={16}
                    className={cn(
                      'shrink-0 transition-all duration-[180ms]',
                      isActive
                        ? 'text-primary scale-[1.05]'
                        : 'text-[#8B95A5] group-hover:text-[#111827] group-hover:scale-[1.10]'
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className={[
              'w-full flex items-center gap-3 px-3 py-[9px] rounded-[13px] text-[13px] font-medium mt-1',
              'text-[#5A6474] group',
              'transition-all duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:bg-red-50/90 hover:text-red-600',
            ].join(' ')}
          >
            <LogOut
              size={16}
              className="shrink-0 text-[#8B95A5] group-hover:text-red-500 transition-all duration-[180ms] group-hover:scale-[1.10]"
            />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
