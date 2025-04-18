import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AssetsPage from './pages/AssetsPage';
import KeysPage from './pages/KeysPage';
import TasksPage from './pages/TasksPage';
import LogsPage from './pages/LogsPage';
import UsersPage from './pages/UsersPage';
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
  const ProtectedLayout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return (
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="main" element={<MainPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="keys" element={<KeysPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Routes>
      </AppLayout>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </Router>
  );
};

export default App; 