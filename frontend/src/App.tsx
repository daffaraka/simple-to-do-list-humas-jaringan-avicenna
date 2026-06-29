import { useEffect } from 'react';
import { useKanban } from './store/kanbanStore';
import { useAuthStore } from './store/authStore';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import { Login } from './pages/Login';
import './index.css';

function MainContent() {
  const { viewMode, fetchCards, isLoading, isDarkMode } = useKanban();

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

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
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-textSecondary">Memuat tugas...</div>
        </div>
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
