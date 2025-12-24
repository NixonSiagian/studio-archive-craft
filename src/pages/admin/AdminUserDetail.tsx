import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Shield, User, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { toast } from '@/components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PROTECTED_ADMIN_EMAIL = 'nixonsiagian49@gmail.com';

interface UserProfile {
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
  role: 'admin' | 'customer';
}

const AdminUserDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: async () => {
      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email, created_at')
        .eq('user_id', id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error('User not found');

      // Fetch role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id)
        .maybeSingle();

      return {
        ...profile,
        role: (roleData?.role || 'customer') as 'admin' | 'customer',
      } as UserProfile;
    },
  });

  const updateRole = useMutation({
    mutationFn: async (newRole: 'admin' | 'customer') => {
      // Check if this is the protected admin email
      if (user?.email === PROTECTED_ADMIN_EMAIL && newRole !== 'admin') {
        throw new Error('Cannot remove admin role from the primary admin account');
      }

      // Check if role record exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', id)
        .maybeSingle();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', id);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: id, role: newRole });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update role');
    },
  });

  const isProtectedAdmin = user?.email === PROTECTED_ADMIN_EMAIL;

  if (isLoading) {
    return (
      <AdminLayout title="Loading...">
        <div className="text-muted-foreground text-sm">Loading user...</div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout title="Error">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">User not found</p>
          <button onClick={() => navigate('/admin/users')} className="btn-primary">
            BACK TO USERS
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="User Details">
      <title>User Details — WNM Admin</title>

      {/* Back button */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      <div className="max-w-2xl">
        {/* User Info Card */}
        <div className="border border-border p-6 mb-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            User Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <p className="font-mono text-sm">{user.email || '—'}</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Full Name</label>
              <p className="text-sm">{user.full_name || '—'}</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Joined</label>
              <p className="text-sm text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()} at{' '}
                {new Date(user.created_at).toLocaleTimeString()}
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">User ID</label>
              <p className="font-mono text-xs text-muted-foreground">{user.user_id}</p>
            </div>
          </div>
        </div>

        {/* Role Management Card */}
        <div className="border border-border p-6">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Role Management
          </h2>

          {isProtectedAdmin && (
            <div className="flex items-start gap-3 p-4 bg-muted/30 border border-border mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Protected Admin Account</p>
                <p className="text-xs text-muted-foreground mt-1">
                  This is the primary admin account and cannot be demoted to customer.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block">Current Role</label>
              <div className="flex items-center gap-2">
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span className="text-sm uppercase tracking-wider">{user.role}</span>
              </div>
            </div>

            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block">Change Role</label>
              {isProtectedAdmin && user.role === 'admin' ? (
                <p className="text-xs text-muted-foreground italic">Cannot change</p>
              ) : user.role === 'customer' ? (
                <button
                  onClick={() => updateRole.mutate('admin')}
                  disabled={updateRole.isPending}
                  className="px-4 py-2 bg-foreground text-background text-xs uppercase tracking-widest hover:bg-foreground/90 transition-colors disabled:opacity-50"
                >
                  {updateRole.isPending ? 'Updating...' : 'Make Admin'}
                </button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={updateRole.isPending}
                      className="px-4 py-2 border border-border text-xs uppercase tracking-widest hover:border-foreground transition-colors disabled:opacity-50"
                    >
                      {updateRole.isPending ? 'Updating...' : 'Remove Admin'}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Admin Role?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove admin privileges from {user.email}. They will no longer have access to the admin dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => updateRole.mutate('customer')}>
                        Remove Admin
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUserDetail;
