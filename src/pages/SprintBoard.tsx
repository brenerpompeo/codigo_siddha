import React, { useState } from 'react';
import { useAppStore } from '../store';
import { PILLARS, Task, PillarType } from '../types';
import { Plus, X, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const SprintBoard: React.FC = () => {
  const { activeSprint, tasks, startSprint, addTask, updateTaskStatus, deleteTask } = useAppStore();
  const navigate = useNavigate();

  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPillar, setNewTaskPillar] = useState<PillarType>('Personal');

  const [showStartSprintModal, setShowStartSprintModal] = useState(false);
  const [sprintDuration, setSprintDuration] = useState<7|14|21|28>(7);

  if (!activeSprint) {
    return (
        <div className="min-h-screen bg-cosmic-dark text-cosmic-text p-8 flex flex-col items-center justify-center">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="w-20 h-20 bg-cosmic-card rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                    <Calendar className="w-10 h-10 text-cosmic-primary" />
                </div>
                <h1 className="text-3xl font-bold">No Active Sprint</h1>
                <p className="text-white/60">Align your energy with a new cycle. Choose your duration based on your current capacity.</p>

                <div className="grid grid-cols-2 gap-4">
                    {[7, 14, 21, 28].map((d) => (
                        <button
                            key={d}
                            onClick={() => { setSprintDuration(d as any); setShowStartSprintModal(true); }}
                            className="bg-cosmic-card p-4 rounded-xl border border-white/10 hover:border-cosmic-primary hover:bg-white/5 transition-all"
                        >
                            <div className="text-2xl font-bold">{d}</div>
                            <div className="text-xs uppercase tracking-widest text-white/50">Days</div>
                        </button>
                    ))}
                </div>

                <button onClick={() => navigate('/dashboard')} className="text-white/40 hover:text-white mt-8 text-sm">Back to Dashboard</button>
            </div>

            {/* Confirm Start Modal */}
            {showStartSprintModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-cosmic-card p-8 rounded-2xl w-full max-w-sm border border-white/10">
                        <h3 className="text-xl font-bold mb-4">Start {sprintDuration}-Day Sprint?</h3>
                        <p className="text-white/60 mb-6">This will define your cycle until {new Date(Date.now() + sprintDuration * 86400000).toLocaleDateString()}.</p>
                        <div className="flex gap-4">
                            <button onClick={() => setShowStartSprintModal(false)} className="flex-1 py-3 rounded-lg bg-white/5">Cancel</button>
                            <button
                                onClick={() => {
                                    startSprint(sprintDuration, []);
                                    setShowStartSprintModal(false);
                                }}
                                className="flex-1 py-3 rounded-lg bg-cosmic-primary font-bold text-white shadow-lg shadow-cosmic-primary/30"
                            >
                                Ignite
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
  }

  const sprintTasks = tasks.filter(t => t.sprintId === activeSprint.id);
  const todoTasks = sprintTasks.filter(t => t.status === 'todo');
  const inProgressTasks = sprintTasks.filter(t => t.status === 'in-progress');
  const doneTasks = sprintTasks.filter(t => t.status === 'done');

  const handleCreateTask = () => {
    if (!newTaskTitle) return;
    addTask({
        title: newTaskTitle,
        pillar: newTaskPillar,
        sprintId: activeSprint.id
    });
    setNewTaskTitle('');
    setShowNewTaskModal(false);
  };

  return (
    <div className="min-h-screen bg-cosmic-dark text-cosmic-text flex flex-col">
        {/* Header */}
        <header className="p-6 border-b border-white/10 flex justify-between items-center bg-cosmic-dark/50 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        Sprint Board
                        <span className="text-xs bg-cosmic-primary/20 text-cosmic-primary px-2 py-1 rounded-full border border-cosmic-primary/20">
                            Day {Math.ceil((new Date().getTime() - new Date(activeSprint.startDate).getTime()) / (1000 * 3600 * 24))} / {activeSprint.duration}
                        </span>
                    </h1>
                </div>
            </div>
            <button
                onClick={() => setShowNewTaskModal(true)}
                className="flex items-center gap-2 bg-cosmic-primary px-4 py-2 rounded-lg font-medium hover:bg-cosmic-secondary transition-colors"
            >
                <Plus size={18} />
                <span className="hidden md:inline">New Task</span>
            </button>
        </header>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-6">
            <div className="flex gap-6 min-w-[1000px] h-full">
                <Column title="Backlog / To Do" tasks={todoTasks} status="todo" onDrop={updateTaskStatus} onDelete={deleteTask} />
                <Column title="In Motion" tasks={inProgressTasks} status="in-progress" onDrop={updateTaskStatus} onDelete={deleteTask} />
                <Column title="Manifested" tasks={doneTasks} status="done" onDrop={updateTaskStatus} onDelete={deleteTask} />
            </div>
        </div>

        {/* New Task Modal */}
        {showNewTaskModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                <div className="bg-cosmic-card p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">New Task</h3>
                        <button onClick={() => setShowNewTaskModal(false)}><X size={20} /></button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Title</label>
                            <input
                                autoFocus
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                className="w-full bg-cosmic-dark border border-white/10 rounded-lg p-3 focus:border-cosmic-primary outline-none"
                                placeholder="What needs to be done?"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Pillar</label>
                            <div className="flex flex-wrap gap-2">
                                {PILLARS.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setNewTaskPillar(p)}
                                        className={clsx(
                                            "px-3 py-1 rounded-full text-xs border transition-colors",
                                            newTaskPillar === p
                                                ? "bg-cosmic-accent text-white border-cosmic-accent"
                                                : "bg-transparent border-white/20 text-white/60 hover:border-white/40"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleCreateTask}
                            disabled={!newTaskTitle}
                            className="w-full py-3 bg-cosmic-primary rounded-lg font-bold mt-4 hover:bg-cosmic-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add to Board
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

// Kanban Column
const Column = ({ title, tasks, status, onDrop, onDelete }: {
    title: string,
    tasks: Task[],
    status: Task['status'],
    onDrop: (id: string, s: Task['status']) => void,
    onDelete: (id: string) => void
}) => {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        const taskId = e.dataTransfer.getData('taskId');
        if (taskId) onDrop(taskId, status);
    };

    return (
        <div
            className="flex-1 bg-white/5 rounded-xl flex flex-col max-h-full border border-white/5"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="p-4 border-b border-white/5 font-bold flex justify-between items-center">
                {title}
                <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{tasks.length}</span>
            </div>

            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onDelete={onDelete} />
                ))}
            </div>
        </div>
    );
};

const TaskCard = ({ task, onDelete }: { task: Task, onDelete: (id: string) => void }) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('taskId', task.id);
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="bg-cosmic-card p-4 rounded-lg border border-white/5 shadow-sm hover:border-cosmic-primary/50 cursor-move group transition-all"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={clsx(
                    "text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border",
                    getPillarColor(task.pillar)
                )}>
                    {task.pillar}
                </span>
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-opacity"
                >
                    <X size={14} />
                </button>
            </div>
            <h4 className="font-medium text-sm leading-snug">{task.title}</h4>
        </div>
    );
};

const getPillarColor = (pillar: PillarType) => {
    switch (pillar) {
        case 'Physical': return "border-red-500/30 text-red-300 bg-red-500/10";
        case 'Mental': return "border-blue-500/30 text-blue-300 bg-blue-500/10";
        case 'Intellectual': return "border-yellow-500/30 text-yellow-300 bg-yellow-500/10";
        case 'Spiritual': return "border-purple-500/30 text-purple-300 bg-purple-500/10";
        case 'Cultural': return "border-pink-500/30 text-pink-300 bg-pink-500/10";
        case 'Personal': return "border-green-500/30 text-green-300 bg-green-500/10";
        case 'Professional': return "border-orange-500/30 text-orange-300 bg-orange-500/10";
        default: return "border-white/20 text-white/50";
    }
};
