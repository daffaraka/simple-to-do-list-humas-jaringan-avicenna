import { useState } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, Type, FileText, User, Calendar, Briefcase } from 'lucide-react';
import type { ColumnId, Department } from '../types';
import { useKanban } from '../store/kanbanStore';

interface CreateTaskModalProps {
  columnId: ColumnId;
  onClose: () => void;
}

export function CreateTaskModal({ columnId, onClose }: CreateTaskModalProps) {
  const { addCard, activeDepartment } = useKanban();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pic, setPic] = useState('');
  const [requestDate, setRequestDate] = useState('');
  const [department, setDepartment] = useState<Department>(activeDepartment);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    addCard(title.trim(), columnId, {
      description,
      pic,
      requestDate: requestDate || null,
      department
    });
    
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-bgSecondary w-full max-w-lg max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/20 shrink-0">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Tugas Baru
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Type size={14} className="text-indigo-400" />
              Nama Tugas <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Perbaikan jaringan lantai 2"
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-gray-600"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" />
              Deskripsi Singkat
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan detail..."
              className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-100 min-h-[80px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none transition-all placeholder-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PIC */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <User size={14} className="text-indigo-400" />
                PIC
              </label>
              <input
                type="text"
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                placeholder="Nama PIC"
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-gray-600"
              />
            </div>

            {/* Request Date with native dark mode support via style */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" />
                Tanggal Permintaan
              </label>
              <input
                type="date"
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                style={{ colorScheme: 'dark' }}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-sm text-gray-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Department Selection */}
          <div className="space-y-2 pt-1 border-t border-white/5">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Briefcase size={14} className="text-indigo-400" />
              Tugas Milik Divisi
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="department" 
                  className="peer sr-only" 
                  checked={department === 'humas'}
                  onChange={() => setDepartment('humas')}
                />
                <div className="text-center px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-400 peer-checked:bg-indigo-600/20 peer-checked:border-indigo-500/50 peer-checked:text-indigo-300 transition-all">
                  Humas
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="department" 
                  className="peer sr-only" 
                  checked={department === 'jaringan'}
                  onChange={() => setDepartment('jaringan')}
                />
                <div className="text-center px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-gray-400 peer-checked:bg-indigo-600/20 peer-checked:border-indigo-500/50 peer-checked:text-indigo-300 transition-all">
                  Jaringan
                </div>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
            >
              Buat Tugas
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
