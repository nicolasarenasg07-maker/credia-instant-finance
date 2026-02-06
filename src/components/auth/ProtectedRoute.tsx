import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required, check it
  if (requiredRole && user?.role !== requiredRole) {
    // Non-admin trying to access admin routes
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/dashboard" replace />;
    }
    // Admin trying to access SME-only routes (if any)
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
