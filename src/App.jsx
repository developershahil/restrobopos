import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CustomerCRM from './pages/CustomerCRM';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Stores from './pages/Stores';
import Reports from './pages/Reports';
import Menu from './pages/Menu';
import Offers from './pages/Offers';
import ItemAvailability from './pages/ItemAvailability';
import StoreSettings from './pages/StoreSettings';
import GlobalSettings from './pages/GlobalSettings';
import Login from './pages/Login';

// Simple Auth Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<CustomerCRM />} />
          <Route path="orders" element={<Orders />} />
          <Route path="reports" element={<Reports />} />
          <Route path="menu" element={<Menu />} />
          <Route path="offers" element={<Offers />} />
          <Route path="availability" element={<ItemAvailability />} />
          <Route path="inventory" element={<div className="p-6">Inventory Module (Coming Soon)</div>} />
          <Route path="stores" element={<Stores />} />
          <Route path="settings" element={<StoreSettings />} />
          <Route path="global-settings" element={<GlobalSettings />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
