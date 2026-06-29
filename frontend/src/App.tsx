import { useEffect, useState } from 'react';
import { useKanban } from './store/kanbanStore';
import { useAuthStore } from './store/authStore';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { Dashboard } from './components/Dashboard';
import { Login } from './pages/Login';
import { MasterData } from './pages/MasterData';
import './index.css';

function MainContent() {
  const { viewMode, fetchCards, isLoading, isDarkMode, activeBoardId, fetchDepartments } = useKanban();
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    const handleHash = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (activeBoardId) {
      fetchCards(activeBoardId);
    }
  }, [fetchCards, activeBoardId]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bgPrimary text-textPrimary font-sans transition-colors duration-300">
      <Header />
      {currentHash === '#master' ? (
        <MasterData />
      ) : isLoading && activeBoardId ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-textSecondary">Memuat tugas...</div>
        </div>
      ) : !activeBoardId ? (
        <Dashboard />
      ) : (
        viewMode === 'kanban' ? <KanbanBoard /> : <CalendarView />
      )}
    </div>
  );
}

function App() {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Login />;
  }

  return <MainContent />;
}

export default App;
