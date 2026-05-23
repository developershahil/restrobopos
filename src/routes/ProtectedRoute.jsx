import { Navigate } from 'react-router-dom';
import { SESSION_KEY } from '@shared/utils/auth';

export default function ProtectedRoute({ children }) {
  const hasToken = !!sessionStorage.getItem(SESSION_KEY);
  const hasFlag  = localStorage.getItem('isLoggedIn') === 'true';
  if (!hasToken || !hasFlag) return <Navigate to="/login" replace />;
  return children;
}
