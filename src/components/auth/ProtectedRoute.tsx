import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute component for route-level access control.
 * 
 * SECURITY NOTE: This client-side check is for UX/navigation only.
 * Actual authorization is enforced server-side via RLS policies with
 * the has_role() function using SECURITY DEFINER. Even if this check
 * is bypassed, backend operations would fail due to RLS policies.
 */
const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm tracking-widest uppercase">Loading...</div>
      </div>
    );
  }

  // Not logged in -> redirect to /auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> redirect to home (403-like behavior)
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
