import React from 'react';
import {
  LayoutDashboard,
  KeyRound,
  Atom,
  Flame,
  LineChart,
  ScrollText,
  FlaskConical,
  Sliders,
  Radio,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '../ui/Primitives';

interface SidebarProps {
  activeView?: string;
  activeTab?: string;
  onNavigate?: (view: string) => void;
  onTabChange?: (view: string) => void;
  isOpen?: boolean;
  onCloseMobile?: () => void;
  threatCount?: number;
  securityStatus?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: 'default' | 'danger' | 'cyan';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  activeTab,
  onNavigate,
  onTabChange,
  isOpen = true,
  onCloseMobile = () => {},
  threatCount = 14,
  securityStatus = 'SECURE'
}) => {
  const currentTab = activeView || activeTab || 'overview';
  const handleNavigate = onNavigate || onTabChange || (() => {});

  const intelligenceItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'verification', label: 'Verification', icon: KeyRound },
    { id: 'quantum-state', label: 'Simulator', icon: Atom },
    { id: 'attack-lab', label: 'Attack Lab', icon: Flame, badge: `${threatCount}`, badgeVariant: 'danger' }
  ];

  const managementItems: NavItem[] = [
    { id: 'security-analytics', label: 'Analytics', icon: LineChart },
    { id: 'audit-log', label: 'Audit Log', icon: ScrollText },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'settings', label: 'Settings', icon: Sliders }
  ];

  const handleItemClick = (id: string) => {
    handleNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          'w-60 bg-[#0B0F17] border-r border-slate-800/50 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out z-30',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Navigation list */}
        <div className="p-3 space-y-4 overflow-y-auto flex-1">
          {/* Intelligence Section */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              INTELLIGENCE
            </div>

            <div className="space-y-1 mt-1">
              {intelligenceItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer rounded-sm',
                      isActive
                        ? 'bg-[#0c1626] text-blue-400 border border-blue-600/40 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-400' : item.id === 'attack-lab' ? 'text-rose-500' : 'text-slate-400'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-rose-950/70 text-rose-400 border border-rose-800/50 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Management Section */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              MANAGEMENT
            </div>

            <div className="space-y-1 mt-1">
              {managementItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer rounded-sm',
                      isActive
                        ? 'bg-[#0c1626] text-blue-400 border border-blue-600/40 font-semibold shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          isActive ? 'text-blue-400' : 'text-slate-400'
                        )}
                      />
                      <span>{item.label}</span>
                    </div>

                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer Security Pulse */}
        <div className="p-3 border-t border-slate-800/50 bg-[#070B11]">
          <div className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-sm space-y-2">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              SECURITY PULSE
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[11px] text-slate-400">Signature Confidence</span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">99.4%</span>
            </div>
            <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[99.4%] shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

