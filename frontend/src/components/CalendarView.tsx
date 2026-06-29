import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { useKanban } from '../store/kanbanStore';
import { CardModal } from './CardModal';
import type { Card } from '../types';

export function CalendarView() {
  const { cards, activeDepartment } = useKanban();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // Filter cards by active department and those that have a requestDate
  const departmentCards = useMemo(() => {
    return cards.filter(card => card.department === activeDepartment && card.requestDate);
  }, [cards, activeDepartment]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const days = [];
  let day = startDate;
  let formattedDate = "";

  // Render Days of Week Header
  const daysOfWeek = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const renderDaysHeader = () => {
    return (
      <div className="grid grid-cols-7 border-b border-white/5">
        {daysOfWeek.map((dayName, idx) => (
          <div key={idx} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {dayName}
          </div>
        ))}
      </div>
    );
  };

  // Build the grid cells
  const rows = [];
  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;
      
      // Find cards for this specific day
      const dayCards = departmentCards.filter(c => {
        if (!c.requestDate) return false;
        return isSameDay(parseISO(c.requestDate), cloneDay);
      });

      days.push(
        <div
          key={day.toISOString()}
          className={`min-h-[120px] border-r border-b border-white/5 p-2 flex flex-col transition-colors ${
            !isSameMonth(day, monthStart)
              ? "bg-white/[0.02] text-gray-600"
              : isSameDay(day, new Date())
              ? "bg-indigo-500/10 text-indigo-300"
              : "bg-transparent text-gray-300 hover:bg-white/[0.02]"
          }`}
        >
          <div className="flex justify-end mb-1">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
              isSameDay(day, new Date()) ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : ""
            }`}>
              {formattedDate}
            </span>
          </div>
          
          {/* Cards for the day */}
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
            {dayCards.map(card => {
              const isDone = card.columnId === 'done';
              const isInProgress = card.columnId === 'progress';
              
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={`text-xs px-2 py-1 rounded truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                    isDone 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : isInProgress
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                  title={card.title}
                >
                  {card.title}
                </div>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toISOString()}>
        {days}
      </div>
    );
    days.length = 0; // Clear days array for next row
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-bgPrimary p-6 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col h-full bg-bgSecondary/50 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
        
        {/* Calendar Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
          <h2 className="text-xl font-bold text-gray-100 capitalize">
            {format(currentDate, dateFormat, { locale: id })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg bg-black/40 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
            >
              Hari Ini
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg bg-black/40 text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {renderDaysHeader()}
          <div className="flex-1 flex flex-col">
            {rows}
          </div>
        </div>
      </div>

      {/* Render Card Modal if a card is clicked */}
      {selectedCard && (
        <CardModal 
          card={selectedCard} 
          onClose={() => setSelectedCard(null)} 
        />
      )}
    </div>
  );
}
