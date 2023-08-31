import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/Discord/DashboardPage';
import ServerPage from './pages/Discord/ServerPage';
import LoginPage from './pages/LoginPage';
import Callback from './pages/Callback';
import CommandsPage from './pages/CommandsPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/comandos" element={<CommandsPage />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } />
          <Route path="/server/:serverId/*" element={
            <PrivateRoute>
              <ServerPage />
            </PrivateRoute>
          } />
          <Route path="*" element={<div>Página não encontrada</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
