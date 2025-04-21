import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import 'antd/dist/reset.css';

import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import AssetsPage from './pages/AssetsPage';
import KeysPage from './pages/KeysPage';
import LogsPage from './pages/LogsPage';
import TasksPage from './pages/TasksPage';
import UsersPage from './pages/UsersPage';
import AppLayout from './components/AppLayout';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />
        {/* Protected Routes with Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout>
                <Outlet />
              </AppLayout>
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="main" replace />} />
          <Route path="main" element={<MainPage />} />
          <Route path="assets" element={<AssetsPage />} />
          <Route path="keys" element={<KeysPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="*" element={<Navigate to="main" replace />} />
        </Route>
        {/* Catch all unmatched */}
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

