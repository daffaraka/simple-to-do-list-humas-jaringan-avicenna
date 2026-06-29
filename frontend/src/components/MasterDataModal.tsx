import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Briefcase, Lock, Mail, Tag } from 'lucide-react';
import api from '../lib/api';
import { useKanban } from '../store/kanbanStore';

interface MasterDataModalProps {
  type: 'users' | 'departments' | 'roles';
  onClose: () => void;
  onSuccess: () => void;
}

export function MasterDataModal({ type, onClose, onSuccess }: MasterDataModalProps) {
  const { departments } = useKanban();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    if (type === 'users') {
      // Fetch roles for user creation
      api.get('/roles').then(res => {
        setRoles(res.data);
        if (res.data.length > 0) setRoleId(res.data[0].id);
      }).catch(console.error);

      if (departments.length > 0) setDepartmentId(departments[0].id);
    }
  }, [type, departments]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      if (type === 'users') {
        if (!email || !password || !departmentId || !roleId) return;
        await api.post('/users', { name, email, password, departmentId, roleId });
      } else {
        await api.post(`/${type}`, { name });
      }
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (type === 'users') return 'Tambah Pengguna';
    if (type === 'departments') return 'Tambah Departemen';
    return 'Tambah Jabatan (Role)';
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-bgSecondary w-full max-w-md max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-borderBase animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-borderBase bg-bgGlass shrink-0">
          <h2 className="text-lg font-semibold text-textPrimary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar">
          {/* Name Field (Common) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
              {type === 'users' ? <User size={14} className="text-indigo-400" /> : <Tag size={14} className="text-indigo-400" />}
              Nama {type === 'users' ? 'Lengkap' : ''} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Masukkan nama ${type.slice(0, -1)}`}
              className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-textSecondary"
            />
          </div>

          {/* User Specific Fields */}
          {type === 'users' && (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <Mail size={14} className="text-indigo-400" />
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-textSecondary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                  <Lock size={14} className="text-indigo-400" />
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder-textSecondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                    <Briefcase size={14} className="text-indigo-400" />
                    Departemen <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={departmentId}
                      onChange={(e) => setDepartmentId(e.target.value)}
                      className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      {departments.map(d => (
                        <option key={d.id} value={d.id} className="bg-bgSecondary text-textPrimary">{d.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-textSecondary flex items-center gap-2">
                    <User size={14} className="text-indigo-400" />
                    Role <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={roleId}
                      onChange={(e) => setRoleId(e.target.value)}
                      className="w-full bg-bgGlass border border-borderBase rounded-xl p-3 text-sm text-textPrimary focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none"
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id} className="bg-bgSecondary text-textPrimary">{r.name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-borderBase shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-textSecondary hover:text-textPrimary hover:bg-bgGlassHover rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
