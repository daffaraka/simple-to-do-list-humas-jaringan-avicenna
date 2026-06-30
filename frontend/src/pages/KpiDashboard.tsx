import React, { useEffect } from 'react';
import { useKpiStore } from '../store/kpiStore';
import { useKanban } from '../store/kanbanStore';
import type { Board } from '../types';

export const KpiDashboard: React.FC = () => {
  const { kpis, fetchKpis, isLoading } = useKpiStore();
  const { fetchBoards } = useKanban();

  useEffect(() => {
    fetchKpis();
    fetchBoards();
  }, [fetchKpis, fetchBoards]);

  const calculateProgress = (boards: Board[] = []) => {
    if (boards.length === 0) return 0;
    
    let totalProgress = 0;
    boards.forEach(board => {
       const tasks = board.tasks || [];
       if (tasks.length === 0) return;
       const doneTasks = tasks.filter(t => t.columnId === 'done').length;
       totalProgress += (doneTasks / tasks.length) * 100;
    });
    
    return Math.round(totalProgress / boards.length);
  };

  if (isLoading) return <div className="p-6 text-center text-textSecondary">Memuat Dashboard KPI...</div>;

  return (
    <div className="flex-1 overflow-auto p-6 bg-bgPrimary">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary tracking-tight">Dashboard KPI</h1>
        <p className="text-textSecondary mt-2">Pantau capaian target dan progress modul</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {kpis.map(kpi => {
          const progress = calculateProgress(kpi.boards);
          return (
            <div key={kpi.id} className="bg-bgSecondary rounded-2xl p-6 border border-border/50 shadow-sm relative overflow-hidden group hover:border-brand-500/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-1">{kpi.department?.name}</div>
                  <h3 className="text-xl font-bold text-textPrimary leading-tight">{kpi.title}</h3>
                </div>
                
                {/* Radial Progress */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
                    <path className="text-border" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-brand-500" strokeDasharray={`${progress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-textPrimary">
                    {progress}%
                  </div>
                </div>
              </div>
              
              <p className="text-textSecondary text-sm line-clamp-2 mb-6">{kpi.description}</p>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-textPrimary">Progress Board (Modul)</h4>
                {kpi.boards?.map(board => {
                  const tasks = board.tasks || [];
                  const doneTasks = tasks.filter(t => t.columnId === 'done').length;
                  const boardProgress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;
                  return (
                    <div key={board.id} className="bg-bgPrimary/50 p-3 rounded-xl border border-border/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-textPrimary">{board.title}</span>
                        <span className="text-xs font-semibold text-brand-500">{boardProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full transition-all duration-500" style={{ width: `${boardProgress}%` }} />
                      </div>
                    </div>
                  );
                })}
                {(!kpi.boards || kpi.boards.length === 0) && (
                  <div className="text-xs text-textSecondary italic">Belum ada board yang terhubung.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
