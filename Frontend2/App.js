import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import Movements from './pages/Movements';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ReceiptView from './pages/ReceiptView';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout><Dashboard /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/products"
        element={
          <PrivateRoute>
            <AppLayout><Products /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <AppLayout><Categories /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/warehouses"
        element={
          <PrivateRoute>
            <AppLayout><Warehouses /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <AppLayout><Inventory /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/receipts"
        element={
          <PrivateRoute>
            <AppLayout><Receipts /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/receipts/:id"
        element={
          <PrivateRoute>
            <AppLayout><ReceiptView /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/deliveries"
        element={
          <PrivateRoute>
            <AppLayout><Deliveries /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/transfers"
        element={
          <PrivateRoute>
            <AppLayout><Transfers /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/adjustments"
        element={
          <PrivateRoute>
            <AppLayout><Adjustments /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/movements"
        element={
          <PrivateRoute>
            <AppLayout><Movements /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <AppLayout><Profile /></AppLayout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
