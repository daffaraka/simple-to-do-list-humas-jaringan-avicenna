import { useState } from 'react';
import { Search, Tag, Users, Network, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import { AVAILABLE_LABELS } from '../types';
import { useKanban } from '../store/kanbanStore';

export function Header() {
  const { searchQuery, setSearchQuery, filterLabel, setFilterLabel, activeDepartment, setActiveDepartment, viewMode, setViewMode } = useKanban();

  return (
    <header className="bg-bgSecondary/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-20 flex flex-col">
      {/* Main Nav */}
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2 min-w-[200px]">
          Humas & Jaringan To Do
        </h1>

        {/* View Mode Switcher (Centered) */}
        <div className="hidden md:flex bg-black/40 p-1 rounded-lg border border-white/5 mx-auto">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'kanban' 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <LayoutGrid size={16} />
            To Do List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'calendar' 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <CalendarIcon size={16} />
            Kalender
          </button>
        </div>

        {/* Search (Right) */}
        <div className="flex items-center min-w-[200px] justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari tugas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Sub Nav */}
      <div className="px-6 py-3 bg-black/20 border-t border-white/5 flex items-center justify-between">
        {/* Department Switcher */}
        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setActiveDepartment('humas')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeDepartment === 'humas' 
                ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Users size={16} />
            Humas
          </button>
          <button
            onClick={() => setActiveDepartment('jaringan')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
              activeDepartment === 'jaringan' 
                ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <Network size={16} />
            Jaringan
          </button>
        </div>

        {/* Label Filter (Moved to Sub Nav for balance) */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-white/5 transition-all">
            <Tag size={16} className={filterLabel ? 'text-indigo-400' : ''} />
            <span className="hidden sm:inline">
              {filterLabel 
                ? AVAILABLE_LABELS.find(l => l.id === filterLabel)?.name || 'Filter'
                : 'Label'}
            </span>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 bg-bgSecondary border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-30">
            <div className="p-2 space-y-1">
              <button
                onClick={() => setFilterLabel(null)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filterLabel === null ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                Semua Label
              </button>
              {AVAILABLE_LABELS.map((label) => (
                <button
                  key={label.id}
                  onClick={() => setFilterLabel(label.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterLabel === label.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
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
      </div>
    </header>
  );
}
