import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Briefcase, UserPlus } from 'lucide-react';
import { MasterDataModal } from '../components/MasterDataModal';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export function MasterData() {
  const [activeTab, setActiveTab] = useState<'users' | 'departments' | 'roles'>('users');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/${activeTab}`);
      setData(response.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus data');
    }
  };

  // Open modal function
  const handleAdd = () => {
    setIsModalOpen(true);
  };

  if (user?.role?.name?.toLowerCase() !== 'admin') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold text-red-500 mb-4">Akses Ditolak</h2>
        <p className="text-textSecondary mb-6">Anda tidak memiliki akses ke halaman ini.</p>
        <button onClick={() => window.location.hash = ''} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Kembali ke Dashboard</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-bgPrimary p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.location.hash = ''}
              className="p-2 hover:bg-bgGlass rounded-lg transition-colors text-textSecondary hover:text-textPrimary"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-textPrimary">Master Data</h1>
              <p className="text-textSecondary text-sm">Kelola pengguna, departemen, dan jabatan</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-b border-borderBase pb-4">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-textSecondary hover:bg-bgGlass'}`}
          >
            <Users size={16} /> Users
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'departments' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-textSecondary hover:bg-bgGlass'}`}
          >
            <Briefcase size={16} /> Departments
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'roles' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-textSecondary hover:bg-bgGlass'}`}
          >
            <Users size={16} /> Roles
          </button>
        </div>

        {loading ? (
          <div className="text-center text-textSecondary py-10">Memuat...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <div className="bg-bgSecondary rounded-2xl border border-borderBase overflow-hidden">
            <div className="p-4 border-b border-borderBase flex justify-end bg-bgGlass">
              <button onClick={handleAdd} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <UserPlus size={16} />
                Tambah {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </button>
            </div>
            <table className="w-full text-left text-sm text-textSecondary">
              <thead className="bg-bgGlass text-textPrimary">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  {activeTab === 'users' && <th className="px-6 py-4 font-medium">Email</th>}
                  {activeTab === 'users' && <th className="px-6 py-4 font-medium">Department</th>}
                  {activeTab === 'users' && <th className="px-6 py-4 font-medium">Role</th>}
                  <th className="px-6 py-4 font-medium">ID (Reference)</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderBase">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-bgGlass transition-colors">
                    <td className="px-6 py-4 text-textPrimary font-medium">{item.name}</td>
                    {activeTab === 'users' && <td className="px-6 py-4">{item.email}</td>}
                    {activeTab === 'users' && <td className="px-6 py-4">{item.department?.name}</td>}
                    {activeTab === 'users' && <td className="px-6 py-4">{item.role?.name}</td>}
                    <td className="px-6 py-4 font-mono text-xs opacity-50">{item.id}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && (
              <div className="text-center py-10 text-textSecondary">Tidak ada data.</div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <MasterDataModal
          type={activeTab}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
