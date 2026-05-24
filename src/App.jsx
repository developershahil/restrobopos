import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from '@layouts/DashboardLayout';
import ProtectedRoute from '@routes/ProtectedRoute';

// Pages — organized by module
import Login          from '@modules/auth/pages/Login';
import Dashboard      from '@modules/dashboard/pages/Dashboard';
import CustomerCRM    from '@modules/crm/pages/CustomerCRM';
import Orders         from '@modules/orders/pages/Orders';
import Profile        from '@modules/profile/pages/Profile';
import Stores         from '@modules/stores/pages/Stores';
import Reports        from '@modules/reports/pages/Reports';
import Menu           from '@modules/menu/pages/Menu';
import Offers         from '@modules/offers/pages/Offers';
import ItemAvailability from '@modules/inventory/pages/ItemAvailability';
import StoreSettings  from '@modules/settings/pages/StoreSettings';
import GlobalSettings from '@modules/settings/pages/GlobalSettings';
import Notifications  from '@modules/notifications/pages/Notifications';
import Inventory      from '@modules/inventory/pages/Inventory';
import Riders         from '@modules/riders/pages/Riders';
import RiderDetails   from '@modules/riders/pages/RiderDetails';

// 404 Page
function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8">
      <div className="text-8xl font-black text-muted-foreground/20 mb-4">404</div>
      <h1 className="text-2xl font-black text-foreground mb-2">Page Not Found</h1>
      <p className="text-muted-foreground font-medium mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/dashboard" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
        ← Back to Dashboard
      </a>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: '600',
          },
        }} 
      />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard"       element={<Dashboard />} />
            <Route path="customers"       element={<CustomerCRM />} />
            <Route path="orders"          element={<Orders />} />
            <Route path="reports"         element={<Reports />} />
            <Route path="menu"            element={<Menu />} />
            <Route path="offers"          element={<Offers />} />
            <Route path="availability"    element={<ItemAvailability />} />
            <Route path="inventory"       element={<Inventory />} />
            <Route path="stores"          element={<Stores />} />
            <Route path="settings"        element={<StoreSettings />} />
            <Route path="global-settings" element={<GlobalSettings />} />
            <Route path="notifications"   element={<Notifications />} />
            <Route path="profile"         element={<Profile />} />
            <Route path="riders"          element={<Riders />} />
            <Route path="riders/:id"      element={<RiderDetails />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
