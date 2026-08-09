import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { PublicSite } from './pages/PublicSite';

// Code-split the admin dashboard (Supabase, Recharts, jsPDF, ExcelJS) away from
// the public site bundle — visitors never pay for weight they don't use.
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })));
const Login = lazy(() => import('./pages/admin/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard })));

const AdminFallback: React.FC = () => (
  <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
    <span className="font-mono-custom text-xs text-[#cbd5e1] animate-pulse">Cargando panel administrativo…</span>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<AdminFallback />}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminFallback />}>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
