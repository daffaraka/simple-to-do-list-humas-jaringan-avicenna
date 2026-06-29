import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { COLUMNS } from '../types';
import type { Card, ColumnId } from '../types';
import { useKanban } from '../store/kanbanStore';
import { KanbanColumn } from './KanbanColumn';
import { CardDragOverlay } from './KanbanCard';

export function KanbanBoard() {
  const { getFilteredCards, moveCard, reorderCards, activeDepartment } = useKanban();
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = active.data.current?.card as Card;
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isActiveCard && isOverColumn) {
      moveCard(activeId, overId as ColumnId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    // Same column reorder
    const activeCard = active.data.current?.card as Card;
    const overCard = over.data.current?.card as Card;

    if (activeCard && overCard && activeCard.columnId === overCard.columnId) {
      reorderCards(activeId, overId);
    } else if (activeCard && overCard && activeCard.columnId !== overCard.columnId) {
       // Moving to a new column is handled during dragOver, but if dropped directly on a card in another column
       moveCard(activeId, overCard.columnId);
    } else if (activeCard && !overCard) {
       // Dropped onto empty column
       moveCard(activeId, overId as ColumnId);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-bgPrimary via-bgSecondary to-indigo-500/10 dark:to-indigo-950/20 z-0 transition-colors duration-300"></div>
      
      <div className="relative z-10 flex gap-6 h-full items-start w-full">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={getFilteredCards(column.id)}
            />
          ))}
          
          {/* Add Column button could go here in future */}
          
          <DragOverlay>
            {activeCard ? <CardDragOverlay card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
