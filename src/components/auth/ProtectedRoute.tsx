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
  const { user, loading, isAdmin, role } = useAuth();
  const location = useLocation();

  // Debug logging (temporary - remove after verification)
  console.log('[ProtectedRoute] State:', { 
    email: user?.email, 
    role, 
    isAdmin, 
    loading, 
    requireAdmin,
    path: location.pathname 
  });

  // CRITICAL: Don't redirect while auth/role is still loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="text-muted-foreground text-sm tracking-widest uppercase">Loading...</div>
        {/* Debug info (temporary) */}
        <div className="text-xs text-muted-foreground/50 font-mono">
          auth loading...
        </div>
      </div>
    );
  }

  // Not logged in -> redirect to /auth
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but not admin -> redirect to home (403-like behavior)
  if (requireAdmin && !isAdmin) {
    console.log('[ProtectedRoute] User is not admin, showing access denied');
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-4">
        <h1 className="text-2xl font-display tracking-tight">ACCESS DENIED</h1>
        <p className="text-muted-foreground text-sm text-center max-w-md">
          You do not have permission to access this area.
        </p>
        {/* Debug info (temporary) */}
        <div className="text-xs text-muted-foreground/50 font-mono mt-4 p-2 bg-muted/30 rounded">
          email: {user.email} | role: {role} | isAdmin: {String(isAdmin)}
        </div>
        <Navigate to="/" replace />
      </div>
    );
  }

  // Show debug info for admin pages (temporary)
  if (requireAdmin) {
    return (
      <>
        {/* Debug banner (temporary - remove after verification) */}
        <div className="fixed top-0 left-0 right-0 z-[100] bg-green-500/10 text-green-700 text-xs font-mono p-1 text-center">
          ✓ Admin Access | email: {user.email} | role: {role}
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
