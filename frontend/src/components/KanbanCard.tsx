import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, Calendar, Edit2, Trash2 } from 'lucide-react';
import type { Card } from '../types';
import { useState } from 'react';
import { CardModal } from './CardModal';
import { useKanban } from '../store/kanbanStore';

interface KanbanCardProps {
  card: Card;
  isOverlay?: boolean;
}

const PRIORITY_COLORS = {
  low: 'bg-gray-500/20 text-gray-300',
  medium: 'bg-indigo-500/20 text-indigo-300',
  high: 'bg-red-500/20 text-red-300',
};

export function KanbanCard({ card, isOverlay }: KanbanCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { deleteCard } = useKanban();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'Card',
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const completedChecklist = card.checklist.filter((item) => item.completed).length;

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-32 bg-white/5 border border-white/10 border-dashed rounded-xl opacity-40"
      />
    );
  }

  const CardContent = (
    <div className={`group bg-bgSecondary border border-white/5 p-4 rounded-xl shadow-md hover:shadow-lg hover:border-white/20 transition-all relative ${isOverlay ? 'drag-overlay' : ''}`}>
      {/* Action Buttons (visible on hover) */}
      {!isOverlay && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-bgSecondary/90 backdrop-blur rounded-md p-1 shadow-sm border border-white/10 z-10">
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="p-1.5 text-gray-400 hover:text-indigo-400 hover:bg-white/10 rounded transition-colors"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Hapus tugas ini?')) {
                deleteCard(card.id);
              }
            }}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
            title="Hapus"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 pr-12">
          {card.labels.map((label) => (
            <span
              key={label.id}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${label.color}20`, color: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-200 mb-3 leading-snug line-clamp-2">
        {card.title}
      </h3>

      <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {card.checklist.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckSquare size={14} />
                <span>{completedChecklist}/{card.checklist.length}</span>
              </div>
            )}
            {card.requestDate && (
              <div className="flex items-center gap-1 text-xs text-gray-400" title="Tanggal Permintaan">
                <Calendar size={13} />
                <span>
                  {new Date(card.requestDate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            )}
          </div>
          
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${PRIORITY_COLORS[card.priority]}`}>
            {card.priority}
          </span>
        </div>

        {/* PIC Row */}
        {card.pic && (
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-indigo-300">
              {card.pic.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[120px]">{card.pic}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (isOverlay) {
    return CardContent;
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          // Prevent drag from triggering click if it moved
          if (e.defaultPrevented) return;
          setIsModalOpen(true);
        }}
        className="cursor-grab active:cursor-grabbing"
      >
        {CardContent}
      </div>

      {isModalOpen && (
        <CardModal card={card} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export function CardDragOverlay({ card }: { card: Card }) {
  return <KanbanCard card={card} isOverlay />;
}
