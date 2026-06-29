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
            ...card.checklist,
            { id: uuidv4(), text: newChecklistText.trim(), completed: false },
          ],
        });
        setNewChecklistText('');
      }
    }
  };

  const toggleChecklist = (itemId: string) => {
    updateCard(card.id, {
      checklist: card.checklist.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ),
    });
  };

  const deleteChecklist = (itemId: string) => {
    updateCard(card.id, {
      checklist: card.checklist.filter((item) => item.id !== itemId),
    });
  };

  const toggleLabel = (labelId: string) => {
    const hasLabel = card.labels.some((l) => l.id === labelId);
    if (hasLabel) {
      updateCard(card.id, {
        labels: card.labels.filter((l) => l.id !== labelId),
      });
    } else {
      const labelData = AVAILABLE_LABELS.find((l) => l.id === labelId);
      if (labelData) {
        updateCard(card.id, {
          labels: [...card.labels, labelData],
        });
      }
    }
  };

  const progress = card.checklist.length > 0
    ? Math.round((card.checklist.filter((c) => c.completed).length / card.checklist.length) * 100)
    : 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-bgSecondary w-full max-w-3xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="flex-1 bg-transparent text-lg sm:text-xl font-semibold text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 rounded-md px-2 py-1 mr-4"
          />
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 flex flex-col md:flex-row gap-6 sm:gap-8">
          
          {/* Left Column - Main Info */}
          <div className="flex-1 space-y-5 sm:space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Deskripsi</h4>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Tambahkan deskripsi lebih detail..."
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-200 min-h-[100px] sm:min-h-[120px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">PIC (Penanggung Jawab)</h4>
                <input
                  type="text"
                  value={card.pic || ''}
                  onChange={(e) => updateCard(card.id, { pic: e.target.value })}
                  placeholder="Nama PIC"
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">Tanggal Permintaan</h4>
                <input
                  type="date"
                  value={card.requestDate || ''}
                  onChange={(e) => updateCard(card.id, { requestDate: e.target.value || null })}
                  style={{ colorScheme: 'dark' }}
                  className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
                />
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Tautan Dokumen</h4>
              <input
                type="url"
                value={card.documentLink || ''}
                onChange={(e) => updateCard(card.id, { documentLink: e.target.value })}
                placeholder="https://..."
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50"
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
                <CheckSquare size={18} className="text-gray-400" />
                <h4 className="text-sm font-medium text-gray-200">Checklist</h4>
              </div>
              
              {card.checklist.length > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{progress}% Selesai</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-3">
                {card.checklist.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-2 sm:gap-3 group">
                    <button
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-4 h-4 shrink-0 rounded flex items-center justify-center border transition-colors ${
                        item.completed ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-500 hover:border-indigo-400'
                      }`}
                    >
                      {item.completed && <CheckSquare size={12} className="opacity-0" style={{ display: 'none' }} />}
                      {/* Using HTML checkmark to avoid large icon padding */}
                      {item.completed && <span className="text-[10px]">✓</span>}
                    </button>
                    <span className={`flex-1 min-w-[200px] text-sm break-words ${item.completed ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteChecklist(item.id)}
                      className="text-gray-500 hover:text-red-400 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1"
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
                  className="flex-1 bg-black/20 border border-white/5 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
                />
                <button
                  onClick={handleAddChecklist}
                  disabled={!newChecklistText.trim()}
                  className="bg-white/5 hover:bg-white/10 disabled:opacity-50 text-gray-300 p-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full md:w-56 space-y-5 sm:space-y-6 pt-4 md:pt-0 border-t md:border-t-0 border-white/10 md:pl-2">
            
            {/* Status Column */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status Kolom</h4>
              <select
                value={card.columnId}
                onChange={(e) => moveCard(card.id, e.target.value as ColumnId)}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
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
                <Tag size={14} className="text-gray-400" />
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Label</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_LABELS.map((label) => {
                  const isActive = card.labels.some((l) => l.id === label.id);
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
                <Flag size={14} className="text-gray-400" />
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prioritas</h4>
              </div>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateCard(card.id, { priority: p })}
                    className={`flex-1 py-1.5 rounded-md text-xs font-medium uppercase tracking-wide transition-all ${
                      card.priority === p 
                        ? p === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                        : p === 'medium' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/50'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                        : 'bg-white/5 text-gray-500 border border-transparent hover:bg-white/10'
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
                <CalendarDays size={14} className="text-gray-400" />
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Batas Waktu</h4>
              </div>
              <input
                type="date"
                value={card.dueDate || ''}
                onChange={(e) => updateCard(card.id, { dueDate: e.target.value || null })}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            {/* Delete Button */}
            <div className="pt-4 border-t border-white/10">
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
