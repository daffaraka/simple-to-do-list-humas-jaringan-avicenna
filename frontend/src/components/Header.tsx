import { useState } from 'react';
import { Search, Tag, Users, Network, LayoutGrid, Calendar as CalendarIcon, LogOut, Sun, Moon, Layers, ArrowLeft } from 'lucide-react';
import { AVAILABLE_LABELS } from '../types';
import { useKanban } from '../store/kanbanStore';
import { useAuthStore } from '../store/authStore';

export function Header() {
  const { searchQuery, setSearchQuery, filterLabel, setFilterLabel, activeDepartment, setActiveDepartment, viewMode, setViewMode, isDarkMode, toggleDarkMode, activeBoardId, setActiveBoardId, boards } = useKanban();
  const activeBoard = boards.find(b => b.id === activeBoardId);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

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
              <div className="text-xs text-textSecondary capitalize">{user?.department}</div>
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
      <div className="px-6 py-3 bg-bgGlass border-t border-borderBase flex items-center justify-between transition-colors duration-300">
        {/* Department Switcher */}
        <div className="flex bg-bgGlass rounded-lg p-1 border border-borderBase">
          <button
            onClick={() => setActiveDepartment('all')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeDepartment === 'all' 
                ? 'bg-blue-500/20 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)] dark:text-blue-300' 
                : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover'
            }`}
          >
            <Layers size={16} />
            Semua
          </button>
          <button
            onClick={() => setActiveDepartment('humas')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeDepartment === 'humas' 
                ? 'bg-indigo-500/20 text-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.2)] dark:text-indigo-300' 
                : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover'
            }`}
          >
            <Users size={16} />
            Humas
          </button>
          <button
            onClick={() => setActiveDepartment('jaringan')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeDepartment === 'jaringan' 
                ? 'bg-purple-500/20 text-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.2)] dark:text-purple-300' 
                : 'text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover'
            }`}
          >
            <Network size={16} />
            Jaringan
          </button>
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
    </header>
  );
}
