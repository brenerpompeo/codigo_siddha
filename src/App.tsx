import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { SprintBoard } from './pages/SprintBoard';
import { useAppStore } from './store';
import { ToastContainer } from './components/ui/Toast';

// Auth Guard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useAppStore((state) => state.user);
    if (!user) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

function App() {
  const user = useAppStore((state) => state.user);
  console.log("App Rendering, User:", user);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Onboarding />} />
        <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            }
        />
        <Route
            path="/sprint"
            element={
                <ProtectedRoute>
                    <SprintBoard />
                </ProtectedRoute>
            }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
