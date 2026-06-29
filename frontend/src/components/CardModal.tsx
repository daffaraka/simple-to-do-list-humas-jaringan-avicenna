import { useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  X, Tag, Flag, CalendarDays, CheckSquare, Plus, Trash2
} from 'lucide-react';
import { COLUMNS, AVAILABLE_LABELS } from '../types';
import type { Card, ColumnId } from '../types';
import { useKanban } from '../store/kanbanStore';
import { v4 as uuidv4 } from 'uuid';

interface CardModalProps {
  card: Card;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  const { updateCard, deleteCard, moveCard } = useKanban();
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [newChecklistText, setNewChecklistText] = useState('');

  const checklist = card.checklist || [];
  const labels = card.labels || [];

  const handleSave = () => {
    updateCard(card.id, { title, description });
  };

  const handleAddChecklist = (e: KeyboardEvent | MouseEvent) => {
    if (
      (e.type === 'keydown' && (e as KeyboardEvent).key === 'Enter') ||
      e.type === 'click'
    ) {
      if (newChecklistText.trim()) {
        updateCard(card.id, {
          checklist: [
            ...checklist,
            { id: uuidv4(), text: newChecklistText.trim(), completed: false },
          ],
        });
        setNewChecklistText('');
      }
    }
  };

  const toggleChecklist = (itemId: string) => {
    updateCard(card.id, {
      checklist: checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const deleteChecklist = (itemId: string) => {
    updateCard(card.id, {
      checklist: checklist.filter((item) => item.id !== itemId),
    });
  };

  const toggleLabel = (labelId: string) => {
    const hasLabel = labels.some((l) => l.id === labelId);
    if (hasLabel) {
      updateCard(card.id, {
        labels: labels.filter((l) => l.id !== labelId),
      });
    } else {
      const labelData = AVAILABLE_LABELS.find((l) => l.id === labelId);
      if (labelData) {
        updateCard(card.id, {
          labels: [...labels, labelData],
        });
      }
    }
  };

  const progress = checklist.length > 0
    ? Math.round((checklist.filter((c) => c.completed).length / checklist.length) * 100)
    : 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-bgSecondary w-full max-w-3xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-borderBase animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-borderBase">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="flex-1 bg-transparent text-lg sm:text-xl font-semibold text-textPrimary focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded-md px-2 py-1 mr-4"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col md:flex-row gap-6 sm:gap-8">
          
          {/* Left Column - Main Info */}
          <div className="flex-1 space-y-5 sm:space-y-6">
            <div>
              <h4 className="text-sm font-medium text-textSecondary mb-2">Deskripsi</h4>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Tambahkan deskripsi lebih detail..."
                className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary min-h-[100px] sm:min-h-[120px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-textSecondary mb-2">PIC (Penanggung Jawab)</h4>
                <input
                  type="text"
                  value={typeof card.pic === 'object' && card.pic !== null ? (card.pic as any).name : (card.pic || '')}
                  onChange={(e) => updateCard(card.id, { pic: e.target.value })}
                  placeholder="Nama PIC"
                  className="w-full bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-textSecondary mb-2">Tanggal Permintaan</h4>
                <input
                  type="date"
                  value={card.requestDate || ''}
                  onChange={(e) => updateCard(card.id, { requestDate: e.target.value || null })}
                  className="w-full bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-textSecondary mb-2">Tautan Dokumen</h4>
              <input
                type="url"
                value={card.documentLink || ''}
                onChange={(e) => updateCard(card.id, { documentLink: e.target.value })}
                placeholder="https://..."
                className="w-full bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
              />
              {card.documentLink && (
                <a 
                  href={card.documentLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline"
                >
                  Buka Dokumen
                </a>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare size={18} className="text-textSecondary" />
                <h4 className="text-sm font-medium text-textPrimary">Checklist</h4>
              </div>
              
              {checklist.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-textSecondary mb-1">
                    <span>{progress}% Selesai</span>
                  </div>
                  <div className="h-1.5 bg-bgGlassHover rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {checklist.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-2 sm:gap-3 group">
                    <button
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
                        item.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-textSecondary hover:border-indigo-400'
                      }`}
                    >
                      {item.completed && <CheckSquare size={12} className="opacity-0" style={{ display: 'none' }} />}
                      {/* Using HTML checkmark to avoid large icon padding */}
                      {item.completed && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={`flex-1 min-w-[200px] text-sm break-words ${item.completed ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteChecklist(item.id)}
                      className="text-textSecondary hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-3">
                <input
                  type="text"
                  value={newChecklistText}
                  onChange={(e) => setNewChecklistText(e.target.value)}
                  onKeyDown={handleAddChecklist}
                  placeholder="Tambah item baru..."
                  className="flex-1 bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={handleAddChecklist}
                  disabled={!newChecklistText.trim()}
                  className="bg-bgGlass hover:bg-bgGlassHover disabled:opacity-50 text-textSecondary p-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full md:w-56 space-y-5 sm:space-y-6 pt-4 md:pt-0 border-t md:border-t-0 border-borderBase md:pl-2">
            
            {/* Status Column */}
            <div>
              <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-2">Status Kolom</h4>
              <select
                value={card.columnId}
                onChange={(e) => moveCard(card.id, e.target.value as ColumnId)}
                className="w-full bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50"
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id} className="bg-bgSecondary">
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Labels */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag size={14} className="text-textSecondary" />
                <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Label</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LABELS.map((label) => {
                  const isActive = labels.some((l) => l.id === label.id);
                  return (
                    <button
                      key={label.id}
                      onClick={() => toggleLabel(label.id)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium transition-all"
                      style={{
                        backgroundColor: isActive ? label.color : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#fff' : label.color,
                        border: `1px solid ${isActive ? 'transparent' : label.color + '40'}`,
                      }}
                    >
                      {label.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag size={14} className="text-textSecondary" />
                <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Prioritas</h4>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateCard(card.id, { priority: p })}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide transition-all ${
                      card.priority === p 
                        ? p === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/50 dark:text-red-300'
                        : p === 'medium' ? 'bg-indigo-500/20 text-indigo-500 border border-indigo-500/50 dark:text-indigo-300'
                        : 'bg-gray-500/20 text-gray-600 border border-gray-500/50 dark:text-gray-400'
                        : 'bg-bgGlass text-textSecondary border border-transparent hover:bg-bgGlassHover'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={14} className="text-textSecondary" />
                <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider">Batas Waktu</h4>
              </div>
              <input
                type="date"
                value={card.dueDate || ''}
                onChange={(e) => updateCard(card.id, { dueDate: e.target.value || null })}
                className="w-full bg-bgGlass border border-borderBase rounded-lg p-2 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 dark:[color-scheme:dark]"
              />
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-borderBase">
              <button
                onClick={() => {
                  if (confirm('Hapus tugas ini?')) {
                    deleteCard(card.id);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                <Trash2 size={16} />
                Hapus Tugas
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
