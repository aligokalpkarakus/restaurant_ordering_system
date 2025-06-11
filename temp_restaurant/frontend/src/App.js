import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import MenuManagement from './components/MenuManagement';
import TableManagement from './components/TableManagement';
import UserManagement from './components/UserManagement';
import Reports from './pages/Reports';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MenuPage from './pages/MenuPage';
import OrderPage from './pages/OrderPage';
import TrackOrderPage from './pages/TrackOrderPage';
import KitchenDashboard from './pages/KitchenDashboard';
import PaymentPage from './pages/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import WaiterPanel from './pages/WaiterPanel';
import RecipeManagement from './pages/RecipeManagement';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate page based on role
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'kitchen') return <Navigate to="/kitchen" />;
    if (user.role === 'server' || user.role === 'waiter') return <Navigate to="/waiter-panel" />;
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Müşteri QR ile menüye ulaşır */}
            <Route path="/table/:id" element={<MenuPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
            <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
            <Route path="/payment/:tableId" element={<PaymentPage />} />
            <Route path="/order-success/:tableId" element={<OrderSuccessPage />} />
            <Route path="/payment-success/:tableId" element={<PaymentSuccessPage />} />
            {/* Personel ve admin için login ekranı ana route */}
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/menu"
              element={
                <PrivateRoute requiredRole="admin">
                  <MenuManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/tables"
              element={
                <PrivateRoute requiredRole="admin">
                  <TableManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute requiredRole="admin">
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <PrivateRoute requiredRole="admin">
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/recipes"
              element={
                <PrivateRoute requiredRole="admin">
                  <RecipeManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/kitchen"
              element={
                <PrivateRoute requiredRole="kitchen">
                  <KitchenDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/waiter-panel"
              element={
                <PrivateRoute requiredRole="server">
                  <WaiterPanel />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
