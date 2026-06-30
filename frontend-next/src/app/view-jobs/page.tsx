"use client";

import { useEffect, useState } from 'react';
import { useKanban } from '@/store/kanbanStore';
import { Calendar, CheckSquare, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function ViewJobsPage() {
  const { cards, fetchAllCards, isLoading } = useKanban();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPics, setExpandedPics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  const filteredCards = cards.filter(card => {
    const titleMatch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const picName = typeof card.pic === 'object' && card.pic !== null ? (card.pic as any).name : (typeof card.pic === 'string' ? card.pic : "");
    const picMatch = picName.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || picMatch;
  });

  // Group cards by PIC Name
  const groupedCards = filteredCards.reduce((acc, card) => {
    const picObj = typeof card.pic === 'object' && card.pic !== null ? (card.pic as any) : null;
    const picName = picObj ? picObj.name : (typeof card.pic === 'string' ? card.pic : 'Belum Ditugaskan');
    
    if (!acc[picName]) {
      acc[picName] = [];
    }
    acc[picName].push(card);
    return acc;
  }, {} as Record<string, typeof cards>);

  const toggleExpand = (picName: string) => {
    setExpandedPics(prev => ({
      ...prev,
      [picName]: !prev[picName]
    }));
  };

  // Professional muted colors for avatars
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-slate-800 text-slate-50',
      'bg-zinc-800 text-zinc-50',
      'bg-neutral-800 text-neutral-50',
      'bg-stone-800 text-stone-50',
      'bg-indigo-900 text-indigo-50'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const priorityColors = {
    low: 'bg-gray-500 text-white font-bold shadow-sm',
    medium: 'bg-indigo-600 text-white font-bold shadow-sm',
    high: 'bg-rose-600 text-white font-bold shadow-sm',
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Semua Pekerjaan (View Jobs)</h1>
          <p className="text-sm text-textSecondary mt-1">Pantau ringkasan dan detail pekerjaan berdasarkan PIC.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
          <input
            type="text"
            placeholder="Cari pekerjaan atau nama PIC..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-bgSecondary border border-gray-200 dark:border-borderBase rounded-xl pl-9 pr-4 py-2 text-sm text-textPrimary focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-textSecondary">Memuat pekerjaan...</div>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-bgSecondary/50 rounded-2xl border border-borderBase border-dashed">
          <div className="text-textSecondary mb-2">Belum ada pekerjaan yang ditemukan</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Object.entries(groupedCards).map(([picName, picCards]) => {
            const nameParts = picName.trim().split(/\s+/);
            const picInitials = nameParts.length >= 2 
              ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
              : picName.substring(0, 2).toUpperCase();
            
            // Calculate stats
            const totalJobs = picCards.length;
            const todoCount = picCards.filter(c => c.columnId === 'new').length;
            const progressCount = picCards.filter(c => c.columnId === 'progress').length;
            const doneCount = picCards.filter(c => c.columnId === 'done').length;

            const isExpanded = expandedPics[picName] || false;

            return (
              <div key={picName} className="bg-bgSecondary border border-borderBase p-5 rounded-3xl shadow-sm flex flex-col h-max transition-all duration-300 hover:shadow-md">
                {/* Person Header (Clickable to toggle) */}
                <div 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                  onClick={() => toggleExpand(picName)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 shrink-0 rounded-2xl ${getAvatarColor(picName)} flex items-center justify-center text-lg font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/10 transform group-hover:scale-105 transition-transform duration-300`}>
                      {picInitials}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-textPrimary group-hover:text-indigo-600 transition-colors">{picName}</h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-slate-800 text-white shadow-sm border border-slate-900">
                          Total: {totalJobs}
                        </span>
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-slate-500 text-white shadow-sm border border-slate-600">
                          To Do: {todoCount}
                        </span>
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-sm border border-indigo-700">
                          Progress: {progressCount}
                        </span>
                        <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-sm border border-emerald-700">
                          Done: {doneCount}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-bgGlass rounded-lg text-textSecondary group-hover:text-textPrimary transition-colors sm:self-center self-end">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Person's Tasks (Expanded View) */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-borderBase flex-1 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {picCards.map((card) => {
                      const checklist = card.checklist || [];
                      const completedChecklist = checklist.filter((item) => item.completed).length;
                      const pColor = priorityColors[card.priority as keyof typeof priorityColors] || priorityColors.low;
                      
                      // Status Label Colors
                      const statusColors: Record<string, string> = {
                        'new': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
                        'progress': 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
                        'done': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      };
                      const sColor = statusColors[card.columnId] || statusColors['new'];
                      const statusText = card.columnId === 'new' ? 'To Do' : (card.columnId === 'progress' ? 'Progress' : 'Done');

                      return (
                        <div key={card.id} className="bg-bgGlass border border-borderBase p-4 rounded-xl hover:border-indigo-500/30 transition-colors shadow-sm">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-textPrimary leading-snug line-clamp-2">
                              {card.title}
                            </h3>
                            <div className="flex gap-2 shrink-0">
                              <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm ${pColor}`}>
                                {card.priority}
                              </span>
                              <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${sColor}`}>
                                {statusText}
                              </span>
                            </div>
                          </div>

                          {/* Task Meta Info */}
                          <div className="flex flex-wrap items-center gap-4 mt-3">
                            {checklist.length > 0 && (
                              <div className="flex items-center gap-1.5 text-[11px] text-textSecondary bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md">
                                <CheckSquare size={12} />
                                <span>{completedChecklist}/{checklist.length}</span>
                              </div>
                            )}
                            {card.requestDate && (
                              <div className="flex items-center gap-1.5 text-[11px] text-textSecondary bg-indigo-500/5 px-2 py-1 rounded-md" title="Target Tanggal">
                                <Calendar size={12} className="text-indigo-500" />
                                <span>
                                  {new Date(card.requestDate).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              </div>
                            )}
                            {card.dueDate && (
                              <div className="flex items-center gap-1.5 text-[11px] text-textSecondary bg-emerald-500/5 px-2 py-1 rounded-md" title="Tanggal Selesai">
                                <Calendar size={12} className="text-emerald-500" />
                                <span>
                                  {new Date(card.dueDate).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
