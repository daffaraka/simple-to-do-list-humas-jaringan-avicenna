"use client";
import { useEffect, use } from 'react';
import { KanbanBoard } from '@/components/KanbanBoard';
import { useKanban } from '@/store/kanbanStore';

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchCards, isLoading, setActiveBoardId, activeBoardId } = useKanban();

  useEffect(() => {
    if (id) {
      setActiveBoardId(id);
      fetchCards(id);
    }
    
    return () => {
      setActiveBoardId(null);
    };
  }, [id, setActiveBoardId, fetchCards]);

  if (isLoading || activeBoardId !== id) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-textSecondary">Memuat tugas...</div>
      </div>
    );
  }

  return <KanbanBoard />;
}
