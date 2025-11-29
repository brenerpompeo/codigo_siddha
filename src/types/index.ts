export type PillarType =
  | 'Physical'
  | 'Mental'
  | 'Intellectual'
  | 'Spiritual'
  | 'Cultural'
  | 'Personal'
  | 'Professional';

export const PILLARS: PillarType[] = [
  'Physical', 'Mental', 'Intellectual', 'Spiritual', 'Cultural', 'Personal', 'Professional'
];

export type HumanDesignType =
  | 'Generator'
  | 'Manifesting Generator'
  | 'Projector'
  | 'Manifestor'
  | 'Reflector';

export type HumanDesignProfile =
  | '1/3' | '1/4' | '2/4' | '2/5' | '3/5' | '3/6' | '4/6' | '4/1' | '5/1' | '5/2' | '6/2' | '6/3';

export type HumanDesignAuthority =
  | 'Emotional'
  | 'Sacral'
  | 'Splenic'
  | 'Ego'
  | 'G-Center'
  | 'Mental'
  | 'Lunar';

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string; // ISO string
  humanDesign: {
    type: HumanDesignType;
    profile: HumanDesignProfile;
    authority: HumanDesignAuthority;
    strategy: string;
    signature: string;
    notSelfTheme: string;
  };
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  pillar: PillarType;
  status: 'todo' | 'in-progress' | 'done';
  sprintId: string;
  createdAt: string;
  completedAt?: string;
}

export interface Sprint {
  id: string;
  startDate: string;
  endDate: string;
  duration: 7 | 14 | 21 | 28;
  status: 'active' | 'completed';
  goals?: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface AppState {
  user: UserProfile | null;
  activeSprint: Sprint | null;
  tasks: Task[];
  badges: Badge[];
  // Actions
  setUser: (user: UserProfile) => void;
  startSprint: (duration: 7 | 14 | 21 | 28, goals: string[]) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  deleteTask: (taskId: string) => void;
  completeSprint: () => void;
  checkBadges: () => void;
}
