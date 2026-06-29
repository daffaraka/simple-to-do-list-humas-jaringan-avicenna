import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Card, ColumnId, Department } from '../types';

const STORAGE_KEY = 'kanban-board-data';

const SEED_DATA: Card[] = [
  {
    id: uuidv4(),
    title: 'Buat desain mockup halaman utama',
    description: 'Membuat wireframe dan mockup untuk halaman landing page baru',
    documentLink: 'https://figma.com/file/xyz',
    requestDate: '2026-06-25',
    pic: 'Sarah',
    columnId: 'new',
    department: 'humas',
    position: 0,
    labels: [{ id: 'l5', name: 'Design', color: '#ec4899' }],
    checklist: [
      { id: uuidv4(), text: 'Research referensi desain', completed: true },
      { id: uuidv4(), text: 'Wireframe low-fidelity', completed: false },
      { id: uuidv4(), text: 'Mockup high-fidelity', completed: false },
    ],
    dueDate: '2026-07-15',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Setup database PostgreSQL',
    description: 'Konfigurasi database dan buat skema awal untuk proyek',
    documentLink: '',
    requestDate: '2026-06-28',
    pic: 'Budi',
    columnId: 'new',
    department: 'jaringan',
    position: 1,
    labels: [{ id: 'l7', name: 'Backend', color: '#10b981' }],
    checklist: [],
    dueDate: '2026-07-10',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Implementasi autentikasi JWT',
    description: 'Setup login, register, dan middleware autentikasi',
    documentLink: 'https://github.com/project/issues/1',
    requestDate: '2026-06-20',
    pic: 'Andi',
    columnId: 'progress',
    department: 'jaringan',
    position: 0,
    labels: [
      { id: 'l2', name: 'Feature', color: '#6366f1' },
      { id: 'l7', name: 'Backend', color: '#10b981' },
    ],
    checklist: [
      { id: uuidv4(), text: 'Setup Passport.js', completed: true },
      { id: uuidv4(), text: 'Buat endpoint login', completed: true },
      { id: uuidv4(), text: 'Buat endpoint register', completed: false },
      { id: uuidv4(), text: 'Middleware JWT', completed: false },
    ],
    dueDate: '2026-07-05',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: 'Buat draft press release bulanan',
    description: 'Menulis draft untuk kegiatan bulanan divisi Humas',
    documentLink: 'https://docs.google.com/document/d/123',
    requestDate: '2026-06-26',
    pic: 'Rina',
    columnId: 'progress',
    department: 'humas',
    position: 1,
    labels: [{ id: 'l4', name: 'Documentation', color: '#06b6d4' }],
    checklist: [],
    dueDate: null,
    priority: 'low',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

function loadCards(): Card[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load cards from localStorage:', e);
  }
  return SEED_DATA;
}

export type ViewMode = 'kanban' | 'calendar';

interface KanbanContextType {
  cards: Card[];
  searchQuery: string;
  filterLabel: string | null;
  activeDepartment: Department;
  viewMode: ViewMode;
  addCard: (title: string, columnId: ColumnId, extraData?: Partial<Card>) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, toColumnId: ColumnId) => void;
  reorderCards: (activeId: string, overId: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterLabel: (labelId: string | null) => void;
  setActiveDepartment: (department: Department) => void;
  setViewMode: (mode: ViewMode) => void;
  getFilteredCards: (columnId: ColumnId) => Card[];
}

const KanbanContext = createContext<KanbanContextType | null>(null);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<Card[]>(loadCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<Department>('humas');
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    } catch (e) {
      console.error('Failed to save cards to localStorage:', e);
    }
  }, [cards]);

  const addCard = useCallback((title: string, columnId: ColumnId, extraData?: Partial<Card>) => {
    setCards((prev) => {
      const targetDepartment = extraData?.department || activeDepartment;
      const columnCards = prev.filter((c) => c.columnId === columnId && c.department === targetDepartment);
      const newCard: Card = {
        id: uuidv4(),
        title,
        description: '',
        documentLink: '',
        requestDate: null,
        pic: '',
        columnId,
        department: targetDepartment,
        position: columnCards.length,
        labels: [],
        checklist: [],
        dueDate: null,
        priority: 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...extraData,
      };
      return [...prev, newCard];
    });
  }, [activeDepartment]);

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const moveCard = useCallback((cardId: string, toColumnId: ColumnId) => {
    setCards((prev) => {
      const card = prev.find((c) => c.id === cardId);
      if (!card || card.columnId === toColumnId) return prev;

      const targetCards = prev.filter((c) => c.columnId === toColumnId && c.department === card.department);
      return prev.map((c) =>
        c.id === cardId
          ? { ...c, columnId: toColumnId, position: targetCards.length, updatedAt: new Date().toISOString() }
          : c
      );
    });
  }, []);

  const reorderCards = useCallback((activeId: string, overId: string) => {
    setCards((prev) => {
      const activeCard = prev.find((c) => c.id === activeId);
      const overCard = prev.find((c) => c.id === overId);
      if (!activeCard || !overCard) return prev;

      const columnId = overCard.columnId;
      const columnCards = prev
        .filter((c) => c.columnId === columnId && c.department === activeCard.department)
        .sort((a, b) => a.position - b.position);

      const activeIdx = columnCards.findIndex((c) => c.id === activeId);
      const overIdx = columnCards.findIndex((c) => c.id === overId);

      if (activeIdx === -1 || overIdx === -1) return prev;

      const reordered = [...columnCards];
      const [moved] = reordered.splice(activeIdx, 1);
      reordered.splice(overIdx, 0, moved);

      const updatedPositions = new Map<string, number>();
      reordered.forEach((card, idx) => {
        updatedPositions.set(card.id, idx);
      });

      return prev.map((card) => {
        if (updatedPositions.has(card.id)) {
          return { ...card, position: updatedPositions.get(card.id)! };
        }
        return card;
      });
    });
  }, []);

  const getFilteredCards = useCallback(
    (columnId: ColumnId): Card[] => {
      return cards
        .filter((card) => {
          if (card.columnId !== columnId) return false;
          if (card.department !== activeDepartment) return false;
          
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            if (
              !card.title.toLowerCase().includes(q) &&
              !card.description.toLowerCase().includes(q)
            ) {
              return false;
            }
          }
          if (filterLabel) {
            if (!card.labels.some((l) => l.id === filterLabel)) {
              return false;
            }
          }
          return true;
        })
        .sort((a, b) => a.position - b.position);
    },
    [cards, searchQuery, filterLabel, activeDepartment]
  );

  const value = useMemo(
    () => ({
      cards,
      searchQuery,
      filterLabel,
      activeDepartment,
      viewMode,
      addCard,
      updateCard,
      deleteCard,
      moveCard,
      reorderCards,
      setSearchQuery,
      setFilterLabel,
      setActiveDepartment,
      setViewMode,
      getFilteredCards,
    }),
    [cards, searchQuery, filterLabel, activeDepartment, viewMode, addCard, updateCard, deleteCard, moveCard, reorderCards, getFilteredCards]
  );

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
}

export function useKanban(): KanbanContextType {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
