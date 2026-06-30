"use client";

import { useEffect, useState } from 'react';
import { useKanban } from '@/store/kanbanStore';
import { Calendar, CheckSquare, Search } from 'lucide-react';
import { PRIORITY_COLORS } from '@/components/KanbanCard';

export default function ViewJobsPage() {
  const { cards, fetchAllCards, isLoading } = useKanban();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllCards();
  }, [fetchAllCards]);

  const filteredCards = cards.filter(card => {
    const titleMatch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const picName = typeof card.pic === 'object' && card.pic !== null ? (card.pic as any).name : (typeof card.pic === 'string' ? card.pic : "");
    const picMatch = picName.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || picMatch;
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Semua Pekerjaan (View Jobs)</h1>
          <p className="text-sm text-textSecondary mt-1">Pantau seluruh pekerjaan dan PIC yang bertanggung jawab.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const checklist = card.checklist || [];
            const completedChecklist = checklist.filter((item) => item.completed).length;
            const picObj = typeof card.pic === 'object' && card.pic !== null ? (card.pic as any) : null;
            const picName = picObj ? picObj.name : (typeof card.pic === 'string' ? card.pic : 'Unknown');
            const picInitials = picName.charAt(0).toUpperCase();

            // Priority colors definition locally since it might not be exported from KanbanCard
            const priorityColors = {
              low: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300',
              medium: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300',
              high: 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300',
            };
            const pColor = priorityColors[card.priority] || priorityColors.low;

            return (
              <div key={card.id} className="bg-bgSecondary border border-borderBase p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h3 className="text-sm font-semibold text-textPrimary leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm shrink-0 ${pColor}`}>
                    {card.priority}
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  {/* PIC Info */}
                  <div className="flex items-center gap-3 bg-bgGlass p-2.5 rounded-xl border border-borderBase">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-500 dark:text-indigo-400">
                      {picInitials}
                    </div>
                    <div>
                      <div className="text-xs text-textSecondary font-medium uppercase tracking-wider mb-0.5">Assigned To</div>
                      <div className="text-sm font-semibold text-textPrimary">{picName}</div>
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {checklist.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                        <CheckSquare size={14} />
                        <span>{completedChecklist}/{checklist.length}</span>
                      </div>
                    )}
                    {card.requestDate && (
                      <div className="flex items-center gap-1 text-xs text-textSecondary" title="Target Tanggal">
                        <Calendar size={13} className="text-indigo-400" />
                        <span>
                          {new Date(card.requestDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    )}
                    {card.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-textSecondary" title="Tanggal Selesai">
                        <Calendar size={13} className="text-emerald-400" />
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
