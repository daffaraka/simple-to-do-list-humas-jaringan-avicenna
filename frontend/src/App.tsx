import { KanbanProvider, useKanban } from './store/kanbanStore';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { CalendarView } from './components/CalendarView';
import './index.css';

function MainContent() {
  const { viewMode } = useKanban();
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bgPrimary text-gray-200 font-sans">
      <Header />
      {viewMode === 'kanban' ? <KanbanBoard /> : <CalendarView />}
    </div>
  );
}

function App() {
  return (
    <KanbanProvider>
      <MainContent />
    </KanbanProvider>
  );
}

export default App;
