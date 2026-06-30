import { useState, useEffect } from 'react';
import { Search, Tag, Users, LayoutGrid, Calendar as CalendarIcon, LogOut, Sun, Moon, Layers, ArrowLeft, Target, Briefcase, Bell } from 'lucide-react';
import { AVAILABLE_LABELS } from '../types';
import { useKanban } from '../store/kanbanStore';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

export function Header() {
  const { searchQuery, setSearchQuery, filterLabel, setFilterLabel, activeDepartment, setActiveDepartment, viewMode, setViewMode, isDarkMode, toggleDarkMode, activeBoardId, setActiveBoardId, boards, departments } = useKanban();
  const activeBoard = boards.find(b => b.id === activeBoardId);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role?.name?.toLowerCase() === 'admin';
  const hash = useHash();
  const isMasterData = hash === '#master';
  
  const { notifications, unreadCount, fetchNotifications, markAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <header className="bg-bgSecondary/80 backdrop-blur-md border-b border-borderBase sticky top-0 z-20 flex flex-col transition-colors duration-300">
      {/* Main Nav */}
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo or Back Button */}
        <div className="flex items-center gap-4 min-w-[200px]">
          {activeBoardId ? (
            <button
              onClick={() => setActiveBoardId(null)}
              className="flex items-center gap-2 text-textSecondary hover:text-textPrimary bg-bgGlass hover:bg-bgGlassHover px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          ) : (
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              TimePro IT & Branding
            </h1>
          )}
          {activeBoard && (
            <div className="hidden sm:block border-l border-borderBase pl-4">
              <h2 className="text-sm font-bold text-textPrimary truncate max-w-[200px]">{activeBoard.title}</h2>
            </div>
          )}
        </div>

        {/* View Mode Switcher (Centered) - Only show if inside a board */}
        {activeBoardId && (
          <div className="hidden md:flex bg-black/40 p-1 rounded-lg border border-white/5 mx-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'kanban' 
                ? 'bg-slate-800 text-white shadow-md dark:bg-black' 
                : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlass'
            }`}
          >
            <LayoutGrid size={16} />
            To Do List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'calendar' 
                ? 'bg-slate-800 text-white shadow-md dark:bg-black' 
                : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlass'
            }`}
          >
            <CalendarIcon size={16} />
            Kalender
          </button>
        </div>
        )}

        {/* Main Tabs (Tasks / Master Data / KPI / Jobs) */}
        {!activeBoardId && (
          <div className="hidden md:flex ml-auto mr-4 gap-2">
            <button
              onClick={() => window.location.hash = '#kpi'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${hash === '#kpi' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-textSecondary border-transparent hover:bg-bgGlass'}`}
            >
              <Target size={16} />
              Dashboard KPI
            </button>
            <button
              onClick={() => window.location.hash = '#jobs'} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${hash === '#jobs' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-textSecondary border-transparent hover:bg-bgGlass'}`}
            >
              <Briefcase size={16} />
              Pekerjaan Saya
            </button>
            <button
              onClick={() => window.location.hash = ''} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${hash === '' ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-textSecondary border-transparent hover:bg-bgGlass'}`}
            >
              <LayoutGrid size={16} />
              Proyek
            </button>
            {isAdmin && (
              <button
                onClick={() => window.location.hash = '#master'} 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${isMasterData ? 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30' : 'text-textSecondary border-transparent hover:bg-bgGlass'}`}
              >
                <Users size={16} />
                Master Data
              </button>
            )}
          </div>
        )}

        {/* Search & Profile (Right) */}
        <div className="flex items-center min-w-[200px] justify-end gap-4 ml-auto">
          {activeBoardId && (
          <div className="relative w-full max-w-[200px] hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bgGlass border border-borderBase rounded-lg py-2 pl-10 pr-4 text-sm text-textPrimary placeholder-textSecondary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 relative text-textSecondary hover:text-textPrimary hover:bg-bgGlass rounded-lg transition-colors"
              title="Notifikasi"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-bgSecondary"></span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-bgSecondary border border-borderBase rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                <div className="p-3 border-b border-borderBase flex justify-between items-center bg-bgGlass">
                  <h3 className="font-semibold text-textPrimary text-sm">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAsRead('all')}
                      className="text-xs text-brand-500 hover:text-brand-400 transition-colors"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-textSecondary">Belum ada notifikasi</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border-b border-borderBase/50 hover:bg-bgGlass cursor-pointer transition-colors ${notif.read ? 'opacity-70' : 'bg-brand-500/5'}`}
                        onClick={() => {
                          if (!notif.read) markAsRead(notif.id);
                          if (notif.link) {
                             const [path, query] = notif.link.split('?');
                             window.location.hash = ''; // ensure it's not on another hash
                             // Assuming we need to set active board and potentially open modal. This requires some advanced routing.
                             // For simplicity we just open the board
                             const boardIdMatch = path.match(/\/board\/([a-zA-Z0-9-]+)/);
                             if (boardIdMatch) {
                               setActiveBoardId(boardIdMatch[1]);
                             }
                             setShowNotifications(false);
                          }
                        }}
                      >
                        <h4 className={`text-sm ${notif.read ? 'font-medium text-textSecondary' : 'font-semibold text-textPrimary'}`}>{notif.title}</h4>
                        <p className="text-xs text-textSecondary mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-2 text-textSecondary hover:text-textPrimary hover:bg-bgGlass rounded-lg transition-colors"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-borderBase">
            <div className="hidden lg:block text-right">
              <div className="text-sm font-medium text-textPrimary">{user?.name}</div>
              <div className="text-xs text-textSecondary capitalize">{departments.find(d => d.id === user?.departmentId)?.name || 'Unknown'}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-textSecondary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Sub Nav */}
      {!isMasterData && (
      <div className="px-6 py-3 bg-bgGlass border-t border-borderBase flex items-center justify-between transition-colors duration-300">
        {/* Department Switcher & Project Name */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="flex bg-bgGlass rounded-lg p-1 border border-borderBase overflow-x-auto max-w-full custom-scrollbar">
              <button
                onClick={() => setActiveDepartment('all')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeDepartment === 'all' 
                    ? 'bg-blue-500/20 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)] dark:text-blue-300' 
                    : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover'
                }`}
              >
                <Layers size={16} />
                Semua
              </button>
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setActiveDepartment(dept.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    activeDepartment === dept.id
                      ? 'bg-indigo-500/20 text-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.2)] dark:text-indigo-300' 
                      : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover'
                  }`}
                >
                  <Users size={16} />
                  {dept.name}
                </button>
              ))}
            </div>
          )}

          {!isAdmin && activeBoardId && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-bgGlass border border-borderBase rounded-lg">
              <Layers size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-textPrimary">{activeBoard?.title}</span>
            </div>
          )}
        </div>

        {/* Label Filter (Moved to Sub Nav for balance) - Only show if in board */}
        {activeBoardId ? (
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 bg-bgGlass border border-borderBase rounded-lg text-sm text-textSecondary hover:bg-bgGlassHover hover:text-textPrimary transition-all">
              <Tag size={16} className={filterLabel ? 'text-indigo-500 dark:text-indigo-400' : ''} />
              <span className="hidden sm:inline">
                {filterLabel 
                  ? AVAILABLE_LABELS.find(l => l.id === filterLabel)?.name || 'Filter'
                  : 'Label'}
              </span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-bgSecondary border border-borderBase rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-30">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setFilterLabel(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterLabel === null ? 'bg-bgGlass text-textPrimary' : 'text-textSecondary hover:bg-bgGlassHover hover:text-textPrimary'
                  }`}
                >
                  Semua Label
                </button>
                {AVAILABLE_LABELS.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => setFilterLabel(label.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      filterLabel === label.id ? 'bg-bgGlass text-textPrimary' : 'text-textSecondary hover:bg-bgGlassHover hover:text-textPrimary'
                    }`}
                  >
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div /> /* Empty div to keep flex alignment */
        )}
      </div>
      )}
    </header>
  );
}
