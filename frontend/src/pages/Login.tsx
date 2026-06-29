import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      setAuth(res.data.user, res.data.token);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal login, periksa koneksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgPrimary text-gray-200">
      <div className="bg-bgSecondary p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/5">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login Humas & Jaringan</h1>
        
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm text-center border border-red-500/30">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Email</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 border-white/10 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="user@kominfo.go.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 border-white/10 rounded-lg p-2.5 text-white focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
