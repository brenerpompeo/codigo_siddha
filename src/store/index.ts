import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Task, Sprint, UserProfile, Badge, PILLARS } from '../types';
import { addDays, differenceInDays } from 'date-fns';
import { useToastStore } from '../components/ui/Toast';

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      activeSprint: null,
      tasks: [],
      badges: [],

      setUser: (user: UserProfile) => set({ user }),

      startSprint: (duration, goals) => {
        const now = new Date();
        const newSprint: Sprint = {
          id: crypto.randomUUID(),
          startDate: now.toISOString(),
          endDate: addDays(now, duration).toISOString(),
          duration,
          status: 'active',
          goals
        };
        set({ activeSprint: newSprint });
        useToastStore.getState().addToast(`Sprint initiated. Focus for ${duration} days.`, 'success');
      },

      addTask: (taskData) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: 'todo',
          ...taskData
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
        useToastStore.getState().addToast('Task added to the board.', 'info');
      },

      updateTaskStatus: (taskId, status) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString() : undefined }
              : t
          )
        }));

        if (status === 'done') {
            useToastStore.getState().addToast('Task Completed!', 'success');
            get().checkBadges();
        }
      },

      deleteTask: (taskId) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
      },

      completeSprint: () => {
        set((state) => {
            if (!state.activeSprint) return {};
            return {
                activeSprint: { ...state.activeSprint, status: 'completed' }
            };
        });
      },

      checkBadges: () => {
        const state = get();
        const { tasks, badges } = state;
        const completedTasks = tasks.filter(t => t.status === 'done');
        const newBadges: Badge[] = [];

        // 1. First Blood
        if (completedTasks.length >= 1 && !badges.find(b => b.id === 'first-blood')) {
            newBadges.push({
                id: 'first-blood',
                name: 'Initiate',
                description: 'Completed your first task.',
                icon: 'star',
                unlockedAt: new Date().toISOString()
            });
        }

        // 2. Sprint Master (5 tasks)
        if (completedTasks.length >= 5 && !badges.find(b => b.id === 'task-master-5')) {
             newBadges.push({
                id: 'task-master-5',
                name: 'Momentum',
                description: 'Completed 5 tasks.',
                icon: 'zap',
                unlockedAt: new Date().toISOString()
            });
        }

        // 3. Balanced Life (At least 1 task in every pillar)
        const pillarsCovered = PILLARS.filter(p => completedTasks.some(t => t.pillar === p));
        if (pillarsCovered.length === 7 && !badges.find(b => b.id === 'balanced-life')) {
            newBadges.push({
                id: 'balanced-life',
                name: 'Equilibrium',
                description: 'Completed a task in all 7 pillars.',
                icon: 'scales',
                unlockedAt: new Date().toISOString()
            });
        }

        if (newBadges.length > 0) {
            set({ badges: [...badges, ...newBadges] });
            newBadges.forEach(b => {
                useToastStore.getState().addToast(`Achievement Unlocked: ${b.name}`, 'achievement');
            });
        }
      }
    }),
    {
      name: 'personal-dashboard-storage',
    }
  )
);
