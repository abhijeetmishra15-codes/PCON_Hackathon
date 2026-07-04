import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Briefcase,
  Users,
  MessageSquare,
  Trophy,
  Settings,
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
    // Insert after Opportunities
    const oppIndex = defaultNavItems.findIndex(i => i.to === '/opportunities');
    if (oppIndex !== -1) {
      defaultNavItems.splice(oppIndex + 1, 0, { icon: Briefcase, label: 'My Opportunities', to: '/my-opportunities' });
    }
  }

  const defaultBottomItems = [
    { icon: Settings, label: 'Settings', to: '/settings' },
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
    'fixed inset-y-0 left-0 z-50 w-[240px] flex flex-col',
    'bg-[#FEFAF6] border-r border-border',
    'transition-transform duration-300 ease-out lg:translate-x-0',
    isOpen ? 'translate-x-0' : '-translate-x-full'
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-text-main/15 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Logo */}
        <div className="h-[60px] flex items-center px-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-btn-primary shrink-0">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-[17px] tracking-tight text-text-main">
              AlumniConnect
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5">
          {activeNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 group relative',
                isActive
                  ? [
                    'bg-primary/10 text-primary',
                    'before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2',
                    'before:w-[3px] before:h-5 before:rounded-r-full before:bg-primary',
                  ].join(' ')
                  : 'text-text-secondary hover:bg-secondary/80 hover:text-text-main'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={17}
                    className={cn(
                      'shrink-0 transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-text-secondary/70 group-hover:text-text-main'
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom: Settings & Logout */}
        <div className="px-3 pb-4 pt-2 border-t border-border space-y-0.5">
          {activeBottomItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-secondary/80 hover:text-text-main'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={17}
                    className={cn(
                      'shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-text-secondary/70 group-hover:text-text-main'
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150 group text-text-secondary hover:bg-red-50 hover:text-red-600 mt-1"
          >
            <LogOut size={17} className="shrink-0 transition-colors text-text-secondary/70 group-hover:text-red-500" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
