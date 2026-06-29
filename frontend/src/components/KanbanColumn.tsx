import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Column, Card } from '../types';
import { KanbanCard } from './KanbanCard';
import { CreateTaskModal } from './CreateTaskModal';

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
}

export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  const [isCreating, setIsCreating] = useState(false);
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <>
      <div className="flex flex-col bg-bgSecondary/50 border border-white/5 rounded-2xl overflow-hidden w-80 shrink-0 h-full max-h-full">
        {/* Column Header */}
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-gray-200">{column.title}</h2>
            <span className="bg-white/10 text-gray-400 text-xs px-2 py-0.5 rounded-full font-medium">
              {cards.length}
            </span>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Tambah tugas"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Cards Container */}
        <div
          ref={setNodeRef}
          className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[400px] md:min-h-[200px]"
        >
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <KanbanCard key={card.id} card={card} />
            ))}
          </SortableContext>
        </div>
      </div>
      
      {isCreating && (
        <CreateTaskModal 
          columnId={column.id} 
          onClose={() => setIsCreating(false)} 
        />
      )}
    </>
  );
}
