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

  // CRITICAL: Don't redirect while auth/role is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-4">
        <h1 className="text-2xl font-display tracking-tight">ACCESS DENIED</h1>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          You do not have permission to access this area.
        </p>
        <Navigate to="/" replace />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
